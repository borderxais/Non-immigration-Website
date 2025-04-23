import React, { useState, useEffect, useCallback } from 'react';
import { Form, Steps, Button, Card, Typography, message, Spin } from 'antd';
import { FormInstance } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationIdDisplay from '../ApplicationIdDisplay';
import PersonalInfoI from './sections/PersonalInfoI';
// import PersonalInfoII from './sections/PersonalInfoII';
// import TravelInfo from './sections/TravelInfo';
// import PreviousTravel from './sections/PreviousTravel';
// import SecurityBackground from './sections/SecurityBackground';
// import TravelCompanions from './sections/TravelCompanions';
// import WorkHistory from './sections/WorkHistory';
import DS160ReviewPage from './sections/DS160ReviewPage';
import { generateApplicationId } from '../../utils/formUtils';
import ds160Service from '../../services/ds160Service';
import './ds160Form.css';

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
  //   key: 'workHistory',
  //   title: '工作经历',
  //   component: WorkHistory
  // },
  // {
  //   key: 'securityBackground',
  //   title: '安全背景',
  //   component: SecurityBackground
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
  const [applicationId, setApplicationId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [form] = Form.useForm();

  // Load form data from backend
  const loadFormData = useCallback(async (id: string) => {
    try {
      const response = await ds160Service.getFormById(id);
      if (response?.form_data) {
        form.setFieldsValue(response.form_data);
      }
    } catch (error: any) {
      console.error('Error loading form data:', error);
      message.error('加载表单数据时出错');
    }
  }, [form]);

  useEffect(() => {
    // Only check authentication after loading is complete
    if (!isLoading) {
      if (!isAuthenticated) {
        message.warning('请先登录以访问DS-160表格');
        navigate('/auth/login', { 
          state: { from: location.pathname + location.search } 
        });
      } else {
        // User is authenticated, show the form and generate application ID if needed
        setShowForm(true);
        const existingId = localStorage.getItem('currentApplicationId');
        if (existingId) {
          setApplicationId(existingId);
          loadFormData(existingId);
        } else {
          const newApplicationId = generateApplicationId();
          setApplicationId(newApplicationId);
          // Store in local storage for persistence
          localStorage.setItem('currentApplicationId', newApplicationId);
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate, location, applicationId, loadFormData]);

  // Handle section completion
  const handleSectionComplete = async (values: any) => {
    try {
      await saveFormData(values);
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error completing section:', error);
      message.error('保存表单时出错');
    }
  };

  // Handle final submission
  const handleSubmit = async (values: any) => {
    try {
      await saveFormData(values, 'submitted');
      message.success('表单提交成功！');
      navigate('/ds160-success', { state: { applicationId } });
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('提交表单时出错');
    }
  };

  // Handle edit request from review page
  const handleEdit = (sectionIndex: number) => {
    if (completedSteps.includes(sectionIndex)) {
      setCurrentStep(sectionIndex);
    } else {
      message.warning('请先完成之前的步骤');
    }
  };

  // Save form data
  const saveFormData = async (values: any, status: 'draft' | 'submitted' = 'draft') => {
    try {
      const formData = {
        form_data: values,
        status,
        application_id: applicationId
      };

      if (applicationId) {
        await ds160Service.updateForm(applicationId, formData);
        message.success('表单已保存');
      } else {
        const response = await ds160Service.createForm(formData);
        setApplicationId(response.application_id || '');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      message.error('保存表单时出错');
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

  const CurrentSection = formSections[currentStep].component;

  return (
    <div className="ds160-form-container">
      <Card>
        <Title level={2} className="form-title">DS-160 非移民签证申请表</Title>
        <p className="page-description">
          请填写以下表格以完成您的DS-160非移民签证申请。所有带星号(*)的字段为必填项。
          您可以随时保存草稿并稍后返回继续填写。
        </p>
        
        <ApplicationIdDisplay applicationId={applicationId} />
        
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Left sidebar with steps */}
          <div style={{ width: '25%', minWidth: '200px' }}>
            <Steps 
              current={currentStep} 
              direction="vertical"
              items={formSections.map((section, index) => ({
                title: section.title,
                disabled: !completedSteps.includes(index) && index !== currentStep,
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
              onFinish={currentStep === formSections.length - 1 ? handleSubmit : handleSectionComplete}
            >
              {currentStep === formSections.length - 1 ? (
                <DS160ReviewPage 
                  form={form}
                  onSubmit={() => {
                    const values = form.getFieldsValue();
                    handleSubmit(values);
                  }}
                  onEdit={handleEdit}
                />
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
                
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  {currentStep === formSections.length - 1 ? '提交' : '下一步'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DS160Form;