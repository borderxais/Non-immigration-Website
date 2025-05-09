import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined, WechatOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials } from '../../types/auth';

const { Title, Text } = Typography;

interface LocationState {
  from?: string;
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, logout, isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a message in the location state
    const state = location.state as LocationState;
    if (state && state.message) {
      setRedirectMessage(state.message);
    }
  }, [location]);

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      await login(values);
      message.success('登录成功！');
      
      // If there was a 'from' path in the state, redirect there after login
      const state = location.state as LocationState;
      if (state && state.from) {
        navigate(state.from);
      } else {
        navigate('/');
      }
    } catch (error) {
      message.error('登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    message.success('已成功退出登录');
    // Force a page reload to ensure all components update with the new auth state
    window.location.reload();
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '40px auto',
      padding: '0 16px'
    }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          欢迎回来
        </Title>

        {/* Display redirect message if present */}
        {redirectMessage && (
          <Alert
            message={redirectMessage}
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Display username and logout button if logged in */}
        {isAuthenticated && user ? (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Text style={{ display: 'block', marginBottom: 16 }}>
              已登录为: <strong>{user.username}</strong>
            </Text>
            <Button 
              type="primary" 
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </div>
        ) : (
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="邮箱" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large"
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="link" onClick={() => navigate('/auth/forgot-password')}>
                忘记密码？
              </Button>
            </Form.Item>
          </Form>
        )}

        <Divider>或</Divider>

        <Button 
          icon={<WechatOutlined />} 
          block 
          size="large"
          style={{ 
            backgroundColor: '#07C160',
            color: 'white',
            marginBottom: 16
          }}
          onClick={() => message.info('微信登录功能即将推出')}
        >
          微信登录
        </Button>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>还没有账号？</Text>
          <Button type="link" onClick={() => navigate('/auth/register')}>
            立即注册
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;