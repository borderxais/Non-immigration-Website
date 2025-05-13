import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminRoute from '../components/AdminRoute';

const { Content } = Layout;

const AdminLayout: React.FC = () => {
  return (
    <AdminRoute>
      <Layout style={{ padding: '24px' }}>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </AdminRoute>
  );
};

export default AdminLayout;
