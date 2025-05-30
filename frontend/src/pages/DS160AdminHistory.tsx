import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag, Button, Space, message, Spin, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ds160Service from '../services/ds160Service';
import { DS160Form } from '../services/ds160Service';

const { Title } = Typography;
const { Search } = Input;

const DS160AdminHistory: React.FC = () => {
  const [applications, setApplications] = useState<DS160Form[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<DS160Form[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch all applications when component mounts (admin only)
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const forms = await ds160Service.getAllForms();
        setApplications(forms);
        setFilteredApplications(forms);
      } catch (error) {
        console.error('Error fetching applications:', error);
        message.error('获取申请历史记录失败');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && isAuthenticated) {
      // Check if user is admin
      if (user?.role !== 'admin') {
        message.error('只有管理员可以访问此页面');
        navigate('/');
        return;
      }
      fetchApplications();
    } else if (!isLoading && !isAuthenticated) {
      message.warning('请先登录以访问管理员页面');
      navigate('/auth/login', {
        state: { from: '/admin/ds160/history' }
      });
    }
  }, [isAuthenticated, isLoading, navigate, user]);

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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearch = (value: string) => {
    if (!value) {
      setFilteredApplications(applications);
      return;
    }
    
    const filtered = applications.filter(app => 
      app.application_id.toLowerCase().includes(value.toLowerCase()) ||
      (app.target_user_id && app.target_user_id.toString().includes(value))
    );
    setFilteredApplications(filtered);
  };

  const columns = [
    {
      title: '申请编号',
      dataIndex: 'application_id',
      key: 'application_id',
    },
    {
      title: '用户ID',
      dataIndex: 'target_user_id',
      key: 'target_user_id',
      render: (userId: number) => userId || '未指定',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '草稿', value: 'draft' },
        { text: '已提交', value: 'submitted' },
        { text: '已批准', value: 'approved' },
        { text: '已拒绝', value: 'rejected' },
      ],
      onFilter: (value: any, record: DS160Form) => record.status === value,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date),
      sorter: (a: DS160Form, b: DS160Form) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      },
      defaultSortOrder: 'descend' as 'descend',
    },
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
            <Button onClick={() => navigate(`/admin/ds160/form/${record.application_id}`)}>
              继续编辑
            </Button>
          ) : (
            <Button onClick={() => navigate(`/admin/ds160/view/${record.application_id}`)}>
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
    <div className="ds160-admin-history-container">
      <Title level={2}>DS-160申请管理</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索申请编号或用户ID"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p>加载申请历史记录...</p>
        </div>
      ) : (
        <>
          {filteredApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p>没有找到任何DS-160申请记录</p>
              <Button type="primary" onClick={() => navigate('/admin/ds160')}>
                创建新申请
              </Button>
            </div>
          ) : (
            <Table 
              columns={columns} 
              dataSource={filteredApplications.map(app => ({ ...app, key: app.application_id }))} 
              pagination={{ pageSize: 10 }}
              rowKey="application_id"
            />
          )}
        </>
      )}
    </div>
  );
};

export default DS160AdminHistory;
