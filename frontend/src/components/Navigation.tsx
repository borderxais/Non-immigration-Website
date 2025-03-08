import React, { useContext } from 'react';
import { Menu, Button, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FormOutlined, 
  TeamOutlined, 
  MobileOutlined,
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

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
          key: '/ds160/history',
          label: '历史记录',
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
        {
          key: '/interview/simulation',
          label: '面签模拟',
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
        {isAuthenticated && user ? (
          <Button 
            type="primary" 
            ghost 
            icon={<UserOutlined />}
            onClick={() => navigate('/profile')}
          >
            {user.username}
          </Button>
        ) : (
          <Button 
            type="primary" 
            ghost 
            icon={<UserOutlined />}
            onClick={() => navigate('/auth/login')}
          >
            登录/注册
          </Button>
        )}
      </Space>
    </div>
  );
};

export default Navigation;
