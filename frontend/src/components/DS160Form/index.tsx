import React, { useState, useEffect, useCallback } from 'react';
import { Form, Steps, Button, Card, Typography, message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationIdDisplay from '../ApplicationIdDisplay';
import PersonalInfoI from './sections/PersonalInfoI';
import PersonalInfoII from './sections/PersonalInfoII';
import TravelInfo from './sections/TravelInfo';
import PreviousTravel from './sections/PreviousTravel';
import { generateApplicationId } from '../../utils/formUtils';
import ds160Service from '../../services/ds160Service';
import './ds160Form.css';

const { Title } = Typography;
const { Step } = Steps;

// Define the form sections and their titles
const formSections = [
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
    key: 'previousTravel',
    title: '以前的旅行',
    component: PreviousTravel
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

  useEffect(() => {
    // Only check authentication after loading is complete
    if (!isLoading) {
      if (!isAuthenticated) {
        message.warning('请先登录以访问DS-160表格');
        navigate('/auth/login', { 
          state: { from: location.pathname + location.search } 
        });
      } else {
        // User is authenticated, show the form
        setShowForm(true);
      }
    }
  }, [isAuthenticated, isLoading, navigate, location]);

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

  // Initialize form ID and load data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const draftId = params.get('id');
    
    if (draftId) {
      setApplicationId(draftId);
      loadFormData(draftId);
    } else {
      const newApplicationId = generateApplicationId();
      setApplicationId(newApplicationId);
      
      const initialForm = {
        form_data: {},
        status: 'draft',
        application_id: newApplicationId
      };
      
      ds160Service.saveFormDraft(initialForm)
        .then(() => console.log('Initial form created:', newApplicationId))
        .catch(error => console.error('Error creating form:', error));
      
      localStorage.setItem('currentApplicationId', newApplicationId);
    }
  }, [loadFormData]);

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

  // Handle section completion
  const handleSectionComplete = async (values: any) => {
    await saveFormData(values);
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < formSections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      await saveFormData(values, 'submitted');
      navigate('/ds160-success', { state: { applicationId } });
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('提交表单时出错');
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
        
        <Steps current={currentStep} className="form-steps">
          {formSections.map(section => (
            <Step key={section.key} title={section.title} />
          ))}
        </Steps>

        <div className="form-section">
          <Form
            form={form}
            layout="vertical"
            onFinish={currentStep === formSections.length - 1 ? handleSubmit : handleSectionComplete}
          >
            <CurrentSection form={form} />

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
      </Card>
    </div>
  );
};

export default DS160Form;