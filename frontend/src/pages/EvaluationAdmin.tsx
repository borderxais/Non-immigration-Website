import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Button, message, Modal, Space, Tag, Tooltip, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserAddOutlined, QuestionCircleOutlined, EyeOutlined } from '@ant-design/icons';
import evaluationService from '../services/evaluationService';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph, Text } = Typography;

interface EvaluationResult {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  score: number;
  risk_level: string;
  form_data: any;
  created_at: string;
}

const EvaluationAdmin: React.FC = () => {
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);
  const [userExistsMap, setUserExistsMap] = useState<Record<string, boolean>>({});
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      message.error('You do not have permission to access this page');
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch evaluations
  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const data = await evaluationService.getAllEvaluationResults();
      setEvaluations(data);
      
      // Check which emails already have user accounts
      const emails = data.map((evaluation: EvaluationResult) => evaluation.email);
      const uniqueEmails = Array.from(new Set(emails));
      
      const emailExistsMap: Record<string, boolean> = {};
      for (const email of uniqueEmails) {
        try {
          // Ensure email is a string
          const emailStr = String(email);
          const exists = await evaluationService.checkUserExists(emailStr);
          emailExistsMap[emailStr] = exists;
        } catch (error) {
          console.error(`Error checking if user exists:`, error);
          // Skip this email if it's not a valid string
        }
      }
      
      setUserExistsMap(emailExistsMap);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      message.error('Failed to fetch evaluations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  // Handle create user
  const handleCreateUser = async (email: string) => {
    try {
      setCreatingUser(true);
      setCurrentEmail(email);
      
      // Double-check if user already exists
      const userExists = await evaluationService.checkUserExists(email);
      if (userExists) {
        message.error(`邮箱 ${email} 的用户已存在`);
        // Update our local state to reflect this
        setUserExistsMap(prev => ({
          ...prev,
          [email]: true
        }));
        return;
      }
      
      const result = await evaluationService.createUserFromEvaluation(email);
      
      // Show success message with credentials
      Modal.success({
        title: '用户创建成功',
        content: (
          <div>
            <p>已成功创建新用户账号，账号信息如下：</p>
            <p><strong>邮箱:</strong> {email}</p>
            <p><strong>密码:</strong> {result.credentials.password}</p>
            <p>这些凭证也可以在临时凭证页面中找到。</p>
          </div>
        ),
      });
      
      // Update the user exists map
      setUserExistsMap(prev => ({
        ...prev,
        [email]: true
      }));
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      message.error(error.response?.data?.error || 'Failed to create user');
    } finally {
      setCreatingUser(false);
      setCurrentEmail('');
    }
  };

  // Show evaluation details
  const showEvaluationDetails = (evaluation: EvaluationResult) => {
    setCurrentEvaluation(evaluation);
    setDetailModalVisible(true);
  };

  // Format risk level tag
  const getRiskLevelTag = (riskLevel: string, score: number) => {
    let color = 'green';
    if (score > 60) {
      color = 'red';
    } else if (score > 30) {
      color = 'orange';
    }
    
    return <Tag color={color}>{riskLevel}</Tag>;
  };

  const columns = [
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => text || '-',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => text || '-',
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: EvaluationResult, b: EvaluationResult) => a.score - b.score,
    },
    {
      title: '风险等级',
      dataIndex: 'risk_level',
      key: 'risk_level',
      render: (text: string, record: EvaluationResult) => getRiskLevelTag(text, record.score),
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString(),
      sorter: (a: EvaluationResult, b: EvaluationResult) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: 'descend' as 'descend',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: EvaluationResult) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => showEvaluationDetails(record)}
            title="View Details"
          >
            Details
          </Button>
          
          {userExistsMap[record.email] ? (
            <Tooltip title="用户账号已存在">
              <Button 
                type="primary" 
                disabled
                icon={<UserAddOutlined />}
              >
                账号已存在
              </Button>
            </Tooltip>
          ) : (
            <Popconfirm
              title="创建用户账号"
              description={`确定为 ${record.email} 创建新用户账号吗？`}
              onConfirm={() => handleCreateUser(record.email)}
              okText="确定"
              cancelText="取消"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
              >
                创建账号
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Render form data in a readable format
  const renderFormData = (formData: any) => {
    return (
      <div>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <Text strong>{key}: </Text>
            <Text>
              {Array.isArray(value) 
                ? (value as string[]).join(', ') 
                : value as string}
            </Text>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Card>
        <Title level={2}>评估结果管理</Title>
        <Paragraph>
          此页面显示所有用户提交的评估结果。
          您可以查看每个评估的详细信息，并为提交者创建用户账号。
        </Paragraph>

        <Table 
          columns={columns} 
          dataSource={evaluations} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Evaluation Details Modal */}
      <Modal
        title="评估详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentEvaluation && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <Title level={4}>联系信息</Title>
              <p><strong>邮箱:</strong> {currentEvaluation.email}</p>
              <p><strong>姓名:</strong> {currentEvaluation.name || '-'}</p>
              <p><strong>电话:</strong> {currentEvaluation.phone || '-'}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <Title level={4}>评估结果</Title>
              <p>
                <strong>分数:</strong> {currentEvaluation.score} 
                <span style={{ marginLeft: '10px' }}>
                  {getRiskLevelTag(currentEvaluation.risk_level, currentEvaluation.score)}
                </span>
              </p>
              <p><strong>提交时间:</strong> {new Date(currentEvaluation.created_at).toLocaleString()}</p>
            </div>
            
            <div>
              <Title level={4}>表单数据</Title>
              {renderFormData(currentEvaluation.form_data)}
            </div>
          </div>
        )}
      </Modal>

      {/* Creating User Modal */}
      <Modal
        title="创建用户账号"
        open={creatingUser}
        footer={null}
        closable={false}
      >
        <p>正在为 {currentEmail} 创建用户账号...</p>
      </Modal>
    </div>
  );
};

export default EvaluationAdmin;
