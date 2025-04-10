import React from 'react';
import { Form, Select, Radio, Input, Divider, Checkbox } from 'antd';
import { FormInstance } from 'antd/lib/form';
import QuestionItem from '../common/QuestionItem';
import { countryOptions } from '../utils/formOptions';

interface PersonalInfoIIProps {
  form: FormInstance;
}

const PersonalInfoII: React.FC<PersonalInfoIIProps> = ({ form }) => {
  return (
    <>
      <QuestionItem
        question="所属国家/地区（国籍）"
        name="nationality"
        explanation="请选择您目前的国籍。"
      >
        <Select options={countryOptions} style={{ width: '100%' }} placeholder="- 选择一个 -" />
      </QuestionItem>
      
      <QuestionItem
        question="您是否持有或曾经持有上述国籍以外的其他国籍？"
        name="hasOtherNationality"
        explanation="如果您持有或曾经持有多重国籍，请选择'是'。"
      >
        <Radio.Group>
          <Radio value="Y">是</Radio>
          <Radio value="N">否</Radio>
        </Radio.Group>
      </QuestionItem>
      
      <QuestionItem
        question="您是否是所示原籍国/地区（国籍）以外的其他国家/地区的永久居民？"
        name="isPermResOtherCountry"
        explanation="永久居民是指已被一个国家/地区合法授予在该国家/地区无限期生活和工作许可的任何个人。"
      >
        <Radio.Group>
          <Radio value="Y">是</Radio>
          <Radio value="N">否</Radio>
        </Radio.Group>
      </QuestionItem>
      
      <Divider />
      
      <QuestionItem
        question="身份证件号码"
        name="nationalIdNumber"
        hasNaCheckbox={true}
        naCheckboxName="nationalIdNumber_na"
        explanation="您的身份证号码是您的政府给予的一个独一无二的号码。美国政府为其就业的或者付税的都提供一个号码，就业的为'社会安全号'，付税的为'税号'，这些号码都是独一无二的。"
      >
        <Input placeholder="请输入您的身份证号码" />
      </QuestionItem>
      
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
    </>
  );
};

export default PersonalInfoII;