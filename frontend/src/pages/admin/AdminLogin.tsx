import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

// Hardcoded admin credentials (in a real app, this would be authenticated against the backend)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // You should change this to something more secure

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    
    // Simple local authentication
    if (values.username === ADMIN_USERNAME && values.password === ADMIN_PASSWORD) {
      // Store admin status in localStorage
      localStorage.setItem('adminToken', 'admin-session-token');
      message.success('登录成功');
      navigate('/admin/dashboard');
    } else {
      message.error('用户名或密码错误');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 0' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>管理员登录</Title>
        <Form
          name="admin_login"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入管理员用户名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入管理员密码' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;