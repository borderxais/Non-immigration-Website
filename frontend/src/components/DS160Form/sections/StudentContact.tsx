import React, { useEffect } from 'react';
import { Input, Select, Form, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import QuestionItem from '../common/QuestionItem';
import { countryOptions } from '../utils/formOptions';
import { 
  englishNameValidator, 
  englishNamePatternMessage, 
  locationValidator, 
  locationPatternMessage, 
  zipCodeValidator, 
  zipCodePatternMessage, 
  numPhoneValidator, 
  numPhonePatternMessage, 
  emailValidator, 
  emailPatternMessage,
  maxLengths,
  englishAddressValidator,
  englishAddressPatternMessage
} from '../utils/validationRules';
import { FormListFieldData } from 'antd/lib/form/FormList';

interface StudentContactProps {
  form: any;
  readOnly?: boolean;
}

const StudentContact: React.FC<StudentContactProps> = ({ form, readOnly = false }) => {
  // Ensure at least 2 contacts are added when component mounts
  useEffect(() => {
    const studentContacts = form.getFieldValue('studentContacts') || [];
    
    if (studentContacts.length < 2) {
      // Add empty contacts to reach minimum of 2
      const contactsToAdd = 2 - studentContacts.length;
      const newContacts = [...studentContacts];
      
      for (let i = 0; i < contactsToAdd; i++) {
        newContacts.push({});
      }
      
      form.setFieldsValue({
        studentContacts: newContacts
      });
    }
  }, [form]);

  // Render a single contact form
  const renderContactForm = (field: FormListFieldData) => {
    return (
      <div>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="姓氏"
              name={[field.name, 'surname']}
              required={true}
              validator={englishNameValidator}
              validatorMessage={englishNamePatternMessage}
            >
              <Input 
                style={{ width: '95%' }} 
                maxLength={maxLengths.name}
                disabled={readOnly}
              />
            </QuestionItem>
          
            <QuestionItem
              question="名字"
              name={[field.name, 'givenName']}
              required={true}
              validator={englishNameValidator}
              validatorMessage={englishNamePatternMessage}
            >
              <Input 
                style={{ width: '95%' }} 
                maxLength={maxLengths.name}
                disabled={readOnly}
              />
            </QuestionItem>
          
            <QuestionItem
              question="街道地址(第一行)"
              name={[field.name, 'addressLine1']}
              required={true}
              validator={englishAddressValidator}
              validatorMessage={englishAddressPatternMessage}
            >
              <Input 
                style={{ width: '95%' }} 
                maxLength={maxLengths.address}
                disabled={readOnly}
              />
            </QuestionItem>
            
            <QuestionItem
              question="街道地址(第二行) *选填"
              name={[field.name, 'addressLine2']}
              required={false}
              validator={englishAddressValidator}
              validatorMessage={englishAddressPatternMessage}
            >
              <Input 
                style={{ width: '95%' }} 
                maxLength={maxLengths.address}
                disabled={readOnly}
              />
            </QuestionItem>
            
            <QuestionItem
              question="城市"
              name={[field.name, 'city']}
              required={true}
              validator={locationValidator}
              validatorMessage={locationPatternMessage}
            >
              <Input 
                style={{ width: '75%' }} 
                maxLength={maxLengths.city}
                disabled={readOnly}
              />
            </QuestionItem>
            
            <QuestionItem
              question="州/省份"
              name={[field.name, 'state']}
              required={true}
              hasNaCheckbox={true}
              naCheckboxName={[field.name, 'state_na']}
              inlineCheckbox={true}
            >
              <Input 
                maxLength={maxLengths.state}
              />
            </QuestionItem>
            
            <QuestionItem
              question="邮政区域/邮政编码"
              name={[field.name, 'postalCode']}
              required={true}
              hasNaCheckbox={true}
              naCheckboxName={[field.name, 'postalCode_na']}
              validator={zipCodeValidator}
              validatorMessage={zipCodePatternMessage}
              inlineCheckbox={true}
            >
              <Input 
                maxLength={10}
              />
            </QuestionItem>
            
            <QuestionItem
              question="国家/地区"
              name={[field.name, 'country']}
              required={true}
            >
              <Select
                style={{ width: '99%' }}
                options={countryOptions}
                placeholder="- 请选择一个 -"
                showSearch
                filterOption={(input, option) => 
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                disabled={readOnly}
              />
            </QuestionItem>
            
            <QuestionItem
              question="电话号码"
              name={[field.name, 'phone']}
              required={true}
              hasNaCheckbox={true}
              naCheckboxName={[field.name, 'phone_na']}
              validator={numPhoneValidator}
              validatorMessage={numPhonePatternMessage}
              inlineCheckbox={true}
            >
              <Input 
                maxLength={maxLengths.phone}
                minLength={5}
                placeholder="例如：5555555555"
              />
            </QuestionItem>
            
            <QuestionItem
              question="电子邮件地址"
              name={[field.name, 'email']}
              required={true}
              hasNaCheckbox={true}
              naCheckboxName={[field.name, 'email_na']}
              validator={emailValidator}
              validatorMessage={emailPatternMessage}
              inlineCheckbox={true}
            >
              <Input 
                maxLength={maxLengths.email}
                placeholder="例如：emailaddress@example.com"
              />
            </QuestionItem>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ds160-section">
      <h2>额外联络人信息</h2>
      
      <div className="note" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        <h3>注意: 您已表明您在美国停留期间将进行学习。请列出至少两位您居住国的联络人，他们可以证实您申请表格所提供的信息。请不要将直系家属或其他亲戚作为联络人。请注意：邮政信箱号码联络方式不予接受。</h3>
      </div>
      
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <Form.List name="studentContacts">
              {(fields, { add, remove }) => (
                <div className="repeatable-form-container">
                  {fields.map((field) => (
                    <React.Fragment key={field.key}>
                      {/* Content block */}
                      <div className="highlighted-block">
                        {renderContactForm(field)}
                      </div>
                      
                      {/* Buttons right below this content block */}
                      <div className="button-container">
                        <Button
                          type="link"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        >
                          添加另一个联络人
                        </Button>
                        
                        <Button 
                          type="link" 
                          onClick={() => fields.length > 2 && remove(field.name)}
                          icon={<MinusCircleOutlined />}
                          disabled={fields.length <= 2}
                          danger
                        >
                          移除此联络人
                        </Button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </Form.List>
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
    </div>
  );
};

export default StudentContact;
