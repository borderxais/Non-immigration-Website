import React, { useState, useEffect, useCallback } from 'react';
import { Form, Steps, Button, Card, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ApplicationIdDisplay from '../ApplicationIdDisplay';
import PersonalInfo from './sections/PersonalInfo';
import TravelInfo from './sections/TravelInfo';
import AddressHistory from './sections/AddressHistory';
import EducationHistory from './sections/EducationHistory';
import WorkHistory from './sections/WorkHistory';
import FamilyInformation from './sections/FamilyInformation';
import SecurityBackground from './sections/SecurityBackground';
import PassportInformation from './sections/PassportInformation';
import DS160ReviewPage from './sections/DS160ReviewPage';
import { generateApplicationId } from '../../utils/formUtils';
import ds160Service from '../../services/ds160Service';

const DS160Form: React.FC = () => {
  // Generate a unique ID for this form session if not already set
  const [formId, setFormId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Function to load form data from backend
  const loadFormData = useCallback(async (id: string) => {
    try {
      // Call your API to get form data
      const response = await ds160Service.getFormById(id);
      if (response) {
        // Set form data
        // Removed unused formData state
        // Set form values
        form.setFieldsValue(response);
      }
    } catch (error: any) {
      console.error('Error loading form data:', error);
      // Show more detailed error message
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        message.error(`加载表单数据时出错: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request made but no response received:', error.request);
        message.error('服务器未响应请求');
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
        message.error(`请求错误: ${error.message}`);
      }
    }
  }, [form]);

  // Initialize form ID and check URL parameters
  useEffect(() => {
    // Check if there's a form ID in the URL (for resuming a draft)
    const params = new URLSearchParams(window.location.search);
    const draftId = params.get('id');
    
    if (draftId) {
      // If we have an ID in the URL, use that instead of generating a new one
      setFormId(draftId);
      // Load the form data from backend
      loadFormData(draftId);
    } else {
      // Generate a new application ID if none exists
      const newFormId = generateApplicationId();
      setFormId(newFormId);
      
      // Create a new form with the generated ID
      const initialForm = {
        id: newFormId,
        form_data: {},
        status: 'draft',
        application_id: newFormId // Use the same ID as application_id
      };
      
      // Save the initial form to the database
      ds160Service.saveFormDraft(initialForm)
        .then(() => {
          console.log('Initial form created with ID:', newFormId);
        })
        .catch(error => {
          console.error('Error creating initial form:', error);
        });
      
      // Save to localStorage for persistence
      localStorage.setItem('currentFormId', newFormId);
    }
  }, [loadFormData]);

  // Save form ID to localStorage when it changes
  useEffect(() => {
    if (formId) {
      localStorage.setItem('currentFormId', formId);
    }
  }, [formId]);

  // Function to save form data
  const saveFormData = async () => {
    try {
      const values = await form.validateFields();
      const dataToSave = {
        id: formId,
        form_data: values,
        status: 'draft'
      };
      
      // Call your API to save form data
      await ds160Service.saveFormDraft(dataToSave);
      message.success('表单数据已保存');
    } catch (error: any) {
      console.error('Error saving form data:', error);
      message.error('保存表单数据时出错');
    }
  };

  // Function to handle next step
  const handleNext = async () => {
    try {
      // Validate fields in current step
      await form.validateFields();
      
      // Save form data
      await saveFormData();
      
      // Update completed steps
      if (!completedSteps.includes(currentStep + 1)) {
        setCompletedSteps([...completedSteps, currentStep + 1]);
      }
      
      // Go to next step
      setCurrentStep(currentStep + 1);
    } catch (error: any) {
      console.error('Form validation failed:', error);
    }
  };

  // Function to handle previous step
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Validate all fields
      const formValues = await form.validateFields();
      
      // Prepare data for submission
      const dataToSubmit = {
        id: formId,
        form_data: formValues,
        status: 'submitted',
        application_id: formId // Use the same ID as application_id
      };
      
      // Call your API to submit form
      const response = await ds160Service.saveFormDraft(dataToSubmit);
      
      // Show success message
      message.success('表格提交成功！');
      // Redirect to a success page with form ID and application ID
      navigate('/ds160-success', { 
        state: { 
          formId: response.id,
          applicationId: formId // Use the same ID as application_id
        } 
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      message.error('提交表格时出错，请稍后再试。');
    }
  };

  // Define steps for the form
  const steps = [
    {
      title: '个人信息',
      content: <PersonalInfo form={form} />
    },
    {
      title: '旅行信息',
      content: <TravelInfo form={form} />
    },
    {
      title: '地址历史',
      content: <AddressHistory form={form} />
    },
    {
      title: '教育历史',
      content: <EducationHistory form={form} />
    },
    {
      title: '工作历史',
      content: <WorkHistory form={form} />
    },
    {
      title: '家庭信息',
      content: <FamilyInformation form={form} />
    },
    {
      title: '安全背景',
      content: <SecurityBackground form={form} />
    },
    {
      title: '护照信息',
      content: <PassportInformation form={form} />
    },
    {
      title: '审核提交',
      content: <DS160ReviewPage 
        form={form} 
        onSubmit={handleSubmit} 
        onEdit={setCurrentStep} 
      />
    }
  ];

  return (
    <div className="ds160-form-container">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <ApplicationIdDisplay formId={formId} />
            <Steps current={currentStep}>
              {steps.map((step, index) => (
                <Steps.Step key={index} title={step.title} />
              ))}
            </Steps>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Form form={form} layout="vertical" name="ds160Form">
              <div className="steps-content">{steps[currentStep].content}</div>
              <div className="steps-action" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                {currentStep > 0 && (
                  <Button onClick={handlePrev}>
                    上一步
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button type="primary" onClick={handleNext}>
                    下一步
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button type="primary" onClick={handleSubmit}>
                    提交
                  </Button>
                )}
                <Button onClick={saveFormData}>
                  保存草稿
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DS160Form;