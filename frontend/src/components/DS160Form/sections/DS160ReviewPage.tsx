import React from 'react';
import { Button, Card, Descriptions, Divider, Typography, Space, Row, Col } from 'antd';
import { FormInstance } from 'antd/lib/form';

const { Title, Paragraph } = Typography;

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
            <Typography.Text strong>{title}</Typography.Text>
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

  const addressHistory = {
    currentAddress: formData.currentAddress,
    currentCity: formData.currentCity,
    currentState: formData.currentState,
    currentPostalCode: formData.currentPostalCode,
    currentCountry: formData.currentCountry,
    currentAddressDuration: formData.currentAddressYears ? `${formData.currentAddressYears}年 ${formData.currentAddressMonths || 0}月` : '',
    previousAddressesCount: formData.previousAddresses?.length || 0,
  };

  const educationHistory = {
    highestEducationLevel: formData.highestEducationLevel,
    educationHistoryCount: formData.educationHistory?.length || 0,
  };

  const workHistory = {
    primaryOccupation: formData.primaryOccupation,
    currentlyEmployed: formData.currentlyEmployed ? '是' : '否',
    currentEmployerName: formData.currentEmployerName,
    currentJobTitle: formData.currentJobTitle,
    previousEmploymentCount: formData.previousEmployment?.length || 0,
  };

  const familyInfo = {
    maritalStatus: formData.maritalStatus,
    spouseName: formData.spouseSurname && formData.spouseGivenName ? `${formData.spouseSurname} ${formData.spouseGivenName}` : '',
    fatherName: formData.fatherSurname && formData.fatherGivenName ? `${formData.fatherSurname} ${formData.fatherGivenName}` : '',
    motherName: formData.motherSurname && formData.motherGivenName ? `${formData.motherSurname} ${formData.motherGivenName}` : '',
    relativesInUSCount: formData.otherRelatives?.length || 0,
  };

  const securityInfo = {
    hasArrestRecord: formData.hasArrestRecord ? '是' : '否',
    hasViolatedDrugLaw: formData.hasViolatedDrugLaw ? '是' : '否',
    hasMilitaryService: formData.hasMilitaryService ? '是' : '否',
    militaryServiceCountry: formData.militaryServiceCountry,
  };

  const passportInfo = {
    passportType: formData.passportType,
    passportNumber: formData.passportNumber,
    passportIssuingCountry: formData.passportIssuingCountry,
    passportIssuanceDate: formatDate(formData.passportIssuanceDay, formData.passportIssuanceMonth, formData.passportIssuanceYear),
    passportExpirationDate: formatDate(formData.passportExpirationDay, formData.passportExpirationMonth, formData.passportExpirationYear),
    hasPreviousVisa: formData.hasPreviousVisa ? '是' : '否',
  };

  return (
    <div className="ds160-review-page">
      <Title level={3}>申请表审核</Title>
      <Paragraph>
        请仔细检查以下信息。如需修改，请点击相应部分的"编辑"按钮。确认所有信息无误后，点击底部的"提交"按钮完成申请。
      </Paragraph>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {renderSection('个人信息', personalInfo, 0)}
        </Col>
        <Col span={24}>
          {renderSection('旅行信息', travelInfo, 1)}
        </Col>
        <Col span={24}>
          {renderSection('地址历史', addressHistory, 2)}
        </Col>
        <Col span={24}>
          {renderSection('教育历史', educationHistory, 3)}
        </Col>
        <Col span={24}>
          {renderSection('工作历史', workHistory, 4)}
        </Col>
        <Col span={24}>
          {renderSection('家庭信息', familyInfo, 5)}
        </Col>
        <Col span={24}>
          {renderSection('安全背景', securityInfo, 6)}
        </Col>
        <Col span={24}>
          {renderSection('护照信息', passportInfo, 7)}
        </Col>
      </Row>
      
      <Divider />
      
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Space size="large">
          <Button type="primary" size="large" onClick={onSubmit}>
            提交申请
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default DS160ReviewPage;
