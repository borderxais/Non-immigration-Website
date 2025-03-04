import React from 'react';
import { Menu, Button, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FormOutlined, 
  RobotOutlined, 
  TeamOutlined, 
  MobileOutlined,
  HomeOutlined,
  UserOutlined 
} from '@ant-design/icons';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/ds160',
      icon: <FormOutlined />,
      label: 'DS-160表格',
      children: [
        {
          key: '/ds160/fill',
          label: '在线填写',
        },
        {
          key: '/ds160/upload',
          label: '上传表格',
        },
        {
          key: '/ds160/history',
          label: '历史记录',
        },
      ]
    },
    {
      key: '/consultation',
      icon: <RobotOutlined />,
      label: 'AI 签证咨询',
      children: [
        {
          key: '/consultation/chat',
          label: '智能问答',
        },
        {
          key: '/consultation/evaluation',
          label: '签证评估',
        },
      ]
    },
    {
      key: '/interview',
      icon: <TeamOutlined />,
      label: '模拟面签',
      children: [
        {
          key: '/interview/practice',
          label: '面签练习',
        },
        {
          key: '/interview/evaluation',
          label: '面签评估',
        },
      ]
    },
    {
      key: '/platform',
      icon: <MobileOutlined />,
      label: '多端支持',
      children: [
        {
          key: '/platform/wechat',
          label: '微信小程序',
        },
        {
          key: '/platform/app',
          label: 'APP下载(即将推出)',
        },
      ]
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['/']}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ lineHeight: '64px', flex: 1 }}
      />
      <Space style={{ marginLeft: 16 }}>
        <Button 
          type="primary" 
          ghost 
          icon={<UserOutlined />}
          onClick={() => navigate('/auth/login')}
        >
          登录/注册
        </Button>
      </Space>
    </div>
  );
};

export default Navigation;
