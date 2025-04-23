import React, { useState, useEffect, useCallback } from 'react';
import { Form, Steps, Button, Card, Typography, message, Spin, Input, Space, Row, Col } from 'antd';
import { FormInstance } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationIdDisplay from '../ApplicationIdDisplay';
import PersonalInfoI from './sections/PersonalInfoI';
import PersonalInfoII from './sections/PersonalInfoII';
import TravelInfo from './sections/TravelInfo';
import PreviousTravel from './sections/PreviousTravel';
import SecurityBackground from './sections/SecurityBackground';
import TravelCompanions from './sections/TravelCompanions';
import WorkHistory from './sections/WorkHistory';
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
    key: 'workHistory',
    title: '工作经历',
    component: WorkHistory
  },
  {
    key: 'securityBackground',
    title: '安全背景',
    component: SecurityBackground
  },
  {
    key: 'review',
    title: '审核提交',
    component: DS160ReviewPage as unknown as React.FC<SectionProps>
  }
];

const DS160Form: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [applicationId, setApplicationId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Load existing application data
  const loadExistingApplication = useCallback(async (id: string) => {
    setIsFormLoading(true);
    try {
      const response = await ds160Service.getFormById(id);
      if (response?.form_data) {
        setApplicationId(id);
        form.setFieldsValue(response.form_data);
        setShowLandingPage(false);
        message.success('已加载申请表');
      }
    } catch (error) {
      message.error('无法找到该申请表，请检查申请号是否正确');
    } finally {
      setIsFormLoading(false);
    }
  }, [form, setApplicationId, setIsFormLoading, setShowLandingPage]);

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

  // Check authentication and load form data
  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('请先登录以访问DS-160表格');
      navigate('/auth/login', { 
        state: { from: location.pathname + location.search } 
      });
      return;
    }

    // Only proceed if we're not loading and have an application ID
    if (!isFormLoading && applicationId) {
      loadFormData(applicationId);
    }
  }, [isAuthenticated, isFormLoading, navigate, location, applicationId, loadFormData]);

  // Load existing application if ID is provided in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      loadExistingApplication(id);
    }
  }, [location, loadExistingApplication]);

  // Start a new application
  const startNewApplication = () => {
    const newId = generateApplicationId();
    setApplicationId(newId);
    setShowLandingPage(false);
    navigate(`/ds160/fill?id=${newId}`, { replace: true });
  };

  // Handle existing application retrieval
  const retrieveApplication = async (values: { applicationId: string }) => {
    await loadExistingApplication(values.applicationId);
  };

  if (isFormLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>加载中...</p>
      </div>
    );
  }

  if (showLandingPage) {
    return (
      <Card>
        <Title level={2}>DS-160 非移民签证申请表</Title>
        <Row gutter={[16, 16]} justify="center">
          <Col span={24} md={12}>
            <Card title="开始新的申请" style={{ textAlign: 'center' }}>
              <p>点击下方按钮开始填写新的DS-160申请表</p>
              <Button type="primary" size="large" onClick={startNewApplication}>
                开始新申请
              </Button>
            </Card>
          </Col>
          <Col span={24} md={12}>
            <Card title="继续已有申请" style={{ textAlign: 'center' }}>
              <p>输入申请号继续填写已保存的申请表</p>
              <Form onFinish={retrieveApplication}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    name="applicationId"
                    rules={[{ required: true, message: '请输入申请号' }]}
                  >
                    <Input placeholder="请输入申请号" style={{ width: '100%' }} />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    继续填写
                  </Button>
                </Space>
              </Form>
            </Card>
          </Col>
        </Row>
      </Card>
    );
  }

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
                
                {currentStep !== formSections.length - 1 && (
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
                    下一步
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DS160Form;