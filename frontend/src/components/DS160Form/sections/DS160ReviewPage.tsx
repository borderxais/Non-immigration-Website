import React from 'react';
import { Button, Card, Descriptions, Divider, Typography, Space, Row, Col } from 'antd';

const { Title, Text } = Typography;

interface DS160ReviewPageProps {
  formData: any;
  onSubmit: () => void;
  onEdit: (step: number) => void;
}

const DS160ReviewPage: React.FC<DS160ReviewPageProps> = ({ formData, onSubmit, onEdit }) => {
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
        style={{ marginBottom: '24px' }}
      >
        <Descriptions bordered column={1} size="small">
          {Object.entries(sectionData).map(([key, value]) => {
            // Skip internal fields or empty values
            if (key.startsWith('_') || value === undefined || value === null || value === '') {
              return null;
            }

            // Format the key for display
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1') // Add space before capital letters
              .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

            // Format the value based on its type
            let formattedValue: React.ReactNode = '';
            
            // Handle different value types
            if (typeof value === 'boolean') {
              formattedValue = value ? '是' : '否';
            } else if (Array.isArray(value)) {
              formattedValue = value.join(', ');
            } else if (value !== null && value !== undefined) {
              formattedValue = String(value);
            }

            return (
              <Descriptions.Item key={key} label={formattedKey}>
                {formattedValue}
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      </Card>
    );
  };

  // Extract personal information
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

  // Extract travel information
  const travelInfo = {
    arrivalDate: formatDate(formData.arrivalDay, formData.arrivalMonth, formData.arrivalYear),
    lengthOfStay: `${formData.losLength} ${formData.losUnit}`,
    usAddress: `${formData.usAddressLine1}, ${formData.usAddressLine2 || ''}, ${formData.usCity}, ${formData.usState}, ${formData.usZipCode}`,
    travelFunder: formData.travelFunder,
    travelingWithOthers: formData.travelingWithOthers,
  };

  // Extract contact information (assuming it exists in the form data)
  const contactInfo = {
    email: formData.email,
    phone: formData.phone,
    homeAddress: formData.homeAddress,
  };

  // Extract security information (assuming it exists in the form data)
  const securityInfo = {
    hasCriminalRecord: formData.hasCriminalRecord,
    hasDrugHistory: formData.hasDrugHistory,
    hasTerroristActivity: formData.hasTerroristActivity,
  };

  return (
    <div className="ds160-review-page">
      <Title level={3}>申请表审核</Title>
      <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
        请仔细检查以下信息，确保所有内容准确无误。如需修改，请点击相应部分的"编辑"按钮。
      </Text>

      <Divider orientation="left">个人信息</Divider>
      {renderSection('个人信息', personalInfo, 0)}

      <Divider orientation="left">旅行信息</Divider>
      {renderSection('旅行信息', travelInfo, 1)}

      <Divider orientation="left">联系信息</Divider>
      {renderSection('联系信息', contactInfo, 2)}

      <Divider orientation="left">安全问题</Divider>
      {renderSection('安全问题', securityInfo, 3)}

      <Row justify="center" style={{ marginTop: '36px' }}>
        <Col>
          <Space size="large">
            <Button onClick={() => onEdit(0)}>返回编辑</Button>
            <Button type="primary" onClick={onSubmit} size="large">
              确认提交
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default DS160ReviewPage;
