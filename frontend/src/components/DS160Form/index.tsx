import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import WorkEducationPrevious from './sections/WorkEducationPrevious';
import WorkEducationAdditional from './sections/WorkEducationAdditional';
import SecurityBackgroundI from './sections/SecurityBackgroundI';
import SecurityBackgroundII from './sections/SecurityBackgroundII';
import SecurityBackgroundIII from './sections/SecurityBackgroundIII';
import SecurityBackgroundIV from './sections/SecurityBackgroundIV';
import SecurityBackgroundV from './sections/SecurityBackgroundV';

import DS160ReviewPage from './sections/DS160ReviewPage';

import ds160Service from '../../services/ds160Service';
import './ds160Form.css';

//  Application ID AA00EJ7QS1, AA00EMTFSH, AAAAA, 1999
// Date cannot be earlier than 14 May 1915.

const { Title } = Typography;

interface SectionProps {
  form: FormInstance;
}

interface FormSection {
  key: string;
  title: string;
  component: React.FC<SectionProps>;
}

// Define the form sections and their titles
const formSections: FormSection[] = [
  {
    key: 'personalInfo1',
    title: '个人信息 I',
    component: PersonalInfoI
  },
  {
    key: 'personalInfo2',
    title: '个人信息 II',
    component: PersonalInfoII
  },
  {
    key: 'travelInfo',
    title: '旅行信息',
    component: TravelInfo
  },
  {
    key: 'travelCompanions',
    title: '同行人',
    component: TravelCompanions
  },
  {
    key: 'previousTravel',
    title: '以前的旅行',
    component: PreviousTravel
  },
  {
    key: 'addressAndPhone',
    title: '地址和电话',
    component: AddressAndPhone
  },
  {
    key: 'passport',
    title: '护照信息',
    component: Passport
  },
  {
    key: 'usContact',
    title: '美国联系人',
    component: USContact
  },
  {
    key: 'familyRelatives',
    title: '家庭信息：亲属',
    component: FamilyRelatives
  },
  {
    key: 'familySpouse',
    title: '家庭信息：配偶',
    component: FamilySpouse
  },
  {
    key: 'workEducation',
    title: '当前工作和教育',
    component: WorkEducationPresent
  },
  {
    key: 'workEducationPrevious',
    title: '以往工作和教育',
    component: WorkEducationPrevious
  },
  {
    key: 'workEducationAdditional',
    title: '额外工作和教育信息',
    component: WorkEducationAdditional
  },
  {
    key: 'securityBackground',
    title: '安全和背景: 第一部分',
    component: SecurityBackgroundI
  },
  {
    key: 'securityBackground2',
    title: '安全和背景: 第二部分',
    component: SecurityBackgroundII
  },
  {
    key: 'securityBackground3',
    title: '安全和背景: 第三部分',
    component: SecurityBackgroundIII
  },
  {
    key: 'securityBackground4',
    title: '安全和背景: 第四部分',
    component: SecurityBackgroundIV
  },
  {
    key: 'securityBackground5',
    title: '安全和背景: 第五部分',
    component: SecurityBackgroundV
  },
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
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Watch the marital status field to determine which spouse component to show
  const maritalStatus = Form.useWatch('maritalStatus', form);

  // Determine which spouse component to show based on marital status
  const getSpouseComponent = useCallback(() => {
    // If maritalStatus is 'W' (Widowed), show a different version (to be created)
    if (maritalStatus === 'W') {
      // For now, we'll use the regular FamilySpouse component
      // Later we can create a specific component for widowed applicants
      return FamilySpouse;
    }

    // If maritalStatus is 'P' (Domestic Partner), show a different version (to be created)
    if (maritalStatus === 'P') {
      // For now, we'll use the regular FamilySpouse component
      // Later we can create a specific component for domestic partners
      return FamilySpouse;
    }

    // For other values (like 'M' for Married, 'D' for Divorced, etc.), show the regular FamilySpouse
    return FamilySpouse;
  }, [maritalStatus]);

  // Get the dynamic sections based on form values
  const getDynamicFormSections = useCallback(() => {
    const dynamicSections = [...formSectionsRef.current];

    // Find the index of the FamilySpouse section
    const spouseIndex = dynamicSections.findIndex(section => section.key === 'familySpouse');

    // If maritalStatus is 'S' (Single) or 'O' (Other), remove the spouse section
    if ((maritalStatus === 'S' || maritalStatus === 'O') && spouseIndex !== -1) {
      dynamicSections.splice(spouseIndex, 1);
    } else if (spouseIndex !== -1) {
      // Otherwise, ensure the spouse component is set correctly
      dynamicSections[spouseIndex].component = getSpouseComponent();
    }

    return dynamicSections;
  }, [maritalStatus, getSpouseComponent]);

  // Store dynamic form sections in a ref to avoid unnecessary re-renders
  const dynamicFormSectionsRef = useRef(getDynamicFormSections());

  // Update dynamic sections when maritalStatus changes
  useEffect(() => {
    dynamicFormSectionsRef.current = getDynamicFormSections();
  }, [getDynamicFormSections]);

  // Store formSections in a ref since it's static and doesn't need to trigger re-renders
  // const formSectionsRef = useRef(formSections);

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
      const currentSection = dynamicFormSectionsRef.current[currentStep];

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
        if (currentStep < dynamicFormSectionsRef.current.length - 1) {
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
      setSubmitting(true);
      message.loading('正在提交表单，请稍候...', 0);

      // Get current form data first
      const response = await ds160Service.getFormById(application_id);

      // Update form with current data and set status to submitted
      await ds160Service.updateForm(application_id, {
        form_data: response.form_data,
        status: 'submitted'
      });

      message.destroy(); // Clear the loading message
      message.success('表单提交成功！');
      navigate('/ds160/history', { state: { submissionSuccess: true, application_id } });
    } catch (error) {
      console.error('Error submitting form:', error);
      message.destroy(); // Clear the loading message
      message.error('提交表单时出错');
    } finally {
      setSubmitting(false);
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
              return;
            }

            setApplicationId(urlApplicationId);

            // Check for query parameters
            const queryParams = new URLSearchParams(location.search);
            const sectionParam = queryParams.get('section');
            const resetParam = queryParams.get('reset');

            console.log('DS160Form - Query parameters:', { 
              section: sectionParam, 
              reset: resetParam,
              fullSearch: location.search
            });

            // Load existing form data
            const response = await ds160Service.getFormById(urlApplicationId);
            console.log('DS160Form - Loaded form data:', response);

            if (response?.form_data) {
              // If reset=true, don't set form fields but keep the application_id
              if (resetParam !== 'true') {
                console.log('DS160Form - Setting form fields with saved data');

                // Log the structure of the form data to understand it better
                console.log('DS160Form - Form data structure:', JSON.stringify(response.form_data, null, 2));

                // Check if form_data is nested by section or flat
                const isNestedBySection = response.form_data.personalInfo1 || 
                                         response.form_data.personalInfo2 || 
                                         response.form_data.workEducation || 
                                         response.form_data.review;

                if (isNestedBySection) {
                  console.log('DS160Form - Form data is nested by section, flattening...');

                  // Flatten the nested form data
                  const flattenedData = {};
                  Object.keys(response.form_data).forEach(sectionKey => {
                    if (typeof response.form_data[sectionKey] === 'object' && response.form_data[sectionKey] !== null) {
                      Object.assign(flattenedData, response.form_data[sectionKey]);
                    }
                  });

                  console.log('DS160Form - Flattened data:', flattenedData);
                  form.setFieldsValue(flattenedData);
                } else {
                  // Form data is already flat
                  form.setFieldsValue(response.form_data);
                }
              } else {
                console.log('DS160Form - Reset parameter is true, not setting form fields');
              }

              // Determine completed steps from saved data
              const completedSections = dynamicFormSectionsRef.current
                .map((section, index) => ({
                  index,
                  hasData: response.form_data[section.key] && 
                          Object.keys(response.form_data[section.key]).length > 0
                }))
                .filter(section => section.hasData)
                .map(section => section.index);

              console.log('DS160Form - Completed sections:', completedSections);  
              setCompletedSteps(completedSections);

              // Set current step based on section parameter if provided
              if (sectionParam && !isNaN(Number(sectionParam))) {
                const sectionIndex = Number(sectionParam);
                // Make sure the section index is valid
                if (sectionIndex >= 0 && sectionIndex < dynamicFormSectionsRef.current.length) {
                  console.log('DS160Form - Setting current step to:', sectionIndex);
                  setCurrentStep(sectionIndex);
                  message.info(`正在从第 ${sectionIndex + 1} 步继续编辑`);
                } else {
                  console.log('DS160Form - Invalid section index:', sectionIndex, 'defaulting to first section');
                  // If the section index is invalid, default to the first section
                  setCurrentStep(0);
                  message.info('正在从第一步继续编辑');
                }
              } else {
                console.log('DS160Form - No valid section parameter, using default step');
                // If there's no section parameter but we have completed sections, go to the first incomplete section
                if (completedSections.length > 0 && completedSections.length < dynamicFormSectionsRef.current.length) {
                  // Find the first section that's not completed
                  for (let i = 0; i < dynamicFormSectionsRef.current.length; i++) {
                    if (!completedSections.includes(i)) {
                      console.log('DS160Form - Going to first incomplete section:', i);
                      setCurrentStep(i);
                      break;
                    }
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

  const CurrentSection = dynamicFormSectionsRef.current[currentStep].component;

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
              items={dynamicFormSectionsRef.current.map((section, index) => ({
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
              onFinish={currentStep === dynamicFormSectionsRef.current.length - 1 ? handleSubmit : handleSectionComplete}
            >
              {currentStep === dynamicFormSectionsRef.current.length - 1 ? (
                <>
                  {submitting && (
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      background: 'rgba(255, 255, 255, 0.7)', 
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '20px'
                    }}>
                      <Spin size="large" />
                      <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>正在提交表单，请稍候...</p>
                        <p>我们正在处理您的申请并翻译相关内容，这可能需要一些时间。</p>
                      </div>
                    </div>
                  )}
                  <DS160ReviewPage 
                    form={form}
                    onSubmit={() => {
                      const values = form.getFieldsValue();
                      handleSubmit(values);
                    }}
                    onEdit={handleEdit}
                    formSections={dynamicFormSectionsRef.current}
                    readOnly={submitting}
                  />
                </>
              ) : (
                <CurrentSection form={form} />
              )}
              <div className="form-buttons">
                {currentStep > 0 && (
                  <Button 
                    onClick={() => setCurrentStep(currentStep - 1)}
                    style={{ marginRight: 8 }}
                  >
                    上一步
                  </Button>
                )}

                {currentStep !== dynamicFormSectionsRef.current.length - 1 && (
                  <>
                    <Button
                      onClick={handleSave}
                      style={{ marginRight: '8px' }}
                    >
                      保存
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      loading={submitting}
                    >
                      下一步
                    </Button>
                  </>
                )}
              </div>
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