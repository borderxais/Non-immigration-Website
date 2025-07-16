import React, { useEffect, useRef } from 'react';
import { Button, Form } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormListFieldData } from 'antd/lib/form/FormList';

interface RepeatableFormItemProps {
  name: string;
  children: (field: FormListFieldData, listName: string) => React.ReactNode;
  addButtonText?: string;
  removeButtonText?: string;
  blockStyle?: 'highlighted' | 'white';
  maxItems?: number;
}

const RepeatableFormItem: React.FC<RepeatableFormItemProps> = ({
  name,
  children,
  addButtonText = "添加另一个",
  removeButtonText = "移除",
  blockStyle = 'highlighted',
  maxItems = Infinity
}) => {
  // Ensure maxItems is a number
  const maxItemsValue = typeof maxItems === 'number' ? maxItems : Infinity;
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
    
    // Debug maxItems value
    console.log(`RepeatableFormItem ${name} maxItems:`, maxItemsValue);
    
    return () => clearTimeout(timer);
  }, [form, name, maxItemsValue]);

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        // Store the add function in the ref
        addFieldRef.current = add;
        
        return (
          <div className="repeatable-form-container">
            {fields.map((field) => (
              <React.Fragment key={field.key}>
                {/* Content block */}
                <div className={blockStyle === 'highlighted' ? "highlighted-block" : "block-inside-highlight"}>
                  {children(field, name)}
                </div>
                
                {/* Buttons right below this content block */}
                <div className="button-container">
                    <Button
                      type="link"
                      onClick={() => {
                        console.log('Current fields length:', fields.length, 'maxItems:', maxItemsValue);
                        if (fields.length < maxItemsValue) {
                          add();
                        } else {
                          // Alert the user they've reached the limit
                          alert(`最多只能添加${maxItemsValue}个项目`);
                        }
                      }}
                      icon={<PlusOutlined />}
                      disabled={fields.length >= maxItemsValue}
                    >
                      {addButtonText}
                      {fields.length >= maxItemsValue ? ` (已达上限${maxItemsValue}个)` : ''}
                    </Button>
                  
                  <Button 
                    type="link" 
                    onClick={() => fields.length > 1 && remove(field.name)}
                    icon={<MinusCircleOutlined />}
                    disabled={fields.length <= 1}
                    danger
                  >
                    {removeButtonText}
                  </Button>
                </div>
              </React.Fragment>
            ))}
          </div>
        );
      }}
    </Form.List>
  );
};

export default RepeatableFormItem;