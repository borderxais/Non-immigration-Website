import React from 'react';
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
  title,
  children,
  addButtonText = "Add Another",
  removeButtonText = "Remove"
}) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <div key={field.key} className="field-group callout wadd" style={{ marginBottom: '16px', padding: '16px', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
              {children(field)}
              
              <div className="addremove" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button 
                  type="link" 
                  onClick={() => remove(field.name)}
                  icon={<MinusCircleOutlined />}
                >
                  {removeButtonText}
                </Button>
              </div>
            </div>
          ))}
          
          <div className="addremove" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
            <Button
              type="link"
              onClick={() => add()}
              icon={<PlusOutlined />}
            >
              {addButtonText}
            </Button>
          </div>
        </>
      )}
    </Form.List>
  );
};

export default RepeatableFormItem;