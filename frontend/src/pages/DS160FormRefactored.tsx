import React from 'react';
import { Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import DS160FormComponent from '../components/DS160Form';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;

const DS160FormRefactored: React.FC = () => {
  const navigate = useNavigate();
  // Access the auth context to check if user is authenticated
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      message.warning('请先登录以访问DS-160表格');
      navigate('/login', { state: { from: '/ds160-refactored' } });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="ds160-form-page">
      <Card className="page-card">
        <Title level={2} className="page-title">DS-160 非移民签证申请表 (重构版)</Title>
        <p className="page-description">
          请填写以下表格以完成您的DS-160非移民签证申请。所有带星号(*)的字段为必填项。
          您可以随时保存草稿并稍后返回继续填写。
        </p>
        
        {/* Use the refactored DS160Form component */}
        <DS160FormComponent />
      </Card>
    </div>
  );
};

export default DS160FormRefactored;
