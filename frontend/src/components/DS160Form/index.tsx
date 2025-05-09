import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, Steps, Button, Card, Typography, message, Spin, Modal } from 'antd';
import { FormInstance } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationIdDisplay from '../ApplicationIdDisplay';

import PersonalInfoI from './sections/PersonalInfoI';
import PersonalInfoII from './sections/PersonalInfoII';
import TravelInfo from './sections/TravelInfo';
import TravelCompanions from './sections/TravelCompanions';
import PreviousTravel from './sections/PreviousTravel';
import AddressAndPhone from './sections/AddressAndPhone';
import Passport from './sections/Passport';
import USContact from './sections/USContact';
import FamilyRelatives from './sections/FamilyRelatives';
import FamilySpouse from './sections/FamilySpouse';
import WorkEducationPresent from './sections/WorkEducationPresent';
import SecurityBackgroundI from './sections/SecurityBackgroundI';
import SecurityBackgroundII from './sections/SecurityBackgroundII';
import SecurityBackgroundIII from './sections/SecurityBackgroundIII';
import SecurityBackgroundIV from './sections/SecurityBackgroundIV';
import SecurityBackgroundV from './sections/SecurityBackgroundV';

import DS160ReviewPage from './sections/DS160ReviewPage';

import ds160Service from '../../services/ds160Service';
import './ds160Form.css';

//  Application ID AA00EGS9G1, AA00EJ7QS1, AA00EMTFSH

const { Title } = Typography;

interface SectionProps {
  form: FormInstance;
  readOnly?: boolean;
}

interface FormSection {
  key: string;
  title: string;
  component: React.FC<SectionProps>;
}

// Define the form sections and their titles
const formSections: FormSection[] = [
  // {
  //   key: 'personalInfo1',
  //   title: '个人信息 I',
  //   component: PersonalInfoI
  // },
  // {
  //   key: 'personalInfo2',
  //   title: '个人信息 II',
  //   component: PersonalInfoII
  // },
  // {
  //   key: 'travelInfo',
  //   title: '旅行信息',
  //   component: TravelInfo
  // },
  // {
  //   key: 'travelCompanions',
  //   title: '同行人',
  //   component: TravelCompanions
  // },
  // {
  //   key: 'previousTravel',
  //   title: '以前的旅行',
  //   component: PreviousTravel
  // },
  // {
  //   key: 'addressAndPhone',
  //   title: '地址和电话',
  //   component: AddressAndPhone
  // },
  // {
  //   key: 'passport',
  //   title: '护照信息',
  //   component: Passport as unknown as React.FC<SectionProps>
  // },
  // {
  //   key: 'usContact',
  //   title: '美国联系人',
  //   component: USContact as unknown as React.FC<SectionProps>
  // },
  // {
  //   key: 'familyRelatives',
  //   title: '家庭信息：亲属',
  //   component: FamilyRelatives as unknown as React.FC<SectionProps>
  // },
  // {
  //   key: 'familySpouse',
  //   title: '家庭信息：配偶',
  //   component: FamilySpouse as unknown as React.FC<SectionProps>
  // },
  {
    key: 'workEducation',
    title: '工作和教育',
    component: WorkEducationPresent as unknown as React.FC<SectionProps>
  },
  // {
  //   key: 'securityBackground',
  //   title: '安全和背景: 第一部分',
  //   component: SecurityBackgroundI
  // },
  // {
  //   key: 'securityBackground2',
  //   title: '安全和背景: 第二部分',
  //   component: SecurityBackgroundII
  // },
  // {
  //   key: 'securityBackground3',
  //   title: '安全和背景: 第三部分',
  //   component: SecurityBackgroundIII
  // },
  // {
  //   key: 'securityBackground4',
  //   title: '安全和背景: 第四部分',
  //   component: SecurityBackgroundIV
  // },
  // {
  //   key: 'securityBackground5',
  //   title: '安全和背景: 第五部分',
  //   component: SecurityBackgroundV
  // },
  {
    key: 'review',
    title: '审核提交',
    component: DS160ReviewPage as unknown as React.FC<SectionProps>
  }
];

const DS160Form: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [application_id, setApplicationId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [form] = Form.useForm();
  const formSectionsRef = useRef(formSections);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formStatus, setFormStatus] = useState<'draft' | 'submitted' | 'approved' | 'rejected'>('draft');
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Extract application_id from URL
  const pathSegments = location.pathname.split('/');
  const urlApplicationId = pathSegments[pathSegments.length - 1];

  // Save form section data to database
  const saveSectionData = useCallback(async (sectionData: any) => {
    try {
      // Get the current form data
      const response = await ds160Service.getFormById(application_id);
      const existingData = response?.form_data || {};
      
      // Get current section key using the ref
      const currentSection = formSectionsRef.current[currentStep];
      
      // Create nested structure for current section
      const updatedData = {
        ...existingData,
        [currentSection.key]: {
          ...existingData[currentSection.key],
          ...sectionData
        }
      };
      
      // Save to database
      await ds160Service.updateForm(application_id, {
        form_data: updatedData,
        status: 'draft'
      });
      
      return true;
    } catch (error) {
      console.error('Error saving section data:', error);
      message.error('保存表单数据时出错');
      return false;
    }
  }, [application_id, currentStep]); // formSections removed from dependencies since we use ref

  // Handle save button click
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const saved = await saveSectionData(values);
      if (saved) {
        setIsModalVisible(true);
      }
    } catch (error: any) {
      // Check if it's a form validation error
      if (error?.errorFields?.length > 0) {
        message.error('请先填写必填项');
      } else {
        console.error('Error saving form data:', error);
        message.error('保存表单数据时出错');
      }
    }
  };

  const handleContinue = () => {
    setIsModalVisible(false);
    message.success('请继续填写表格');
  };

  const handleExit = () => {
    setIsModalVisible(false);
    message.success('已保存当前进度');
    navigate('/ds160'); 
  };

  // Handle section completion
  const handleSectionComplete = async (values: any) => {
    try {
      const saved = await saveSectionData(values);
      if (saved) {
        // Update completed steps
        const newCompletedSteps = [...completedSteps];
        if (!newCompletedSteps.includes(currentStep)) {
          newCompletedSteps.push(currentStep);
          setCompletedSteps(newCompletedSteps);
        }
        
        // Move to next section
        if (currentStep < formSectionsRef.current.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }
    } catch (error) {
      console.error('Error completing section:', error);
      message.error('完成部分时出错');
    }
  };

  // Handle final submission
  const handleSubmit = async (values: any) => {
    try {
      // Get current form data first
      const response = await ds160Service.getFormById(application_id);
      
      // Update form with current data and set status to submitted
      await ds160Service.updateForm(application_id, {
        form_data: response.form_data,
        status: 'submitted'
      });

      message.success('表单提交成功！');
      navigate('/ds160-success', { state: { application_id } });
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('提交表单时出错');
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        message.warning('请先登录以访问DS-160表格');
        navigate('/auth/login', { 
          state: { from: location.pathname + location.search } 
        });
      } else {
        setShowForm(true);
        
        const initializeForm = async () => {
          try {
            if (!urlApplicationId) {
              // Create a new form if no application ID is provided
              const newForm = await ds160Service.createForm({
                application_id: '', // Backend will generate this
                form_data: {},
                status: 'draft'
              });
              setApplicationId(newForm.application_id);
              setFormStatus('draft');
              setIsReadOnly(false);
              return;
            }

            setApplicationId(urlApplicationId);
            
            // Load existing form data
            const response = await ds160Service.getFormById(urlApplicationId);
            
            if (response) {
              // Set form status and read-only state based on the form's status
              setFormStatus(response.status);
              setIsReadOnly(response.status === 'submitted');
              
              // Process form data by section
              if (response.form_data) {
                // Flatten the nested form data for each section
                const formValues: any = {};
                
                // Process each section's data
                Object.keys(response.form_data).forEach(sectionKey => {
                  const sectionData = response.form_data[sectionKey];
                  if (sectionData && typeof sectionData === 'object') {
                    // Merge section data into the main form values
                    Object.assign(formValues, sectionData);
                  }
                });
                
                // Set form values
                form.setFieldsValue(formValues);
                
                // Determine completed steps from saved data
                const completedSections = formSectionsRef.current
                  .map((section, index) => ({
                    index,
                    hasData: response.form_data[section.key] && 
                            Object.keys(response.form_data[section.key]).length > 0
                  }))
                  .filter(section => section.hasData)
                  .map(section => section.index);
                  
                setCompletedSteps(completedSections);
                
                // If there are completed sections, set the current step to the first incomplete section
                // or the review page if all sections are complete
                if (completedSections.length > 0) {
                  // Find the first incomplete section
                  for (let i = 0; i < formSectionsRef.current.length; i++) {
                    if (!completedSections.includes(i)) {
                      setCurrentStep(i);
                      break;
                    }
                  }
                  
                  // If all sections are complete, go to the review page
                  if (completedSections.length === formSectionsRef.current.length - 1) {
                    setCurrentStep(formSectionsRef.current.length - 1);
                  }
                }
              }
            }
          } catch (error: any) {
            console.error('Error initializing form:', error);
            const errorMessage = error.response?.data?.error || '初始化表单时出错';
            message.error(errorMessage);
            navigate('/ds160');
          }
        };

        initializeForm();
      }
    }
  }, [isLoading, isAuthenticated, navigate, location.pathname, location.search, urlApplicationId, form]);

  // Handle edit request from review page
  const handleEdit = (sectionIndex: number) => {
    if (completedSteps.includes(sectionIndex)) {
      setCurrentStep(sectionIndex);
    } else {
      message.warning('请先完成之前的步骤');
    }
  };

  if (isLoading) {
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

  if (!showForm) {
    return null;
  }

  const renderFormSection = () => {
    const CurrentSection = formSectionsRef.current[currentStep].component;
    
    return (
      <div className="form-section-container">
        <CurrentSection 
          form={form} 
          readOnly={isReadOnly}
        />
        
        <div className="form-actions">
          {currentStep > 0 && (
            <Button 
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{ marginRight: '8px' }}
            >
              上一步
            </Button>
          )}
          
          {!isReadOnly && (
            <Button 
              type="primary" 
              onClick={handleSave}
              style={{ marginRight: '8px' }}
            >
              保存
            </Button>
          )}
          
          {currentStep < formSectionsRef.current.length - 1 ? (
            <Button 
              type="primary"
              onClick={() => form.validateFields().then(handleSectionComplete)}
              disabled={isReadOnly}
            >
              下一步
            </Button>
          ) : (
            <Button 
              type="primary" 
              onClick={() => form.validateFields().then(handleSubmit)}
              disabled={isReadOnly || formStatus === 'submitted'}
            >
              提交
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="ds160-form-container">
      <Card>
        <Title level={2} className="form-title">DS-160 非移民签证申请表</Title>
        <p className="page-description">
          请填写以下表格以完成您的DS-160非移民签证申请。所有带星号(*)的字段为必填项。
          您可以随时保存草稿并稍后返回继续填写。
        </p>
        
        <ApplicationIdDisplay application_id={application_id} />
        
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Left sidebar with steps */}
          <div style={{ width: '25%', minWidth: '200px' }}>
            <Steps 
              current={currentStep} 
              direction="vertical"
              className="ds160-steps"
              items={formSectionsRef.current.map((section, index) => ({
                title: section.title,
                status: completedSteps.includes(index) 
                  ? 'finish' 
                  : (index === currentStep ? 'process' : 'wait'),
                disabled: !completedSteps.includes(index) && index !== currentStep,
                className: index === currentStep ? 'current-step' : '',
              }))}
              onChange={(current) => {
                if (completedSteps.includes(current) || current === currentStep) {
                  setCurrentStep(current);
                } else {
                  message.warning('请先完成当前步骤');
                }
              }}
            />
          </div>

          {/* Right content area */}
          <div style={{ flex: 1 }}>
            <Form
              form={form}
              layout="vertical"
            >
              {currentStep === formSectionsRef.current.length - 1 ? (
                <DS160ReviewPage 
                  form={form}
                  onSubmit={handleSubmit}
                  onEdit={handleEdit}
                  readOnly={isReadOnly}
                />
              ) : (
                renderFormSection()
              )}
            </Form>
          </div>
        </div>
      </Card>
      <Modal
        title="保存成功"
        open={isModalVisible}
        onOk={handleContinue}
        onCancel={handleExit}
        okText="继续填写"
        cancelText="退出申请"
        maskClosable={false}
      >
        <p>请选择下一步操作：</p>
      </Modal>
    </div>
  );
};

export default DS160Form;