import React, { useState, useEffect } from 'react';
import { Form, Steps, Button, Card, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ApplicationIdDisplay from '../ApplicationIdDisplay';
import PersonalInfo from './sections/PersonalInfo';
import TravelInfo from './sections/TravelInfo';
import DS160ReviewPage from './sections/DS160ReviewPage';
import { generateApplicationId } from '../../utils/formUtils';
import ds160Service from '../../services/ds160Service';

const DS160Form: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]);
  const [formId, setFormId] = useState<string | null>(generateApplicationId());
  const [formData, setFormData] = useState<any>({});
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a form ID in the URL (for resuming a draft)
    const params = new URLSearchParams(window.location.search);
    const draftId = params.get('id');
    
    if (draftId) {
      // If we have an ID in the URL, use that instead of the generated one
      setFormId(draftId);
      // Load the form data from backend
      loadFormData(draftId);
    }
    
    // Save the form ID to localStorage for persistence
    const savedFormId = localStorage.getItem('currentFormId');
    if (!draftId && savedFormId) {
      setFormId(savedFormId);
      // Load saved form data if available
      loadFormData(savedFormId);
    } else {
      // Save the current form ID (either from URL or randomly generated)
      localStorage.setItem('currentFormId', formId || '');
    }
  }, []); // Empty dependency array to run only once

  // Function to load form data from backend
  const loadFormData = async (id: string) => {
    try {
      // Call your API to get form data
      const response = await ds160Service.getFormById(id);
      if (response) {
        // Set form data
        setFormData(response);
        // Set form values
        form.setFieldsValue(response);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
      message.error('加载表单数据时出错');
    }
  };

  // Function to save form data
  const saveFormData = async () => {
    try {
      const values = await form.validateFields();
      const dataToSave = {
        ...formData,
        ...values,
        formId
      };
      
      setFormData(dataToSave);
      
      // Save to backend
      const response = await ds160Service.saveFormDraft(dataToSave);
      if (response) {
        message.success('表单数据已保存');
      }
    } catch (error) {
      console.error('Error saving form data:', error);
      message.error('保存表单数据时出错');
    }
  };

  // Handle next step
  const handleNext = async () => {
    try {
      // Validate current form fields
      await form.validateFields();
      
      // Save form data
      await saveFormData();
      
      // Update completed steps
      if (!completedSteps.includes(currentStep + 1)) {
        setCompletedSteps([...completedSteps, currentStep + 1]);
      }
      
      // Go to next step
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Handle previous step
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle step change (for navigation)
  const handleStepChange = (step: number) => {
    // Only allow navigation to completed steps
    if (completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  // Handle final submission
  const handleSubmit = async () => {
    try {
      console.log('Submitting form:', formData);
      const response = await ds160Service.createForm(formData);
      console.log('Form submitted successfully:', response);
      message.success('表格提交成功！');
      // Redirect to a success page
      navigate('/ds160-success');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('提交表格时出错，请稍后再试。');
    }
  };

  // Define steps
  const steps = [
    {
      title: '个人信息',
      content: <PersonalInfo form={form} />,
    },
    {
      title: '旅行信息',
      content: <TravelInfo form={form} />,
    },
    {
      title: '联系信息',
      content: <div>联系信息表单（待实现）</div>,
    },
    {
      title: '安全问题',
      content: <div>安全问题表单（待实现）</div>,
    },
    {
      title: '审核',
      content: (
        <DS160ReviewPage 
          formData={formData} 
          onSubmit={handleSubmit} 
          onEdit={handleStepChange}
        />
      ),
    }
  ];

  return (
    <Card className="ds160-form-container">
      {formId && <ApplicationIdDisplay formId={formId} />}
      
      <Form form={form} layout="vertical" initialValues={formData}>
        <Row gutter={24}>
          <Col span={6}>
            <Steps
              current={currentStep}
              direction="vertical"
              onChange={handleStepChange}
              items={steps.map((item, index) => ({
                title: item.title,
                disabled: !completedSteps.includes(index),
              }))}
            />
          </Col>
          <Col span={18}>
            <div className="steps-content">
              {steps[currentStep].content}
            </div>
            
            {currentStep < steps.length - 1 && (
              <div className="steps-action" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                {currentStep > 0 && (
                  <Button onClick={handlePrev}>
                    上一步
                  </Button>
                )}
                <Button type="primary" onClick={handleNext}>
                  {currentStep === steps.length - 2 ? '预览' : '下一步'}
                </Button>
                <Button onClick={saveFormData}>
                  保存
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default DS160Form;