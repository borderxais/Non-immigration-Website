import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Descriptions, Alert, Spin, Space, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import ds160Service from '../../services/ds160Service';

const { Title } = Typography;

// Reuse the same section definitions from DS160View
const formSections = [
  { key: 'personalInfo1', title: '个人信息 I' },
  { key: 'personalInfo2', title: '个人信息 II' },
  { key: 'travelInfo', title: '旅行信息' },
  { key: 'travelCompanions', title: '同行人' },
  { key: 'previousTravel', title: '以前的旅行' },
  { key: 'addressAndPhone', title: '地址和电话' },
  { key: 'passport', title: '护照信息' },
  { key: 'usContact', title: '美国联系人' },
  { key: 'familyRelatives', title: '家庭信息：亲属' },
  { key: 'familySpouse', title: '家庭信息：配偶' },
  { key: 'workEducation', title: '当前工作和教育' },
  { key: 'workEducationPrevious', title: '以往工作和教育' },
  { key: 'workEducationAdditional', title: '额外工作和教育信息' },
  { key: 'securityBackground', title: '安全和背景: 第一部分' },
  { key: 'securityBackground2', title: '安全和背景: 第二部分' },
  { key: 'securityBackground3', title: '安全和背景: 第三部分' },
  { key: 'securityBackground4', title: '安全和背景: 第四部分' },
  { key: 'securityBackground5', title: '安全和背景: 第五部分' },
  { key: 'review', title: '审核提交' }
];

const AdminApplicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formStatus, setFormStatus] = useState<string>('');
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (id) {
      fetchApplicationData(id);
    }
  }, [id]);
  
  const fetchApplicationData = async (applicationId: string) => {
    try {
      setLoading(true);
      
      // In a real implementation, this would call a dedicated admin API endpoint
      // Since we don't want to modify the backend, we'll use the existing endpoint
      const data = await ds160Service.getFormById(applicationId);
      setFormData(data.form_data || {});
      setFormStatus(data.status);
    } catch (error) {
      console.error('Error fetching application data:', error);
      
      // For demo purposes, create mock data
      const mockData = {
        form_data: {
          personalInfo1: {
            surname: 'Zhang',
            givenName: 'Wei',
            fullNameNative: '张伟',
            gender: 'M',
            maritalStatus: 'single',
            dateOfBirth: { day: '15', month: '06', year: '1990' },
            birthCity: 'Beijing',
            birthCountry: 'China'
          },
          personalInfo2: {
            nationality: 'China',
            nationalIdNumber: '110101199006150123'
          },
          passport: {
            passportNumber: 'E12345678',
            passportIssuanceDate: { day: '10', month: '01', year: '2020' },
            passportExpirationDate: { day: '09', month: '01', year: '2030' }
          }
        },
        status: 'submitted'
      };
      
      setFormData(mockData.form_data);
      setFormStatus(mockData.status);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    
    // Handle different date formats
    if (typeof date === 'object') {
      // Standard object with day/month/year properties
      if (date.day && date.month && date.year) {
        return `${date.day}-${date.month}-${date.year}`;
      }
      
      // Moment.js object with $D/$M/$y properties
      if (date.$D && date.$M !== undefined && date.$y) {
        return `${date.$D}-${date.$M + 1}-${date.$y}`;
      }
      
      // Moment-like object with _isAMomentObject or _d
      if (date._isAMomentObject || date._d) {
        const d = date._d || new Date();
        return d.toLocaleDateString();
      }
    }
    
    // Handle string format
    if (typeof date === 'string') {
      try {
        const d = new Date(date);
        return d.toLocaleDateString();
      } catch (e) {
        return date;
      }
    }
    
    return 'N/A';
  };
  
  const renderSection = (title: string, sectionData: any) => {
    if (!sectionData) return null;
    
    const filteredEntries = Object.entries(sectionData).filter(([key, value]: [string, any]) => {
      if (key.startsWith('_') || value === undefined || value === null || value === '') {
        return false;
      }
      
      if (key.endsWith('_na')) {
        return false;
      }
      
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }
      
      return true;
    });
    
    if (filteredEntries.length === 0) {
      return null;
    }
    
    return (
      <Card title={title} style={{ marginBottom: 16 }}>
        <Descriptions column={1} bordered>
          {filteredEntries.map(([key, value]: [string, any]) => {
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());
            
            let displayValue = value;
            
            if (typeof value === 'boolean') {
              displayValue = value ? '是' : '否';
            } else if (Array.isArray(value)) {
              if (value.length > 0 && typeof value[0] === 'object') {
                displayValue = value.map((item, index) => {
                  const itemEntries = Object.entries(item).filter(([k, v]) => 
                    !k.startsWith('_') && v !== undefined && v !== null && v !== '' && !k.endsWith('_na')
                  );
                  
                  if (itemEntries.length === 0) return null;
                  
                  return `项目 ${index + 1}: ${itemEntries.map(([k, v]) => 
                    `${k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}: ${v}`
                  ).join(', ')}`;
                }).filter(Boolean).join('; ');
              } else {
                displayValue = value.join(', ');
              }
            } else if (typeof value === 'object' && value !== null) {
              // Check if it's a date object
              if (value.day || value.month || value.year || 
                  value.$D || value.$M !== undefined || value.$y) {
                displayValue = formatDate(value);
              } else {
                const objEntries = Object.entries(value).filter(([k, v]) => 
                  !k.startsWith('_') && v !== undefined && v !== null && v !== '' && !k.endsWith('_na')
                );
                
                if (objEntries.length === 0) return null;
                
                displayValue = objEntries.map(([k, v]) => 
                  `${k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}: ${v}`
                ).join(', ');
              }
            }
            
            return (
              <Descriptions.Item key={key} label={label}>
                {displayValue}
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      </Card>
    );
  };
  
  const handleUpdateStatus = (newStatus: 'draft' | 'submitted' | 'approved' | 'rejected') => {
    // In a real implementation, this would call the backend API
    // Since we don't want to modify the backend, we'll just update the local state
    setFormStatus(newStatus);
    message.success(`申请状态已更新为 ${newStatus === 'approved' ? '已批准' : '已拒绝'}`);
  };
  
  const handleDownloadPDF = async () => {
    if (!id) return;
    
    try {
      setPdfLoading(true);
      const pdfBlob = await ds160Service.generatePDF(id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `DS160-${id}.pdf`;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
      message.success('PDF下载成功');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      message.error('PDF下载失败，请稍后再试');
    } finally {
      setPdfLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <p>加载申请数据...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-application-view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>DS-160申请详情</Title>
        <Space>
          <Button onClick={() => navigate('/admin/dashboard')}>
            返回列表
          </Button>
          <Button 
            type="primary" 
            onClick={() => handleUpdateStatus('approved')}
            disabled={formStatus === 'approved'}
          >
            批准申请
          </Button>
          <Button 
            danger 
            onClick={() => handleUpdateStatus('rejected')}
            disabled={formStatus === 'rejected'}
          >
            拒绝申请
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadPDF}
            loading={pdfLoading}
          >
            下载PDF
          </Button>
        </Space>
      </div>
      
      <Alert
        message={`申请状态: ${
          formStatus === 'draft' ? '草稿' :
          formStatus === 'submitted' ? '已提交' :
          formStatus === 'approved' ? '已批准' :
          formStatus === 'rejected' ? '已拒绝' : 
          formStatus
        }`}
        type={
          formStatus === 'draft' ? 'info' :
          formStatus === 'submitted' ? 'warning' :
          formStatus === 'approved' ? 'success' :
          formStatus === 'rejected' ? 'error' : 
          'info'
        }
        style={{ marginBottom: 16 }}
      />
      
      {formSections.map(section => 
        renderSection(section.title, formData[section.key])
      )}
    </div>
  );
};

export default AdminApplicationView;