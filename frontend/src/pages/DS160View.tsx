import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Typography, Alert, Spin, Descriptions, message, Row, Col, Divider, Space, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import ds160Service from '../services/ds160Service';
import ApplicationIdDisplay from '../components/ApplicationIdDisplay';
import { useAuth } from '../contexts/AuthContext';
import { getSections } from '../utils/ds160Sections';
// import { getSections, formatDate } from '../utils/ds160Sections';

const { Title, Paragraph } = Typography;

const DS160View: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<any>(null);
  const [formStatus, setFormStatus] = useState<'submitted' | 'approved' | 'rejected' | 'draft'>('submitted');
  const { isAuthenticated, isLoading } = useAuth();
  const [draftModalVisible, setDraftModalVisible] = useState<boolean>(false);
  const [lastEditedSection, setLastEditedSection] = useState<number>(0);

  useEffect(() => {
    const loadFormData = async () => {
      if (!id) {
        message.error('未提供申请ID');
        navigate('/ds160/history');
        return;
      }
      try {
        setLoading(true);
        const response = await ds160Service.getFormById(id);
        console.log('DS160View - Loaded form data:', response);

        if (response.status === 'draft') {
          setFormData(response);
          setFormStatus('draft');
          
          // Determine the last edited section
          if (response.form_data) {
            // Get the sections from the form data
            const sections = getSections(response.form_data);
            console.log('DS160View - Form sections:', sections);
            
            // Find the last section that has data
            let lastSectionIndex = 0;
            
            // Check if the workEducation section has data
            if (response.form_data.workEducation && 
                Object.keys(response.form_data.workEducation).some(key => {
                  const value = response.form_data.workEducation[key as keyof typeof response.form_data.workEducation];
                  return value && value !== 'N/A';
                })) {
              console.log('DS160View - Work Education section has data');
              lastSectionIndex = 0; // This is the first active section in our current setup
            }
            
            // Check if we've reached the review section
            if (response.form_data.review && 
                Object.keys(response.form_data.review).some(key => {
                  const value = response.form_data.review[key as keyof typeof response.form_data.review];
                  return value && value !== 'N/A';
                })) {
              console.log('DS160View - Review section has data');
              lastSectionIndex = 1; // This is the second active section in our current setup
            }
            
            console.log('DS160View - Last edited section index:', lastSectionIndex);
            setLastEditedSection(lastSectionIndex);
            setDraftModalVisible(true);
          } else {
            // If no form data, just redirect to the form
            console.log('DS160View - No form data, redirecting to form');
            navigate(`/ds160/form/${id}`);
          }
          return;
        }

        if (!['submitted', 'approved', 'rejected'].includes(response.status)) {
          message.error('此申请不是有效的查看状态');
          navigate('/ds160/history');
          return;
        }

        setFormData(response);
        setFormStatus(response.status as 'submitted' | 'approved' | 'rejected');

        if (response.form_data) {
          form.setFieldsValue(response.form_data);
        }
      } catch (error) {
        message.error('加载表单数据时出错');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && isAuthenticated) {
      loadFormData();
    } else if (!isLoading && !isAuthenticated) {
      message.warning('请先登录以查看您的申请');
      navigate('/auth/login');
    }
  }, [id, form, navigate, isAuthenticated, isLoading]);

  // Helper function to render a section with proper handling of missing fields
  const renderSection = (title: string, sectionData: any) => {
    if (!sectionData) return null;
    
    // Filter out entries that should be hidden or are empty
    const filteredEntries = Object.entries(sectionData).filter(([key, value]: [string, any]) => {
      // Skip internal fields or empty values
      if (key.startsWith('_') || value === undefined || value === null || value === '') {
        return false;
      }
      
      // Skip "N/A" values for conditional fields
      if (value === 'N/A') {
        // Handle conditional fields based on parent conditions
        
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
      <Card title={title} style={{ marginBottom: '16px' }} key={title}>
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
            } else if (typeof value === 'object' && value !== null) {
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

  // Handle resuming from draft
  const handleResumeDraft = () => {
    setDraftModalVisible(false);
    navigate(`/ds160/form/${id}`);
  };

  // Handle resuming from specific section
  const handleResumeFromSection = () => {
    setDraftModalVisible(false);
    // Navigate to form with section query parameter
    console.log('DS160View - Resuming from section:', lastEditedSection);
    navigate(`/ds160/form/${id}?section=${lastEditedSection}`);
  };

  // Handle starting over
//   const handleStartOver = () => {
//     setDraftModalVisible(false);
//     console.log('DS160View - Starting over with reset=true');
//     navigate(`/ds160/form/${id}?reset=true`);
//   };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <p>正在加载申请数据...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Alert
          message="加载失败"
          description="无法加载申请数据，请返回申请列表重试。"
          type="error"
          showIcon
        />
        <Button style={{ marginTop: '16px' }} onClick={() => navigate('/ds160/history')}>
          返回申请列表
        </Button>
      </div>
    );
  }

  // Get the form data from the response
  // const formDataContent = formData.form_data || {};

  // If it's a draft, show the draft modal
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
            title="继续填写申请"
            open={draftModalVisible}
            footer={null}
            closable={false}
            maskClosable={false}
          >
            <p>您有一份未完成的DS-160申请表，请选择如何继续：</p>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
              <Space>
                <Button type="primary" onClick={handleResumeFromSection}>
                  从上次编辑处继续
                </Button>
                <Button onClick={handleResumeDraft}>
                  从头开始检查
                </Button>
                <Button onClick={() => navigate('/ds160/history')}>
                  返回申请列表
                </Button>
              </Space>
            </div>
          </Modal>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Alert
        message={`申请状态: ${formStatus === 'submitted' ? '已提交' : formStatus === 'approved' ? '已批准' : '已拒绝'}`}
        description={
          formStatus === 'submitted'
            ? '您的申请已提交，正在等待审核。'
            : formStatus === 'approved'
            ? '恭喜！您的申请已获批准。'
            : '很遗憾，您的申请被拒绝。'
        }
        type={
          formStatus === 'submitted' ? 'info' : formStatus === 'approved' ? 'success' : 'error'
        }
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card title={<Title level={2}>DS-160 非移民签证申请表</Title>}>
        {formData && <ApplicationIdDisplay application_id={formData.application_id || ''} />}

        <Divider />
        
        <Paragraph>
          以下是您提交的DS-160申请表信息。如有任何问题，请联系我们的客服。
        </Paragraph>
        
        <Row gutter={[16, 16]}>
          {formData?.form_data && getSections(formData.form_data).map(({ title, data }) => (
            <Col span={24} key={title}>
              {renderSection(title, data)}
            </Col>
          ))}
        </Row>

        <Divider />
        
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
          <Space size="large">
            <Button type="primary" onClick={() => navigate('/ds160/history')}>返回申请列表</Button>
            <Button onClick={() => window.print()}>打印申请表</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default DS160View;