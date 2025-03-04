import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, WechatOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginCredentials } from '../../types/auth';

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      await login(values);
      message.success('登录成功！');
      navigate('/');
    } catch (error) {
      message.error('登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
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

        <Paragraph style={{ textAlign: 'center', marginTop: 16 }}>
          还没有账号？
          <Button type="link" onClick={() => navigate('/auth/register')}>
            立即注册
          </Button>
        </Paragraph>
      </Card>
    </div>
  );
};

export default Login;
