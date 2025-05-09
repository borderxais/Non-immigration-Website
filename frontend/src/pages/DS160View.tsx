import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Button, Descriptions, Divider, Alert, Modal, Spin, Space, Row, Col } from 'antd';
import ds160Service from '../services/ds160Service';
import ApplicationIdDisplay from '../components/ApplicationIdDisplay';
import { useAuth } from '../contexts/AuthContext';
import { getSections } from '../utils/ds160Sections';

const { Title, Paragraph } = Typography;

const formSections = [
  {
    key: 'personalInfo1',
    title: '个人信息 I'
  },
  {
    key: 'personalInfo2',
    title: '个人信息 II'
  },
  {
    key: 'travelInfo',
    title: '旅行信息'
  },
  {
    key: 'travelCompanions',
    title: '同行人'
  },
  {
    key: 'previousTravel',
    title: '以前的旅行'
  },
  {
    key: 'addressAndPhone',
    title: '地址和电话'
  },
  {
    key: 'usContact',
    title: '美国联系人'
  },
  {
    key: 'workEducation',
    title: '当前工作和教育'
  },
  {
    key: 'workEducationPrevious',
    title: '以往工作和教育'
  },
  {
    key: 'workEducationAdditional',
    title: '额外工作和教育信息'
  },
  {
    key: 'securityBackground',
    title: '安全和背景: 第一部分'
  },
  {
    key: 'securityBackground2',
    title: '安全和背景: 第二部分'
  },
  {
    key: 'securityBackground3',
    title: '安全和背景: 第三部分'
  },
  {
    key: 'securityBackground4',
    title: '安全和背景: 第四部分'
  },
  {
    key: 'securityBackground5',
    title: '安全和背景: 第五部分'
  },
  {
    key: 'review',
    title: '审核提交'
  }
];

const DS160View: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formStatus, setFormStatus] = useState<string>('');
  const [lastEditedSection, setLastEditedSection] = useState<number>(0);
  const [draftModalVisible, setDraftModalVisible] = useState<boolean>(false);
  
  const formatDate = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return 'N/A';
    return `${day}-${month}-${year}`;
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
  
  const getSectionDataMap = (data: any): Record<string, any> => {
    const formDataContent = data.form_data || {};
    console.log('DS160View - Form data content:', formDataContent);
    
    return {
      personalInfo1: formDataContent.personalInfo1 || {
        surname: formDataContent.surname,
        givenName: formDataContent.givenName,
        fullNameNative: formDataContent.fullNameNative,
        gender: formDataContent.gender === 'M' ? '男' : '女',
        maritalStatus: formDataContent.maritalStatus,
        dateOfBirth: formatDate(formDataContent.dobDay, formDataContent.dobMonth, formDataContent.dobYear),
        birthCity: formDataContent.birthCity,
        birthState: formDataContent.birthState,
        birthCountry: formDataContent.birthCountry,
        hasOtherNames: formDataContent.hasOtherNames === 'Y' ? '是' : '否',
        hasTelecode: formDataContent.hasTelecode === 'Y' ? '是' : '否'
      },
      personalInfo2: formDataContent.personalInfo2 || {
        nationality: formDataContent.nationality,
        hasOtherNationality: formDataContent.hasOtherNationality === 'Y' ? '是' : '否',
        otherNationality: formDataContent.hasOtherNationality === 'Y' ? formDataContent.otherNationality : 'N/A',
        isPermResOtherCountry: formDataContent.isPermResOtherCountry === 'Y' ? '是' : '否',
        permResCountry: formDataContent.isPermResOtherCountry === 'Y' ? formDataContent.permResCountry : 'N/A',
        nationalIdNumber: formDataContent.nationalIdNumber_na ? 'N/A' : formDataContent.nationalIdNumber,
        usSSN: formDataContent.usSSN_na ? 'N/A' : (formDataContent.usSSN ? `${formDataContent.usSSN.part1 || ''}-${formDataContent.usSSN.part2 || ''}-${formDataContent.usSSN.part3 || ''}` : 'N/A'),
        usTaxId: formDataContent.usTaxId_na ? 'N/A' : formDataContent.usTaxId,
      },
      travelInfo: formDataContent.travelInfo || {
        visaClass: formDataContent.visaClass || formDataContent.travelPurposes?.[0]?.visaClass || 'N/A',
        specificPurpose: formDataContent.specificPurpose || formDataContent.travelPurposes?.[0]?.specificPurpose || 'N/A',
        applicationReceiptNumber: formDataContent.applicationReceiptNumber || formDataContent.travelPurposes?.[0]?.applicationReceiptNumber || 'N/A',
        hasSpecificPlans: formDataContent.hasSpecificPlans === 'Y' ? '是' : '否',
        arrivalDate: formatDate(
          formDataContent['intendedDateOfArrival.arrivalDay'] || formDataContent.arrivalDay, 
          formDataContent['intendedDateOfArrival.arrivalMonth'] || formDataContent.arrivalMonth, 
          formDataContent['intendedDateOfArrival.arrivalYear'] || formDataContent.arrivalYear
        ),
        lengthOfStay: (formDataContent.stayDuration || formDataContent.intendedLengthOfStay) ? 
          `${formDataContent.stayDuration || formDataContent.intendedLengthOfStay} ${formDataContent.stayDurationType || 'Days'}` : 
          'N/A',
        usAddress: formDataContent.streetAddress1 ? 
          `${formDataContent.streetAddress1}${formDataContent.city ? ', ' + formDataContent.city : ''}${formDataContent.state ? ', ' + formDataContent.state : ''}` : 
          'N/A',
        whoIsPaying: formDataContent.whoIsPaying ? 
          (formDataContent.whoIsPaying === 'S' ? '本人' : 
           formDataContent.whoIsPaying === 'H' ? '美国申请人' : 
           formDataContent.whoIsPaying === 'O' ? '其他个人' : 
           formDataContent.whoIsPaying === 'P' ? '当前雇主' : 
           formDataContent.whoIsPaying === 'U' ? '美国雇主' : 
           formDataContent.whoIsPaying === 'C' ? '其他公司/组织' : 'N/A') : 'N/A',
      },
      travelCompanions: formDataContent.travelCompanions || {
        hasCompanions: formDataContent.hasCompanions === 'Y' ? '是' : '否',
        groupTravel: formDataContent.hasCompanions === 'Y' ? 
          (formDataContent.groupTravel === 'Y' ? '是' : '否') : 'N/A',
        groupName: formDataContent.hasCompanions === 'Y' && formDataContent.groupTravel === 'Y' ? 
          formDataContent.groupName || 'N/A' : 'N/A',
        companionsCount: formDataContent.hasCompanions === 'Y' && formDataContent.groupTravel === 'N' ? 
          formDataContent.companions?.length || 0 : 'N/A',
        companionsDetails: formDataContent.companions || []
      },
      previousTravel: formDataContent.previousTravel || {
        hasBeenToUS: formDataContent.hasBeenToUS === 'Y' ? '是' : '否',
        previousTripsCount: formDataContent.hasBeenToUS === 'Y' ? formDataContent.previousTrips?.length || 0 : 'N/A',
        previousTripsDetails: formDataContent.previousTrips || [],
        previousUsVisa: formDataContent.previousUsVisa === 'Y' ? '是' : '否',
        visaRefused: formDataContent.visaRefused === 'Y' ? '是' : '否',
        immigrantPetition: formDataContent.immigrantPetition === 'Y' ? '是' : '否'
      },
      addressAndPhone: formDataContent.addressAndPhone || {
        homeAddress: `${formDataContent.homeAddressStreet1 || ''}, ${formDataContent.homeAddressCity || ''}, ${formDataContent.homeAddressState || ''}, ${formDataContent.homeAddressZipCode || ''}, ${formDataContent.homeAddressCountry || ''}`,
        isMailingAddressSame: formDataContent.isMailingAddressSame === 'Y' ? '是' : '否',
        primaryPhone: formDataContent.primaryPhone || 'N/A',
        emailAddress: formDataContent.emailAddress || 'N/A',
        socialMediaPlatforms: formDataContent.socialMediaPlatform || []
      },
      usContact: formDataContent.usContact || {
        contactName: `${formDataContent.usPocSurname || ''} ${formDataContent.usPocGivenName || ''}`,
        organization: formDataContent.usPocOrganization || 'N/A',
        relationship: formDataContent.usPocRelationship === 'R' ? '亲属' : 
                      formDataContent.usPocRelationship === 'F' ? '朋友' : 
                      formDataContent.usPocRelationship === 'B' ? '商业伙伴' : 
                      formDataContent.usPocRelationship === 'E' ? '雇主' : 
                      formDataContent.usPocRelationship === 'S' ? '学校' : 
                      formDataContent.usPocRelationship === 'O' ? '其他' : 'N/A',
        address: `${formDataContent.usPocAddressLine1 || ''}, ${formDataContent.usPocCity || ''}, ${formDataContent.usPocState || ''}`,
        phone: formDataContent.usPocPhone || 'N/A',
        email: formDataContent.usPocEmail || 'N/A'
      },
      workEducation: formDataContent.workEducation || {
        presentOccupation: formDataContent.presentOccupation === 'EN' ? '工程师' : 
                          formDataContent.presentOccupation === 'ST' ? '学生' : 
                          formDataContent.presentOccupation === 'BM' ? '商人' : 
                          formDataContent.presentOccupation === 'TE' ? '教师' : 
                          formDataContent.presentOccupation === 'OT' ? '其他' : formDataContent.presentOccupation || 'N/A',
        employerSchoolName: formDataContent.employerSchoolName || 'N/A',
        employerAddress: `${formDataContent.employerAddressLine1 || ''}, ${formDataContent.employerCity || ''}, ${formDataContent.employerState || ''}, ${formDataContent.employerPostalCode || ''}, ${formDataContent.employerCountry || ''}`,
        employerPhone: formDataContent.employerPhone || 'N/A',
        employmentStartDate: formatDate(formDataContent.employerStartDay, formDataContent.employerStartMonth, formDataContent.employerStartYear),
        monthlySalary: formDataContent.monthlySalary || 'N/A'
      },
      workEducationPrevious: formDataContent.workEducationPrevious || {
        previouslyEmployed: formDataContent.previouslyEmployed === 'Y' ? '是' : '否',
        previousEmployments: formDataContent.previousEmployments || [],
        attendedEducation: formDataContent.attendedEducation === 'Y' ? '是' : '否',
        previousEducations: formDataContent.previousEducations || []
      },
      workEducationAdditional: formDataContent.workEducationAdditional || {
        languages: formDataContent.languages || [],
        hasSpecializedSkills: formDataContent.hasSpecializedSkills === 'Y' ? '是' : '否',
        belongsToOrganizations: formDataContent.belongsToOrganizations === 'Y' ? '是' : '否',
        hasMilitaryExperience: formDataContent.hasMilitaryExperience === 'Y' ? '是' : '否',
        hasArmedForcesMembership: formDataContent.hasArmedForcesMembership === 'Y' ? '是' : '否',
        hasRebelGroupMembership: formDataContent.hasRebelGroupMembership === 'Y' ? '是' : '否',
        hasWeaponsTraining: formDataContent.hasWeaponsTraining === 'Y' ? '是' : '否'
      },
      securityBackground: formDataContent.securityBackground || {
        hasDisease: formDataContent.hasDisease === 'Y' ? '是' : '否',
        hasDisorder: formDataContent.hasDisorder === 'Y' ? '是' : '否',
        isDrugUser: formDataContent.isDrugUser === 'Y' ? '是' : '否'
      },
      securityBackground2: formDataContent.securityBackground2 || {
        hasArrest: formDataContent.hasArrest === 'Y' ? '是' : '否',
        hasControlledSubstances: formDataContent.hasControlledSubstances === 'Y' ? '是' : '否',
        hasProstitution: formDataContent.hasProstitution === 'Y' ? '是' : '否',
        hasMoneyLaundering: formDataContent.hasMoneyLaundering === 'Y' ? '是' : '否',
        hasHumanTrafficking: formDataContent.hasHumanTrafficking === 'Y' ? '是' : '否',
        hasAssistedTrafficking: formDataContent.hasAssistedTrafficking === 'Y' ? '是' : '否',
        hasTraffickingRelated: formDataContent.hasTraffickingRelated === 'Y' ? '是' : '否'
      },
      securityBackground3: formDataContent.securityBackground3 || {
        hasIllegalActivity: formDataContent.hasIllegalActivity === 'Y' ? '是' : '否',
        hasTerroristActivity: formDataContent.hasTerroristActivity === 'Y' ? '是' : '否',
        hasTerroristSupport: formDataContent.hasTerroristSupport === 'Y' ? '是' : '否',
        hasTerroristOrg: formDataContent.hasTerroristOrg === 'Y' ? '是' : '否',
        hasTerroristRel: formDataContent.hasTerroristRel === 'Y' ? '是' : '否',
        hasGenocide: formDataContent.hasGenocide === 'Y' ? '是' : '否',
        hasTorture: formDataContent.hasTorture === 'Y' ? '是' : '否',
        hasExViolence: formDataContent.hasExViolence === 'Y' ? '是' : '否',
        hasChildSoldier: formDataContent.hasChildSoldier === 'Y' ? '是' : '否',
        hasReligiousFreedom: formDataContent.hasReligiousFreedom === 'Y' ? '是' : '否',
        hasPopulationControls: formDataContent.hasPopulationControls === 'Y' ? '是' : '否',
        hasTransplant: formDataContent.hasTransplant === 'Y' ? '是' : '否'
      },
      securityBackground4: formDataContent.securityBackground4 || {
        hasImmigrationFraud: formDataContent.hasImmigrationFraud === 'Y' ? '是' : '否',
        hasDeportation: formDataContent.hasDeportation === 'Y' ? '是' : '否'
      },
      securityBackground5: formDataContent.securityBackground5 || {
        hasChildCustody: formDataContent.hasChildCustody === 'Y' ? '是' : '否',
        hasVotingViolation: formDataContent.hasVotingViolation === 'Y' ? '是' : '否',
        hasRenounced: formDataContent.hasRenounced === 'Y' ? '是' : '否'
      }
    };
  };
  
  const renderSections = (data: any) => {
    const sectionDataMap = getSectionDataMap(data);
    
    return formSections.map((section) => {
      const sectionKey = section.key;
      const sectionTitle = section.title;
      
      if (sectionKey === 'review') return null;
      
      // Fix TypeScript error by using type assertion
      const sectionData = sectionDataMap[sectionKey as keyof typeof sectionDataMap] || {};
      
      return renderSection(sectionTitle, sectionData);
    }).filter(Boolean);
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!isLoading && isAuthenticated && id) {
      const fetchFormData = async () => {
        try {
          setLoading(true);
          const application_id = id;
          console.log('DS160View - Fetching form data for application ID:', application_id);
          
          const response = await ds160Service.getFormById(application_id);
          console.log('DS160View - Form data response:', response);
          
          setFormData(response);
          setFormStatus(response.status || 'draft');
          
          if (response.form_data) {
            console.log('DS160View - Form data:', response.form_data);
            
            const sectionKeys = Object.keys(response.form_data).filter(key => 
              typeof response.form_data[key] === 'object' && 
              response.form_data[key] !== null
            );
            console.log('DS160View - Detected section keys:', sectionKeys);
            
            const sectionIndices: Record<string, number> = {
              'personalInfo1': 0,
              'personalInfo2': 1,
              'travelInfo': 2,
              'travelCompanions': 3,
              'previousTravel': 4,
              'addressAndPhone': 5,
              'usContact': 6,
              'workEducation': 7,
              'workEducationPrevious': 8,
              'workEducationAdditional': 9,
              'securityBackground': 10,
              'securityBackground2': 11,
              'securityBackground3': 12,
              'securityBackground4': 13,
              'securityBackground5': 14,
              'review': 15
            };
            
            let lastSectionIndex = 0;
            sectionKeys.forEach(key => {
              if (sectionIndices[key] !== undefined && 
                  Object.keys(response.form_data[key]).length > 0) {
                console.log(`DS160View - Section ${key} has data`);
                lastSectionIndex = Math.max(lastSectionIndex, sectionIndices[key]);
              }
            });
            
            console.log('DS160View - Last section with data index:', lastSectionIndex);
            
            setLastEditedSection(lastSectionIndex);
            setDraftModalVisible(true);
          } else {
            console.log('DS160View - No form data found');
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching form data:', error);
          setLoading(false);
        }
      };

      fetchFormData();
    }
  }, [id, isAuthenticated, isLoading, navigate, location]);

  const handleResumeDraft = () => {
    setDraftModalVisible(false);
    console.log('DS160View - Resuming from section:', lastEditedSection);
    navigate(`/ds160/form/${id}?section=${lastEditedSection}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large">
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <p>加载中...</p>
          </div>
        </Spin>
      </div>
    );
  }

  if (!formData) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="错误"
          description="无法加载申请数据。请返回申请列表并重试。"
          type="error"
          showIcon
        />
        <Button style={{ marginTop: '16px' }} onClick={() => navigate('/ds160/history')}>
          返回申请列表
        </Button>
      </div>
    );
  }

  if (formStatus === 'draft') {
    return (
      <div style={{ padding: '24px' }}>
        <Card title={<Title level={2}>DS-160 非移民签证申请表 - 草稿</Title>}>
          {formData && <ApplicationIdDisplay application_id={formData.application_id || ''} />}
          
          <Alert
            message="草稿申请"
            description="此申请尚未提交，您可以继续编辑并完成申请。"
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Space size="large">
              <Button type="primary" onClick={handleResumeDraft}>
                继续编辑申请
              </Button>
              <Button onClick={() => navigate('/ds160/history')}>
                返回申请列表
              </Button>
            </Space>
          </div>
          
          <Modal
            title="继续编辑申请"
            open={draftModalVisible}
            onOk={handleResumeDraft}
            onCancel={() => setDraftModalVisible(false)}
            okText="从上次编辑处继续"
            cancelText="取消"
          >
            <p>您有一个未完成的申请。您想从上次编辑的部分继续吗？</p>
          </Modal>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<Title level={2}>DS-160 非移民签证申请表 - 已提交</Title>}>
        {formData && <ApplicationIdDisplay application_id={formData.application_id || ''} />}
        
        <Alert
          message="已提交申请"
          description={`此申请已于 ${formData.updated_at ? new Date(formData.updated_at).toLocaleString() : '未知时间'} 提交。`}
          type="success"
          showIcon
          style={{ marginBottom: '24px' }}
        />
        
        <Divider />
        
        <Row gutter={[16, 16]}>
          <Col span={24}>
            {renderSections(formData)}
          </Col>
        </Row>
        
        <Divider />
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <Button onClick={() => navigate('/ds160/history')}>
            返回申请列表
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DS160View;