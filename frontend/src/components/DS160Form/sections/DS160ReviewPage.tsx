import React from 'react';
import { Button, Card, Descriptions, Divider, Typography, Space, Row, Col } from 'antd';
import { FormInstance } from 'antd/lib/form';

const { Title, Paragraph } = Typography;

interface DS160ReviewPageProps {
  form: FormInstance;
  onSubmit: (values: any) => void;
  onEdit: (step: number) => void;
  readOnly?: boolean;
  formSections: any[]; 
}

const DS160ReviewPage: React.FC<DS160ReviewPageProps> = ({ 
  form, 
  onSubmit, 
  onEdit, 
  readOnly = false,
  formSections = [] 
}) => {
  // Get form data
  const formData = form.getFieldsValue(true);
  console.log('Review page form data:', formData);
  
  // Helper function to format date values from form data
  const formatDate = (dateObj: any) => {
    // If no date object provided
    if (!dateObj) return 'N/A';
    
    console.log("Formatting date object:", JSON.stringify(dateObj));
    
    // Handle nested date object with day, month, year properties
    if (dateObj && typeof dateObj === 'object') {
      if ('day' in dateObj && 'month' in dateObj && 'year' in dateObj) {
        return `${dateObj.day}-${dateObj.month}-${dateObj.year}`;
      }
      
      // Handle date object with different property names
      if ('$D' in dateObj && '$M' in dateObj && '$y' in dateObj) {
        // Note: $M is 0-indexed in moment objects, so add 1
        return `${dateObj.$D}-${dateObj.$M + 1}-${dateObj.$y}`;
      }
      
      // Handle moment-like objects
      if (dateObj._isAMomentObject || dateObj._isValid || dateObj._d) {
        try {
          const date = new Date(dateObj._d || dateObj);
          return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        } catch (e) {
          console.error("Error parsing moment object:", e);
        }
      }
    }
    
    // Handle string date formats
    if (typeof dateObj === 'string') {
      // Try to parse various date formats
      const dateParts = dateObj.split(/[-/]/);
      if (dateParts.length === 3) {
        return dateParts.join('-');
      }
      
      // Try to parse ISO date string
      try {
        const date = new Date(dateObj);
        if (!isNaN(date.getTime())) {
          return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        }
      } catch (e) {
        console.error("Error parsing date string:", e);
      }
      
      return dateObj; // Return as is if it's already formatted
    }
    
    return 'N/A';
  };

  // Helper function for individual date parts
  const formatDateParts = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return 'N/A';
    return `${day}-${month}-${year}`;
  };

  // Helper function to get section title and data
  const renderSection = (title: string, sectionData: any, editStep: number) => {
    if (!sectionData) return null;
    
    // Pre-process the data to remove irrelevant fields before filtering
    let processedData = { ...sectionData };
    
    // Filter out entries that should be hidden based on conditional logic
    const filteredEntries = Object.entries(processedData).filter(([key, value]: [string, any]) => {
      // Skip internal fields or empty values
      if (key.startsWith('_') || value === undefined || value === null || value === '') {
        return false;
      }
      
      // Skip fields ending with _na as they're just checkbox states
      if (key.endsWith('_na')) {
        return false;
      }
      
      // Skip arrays that are empty
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }
      
      return true;
    });
    
    // If there are no entries to display after filtering, return null
    if (filteredEntries.length === 0) {
      return null;
    }
    
    return (
      <Card 
        title={title} 
        style={{ marginBottom: 16 }}
        extra={
          !readOnly && (
            <Button type="link" onClick={() => onEdit(editStep)}>
              编辑
            </Button>
          )
        }
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
              // Handle arrays of objects
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
              // Format nested objects
              const objEntries = Object.entries(value).filter(([k, v]) => 
                !k.startsWith('_') && v !== undefined && v !== null && v !== '' && !k.endsWith('_na')
              );
              
              if (objEntries.length === 0) return null;
              
              displayValue = objEntries.map(([k, v]) => 
                `${k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}: ${v}`
              ).join(', ');
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

  // Map section keys to their indices in the form sections array
  const getSectionIndex = (sectionKey: string): number => {
    const index = formSections.findIndex(section => section.key === sectionKey);
    return index >= 0 ? index : 0; // Default to 0 if not found
  };

  // Dynamically extract sections from formData
  const renderSections = () => {
    // Create a mapping of section keys to their display data
    const sectionDataMap: Record<string, any> = {
      personalInfo1: formData.personalInfo1 || {
        surname: formData.surname || 'N/A',
        givenName: formData.givenName || 'N/A',
        fullNameNative: formData.fullNameNative || 'N/A',
        gender: formData.gender === 'M' ? '男' : '女',
        maritalStatus: formData.maritalStatus || 'N/A',
        dateOfBirth: (() => {
          // Debug all possible date of birth sources
          console.log("DOB Debug - personalInfo1?.dob:", JSON.stringify(formData.personalInfo1?.dob));
          console.log("DOB Debug - dob:", JSON.stringify(formData.dob));
          console.log("DOB Debug - dobDay:", formData.dobDay);
          console.log("DOB Debug - dobMonth:", formData.dobMonth);
          console.log("DOB Debug - dobYear:", formData.dobYear);
          
          // Try all possible formats for date of birth
          if (formData.personalInfo1?.dob) {
            return formatDate(formData.personalInfo1.dob);
          } 
          if (formData.dob) {
            return formatDate(formData.dob);
          }
          if (formData.dobDay && formData.dobMonth && formData.dobYear) {
            return formatDateParts(formData.dobDay, formData.dobMonth, formData.dobYear);
          }
          
          return 'N/A';
        })(),
        birthCity: formData.birthCity || 'N/A',
        birthState: formData.birthState || 'N/A',
        birthCountry: formData.birthCountry || 'N/A',
        hasOtherNames: formData.hasOtherNames === 'Y' ? '是' : '否',
        hasTelecode: formData.hasTelecode === 'Y' ? '是' : '否'
      },
      personalInfo2: formData.personalInfo2 || {
        nationality: formData.nationality,
        hasOtherNationality: formData.hasOtherNationality === 'Y' ? '是' : '否',
        otherNationality: formData.hasOtherNationality === 'Y' ? formData.otherNationality : 'N/A',
        isPermResOtherCountry: formData.isPermResOtherCountry === 'Y' ? '是' : '否',
        permResCountry: formData.isPermResOtherCountry === 'Y' ? formData.permResCountry : 'N/A',
        nationalIdNumber: formData.nationalIdNumber_na ? 'N/A' : formData.nationalIdNumber,
        usSSN: formData.usSSN_na ? 'N/A' : (formData.usSSN ? `${formData.usSSN.part1 || ''}-${formData.usSSN.part2 || ''}-${formData.usSSN.part3 || ''}` : 'N/A'),
        usTaxId: formData.usTaxId_na ? 'N/A' : formData.usTaxId,
      },
      travelInfo: formData.travelInfo || {
        visaClass: formData.visaClass || formData.travelPurposes?.[0]?.visaClass || 'N/A',
        specificPurpose: formData.specificPurpose || formData.travelPurposes?.[0]?.specificPurpose || 'N/A',
        applicationReceiptNumber: formData.applicationReceiptNumber || formData.travelPurposes?.[0]?.applicationReceiptNumber || 'N/A',
        hasSpecificPlans: formData.hasSpecificPlans === 'Y' ? '是' : '否',
        arrivalDate: formatDate(formData.intendedDateOfArrival) || formatDate(formData.arrivalDate),
        lengthOfStay: (formData.stayDuration || formData.intendedLengthOfStay) ? 
          `${formData.stayDuration || formData.intendedLengthOfStay} ${formData.stayDurationType || 'Days'}` : 
          'N/A',
        usAddress: formData.streetAddress1 ? 
          `${formData.streetAddress1}${formData.city ? ', ' + formData.city : ''}${formData.state ? ', ' + formData.state : ''}` : 
          'N/A',
        whoIsPaying: formData.whoIsPaying ? 
          (formData.whoIsPaying === 'S' ? '本人' : 
           formData.whoIsPaying === 'H' ? '美国申请人' : 
           formData.whoIsPaying === 'O' ? '其他个人' : 
           formData.whoIsPaying === 'P' ? '当前雇主' : 
           formData.whoIsPaying === 'U' ? '美国雇主' : 
           formData.whoIsPaying === 'C' ? '其他公司/组织' : 'N/A') : 'N/A',
      },
      travelCompanions: formData.travelCompanions || {
        hasCompanions: formData.hasCompanions === 'Y' ? '是' : '否',
        groupTravel: formData.hasCompanions === 'Y' ? 
          (formData.groupTravel === 'Y' ? '是' : '否') : 'N/A',
        groupName: formData.hasCompanions === 'Y' && formData.groupTravel === 'Y' ? 
          formData.groupName || 'N/A' : 'N/A',
        companionsCount: formData.hasCompanions === 'Y' && formData.groupTravel === 'N' ? 
          formData.companions?.length || 0 : 'N/A',
        companionsDetails: formData.companions || []
      },
      previousTravel: formData.previousTravel || {
        hasBeenToUS: formData.hasBeenToUS === 'Y' ? '是' : '否',
        previousTripsCount: formData.hasBeenToUS === 'Y' ? formData.previousTrips?.length || 0 : 'N/A',
        previousTripsDetails: formData.previousTrips || [],
        previousUsVisa: formData.previousUsVisa === 'Y' ? '是' : '否',
        visaRefused: formData.visaRefused === 'Y' ? '是' : '否',
        immigrantPetition: formData.immigrantPetition === 'Y' ? '是' : '否'
      },
      addressAndPhone: formData.addressAndPhone || {
        homeAddress: `${formData.homeAddressStreet1 || ''}, ${formData.homeAddressCity || ''}, ${formData.homeAddressState || ''}, ${formData.homeAddressZipCode || ''}, ${formData.homeAddressCountry || ''}`,
        isMailingAddressSame: formData.isMailingAddressSame === 'Y' ? '是' : '否',
        primaryPhone: formData.primaryPhone || 'N/A',
        emailAddress: formData.emailAddress || 'N/A',
        socialMediaPlatforms: formData.socialMediaPlatform || []
      },
      passport: formData.passport || {
        passportNumber: formData.passportNumber || formData.passport?.passportNumber || 'N/A',
        passportType: formData.passportType || formData.passport?.passportType || 'N/A',
        passportBookNumber: formData.passportBookNumber || formData.passport?.passportBookNumber || 'N/A',
        passportIssuedCountry: formData.passportIssuedCountry || formData.passport?.passportIssuedCountry || 'N/A',
        passportIssuedCity: formData.passportIssuedCity || formData.passport?.passportIssuedCity || 'N/A',
        passportIssuedInCountry: formData.passportIssuedInCountry || formData.passport?.passportIssuedInCountry || 'N/A',
        passportIssuanceDate: formatDate(formData.passportIssuedDate) || 
                             formatDate(formData.passport?.passportIssuedDate) || 
                             formatDateParts(formData.passportIssuanceDay, formData.passportIssuanceMonth, formData.passportIssuanceYear),
        passportExpirationDate: formatDate(formData.passportExpirationDate) || 
                               formatDate(formData.passport?.passportExpirationDate) || 
                               formatDateParts(formData.passportExpirationDay, formData.passportExpirationMonth, formData.passportExpirationYear),
        hasLostPassport: formData.hasLostPassport === 'Y' || formData.passport?.hasLostPassport === 'Y' ? '是' : '否'
      },
      usContact: formData.usContact || {
        contactName: `${formData.usPocSurname || ''} ${formData.usPocGivenName || ''}`,
        organization: formData.usPocOrganization || 'N/A',
        relationship: formData.usPocRelationship === 'R' ? '亲属' : 
                      formData.usPocRelationship === 'F' ? '朋友' : 
                      formData.usPocRelationship === 'B' ? '商业伙伴' : 
                      formData.usPocRelationship === 'E' ? '雇主' : 
                      formData.usPocRelationship === 'S' ? '学校' : 
                      formData.usPocRelationship === 'O' ? '其他' : 'N/A',
        address: `${formData.usPocAddressLine1 || ''}, ${formData.usPocCity || ''}, ${formData.usPocState || ''}`,
        phone: formData.usPocPhone || 'N/A',
        email: formData.usPocEmail || 'N/A'
      },
      familyRelatives: formData.familyRelatives || {
        hasRelatives: formData.hasRelatives === 'Y' ? '是' : '否',
        relativesCount: formData.hasRelatives === 'Y' ? formData.relatives?.length || 0 : 'N/A',
        relativesDetails: formData.relatives || []
      },
      familySpouse: formData.familySpouse || {
        hasSpouse: formData.hasSpouse === 'Y' ? '是' : '否',
        spouseSurname: formData.familySpouse?.spouseSurname || formData.spouseSurname || 'N/A',
        spouseGivenName: formData.familySpouse?.spouseGivenName || formData.spouseGivenName || 'N/A',
        spouseName: `${formData.familySpouse?.spouseSurname || formData.spouseSurname || ''} ${formData.familySpouse?.spouseGivenName || formData.spouseGivenName || ''}`,
        spouseBirthDate: formatDate(formData.spouseDob) || 
                        formatDate(formData.familySpouse?.spouseDob) || 
                        formatDateParts(formData.spouseDobDay, formData.spouseDobMonth, formData.spouseDobYear),
        spouseBirthPlace: `${formData.familySpouse?.spousePobCity || formData.spouseBirthCity || ''}, ${formData.familySpouse?.spousePobState || formData.spouseBirthState || ''}, ${formData.familySpouse?.spousePobCountry || formData.spouseBirthCountry || ''}`,
        spouseNationality: formData.familySpouse?.spouseNationality || formData.spouseNationality || 'N/A',
        spouseAddressType: formData.familySpouse?.spouseAddressType || formData.spouseAddressType || 'N/A'
      },
      workEducation: formData.workEducation || {
        presentOccupation: formData.presentOccupation === 'EN' ? '工程师' : 
                          formData.presentOccupation === 'ST' ? '学生' : 
                          formData.presentOccupation === 'BM' ? '商人' : 
                          formData.presentOccupation === 'TE' ? '教师' : 
                          formData.presentOccupation === 'OT' ? '其他' : formData.presentOccupation || 'N/A',
        employerSchoolName: formData.employerSchoolName || 'N/A',
        employerAddress: `${formData.employerAddressLine1 || ''}, ${formData.employerCity || ''}, ${formData.employerState || ''}, ${formData.employerPostalCode || ''}, ${formData.employerCountry || ''}`,
        employerPhone: formData.employerPhone || 'N/A',
        employmentStartDate: formatDate(formData.employerStart) || 
                           formatDate(formData.workEducation?.employerStart) || 
                           formatDateParts(formData.employerStartDay, formData.employerStartMonth, formData.employerStartYear),
        monthlySalary: formData.monthlySalary || 'N/A'
      },
      workEducationPrevious: formData.workEducationPrevious || {
        previouslyEmployed: formData.previouslyEmployed === 'Y' ? '是' : '否',
        previousEmployments: formData.previousEmployments || [],
        attendedEducation: formData.attendedEducation === 'Y' ? '是' : '否',
        previousEducations: formData.previousEducations || []
      },
      workEducationAdditional: formData.workEducationAdditional || {
        languages: formData.languages || [],
        hasSpecializedSkills: formData.hasSpecializedSkills === 'Y' ? '是' : '否',
        belongsToOrganizations: formData.belongsToOrganizations === 'Y' ? '是' : '否',
        hasMilitaryExperience: formData.hasMilitaryExperience === 'Y' ? '是' : '否',
        hasArmedForcesMembership: formData.hasArmedForcesMembership === 'Y' ? '是' : '否',
        hasRebelGroupMembership: formData.hasRebelGroupMembership === 'Y' ? '是' : '否',
        hasWeaponsTraining: formData.hasWeaponsTraining === 'Y' ? '是' : '否'
      },
      securityBackground: formData.securityBackground || {
        hasDisease: formData.hasDisease === 'Y' ? '是' : '否',
        hasDisorder: formData.hasDisorder === 'Y' ? '是' : '否',
        isDrugUser: formData.isDrugUser === 'Y' ? '是' : '否'
      },
      securityBackground2: formData.securityBackground2 || {
        hasArrest: formData.hasArrest === 'Y' ? '是' : '否',
        hasControlledSubstances: formData.hasControlledSubstances === 'Y' ? '是' : '否',
        hasProstitution: formData.hasProstitution === 'Y' ? '是' : '否',
        hasMoneyLaundering: formData.hasMoneyLaundering === 'Y' ? '是' : '否',
        hasHumanTrafficking: formData.hasHumanTrafficking === 'Y' ? '是' : '否',
        hasAssistedTrafficking: formData.hasAssistedTrafficking === 'Y' ? '是' : '否',
        hasTraffickingRelated: formData.hasTraffickingRelated === 'Y' ? '是' : '否'
      },
      securityBackground3: formData.securityBackground3 || {
        hasIllegalActivity: formData.hasIllegalActivity === 'Y' ? '是' : '否',
        hasTerroristActivity: formData.hasTerroristActivity === 'Y' ? '是' : '否',
        hasTerroristSupport: formData.hasTerroristSupport === 'Y' ? '是' : '否',
        hasTerroristOrg: formData.hasTerroristOrg === 'Y' ? '是' : '否',
        hasTerroristRel: formData.hasTerroristRel === 'Y' ? '是' : '否',
        hasGenocide: formData.hasGenocide === 'Y' ? '是' : '否',
        hasTorture: formData.hasTorture === 'Y' ? '是' : '否',
        hasExViolence: formData.hasExViolence === 'Y' ? '是' : '否',
        hasChildSoldier: formData.hasChildSoldier === 'Y' ? '是' : '否',
        hasReligiousFreedom: formData.hasReligiousFreedom === 'Y' ? '是' : '否',
        hasPopulationControls: formData.hasPopulationControls === 'Y' ? '是' : '否',
        hasTransplant: formData.hasTransplant === 'Y' ? '是' : '否'
      },
      securityBackground4: formData.securityBackground4 || {
        hasImmigrationFraud: formData.hasImmigrationFraud === 'Y' ? '是' : '否',
        hasDeportation: formData.hasDeportation === 'Y' ? '是' : '否'
      },
      securityBackground5: formData.securityBackground5 || {
        hasChildCustody: formData.hasChildCustody === 'Y' ? '是' : '否',
        hasVotingViolation: formData.hasVotingViolation === 'Y' ? '是' : '否',
        hasRenounced: formData.hasRenounced === 'Y' ? '是' : '否'
      }
    };

    // Render each section based on the formSections array
    return formSections.map((section) => {
      const sectionKey = section.key;
      const sectionTitle = section.title;
      const sectionIndex = getSectionIndex(sectionKey);
      
      // Get the section data from our mapping
      const sectionData = sectionDataMap[sectionKey] || formData[sectionKey] || {};
      
      return renderSection(sectionTitle, sectionData, sectionIndex);
    });
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
          {renderSections()}
        </Col>
      </Row>
      
      <Divider />
      
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Space size="large">
          <Button type="primary" size="large" onClick={() => onSubmit(formData)}>
            提交申请
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default DS160ReviewPage;
