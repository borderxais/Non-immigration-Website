import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import authService from '../../services/authService';

const { Title } = Typography;

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await authService.login(values); 
      
      // Check if the logged-in user is an admin
      if (response.user?.role === UserRole.ADMIN) {
        await login(values); // Update auth context
        message.success('登录成功');
        navigate('/admin/dashboard');
      } else {
        console.log('Access denied - insufficient permissions');
        message.error('没有管理员权限');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
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
            label="邮箱"
            name="email"
            rules={[{ required: true, message: '请输入管理员邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]}
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