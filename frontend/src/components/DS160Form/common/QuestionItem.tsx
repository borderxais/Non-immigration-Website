import React from 'react';
import { Form, Input, Select, DatePicker, Radio, Space, Checkbox, Row, Col, Typography, Flex } from 'antd';

const { Text } = Typography;

interface QuestionItemProps {
  number?: string;
  question: string;
  name?: string | (string | number)[];
  required?: boolean;
  children: React.ReactNode;
  hasNaCheckbox?: boolean;
  naCheckboxName?: string | (string | number)[];
  inlineCheckbox?: boolean; // New prop to control checkbox layout
  parentFieldName?: string; // New prop to specify parent field name for RepeatableFormItem
}

const QuestionItem: React.FC<QuestionItemProps> = ({ 
  number, 
  question, 
  name, 
  required = true, 
  children, 
  hasNaCheckbox = false, 
  naCheckboxName,
  inlineCheckbox = false, // Default to false for backward compatibility
  parentFieldName // Parent field name for RepeatableFormItem
}) => {
  // Use the form instance from the parent component
  const form = Form.useFormInstance();
  
  // Use the form instance to get the current value of the NA checkbox
  const naCheckboxFieldName = naCheckboxName || (name ? (typeof name === 'string' ? `${name}_na` : [...name, '_na']) : undefined);
  
  // Use state to track the checkbox value instead of useWatch
  const [isNaChecked, setIsNaChecked] = React.useState<boolean>(
    naCheckboxFieldName ? Boolean(form.getFieldValue(naCheckboxFieldName)) : false
  );
  
  // Handle NA checkbox change
  const handleNaCheckboxChange = (e: any) => {
    const checked = e.target.checked;
    
    // If the checkbox is checked, clear the related field value
    if (checked && name) {
      // Construct the full field path including parent field name if provided
      const fullFieldPath = parentFieldName && Array.isArray(name) 
        ? [parentFieldName, ...name] 
        : name;
      
      // Clear the field value
      form.setFieldValue(fullFieldPath, undefined);
      
      // Force a re-render to update the UI
      setTimeout(() => {
        form.validateFields([fullFieldPath].flat());
      }, 0);
    }
    
    // Update the state
    setIsNaChecked(checked);
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
          placeholder={isNaChecked ? '' : (children.props as any).placeholder}
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
          placeholder={isNaChecked ? '' : (children.props as any).placeholder}
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
          placeholder={isNaChecked ? '' : (children.props as any).placeholder}
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
  
  // Render the NA checkbox
  const renderNaCheckbox = () => {
    if (hasNaCheckbox && naCheckboxFieldName) {
      return (
        <Form.Item 
          name={naCheckboxFieldName} 
          valuePropName="checked"
          style={{ 
            marginBottom: 0, 
            marginTop: inlineCheckbox ? 0 : 8, 
            textAlign: inlineCheckbox ? 'left' : 'right',
            marginLeft: inlineCheckbox ? 16 : 0
          }}
        >
          <Checkbox onChange={handleNaCheckboxChange}>不适用/无法提供</Checkbox>
        </Form.Item>
      );
    }
    return null;
  };
  
  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col span={24}>
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Text strong>
            {number ? `${number}. ` : ''}{question}{required && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>}
          </Text>
          
          {inlineCheckbox && hasNaCheckbox ? (
            // Inline layout with checkbox in the same row
            <Flex align="center" style={{ width: '100%' }}>
              {name ? (
                <Form.Item 
                  name={name} 
                  rules={fieldRules}
                  style={{ marginBottom: 0, flex: 1 }}
                >
                  {renderDisableableInput()}
                </Form.Item>
              ) : (
                // If no name is provided, render children directly without Form.Item
                renderDisableableInput()
              )}
              {renderNaCheckbox()}
            </Flex>
          ) : (
            // Standard vertical layout
            <>
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
              
              {!inlineCheckbox && renderNaCheckbox()}
            </>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default QuestionItem;
