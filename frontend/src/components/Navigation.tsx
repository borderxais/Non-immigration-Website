import React from 'react';
import { Menu, Button, Space, Dropdown, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FormOutlined, 
  TeamOutlined, 
  MobileOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  RobotOutlined
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

  // Check if user is an admin or regular user
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isRegularUser = isAuthenticated && user?.role === 'user';

  // Public home tab
  const homeTab = {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页'
  };
  // Evaluation tab that's always visible
  const evaluationTab = {
    key: '/evaluation',
    icon: <RobotOutlined />,
    label: '評測'
  };
  // DS160 History tab for regular users
  const ds160HistoryTab = {
    key: '/ds160/history',
    icon: <FormOutlined />,
    label: 'DS-160申请历史'
  };

  // Base menu items for all users
  let baseMenuItems = [
    homeTab,
    evaluationTab
  ];
  
  // Add DS160 history tab for regular users
  if (isRegularUser) {
    baseMenuItems.push(ds160HistoryTab);
  }

  // Additional menu items only for admin users
  const adminMenuItems = [
    
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/admin/evaluation-menu',
      icon: <RobotOutlined />,
      label: '评估管理',
      children: [
        {
          key: '/admin/evaluations',
          label: '评估结果',
        },
        {
          key: '/admin/temp-credentials',
          label: '临时凭证',
        }
      ]
    },
    {
      key: '/admin/ds160-menu',
      icon: <FormOutlined />,
      label: 'DS-160服务',
      children: [
        {
          key: '/admin/ds160',
          icon: <FormOutlined />,
          label: '填写DS-160'
        },
        {
          key: '/admin/ds160/history',
          label: '管理DS-160申请',
        },
        {
          key: '/admin/ds160/upload',
          label: '上传DS-160',
        }
      ]
    },
    {
      key: '/admin/interview',
      icon: <TeamOutlined />,
      label: '模拟面签',
      children: [
        {
          key: '/admin/interview/practice',
          label: '面签练习',
        },
        {
          key: '/admin/interview/evaluation',
          label: '面签评估',
        },
        {
          key: '/admin/interview/simulation',
          label: '面签模拟',
        },
      ]
    },
    {
      key: '/admin/platform',
      icon: <MobileOutlined />,
      label: '多端支持',
      children: [
        {
          key: '/admin/platform/wechat',
          label: '微信小程序',
        },
        {
          key: '/admin/platform/app',
          label: 'APP下载(即将推出)',
        },
      ]
    },
    //{
      //key: '/admin/dashboard',
      //icon: <TeamOutlined />,
      //label: '管理仪表盘',
    //},
  ];

  // Final menu items based on user role
  const menuItems = isAdmin ? adminMenuItems : baseMenuItems;

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
            登录
          </Button>
        )}
      </Space>
    </div>
  );
};

export default Navigation;
