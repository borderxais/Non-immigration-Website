import React, { useEffect } from 'react';
import { Button, Form } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormListFieldData } from 'antd/lib/form/FormList';

interface RepeatableFormItemProps {
  name: string;
  title?: string;
  children: (field: FormListFieldData) => React.ReactNode;
  addButtonText?: string;
  removeButtonText?: string;
}

const RepeatableFormItem: React.FC<RepeatableFormItemProps> = ({
  name,
  children,
  addButtonText = "Add Another",
  removeButtonText = "Remove"
}) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        // If there are no fields, add one automatically
        useEffect(() => {
          if (fields.length === 0) {
            add();
          }
        }, [fields.length, add]);

        return (
          <div className="repeatable-form-container">
            {/* Scrollable container for form fields */}
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: '4px', padding: '8px' }}>
              {fields.map((field) => (
                <div key={field.key} className="field-group callout wadd" style={{ marginBottom: '16px', padding: '16px', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
                  {children(field)}
                </div>
              ))}
            </div>
            
            {/* Buttons container - outside the scrollable area */}
            <div className="buttons-container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <Button
                type="link"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                {addButtonText}
              </Button>
              
              {fields.length > 1 && (
                <Button 
                  type="link" 
                  onClick={() => remove(fields[fields.length - 1].name)}
                  icon={<MinusCircleOutlined />}
                >
                  {removeButtonText}
                </Button>
              )}
            </div>
          </div>
        );
      }}
    </Form.List>
  );
};

export default RepeatableFormItem;