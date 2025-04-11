import React, { useEffect, useRef } from 'react';
import { Button, Form } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormListFieldData } from 'antd/lib/form/FormList';

interface RepeatableFormItemProps {
  name: string;
  children: (field: FormListFieldData) => React.ReactNode;
  addButtonText?: string;
  removeButtonText?: string;
}

const RepeatableFormItem: React.FC<RepeatableFormItemProps> = ({
  name,
  children,
  addButtonText = "添加另一个",
  removeButtonText = "移除"
}) => {
  // Create a reference to store the Form.List's add function
  const addFieldRef = useRef<any>(null);
  // Get the form instance at the component level
  const form = Form.useFormInstance();

  // Initialize with at least one field when mounted
  useEffect(() => {
    // We need to wait for the next tick to ensure the form is fully rendered
    const timer = setTimeout(() => {
      if (addFieldRef.current) {
        const existingFields = form.getFieldValue(name);
        if (!existingFields || existingFields.length === 0) {
          addFieldRef.current();
        }
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [form, name]);

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        // Store the add function in the ref
        addFieldRef.current = add;
        
        return (
          <div className="repeatable-form-container">
            {fields.map((field) => (
              <div key={field.key} className="field-group callout wadd" style={{ marginBottom: '16px', padding: '16px', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
                {children(field)}
                
                {/* Buttons for each entry */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <Button
                    type="link"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    {addButtonText}
                  </Button>
                  
                  <Button 
                    type="link" 
                    onClick={() => fields.length > 1 && remove(field.name)}
                    icon={<MinusCircleOutlined />}
                    disabled={fields.length <= 1}
                  >
                    {removeButtonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </Form.List>
  );
};

export default RepeatableFormItem;