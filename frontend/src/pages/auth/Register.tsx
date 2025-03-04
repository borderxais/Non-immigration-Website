import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, WechatOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../types/auth';

const { Title, Paragraph } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterData & { confirmPassword: string; agreement: boolean }) => {
    if (!values.agreement) {
      message.error('请阅读并同意用户协议');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, agreement, ...registerData } = values;
      await register(registerData);
      message.success('注册成功！');
      navigate('/');
    } catch (error) {
      message.error('注册失败，请重试');
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
          创建账号
        </Title>
        
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="邮箱" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码长度至少为8位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议')),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意
              <Button type="link" style={{ padding: '0 4px' }}>
                用户协议
              </Button>
              和
              <Button type="link" style={{ padding: '0 4px' }}>
                隐私政策
              </Button>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
            >
              注册
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
          onClick={() => message.info('微信注册功能即将推出')}
        >
          微信注册
        </Button>

        <Paragraph style={{ textAlign: 'center', marginTop: 16 }}>
          已有账号？
          <Button type="link" onClick={() => navigate('/auth/login')}>
            立即登录
          </Button>
        </Paragraph>
      </Card>
    </div>
  );
};

export default Register;
