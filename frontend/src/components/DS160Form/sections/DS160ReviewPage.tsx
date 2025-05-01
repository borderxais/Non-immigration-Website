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
    
    // Pre-process the data to remove irrelevant fields before filtering
    let processedData = { ...sectionData };
    
    // Handle special cases for conditional fields
    if (title === '旅行信息') {
      // If user is paying for themselves, remove all payer-related fields
      if (processedData.whoIsPaying === '本人') {
        delete processedData.payerName;
        delete processedData.payerRelationship;
        delete processedData.payerAddress;
        delete processedData.payerContact;
        delete processedData.principalApplicantInfo;
      }
    }
    
    // Filter out entries that should be hidden based on conditional logic
    const filteredEntries = Object.entries(processedData).filter(([key, value]: [string, any]) => {
      // Skip internal fields or empty values
      if (key.startsWith('_') || value === undefined || value === null || value === '') {
        return false;
      }
      
      // Skip "N/A" values for conditional fields
      if (value === 'N/A') {
        // Check parent condition fields to determine if this field should be shown
        
        // Previous US Travel conditional fields
        if (sectionData.hasBeenToUS === '否' && 
            ['previousTripsCount', 'previousTripsDetails', 'hasUSDriverLicense', 'driverLicenseDetails'].includes(key)) {
          return false;
        }
        
        // Previous US Visa conditional fields
        if (sectionData.previousUsVisa === '否' && 
            ['lastVisaDate', 'lastVisaNumber', 'sameTypeVisa', 'sameCountry', 'tenPrinted', 
             'visaLostStolen', 'visaLostYear', 'visaLostExplanation', 'visaCancelled', 'visaCancelledExplanation'].includes(key)) {
          return false;
        }
        
        // Travel Info - Payer fields
        if ((sectionData.whoIsPaying === '本人' || !sectionData.whoIsPaying) && 
            ['payerName', 'payerRelationship', 'payerAddress', 'payerContact', 'principalApplicantInfo'].includes(key)) {
          return false;
        }
        
        // Visa Lost/Stolen conditional fields
        if (sectionData.visaLostStolen === '否' && 
            ['visaLostYear', 'visaLostExplanation'].includes(key)) {
          return false;
        }
        
        // Visa Cancelled conditional fields
        if (sectionData.visaCancelled === '否' && 
            ['visaCancelledExplanation'].includes(key)) {
          return false;
        }
        
        // Visa Refused conditional fields
        if (sectionData.visaRefused === '否' && 
            ['visaRefusedExplanation'].includes(key)) {
          return false;
        }
        
        // Immigrant Petition conditional fields
        if (sectionData.immigrantPetition === '否' && 
            ['immigrantPetitionExplanation'].includes(key)) {
          return false;
        }
        
        // Travel Companions conditional fields
        if (sectionData.hasCompanions === '否' && 
            ['groupTravel', 'groupName', 'companionsCount', 'companionsDetails'].includes(key)) {
          return false;
        }
        
        // Group Travel conditional fields
        if (sectionData.groupTravel === '否' && 
            ['groupName'].includes(key)) {
          return false;
        }
      }
      
      return true;
    });
    
    // If there are no entries to display after filtering, return null
    if (filteredEntries.length === 0) {
      return null;
    }
    
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
          {filteredEntries.map(([key, value]: [string, any]) => {
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
  const personalInfoI = {
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

  const personalInfoII = {
    nationality: formData.nationality,
    hasOtherNationality: formData.hasOtherNationality === 'Y' ? '是' : formData.hasOtherNationality === 'N' ? '否' : 'N/A',
    otherNationality: formData.hasOtherNationality === 'Y' ? formData.otherNationality : 'N/A',
    isPermResOtherCountry: formData.isPermResOtherCountry === 'Y' ? '是' : formData.isPermResOtherCountry === 'N' ? '否' : 'N/A',
    permResCountry: formData.isPermResOtherCountry === 'Y' ? formData.permResCountry : 'N/A',
    nationalIdNumber: formData.nationalIdNumber_na ? 'N/A' : formData.nationalIdNumber,
    usSSN: formData.usSSN_na ? 'N/A' : (formData.usSSN ? `${formData.usSSN.part1 || ''}-${formData.usSSN.part2 || ''}-${formData.usSSN.part3 || ''}` : 'N/A'),
    usTaxId: formData.usTaxId_na ? 'N/A' : formData.usTaxId,
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

  const travelCompanions = {
    hasCompanions: formData.hasCompanions === 'Y' ? '是' : formData.hasCompanions === 'N' ? '否' : 'N/A',
    groupTravel: formData.hasCompanions === 'Y' ? 
      (formData.groupTravel === 'Y' ? '是' : formData.groupTravel === 'N' ? '否' : 'N/A') : 'N/A',
    groupName: formData.hasCompanions === 'Y' && formData.groupTravel === 'Y' ? 
      formData.groupName || 'N/A' : 'N/A',
    companionsCount: formData.hasCompanions === 'Y' && formData.groupTravel === 'N' ? 
      formData.companions?.length || 0 : 'N/A',
    companionsDetails: formData.hasCompanions === 'Y' && formData.groupTravel === 'N' && formData.companions?.length > 0 ? 
      formData.companions?.map((companion: any, index: number) => 
        `同行人 ${index + 1}: ${companion.surname || ''} ${companion.givenName || ''}, 关系: ${
          companion.relationship === 'S' ? '配偶' : 
          companion.relationship === 'C' ? '子女' : 
          companion.relationship === 'P' ? '父母' : 
          companion.relationship === 'R' ? '其他亲属' : 
          companion.relationship === 'F' ? '朋友' : 
          companion.relationship === 'B' ? '商业伙伴' : 
          companion.relationship === 'O' ? '其他' : 'N/A'
        }`
      )?.join('; ') || 'N/A' : 'N/A',
  };

  const previousTravel = {
    hasBeenToUS: formData.hasBeenToUS === 'Y' ? '是' : formData.hasBeenToUS === 'N' ? '否' : 'N/A',
    previousTripsCount: formData.hasBeenToUS === 'Y' ? formData.previousTrips?.length || 0 : 'N/A',
    previousTripsDetails: formData.hasBeenToUS === 'Y' && formData.previousTrips?.length > 0 ? 
      formData.previousTrips?.map((trip: any, index: number) => 
        `旅行 ${index + 1}: ${formatDate(trip.arrivalDay, trip.arrivalMonth, trip.arrivalYear)} - ${formatDate(trip.departureDay, trip.departureMonth, trip.departureYear)}, 停留天数: ${trip.stayDuration || 'N/A'}`
      )?.join('; ') || 'N/A' : 'N/A',
    hasUSDriverLicense: formData.hasBeenToUS === 'Y' ? 
      (formData.hasUSDriverLicense === 'Y' ? '是' : formData.hasUSDriverLicense === 'N' ? '否' : 'N/A') : 'N/A',
    driverLicenseDetails: formData.hasBeenToUS === 'Y' && formData.hasUSDriverLicense === 'Y' && Array.isArray(formData.driverLicenses) && formData.driverLicenses.length > 0 ? 
      formData.driverLicenses.map((license: any, index: number) => 
        `驾照 ${index + 1}: ${license?.licenseNumber || 'N/A'}, 州: ${license?.driver_license_issue_state || 'N/A'}`
      )?.join('; ') || 'N/A' : 'N/A',
    previousUsVisa: formData.previousUsVisa === 'Y' ? '是' : formData.previousUsVisa === 'N' ? '否' : 'N/A',
    lastVisaDate: formData.previousUsVisa === 'Y' ? 
      formatDate(
        formData['lastVisaDay'] || formData.lastVisaDay, 
        formData['lastVisaMonth'] || formData.lastVisaMonth, 
        formData['lastVisaYear'] || formData.lastVisaYear
      ) : 'N/A',
    lastVisaNumber: formData.previousUsVisa === 'Y' ? formData.lastVisaNumber || 'N/A' : 'N/A',
    sameTypeVisa: formData.previousUsVisa === 'Y' ? 
      (formData.sameTypeVisa === 'Y' ? '是' : formData.sameTypeVisa === 'N' ? '否' : 'N/A') : 'N/A',
    sameCountry: formData.previousUsVisa === 'Y' ? 
      (formData.sameCountry === 'Y' ? '是' : formData.sameCountry === 'N' ? '否' : 'N/A') : 'N/A',
    tenPrinted: formData.previousUsVisa === 'Y' ? 
      (formData.tenPrinted === 'Y' ? '是' : formData.tenPrinted === 'N' ? '否' : 'N/A') : 'N/A',
    visaLostStolen: formData.previousUsVisa === 'Y' ? 
      (formData.visaLostStolen === 'Y' ? '是' : formData.visaLostStolen === 'N' ? '否' : 'N/A') : 'N/A',
    visaLostYear: formData.previousUsVisa === 'Y' && formData.visaLostStolen === 'Y' ? 
      formData.visaLostYear || 'N/A' : 'N/A',
    visaLostExplanation: formData.previousUsVisa === 'Y' && formData.visaLostStolen === 'Y' ? 
      formData.visaLostExplanation || 'N/A' : 'N/A',
    visaCancelled: formData.previousUsVisa === 'Y' ? 
      (formData.visaCancelled === 'Y' ? '是' : formData.visaCancelled === 'N' ? '否' : 'N/A') : 'N/A',
    visaCancelledExplanation: formData.previousUsVisa === 'Y' && formData.visaCancelled === 'Y' ? 
      formData.visaCancelledExplanation || 'N/A' : 'N/A',
    visaRefused: formData.visaRefused === 'Y' ? '是' : formData.visaRefused === 'N' ? '否' : 'N/A',
    visaRefusedExplanation: formData.visaRefused === 'Y' ? formData.visaRefusedExplanation || 'N/A' : 'N/A',
    immigrantPetition: formData.immigrantPetition === 'Y' ? '是' : formData.immigrantPetition === 'N' ? '否' : 'N/A',
    immigrantPetitionExplanation: formData.immigrantPetition === 'Y' ? formData.immigrantPetitionExplanation || 'N/A' : 'N/A',
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
          {renderSection('个人信息 I', personalInfoI, 0)}
        </Col>
        <Col span={24}>
          {renderSection('个人信息 II', personalInfoII, 1)}
        </Col>
        <Col span={24}>
          {renderSection('旅行信息', travelInfo, 2)}
        </Col>
        <Col span={24}>
          {renderSection('同行人', travelCompanions, 3)}
        </Col>
        <Col span={24}>
          {renderSection('以前的旅行', previousTravel, 4)}
        </Col>
        <Col span={24}>
          {renderSection('地址历史', addressHistory, 1)}
        </Col>
        <Col span={24}>
          {renderSection('教育历史', educationHistory, 1)}
        </Col>
        <Col span={24}>
          {renderSection('工作历史', workHistory, 1)}
        </Col>
        <Col span={24}>
          {renderSection('家庭信息', familyInfo, 1)}
        </Col>
        <Col span={24}>
          {renderSection('安全背景', securityInfo, 1)}
        </Col>
        <Col span={24}>
          {renderSection('护照信息', passportInfo, 0)}
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
