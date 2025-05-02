import React, { useState } from 'react';
import { Form, Select, Radio, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import QuestionItem from '../common/QuestionItem';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { countryOptions } from '../utils/formOptions';
import { FormListFieldData } from 'antd/lib/form/FormList';
import '../ds160Form.css';

interface PersonalInfoIIProps {
  form: FormInstance;
}

const PersonalInfoII: React.FC<PersonalInfoIIProps> = ({ form }) => {
  const [hasOtherNationality, setHasOtherNationality] = useState<boolean>(false);
  const [isPermResOtherCountry, setIsPermResOtherCountry] = useState<boolean>(false);
  const [hasOtherPassport, setHasOtherPassport] = useState<boolean>(false);

  const handleOtherNationalityChange = (e: any) => {
    setHasOtherNationality(e.target.value === 'Y');
    if (e.target.value === 'N') {
      setHasOtherPassport(false);
      // Reset other nationality and passport related fields
      form.setFieldsValue({
        otherNationalities: undefined
      });
    }
  };

  const handleOtherPassportChange = (e: any) => {
    setHasOtherPassport(e.target.value === 'Y');
    if (e.target.value === 'N') {
      // Reset passport number when selecting No
      form.setFieldsValue({
        otherPassportNumber: undefined
      });
    }
  };

  const handlePermResChange = (e: any) => {
    setIsPermResOtherCountry(e.target.value === 'Y');
    if (e.target.value === 'N') {
      // Reset permanent residence related fields
      form.setFieldsValue({
        permanentResidences: undefined
      });
    }
  };

  return (
    <div className="personal-info-II-section">
      {/* Section 1: Nationality and Other Nationality */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="所属国家/地区（国籍）"
              name="nationality"
            >
              <Select options={countryOptions} style={{ width: '98%' }} placeholder="- 选择一个 -" />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：国籍</h4>
            <p>请选择您目前的国籍。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否持有或曾经持有上述国籍以外的其他国籍？"
              name="hasOtherNationality"
            >
              <Radio.Group onChange={handleOtherNationalityChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {hasOtherNationality && (
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
                <div className="highlighted-block">
                  <RepeatableFormItem
                    name="otherNationalities"
                    addButtonText="增加另一个"
                    removeButtonText="移除"
                  >
                    {(field: FormListFieldData) => {
                      const { key, ...restField } = field;
                      return (
                        <>
                          <Form.Item
                            key={key}
                            {...restField}
                            name={[field.name, 'country']}
                            label="其他国籍"
                            rules={[{ required: true, message: '请选择其他国籍' }]}
                            style={{ marginBottom: '16px' }}
                          >
                            <Select options={countryOptions} style={{ width: '95%' }} placeholder="- 选择一个 -" />
                          </Form.Item>

                          <Form.Item
                            key={`${key}-passport`}
                            {...restField}
                            name={[field.name, 'hasPassport']}
                            label="是否持有该国护照"
                            rules={[{ required: true, message: '请选择是否持有护照' }]}
                          >
                            <Radio.Group>
                              <Radio value="Y">是</Radio>
                              <Radio value="N">否</Radio>
                            </Radio.Group>
                          </Form.Item>

                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => {
                              const prev = prevValues?.otherNationalities?.[field.name]?.hasPassport;
                              const curr = currentValues?.otherNationalities?.[field.name]?.hasPassport;
                              return prev !== curr;
                            }}
                          >
                            {({ getFieldValue }) => {
                              const hasPassport = getFieldValue(['otherNationalities', field.name, 'hasPassport']);
                              return hasPassport === 'Y' ? (
                                <Form.Item
                                  key={`${key}-passportNumber`}
                                  {...restField}
                                  name={[field.name, 'passportNumber']}
                                  label="护照号码"
                                  rules={[{ required: true, message: '请输入护照号码' }]}
                                >
                                  <Input style={{ width: '95%' }} maxLength={20} placeholder="请输入护照号码" />
                                </Form.Item>
                              ) : null;
                            }}
                          </Form.Item>
                        </>
                      );
                    }}
                  </RepeatableFormItem>
                </div>
              </>
            )}
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：其他国籍</h4>
            <p>如果您持有或曾经持有多重国籍，请选择'是'。</p>
          </div>
        </div>
      </fieldset>
      
      {/* Section 2: Permanent Resident */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否是所示原籍国/地区（国籍）以外的其他国家/地区的永久居民？"
              name="isPermResOtherCountry"
            >
              <Radio.Group onChange={handlePermResChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {isPermResOtherCountry && (
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
                <div className="highlighted-block">
                  <RepeatableFormItem
                    name="permanentResidences"
                    addButtonText="增加另一个"
                    removeButtonText="移除"
                  >
                    {(field: FormListFieldData) => {
                      const { key, ...restField } = field;
                      return (
                        <Form.Item
                          key={key}
                          {...restField}
                          name={[field.name, 'country']}
                          label="永久居留国家/地区"
                          rules={[{ required: true, message: '请选择永久居留国家/地区' }]}
                        >
                          <Select options={countryOptions} style={{ width: '95%' }} placeholder="- 选择一个 -" />
                        </Form.Item>
                      );
                    }}
                  </RepeatableFormItem>
                </div>
              </>
            )}
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：永久居民</h4>
            <p>永久居民是指已被一个国家/地区合法授予在该国家/地区无限期生活和工作许可的任何个人。</p>
          </div>
        </div>
      </fieldset>
      
      {/* Section 3: ID Numbers */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="身份证件号码"
              name="nationalIdNumber"
              hasNaCheckbox={true}
              naCheckboxName="nationalIdNumber_na"
            >
              <Input placeholder="请输入您的身份证号码" style={{ width: '99%' }} />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：身份证件号码</h4>
            <p>您的身份证号码是您的政府给予的一个独一无二的号码。美国政府为其就业的或者付税的都提供一个号码，就业的为'社会安全号'，付税的为'税号'，这些号码都是独一无二的。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="美国社会安全号"
              name="usSSN"
              hasNaCheckbox={true}
              naCheckboxName="usSSN_na"
            >
              <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
                prevValues.usSSN_na !== currentValues.usSSN_na
              }>
                {({ getFieldValue }) => {
                  const isDisabled = getFieldValue('usSSN_na') === true;
                  
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Form.Item name={['usSSN', 'part1']} noStyle>
                        <Input 
                          style={{ width: '60px' }} 
                          maxLength={3} 
                          placeholder="XXX" 
                          disabled={isDisabled}
                        />
                      </Form.Item>
                      <span>-</span>
                      <Form.Item name={['usSSN', 'part2']} noStyle>
                        <Input 
                          style={{ width: '50px' }} 
                          maxLength={2} 
                          placeholder="XX" 
                          disabled={isDisabled}
                        />
                      </Form.Item>
                      <span>-</span>
                      <Form.Item name={['usSSN', 'part3']} noStyle>
                        <Input 
                          style={{ width: '60px' }} 
                          maxLength={4} 
                          placeholder="XXXX" 
                          disabled={isDisabled}
                        />
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.Item>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：美国社会安全号</h4>
            <p>如果您曾在美国工作或居住，您可能拥有美国社会安全号。如果没有，请选择"不适用"。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="美国纳税人身份号码"
              name="usTaxId"
              hasNaCheckbox={true}
              naCheckboxName="usTaxId_na"
            >
              <Input placeholder="请输入您的美国纳税人身份号码" style={{ width: '99%' }} />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：美国纳税人身份号码</h4>
            <p>如果您曾在美国缴纳税款，您可能拥有美国纳税人身份号码。如果没有，请选择"不适用"。</p>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default PersonalInfoII;