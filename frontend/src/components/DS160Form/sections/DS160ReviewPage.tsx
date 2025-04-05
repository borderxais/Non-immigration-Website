import React from 'react';
import { Button, Card, Descriptions, Divider, Typography, Space, Row, Col, Form } from 'antd';
import { FormInstance } from 'antd/lib/form';

const { Title, Text } = Typography;

interface DS160ReviewPageProps {
  form: FormInstance;
  onSubmit: () => void;
  onEdit: (step: number) => void;
}

const DS160ReviewPage: React.FC<DS160ReviewPageProps> = ({ form, onSubmit, onEdit }) => {
  // Get form data
  const formData = form.getFieldsValue(true);
  
  // Helper function to format date values from form data
  const formatDate = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return 'N/A';
    return `${day}-${month}-${year}`;
  };

  // Helper function to get section title and data
  const renderSection = (title: string, sectionData: any, editStep: number) => {
    if (!sectionData) return null;
    
    return (
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>{title}</Text>
            <Button type="link" onClick={() => onEdit(editStep)}>编辑</Button>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <Descriptions column={1} bordered>
          {Object.entries(sectionData).map(([key, value]: [string, any]) => {
            // Skip internal fields or empty values
            if (key.startsWith('_') || value === undefined || value === null || value === '') {
              return null;
            }
            
            // Format the label
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());
            
            // Format the value based on its type
            let displayValue = value;
            
            if (typeof value === 'boolean') {
              displayValue = value ? '是' : '否';
            } else if (Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (typeof value === 'object') {
              // Skip nested objects in this simple view
              return null;
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

  // Extract sections from formData
  const personalInfo = {
    surname: formData.surname,
    givenName: formData.givenName,
    fullNameNative: formData.fullNameNative,
    gender: formData.gender === 'M' ? '男' : '女',
    maritalStatus: formData.maritalStatus,
    dateOfBirth: formatDate(formData.dobDay, formData.dobMonth, formData.dobYear),
    birthPlace: formData.birthPlace,
    birthState: formData.birthState,
    birthCountry: formData.birthCountry,
  };

  const travelInfo = {
    arrivalDate: formatDate(formData.arrivalDay, formData.arrivalMonth, formData.arrivalYear),
    lengthOfStay: `${formData.losLength} ${formData.losUnit}`,
    usAddress: `${formData.usAddressLine1}, ${formData.usAddressLine2 || ''}, ${formData.usCity}, ${formData.usState}, ${formData.usZipCode}`,
    travelFunder: formData.travelFunder,
    travelingWithOthers: formData.travelingWithOthers,
  };

  const contactInfo = {
    email: formData.email,
    phone: formData.phone,
    homeAddress: formData.homeAddress,
  };

  const securityInfo = {
    hasCriminalRecord: formData.hasCriminalRecord,
    hasDrugHistory: formData.hasDrugHistory,
    hasTerroristActivity: formData.hasTerroristActivity,
  };

  return (
    <div className="ds160-review-page">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>请审核您的DS-160申请表信息</Title>
        <Text>请仔细检查以下信息是否正确。如需修改，请点击相应部分的"编辑"按钮。</Text>
        
        <Divider />
        
        {/* Personal Information Section */}
        {renderSection('个人信息', personalInfo, 0)}
        
        {/* Travel Information Section */}
        {renderSection('旅行信息', travelInfo, 1)}
        
        {/* Contact Information Section */}
        {renderSection('联系信息', contactInfo, 2)}
        
        {/* Security Information Section */}
        {renderSection('安全问题', securityInfo, 3)}
        
        <Divider />
        
        <Row justify="center" style={{ marginTop: 24 }}>
          <Col>
            <Space>
              <Button onClick={() => onEdit(0)}>返回编辑</Button>
              <Button type="primary" onClick={onSubmit}>
                确认提交
              </Button>
            </Space>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default DS160ReviewPage;
