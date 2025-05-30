import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag, Button, Space, message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ds160Service from '../services/ds160Service';
import { DS160Form } from '../services/ds160Service';

const { Title } = Typography;

const DS160History: React.FC = () => {
  const [applications, setApplications] = useState<DS160Form[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we were redirected here after a successful submission
  const submissionSuccess = location.state?.submissionSuccess;
  const submittedApplicationId = location.state?.application_id;

  useEffect(() => {
    // Fetch user's applications when component mounts
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const forms = await ds160Service.getUserForms();
        setApplications(forms);
        
        // If we have a successful submission, show a success message
        if (submissionSuccess && submittedApplicationId) {
          message.success('表单提交成功！您的申请已成功提交。');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        message.error('获取申请历史记录失败');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchApplications();
    } else if (!isLoading && !isAuthenticated) {
      message.warning('请先登录以查看您的申请历史');
      navigate('/auth/login');
    }
  }, [isAuthenticated, isLoading, navigate, submissionSuccess, submittedApplicationId]);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'draft':
        return <Tag color="blue">草稿</Tag>;
      case 'submitted':
        return <Tag color="green">已提交</Tag>;
      case 'approved':
        return <Tag color="success">已批准</Tag>;
      case 'rejected':
        return <Tag color="error">已拒绝</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: '申请编号',
      dataIndex: 'application_id',
      key: 'application_id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'created_at',
    //   key: 'created_at',
    //   render: (date: string) => formatDate(date),
    //   sorter: (a: DS160Form, b: DS160Form) => 
    //     new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    //   defaultSortOrder: 'descend' as 'descend',
    // },
    {
      title: '最后更新',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DS160Form) => (
        <Space size="middle">
          {record.status === 'draft' ? (
            <span style={{ color: '#999' }}>
              尚未提交無法查看
            </span>
          ) : (
            <Button onClick={() => navigate(`/ds160/view/${record.application_id}`)}>
              查看详情
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <div className="ds160-history-container">
      <Title level={2}>我的DS-160申请</Title>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p>加载申请历史记录...</p>
        </div>
      ) : (
        <>
          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p>您还没有任何DS-160申请记录</p>
              
            </div>
          ) : (
            <Table 
              columns={columns} 
              dataSource={applications.map(app => ({ ...app, key: app.application_id }))} 
              pagination={{ pageSize: 10 }}
              rowKey="application_id"
            />
          )}
        </>
      )}
    </div>
  );
};

export default DS160History;
