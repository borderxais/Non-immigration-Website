import React, { useState, useEffect } from 'react';
import { Card, Typography, message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import DS160FormComponent from '../components/DS160Form';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;

const DS160FormRefactored: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    // Only check authentication after loading is complete
    if (!isLoading) {
      if (!isAuthenticated) {
        message.warning('请先登录以访问DS-160表格');
        navigate('/auth/login', { 
          state: { from: location.pathname + location.search } 
        });
      } else {
        // User is authenticated, show the form
        setShowForm(true);
      }
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large">
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <p>加载中...</p>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="ds160-form-page">
      <Card className="page-card">
        <Title level={2} className="page-title">DS-160 非移民签证申请表</Title>
        <p className="page-description">
          请填写以下表格以完成您的DS-160非移民签证申请。所有带星号(*)的字段为必填项。
          您可以随时保存草稿并稍后返回继续填写。
        </p>
        
        {showForm && <DS160FormComponent />}
      </Card>
    </div>
  );
};

export default DS160FormRefactored;
