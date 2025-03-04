import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      // TODO: Implement actual password reset logic
      console.log('Reset password for:', values.email);
      message.success('重置密码链接已发送到您的邮箱');
      navigate('/auth/login');
    } catch (error) {
      message.error('发送失败，请重试');
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
          重置密码
        </Title>

        <Paragraph style={{ textAlign: 'center', marginBottom: 32 }}>
          请输入您的注册邮箱，我们将向您发送重置密码的链接
        </Paragraph>
        
        <Form
          form={form}
          name="forgotPassword"
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
              prefix={<MailOutlined />} 
              placeholder="邮箱" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              发送重置链接
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Button type="link" onClick={() => navigate('/auth/login')}>
              返回登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
