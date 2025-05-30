import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      message.warning('请先登录');
      navigate('/auth/login', { 
        state: { 
          from: '/admin/home', 
          message: '请登录以访问管理员页面' // Please login to access admin pages
        } 
      });
    } else if (!isLoading && isAuthenticated && user?.role !== UserRole.ADMIN) {
      console.log('User:', user);
      console.log(user?.role);
      message.error('没有管理员权限');
      navigate('/');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
    return null; // Let useEffect handle the navigation
  }

  return <>{children}</>;
};

export default AdminRoute;