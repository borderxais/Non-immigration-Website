import React from 'react';
import { Form, Input, Select, DatePicker, Radio, Space, Checkbox, Row, Col, Typography } from 'antd';

const { Text, Paragraph } = Typography;

interface QuestionItemProps {
  number?: string;
  question: string;
  name?: string;
  required?: boolean;
  children: React.ReactNode;
  explanation?: string;
  hasNaCheckbox?: boolean;
  naCheckboxName?: string;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ 
  number, 
  question, 
  name, 
  required = true, 
  children, 
  explanation, 
  hasNaCheckbox = false, 
  naCheckboxName 
}) => {
  // Use the form instance from the parent component
  const form = Form.useFormInstance();
  
  // Use the form instance to get the current value of the NA checkbox
  const naCheckboxFieldName = naCheckboxName || (name ? `${name}_na` : undefined);
  // Always call Form.useWatch unconditionally, but with a fallback value if the field name is undefined
  const naCheckboxValue = Form.useWatch(naCheckboxFieldName || 'non_existent_field', form);
  const isNaChecked = naCheckboxFieldName ? naCheckboxValue : false;
  // Handle NA checkbox change
  const handleNaCheckboxChange = (e: any) => {
    const checked = e.target.checked;
    
    // If the checkbox is checked, clear the related field value
    if (checked && name) {
      // Determine the field name to clear based on the component structure
      const fieldToClear: { [key: string]: undefined } = {};
      
      // If it's a simple field, just clear that field
      fieldToClear[name] = undefined;
      
      // Special handling for complex fields like date fields that might have day/month/year components
      if (name.includes('.')) {
        const baseName = name.split('.')[0];
        
        // Look for possible date components (common patterns in your form)
        if (name.endsWith('Date')) {
          fieldToClear[`${baseName}.expirationDay`] = undefined;
          fieldToClear[`${baseName}.expirationMonth`] = undefined;
          fieldToClear[`${baseName}.expirationYear`] = undefined;
        }
      }
      
      // Set the field values to undefined
      form.setFieldsValue(fieldToClear);
    }
  };
  
  // Modify the rules to respect the NA checkbox state
  const fieldRules = required ? [{ 
    required: !isNaChecked, 
    message: '此字段为必填项' 
  }] : [];
  
  // Create a custom input with disabled state based on NA checkbox
  const renderDisableableInput = () => {
    // Rather than trying to clone the element, we'll wrap it with our own logic
    if (!React.isValidElement(children)) {
      return children;
    }
    
    // For Input components
    if (children.type === Input || children.type === Input.TextArea) {
      return (
        <Input
          {...(children.props as any)}
          disabled={isNaChecked}
          style={{ 
            ...((children.props as any).style || {}),
            backgroundColor: isNaChecked ? '#f5f5f5' : 'white'
          }}
        />
      );
    }
    
    // For Select components
    if (children.type === Select) {
      return (
        <Select
          {...(children.props as any)}
          disabled={isNaChecked}
          style={{ 
            ...((children.props as any).style || {}),
            backgroundColor: isNaChecked ? '#f5f5f5' : 'white'
          }}
        />
      );
    }
    
    // For DatePicker components
    if (children.type === DatePicker) {
      return (
        <DatePicker
          {...(children.props as any)}
          disabled={isNaChecked}
          style={{ 
            ...((children.props as any).style || {}),
            backgroundColor: isNaChecked ? '#f5f5f5' : 'white'
          }}
        />
      );
    }
    
    // For Radio.Group components
    if (children.type === Radio.Group) {
      return (
        <Radio.Group
          {...(children.props as any)}
          disabled={isNaChecked}
        />
      );
    }
    
    // Default case - return the original element
    return children;
  };
  
  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col span={explanation ? 16 : 24}>
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Text strong>
            {number ? `${number}. ` : ''}{question}{required && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>}
          </Text>
          {name ? (
            <Form.Item 
              name={name} 
              rules={fieldRules}
              style={{ marginBottom: 0 }}
            >
              {renderDisableableInput()}
            </Form.Item>
          ) : (
            // If no name is provided, render children directly without Form.Item
            renderDisableableInput()
)}
          
          {hasNaCheckbox && naCheckboxFieldName && (
            <Form.Item 
              name={naCheckboxFieldName} 
              valuePropName="checked"
              style={{ marginBottom: 0, marginTop: 8, textAlign: 'right' }}
            >
              <Checkbox onChange={handleNaCheckboxChange}>不适用/技术无法提供</Checkbox>
            </Form.Item>
          )}
        </Space>
      </Col>
      {explanation && (
        <Col span={8}>
          <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', height: '100%' }}>
            <Paragraph style={{ fontSize: '13px', color: '#666' }}>{explanation}</Paragraph>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default QuestionItem;
