import React, { useState } from 'react';
import { Card, Typography, Form, Input, Button, Avatar, Upload, message, Tabs, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import type { UploadProps } from 'antd';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Initialize form with user data when component mounts
  React.useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, profileForm]);

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      // Here you would call your API to update the profile
      message.success('个人资料已更新');
    } catch (error) {
      message.error('更新失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      // Here you would call your API to change the password
      message.success('密码已成功更新');
      passwordForm.resetFields();
    } catch (error) {
      message.error('密码更新失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188', // Replace with your actual upload endpoint
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '个人资料',
      children: (
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar 
              size={100} 
              icon={<UserOutlined />} 
              src={user?.avatar}
            />
            <div style={{ marginTop: 16 }}>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </div>
          </div>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
            >
              保存更改
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: '修改密码',
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度至少为8个字符' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
            >
              更新密码
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '3',
      label: '账户设置',
      children: (
        <div>
          <Title level={4}>通知设置</Title>
          <Divider />
          <Text>更多账户设置功能即将推出</Text>
        </div>
      ),
    },
  ];

  if (!isAuthenticated) {
    return (
      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={3} style={{ textAlign: 'center' }}>请先登录</Title>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="primary" href="/auth/login">
            去登录
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
        个人中心
      </Title>
      
      <Tabs defaultActiveKey="1" items={items} />
    </Card>
  );
};

export default Profile;
