import React, { useContext } from 'react';
import { Menu, Button, Space, Dropdown, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FormOutlined, 
  TeamOutlined, 
  MobileOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import type { MenuProps } from 'antd';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    message.success('已成功退出登录');
    // Force a page reload to ensure all components update with the new auth state
    window.location.reload();
  };

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

  // User dropdown menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
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
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button 
              type="primary" 
              ghost 
              icon={<UserOutlined />}
            >
              {user.username}
            </Button>
          </Dropdown>
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
