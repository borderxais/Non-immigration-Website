import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag, Button, Space, message, Spin, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import ds160Service, { DS160Form } from '../../services/ds160Service';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<DS160Form[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchAllApplications();
  }, []);
  
  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      const forms = await ds160Service.getAllForms();
      setApplications(forms);
      
      // Simple info message about the admin view
      if (forms.length === 0) {
        message.info('没有找到申请记录');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      message.error('获取申请数据失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    message.success('已退出管理员账户');
    navigate('/admin/login');
  };
  
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
  
  const getUserName = (record: DS160Form) => {
    const personalInfo = record.form_data?.personalInfo1;
    if (!personalInfo) return 'N/A';
    
    return `${personalInfo.surname || ''} ${personalInfo.givenName || ''}`.trim() || 'N/A';
  };
  
  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchText === '' || 
      app.application_id.toLowerCase().includes(searchText.toLowerCase()) ||
      getUserName(app).toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const columns = [
    {
      title: '申请编号',
      dataIndex: 'application_id',
      key: 'application_id',
    },
    {
      title: '申请人',
      key: 'user',
      render: (record: DS160Form) => getUserName(record),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '最后更新',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => formatDate(date),
      sorter: (a: DS160Form, b: DS160Form) => 
        new Date(a.updated_at || '').getTime() - new Date(b.updated_at || '').getTime(),
      defaultSortOrder: 'descend' as 'descend',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DS160Form) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/admin/applications/${record.application_id}`)}>
            查看详情
          </Button>
          <Button 
            type={record.status === 'approved' ? 'default' : 'primary'}
            onClick={() => handleUpdateStatus(record.application_id, 'approved')}
            disabled={record.status === 'approved'}
          >
            批准
          </Button>
          <Button 
            danger
            type={record.status === 'rejected' ? 'default' : 'primary'}
            onClick={() => handleUpdateStatus(record.application_id, 'rejected')}
            disabled={record.status === 'rejected'}
          >
            拒绝
          </Button>
        </Space>
      ),
    },
  ];
  
  const handleUpdateStatus = (applicationId: string, newStatus: 'draft' | 'submitted' | 'approved' | 'rejected') => {
    // In a real implementation, this would call the backend API
    // Since we don't want to modify the backend, we'll just update the local state
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.application_id === applicationId 
          ? { ...app, status: newStatus } 
          : app
      )
    );
    
    message.success(`申请 ${applicationId} 状态已更新为 ${newStatus === 'approved' ? '已批准' : '已拒绝'}`);
  };
  
  return (
    <div className="admin-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>DS-160申请管理</Title>
        <Button type="primary" danger onClick={handleLogout}>
          退出管理员账户
        </Button>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Search
          placeholder="搜索申请编号或申请人姓名"
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        
        <Select 
          defaultValue="all" 
          style={{ width: 120 }} 
          onChange={handleStatusFilterChange}
        >
          <Option value="all">所有状态</Option>
          <Option value="draft">草稿</Option>
          <Option value="submitted">已提交</Option>
          <Option value="approved">已批准</Option>
          <Option value="rejected">已拒绝</Option>
        </Select>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p>加载申请记录...</p>
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={filteredApplications.map(app => ({ ...app, key: app.application_id }))} 
          pagination={{ pageSize: 10 }}
          rowKey="application_id"
        />
      )}
    </div>
  );
};

export default AdminDashboard;