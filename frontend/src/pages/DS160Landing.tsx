import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, message, Modal, Form, Select, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FormOutlined, HistoryOutlined } from '@ant-design/icons';
import { generateApplicationId } from '../utils/formUtils';
import ds160Service from '../services/ds160Service';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const DS160Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);



  // Fetch users when modal is opened
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const userList = await ds160Service.getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoadingUsers(false);
    }
  };

  const showUserSelectionModal = () => {
    if (!isAuthenticated) {
      message.info('请先登录以开始新的DS-160申请');
      navigate('/auth/login', { 
        state: { 
          from: '/admin/ds160', 
          message: '请先登录以开始新的DS-160申请' 
        } 
      });
      return;
    }
    
    // Check if user is admin
    if (user?.role !== 'admin') {
      message.error('只有管理员可以创建DS-160表格');
      return;
    }
    
    // Fetch users when modal is opened
    fetchUsers();
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleNewApplication = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const { target_user_id } = values;
      
      const application_id = generateApplicationId();
      // Create new form in database with target user ID
      await ds160Service.createForm({
        form_data: { target_user_id },
        status: 'draft',
        application_id: application_id
      });
      
      // Set flag to indicate this is a new application
      localStorage.setItem('isNewApplication', 'true');
      setIsModalVisible(false);
      form.resetFields();
      message.success('已为用户创建新的DS-160申请');
      navigate(`/admin/ds160/form/${application_id}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating form:', error);
        message.error('创建表单时出错: ' + error.message);
      } else {
        message.error('创建表单时出错');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewApplications = () => {
    if (!isAuthenticated) {
      message.info('请先登录以查看您的申请历史');
      navigate('/auth/login', { 
        state: { 
          from: '/ds160', 
          message: '请先登录以查看您的申请历史' 
        } 
      });
      return;
    }
    
    navigate('/admin/ds160/history');
  };

  return (
    <>
      <Modal
        title="选择用户"
        open={isModalVisible}
        onOk={handleNewApplication}
        onCancel={handleModalCancel}
        confirmLoading={submitting}
        okText="创建申请"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="target_user_id"
            label="选择用户"
            rules={[{ required: true, message: '请选择用户' }]}
          >
            {loadingUsers ? (
              <Spin tip="加载用户列表中..." />
            ) : (
              <Select
                placeholder="选择用户"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={users.map(user => ({
                  value: user.id,
                  label: `${user.email} (user_id: ${user.id})`,
                }))}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ padding: '24px' }}>
      <Title level={2}>DS-160 非移民签证申请表</Title>
      <Paragraph>
        请选择以下操作：
      </Paragraph>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={showUserSelectionModal}
            style={{ height: '100%' }}
          >
            <div style={{ textAlign: 'center' }}>
              <FormOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={3}>开始新申请</Title>
              <Paragraph>
                为用户填写新的DS-160非移民签证申请表
              </Paragraph>
              <Button type="primary" size="large">
                立即开始
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={handleViewApplications}
            style={{ height: '100%' }}
          >
            <div style={{ textAlign: 'center' }}>
              <HistoryOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={3}>管理我的申请</Title>
              <Paragraph>
                查看或继续填写已保存的申请表
              </Paragraph>
              <Button type="primary" size="large" style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                查看申请
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card>
            <Title level={4}>温馨提示</Title>
            <Paragraph>
              • 请确保准备好所需的个人信息和文件再开始填写
            </Paragraph>
            <Paragraph>
              • 您可以随时保存进度，稍后继续填写
            </Paragraph>
            <Paragraph>
              • 系统会自动保存您的填写进度
            </Paragraph>
          </Card>
        </Col>
      </Row>
      </div>
    </>
  );
};

export default DS160Landing;