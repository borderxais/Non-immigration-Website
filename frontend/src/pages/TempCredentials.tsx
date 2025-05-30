import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Button, message, Modal, Input, Space, Tag, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CopyOutlined, UserAddOutlined } from '@ant-design/icons';
import evaluationService from '../services/evaluationService';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

interface TempCredential {
  id: number;
  user_id: number;
  email: string;
  username: string;
  password: string;
  created_at: string;
  is_used: boolean;
}

const TempCredentials: React.FC = () => {
  const [credentials, setCredentials] = useState<TempCredential[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [createUserModalVisible, setCreateUserModalVisible] = useState<boolean>(false);
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      message.error('您没有权限访问此页面');
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch credentials
  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const data = await evaluationService.getTempCredentials();
      setCredentials(data);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      message.error('获取凭证失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  // Handle copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success('已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制到剪贴板失败');
      });
  };

  // Handle mark as used
  const markAsUsed = async (id: number) => {
    try {
      await evaluationService.markCredentialAsUsed(id);
      message.success('凭证已标记为已使用');
      fetchCredentials();
    } catch (error) {
      console.error('Error marking credential as used:', error);
      message.error('标记凭证为已使用失败');
    }
  };

  // Handle create user
  const handleCreateUser = async () => {
    if (!newUserEmail) {
      message.error('请输入邮箱地址');
      return;
    }

    try {
      setLoading(true);
      const result = await evaluationService.createUserFromEvaluation(newUserEmail);
      message.success('用户创建成功');
      setCreateUserModalVisible(false);
      setNewUserEmail('');
      fetchCredentials();
      
      // Show the credentials to the admin
      Modal.success({
        title: '用户创建成功',
        content: (
          <div>
            <p>已成功创建新用户账号，账号信息如下：</p>
            <p><strong>邮箱:</strong> {newUserEmail}</p>
            <p><strong>密码:</strong> {result.credentials.password}</p>
            <p>请将这些凭证提供给用户。</p>
          </div>
        ),
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      message.error(error.response?.data?.error || '创建用户失败');
    } finally {
      setLoading(false);
    }
  };

  // Filter credentials based on search text
  const filteredCredentials = credentials.filter(cred => 
    cred.email.toLowerCase().includes(searchText.toLowerCase()) ||
    cred.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <Space>
          {text}
          <Tooltip title="复制邮箱">
            <Button 
              icon={<CopyOutlined />} 
              size="small" 
              type="text" 
              onClick={() => copyToClipboard(text)} 
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => (
        <Space>
          {text}
          <Tooltip title="复制用户名">
            <Button 
              icon={<CopyOutlined />} 
              size="small" 
              type="text" 
              onClick={() => copyToClipboard(text)} 
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      render: (text: string) => (
        <Space>
          <Text code>{text}</Text>
          <Tooltip title="复制密码">
            <Button 
              icon={<CopyOutlined />} 
              size="small" 
              type="text" 
              onClick={() => copyToClipboard(text)} 
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'is_used',
      key: 'is_used',
      render: (isUsed: boolean) => (
        isUsed ? 
          <Tag color="green">已使用</Tag> : 
          <Tag color="blue">未使用</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: TempCredential) => (
        <Button 
          type="primary" 
          disabled={record.is_used}
          onClick={() => markAsUsed(record.id)}
        >
          标记为已使用
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Card>
        <Title level={2}>临时用户凭证</Title>
        <Paragraph>
          此页面显示从评估表单创建的用户的临时凭证。
          您可以将这些凭证提供给用户，以便他们登录到自己的账户。
        </Paragraph>

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Search
            placeholder="按邮箱或用户名搜索"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<UserAddOutlined />}
            onClick={() => setCreateUserModalVisible(true)}
          >
            从邮箱创建用户
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredCredentials} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="从邮箱创建用户"
        open={createUserModalVisible}
        onOk={handleCreateUser}
        onCancel={() => {
          setCreateUserModalVisible(false);
          setNewUserEmail('');
        }}
        confirmLoading={loading}
      >
        <Paragraph>
          输入评估表单中的邮箱地址，以创建新的用户账号。
          系统将为该用户生成随机用户名和密码。
        </Paragraph>
        <Input
          placeholder="输入邮箱地址"
          value={newUserEmail}
          onChange={e => setNewUserEmail(e.target.value)}
          style={{ marginTop: 16 }}
        />
      </Modal>
    </div>
  );
};

export default TempCredentials;
