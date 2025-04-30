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
    birthCity: formData.birthCity,
    birthState: formData.birthState,
    birthCountry: formData.birthCountry,
  };

  const travelInfo = {
    visaClass: formData.visaClass || 'N/A',
    specificPurpose: formData.specificPurpose || 'N/A',
    applicationReceiptNumber: formData.applicationReceiptNumber || 'N/A',
    arrivalDate: formatDate(
      formData['intendedDateOfArrival.arrivalDay'] || formData.arrivalDay, 
      formData['intendedDateOfArrival.arrivalMonth'] || formData.arrivalMonth, 
      formData['intendedDateOfArrival.arrivalYear'] || formData.arrivalYear
    ),
    lengthOfStay: (formData.stayDuration || formData.intendedLengthOfStay) ? 
      `${formData.stayDuration || formData.intendedLengthOfStay} ${formData.stayDurationType || formData.losUnit || 'Days'}` : 
      'N/A',
    usAddress: formData.streetAddress1 ? 
      `${formData.streetAddress1}${formData.streetAddress2 ? ', ' + formData.streetAddress2 : ''}${formData.city ? ', ' + formData.city : ''}${formData.state ? ', ' + formData.state : ''}${formData.zipCode ? ', ' + formData.zipCode : ''}` : 
      (formData.usAddressLine1 ? 
        `${formData.usAddressLine1}${formData.usAddressLine2 ? ', ' + formData.usAddressLine2 : ''}${formData.usCity ? ', ' + formData.usCity : ''}${formData.usState ? ', ' + formData.usState : ''}${formData.usZipCode ? ', ' + formData.usZipCode : ''}` : 
        'N/A'),
    whoIsPaying: formData.whoIsPaying ? 
      (formData.whoIsPaying === 'S' ? '本人' : 
       formData.whoIsPaying === 'H' ? '美国申请人' : 
       formData.whoIsPaying === 'O' ? '其他个人' : 
       formData.whoIsPaying === 'P' ? '当前雇主' : 
       formData.whoIsPaying === 'U' ? '美国雇主' : 
       formData.whoIsPaying === 'C' ? '其他公司/组织' : 'N/A') : 'N/A',
    payerName: formData.whoIsPaying === 'O' ? 
      `${formData.payerSurname || ''} ${formData.payerGivenName || ''}`.trim() || 'N/A' : 
      (formData.whoIsPaying === 'C' ? formData.companyName || 'N/A' : 'N/A'),
    payerRelationship: formData.whoIsPaying === 'O' ? 
      (formData.payerRelationship === 'C' ? '子女' : 
       formData.payerRelationship === 'P' ? '父母' : 
       formData.payerRelationship === 'S' ? '配偶' : 
       formData.payerRelationship === 'R' ? '其他亲属' : 
       formData.payerRelationship === 'F' ? '朋友' : 
       formData.payerRelationship === 'O' ? '其他' : 'N/A') : 
      (formData.whoIsPaying === 'C' ? formData.companyRelation || 'N/A' : 'N/A'),
    payerAddress: formData.whoIsPaying === 'O' && formData.isSameAddress === 'N' ? 
      `${formData.payerAddress1 || ''}${formData.payerAddress2 ? ', ' + formData.payerAddress2 : ''}${formData.payerCity ? ', ' + formData.payerCity : ''}${formData.payerStateProvince ? ', ' + formData.payerStateProvince : ''}${formData.payerPostalZIPCode ? ', ' + formData.payerPostalZIPCode : ''}${formData.payerCountry ? ', ' + formData.payerCountry : ''}`.trim() || 'N/A' : 
      (formData.whoIsPaying === 'C' ? 
        `${formData.companyStreetAddress1 || ''}${formData.companyStreetAddress2 ? ', ' + formData.companyStreetAddress2 : ''}${formData.companyCity ? ', ' + formData.companyCity : ''}${formData.companyStateProvince ? ', ' + formData.companyStateProvince : ''}${formData.companyPostalZIPCode ? ', ' + formData.companyPostalZIPCode : ''}${formData.companyCountry ? ', ' + formData.companyCountry : ''}`.trim() || 'N/A' : 
        (formData.whoIsPaying === 'O' && formData.isSameAddress === 'Y' ? '与申请人地址相同' : 'N/A')),
    payerContact: formData.whoIsPaying === 'O' ? 
      `电话: ${formData.payerPhone || 'N/A'}${formData.payerEmail && !formData.payerEmail_na ? ', 邮箱: ' + formData.payerEmail : ''}` : 
      (formData.whoIsPaying === 'C' ? 
        `电话: ${formData.companyPhone || 'N/A'}${formData.companyEmail && !formData.companyEmail_na ? ', 邮箱: ' + formData.companyEmail : ''}` : 'N/A'),
    principalApplicantInfo: formData.specificPurpose && (formData.specificPurpose.includes('H4-') || (formData.visaClass === 'H' && !formData.specificPurpose.includes('H1B1'))) ? 
      `姓: ${formData.principalApplicantSurname || 'N/A'}, 名: ${formData.principalApplicantGivenName || 'N/A'}, 申请收据号: ${formData.applicationReceiptNumber || 'N/A'}` : 'N/A',
    travelingWithOthers: formData.travelingWithOthers === true ? '是' : formData.travelingWithOthers === false ? '否' : 'N/A',
    travelFunder: formData.whoIsPaying || formData.travelFunder || 'N/A',
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
