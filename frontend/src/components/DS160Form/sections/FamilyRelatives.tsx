import React from 'react';
import { Form, Input, Select, Radio } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { relationshipOptions, usStatusOptions } from '../utils/formOptions';
import { 
  nameValidator, 
  namePatternMessage, 
  maxLengths
} from '../utils/validationRules';

interface FamilyInfoProps {
  form: any;
}

const FamilyInfo: React.FC<FamilyInfoProps> = ({ form }) => {
  // 监听父亲信息复选框状态
  const watchFatherSurnameNotKnown = Form.useWatch('fatherSurnameNotKnown', form);
  const watchFatherGivenNameNotKnown = Form.useWatch('fatherGivenNameNotKnown', form);
  const watchFatherDobNotKnown = Form.useWatch('fatherDobNotKnown', form);
  
  // 监听母亲信息复选框状态
  const watchMotherSurnameNotKnown = Form.useWatch('motherSurnameNotKnown', form);
  const watchMotherGivenNameNotKnown = Form.useWatch('motherGivenNameNotKnown', form);
  const watchMotherDobNotKnown = Form.useWatch('motherDobNotKnown', form);
  
  // 监听是否有美国直系亲属
  const watchHasUsRelatives = Form.useWatch('hasUsRelatives', form);
  
  // 监听父亲是否在美国
  const watchFatherInUs = Form.useWatch('fatherInUs', form);
  
  // 监听母亲是否在美国
  const watchMotherInUs = Form.useWatch('motherInUs', form);

  // 监听申请人出生日期
  const formValues = form.getFieldsValue(true);
  const dobData = formValues?.dob;
  const birthDate = dobData ? {
    day: dobData.day,
    month: dobData.month,
    year: dobData.year
  } : undefined;
  
  // 处理是否有美国直系亲属的变化
  const handleHasUsRelativesChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      // 如果选择"否"，清除所有亲属数据
      form.setFieldsValue({
        relatives: []
      });
    }
  };
  
  // 处理父亲是否在美国的变化
  const handleFatherInUsChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      // 如果选择"否"，清除父亲的身份数据
      form.setFieldsValue({
        fatherStatus: undefined
      });
    }
  };
  
  // 处理母亲是否在美国的变化
  const handleMotherInUsChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      // 如果选择"否"，清除母亲的身份数据
      form.setFieldsValue({
        motherStatus: undefined
      });
    }
  };
  
  return (
    <div className="ds160-section">
      <h2>家庭信息：亲属</h2>
      
      <div className="note">
        <p>注意：请提供有关您亲生父母的以下信息。如果您是被收养的，请提供有关您的养父母的以下信息。</p>
      </div>
      
      {/* 父亲信息部分 */}
      <fieldset className="question-section">
        <h4>
          <span>父亲的全名和出生日期</span>
        </h4>
        
        <div className="question-row">
          <div className="question-column">
            <div className="highlighted-block">
              <QuestionItem
                question="姓氏"
                name="fatherSurname"
                required={true}
                hasNaCheckbox={true}
                naCheckboxName="fatherSurnameNotKnown"
                validator={nameValidator}
                validatorMessage={namePatternMessage}
              >
                <Input 
                  style={{ width: '99%' }} 
                  maxLength={maxLengths.name} 
                  disabled={!!watchFatherSurnameNotKnown}
                  placeholder={!!watchFatherSurnameNotKnown ? '' : '请输入父亲姓氏'}
                />
              </QuestionItem>

              <QuestionItem
                question="名字"
                name="fatherGivenName"
                required={true}
                hasNaCheckbox={true}
                naCheckboxName="fatherGivenNameNotKnown"
                validator={nameValidator}
                validatorMessage={namePatternMessage}
              >
                <Input 
                  style={{ width: '99%' }} 
                  maxLength={maxLengths.name} 
                  disabled={!!watchFatherGivenNameNotKnown}
                  placeholder={!!watchFatherGivenNameNotKnown ? '' : '请输入父亲名字'}
                />
              </QuestionItem>
              
              {/* Only show these fields if at least one name field is known */}
              {!(watchFatherSurnameNotKnown && watchFatherGivenNameNotKnown) && (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="出生日期"
                      name="fatherDob"
                      required={true}
                      hasNaCheckbox={true}
                      naCheckboxName="fatherDobNotKnown"
                      inlineCheckbox={true}
                    >
                      <DateInput
                        dayName={["fatherDob", "day"]}
                        monthName={["fatherDob", "month"]}
                        yearName={["fatherDob", "year"]}
                        disabled={!!watchFatherDobNotKnown}
                        validateHistoricalDate={true}
                        validateEarlierThanBirthDate={true}
                        birthDate={birthDate}
                        naCheckboxName="fatherDobNotKnown"
                      />
                    </QuestionItem>

                    <QuestionItem
                      question="您的父亲是否在美国？"
                      name="fatherInUs"
                      required={true}
                    >
                      <Radio.Group onChange={handleFatherInUsChange}>
                        <Radio value="Y">是</Radio>
                        <Radio value="N">否</Radio>
                      </Radio.Group>
                    </QuestionItem>
                    
                    {watchFatherInUs === 'Y' && (
                      <div style={{ marginTop: '16px' }}>
                        <QuestionItem
                          question="父亲的身份"
                          name="fatherStatus"
                          required={true}
                        >
                          <Select 
                            options={usStatusOptions} 
                            style={{ width: '95%' }} 
                            placeholder="- 请选择一个 -" 
                          />
                        </QuestionItem>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 母亲信息部分 */}
      <fieldset className="question-section">
        <h4>
          <span>母亲的全名和出生日期</span>
        </h4>
        
        <div className="question-row">
          <div className="question-column">
            <div className="highlighted-block">
              <QuestionItem
                question="姓氏"
                name="motherSurname"
                required={true}
                hasNaCheckbox={true}
                naCheckboxName="motherSurnameNotKnown"
                validator={nameValidator}
                validatorMessage={namePatternMessage}
              >
                <Input 
                  style={{ width: '99%' }} 
                  maxLength={33} 
                  disabled={!!watchMotherSurnameNotKnown}
                  placeholder={!!watchMotherSurnameNotKnown ? '' : '请输入母亲姓氏'}
                />
              </QuestionItem>

              <QuestionItem
                question="名字"
                name="motherGivenName"
                required={true}
                hasNaCheckbox={true}
                naCheckboxName="motherGivenNameNotKnown"
                validator={nameValidator}
                validatorMessage={namePatternMessage}
              >
                <Input 
                  style={{ width: '99%' }} 
                  maxLength={33} 
                  disabled={!!watchMotherGivenNameNotKnown}
                  placeholder={!!watchMotherGivenNameNotKnown ? '' : '请输入母亲名字'}
                />
              </QuestionItem>
              
              {/* Only show these fields if at least one name field is known */}
              {!(watchMotherSurnameNotKnown && watchMotherGivenNameNotKnown) && (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="出生日期"
                      name="motherDob"
                      required={true}
                      hasNaCheckbox={true}
                      naCheckboxName="motherDobNotKnown"
                    >
                      <DateInput
                        dayName={["motherDob", "day"]}
                        monthName={["motherDob", "month"]}
                        yearName={["motherDob", "year"]}
                        disabled={!!watchMotherDobNotKnown}
                        validateHistoricalDate={true}
                        validateEarlierThanBirthDate={true}
                        birthDate={birthDate}
                        naCheckboxName="motherDobNotKnown"
                      />
                    </QuestionItem>
                  </div>
                  
                  <div>
                    <QuestionItem
                      question="您的母亲是否在美国？"
                      name="motherInUs"
                      required={true}
                    >
                      <Radio.Group onChange={handleMotherInUsChange}>
                        <Radio value="Y">是</Radio>
                        <Radio value="N">否</Radio>
                      </Radio.Group>
                    </QuestionItem>
                    
                    {watchMotherInUs === 'Y' && (
                      <div style={{ marginTop: '16px' }}>
                        <QuestionItem
                          question="母亲的身份"
                          name="motherStatus"
                          required={true}
                        >
                          <Select 
                            options={usStatusOptions} 
                            style={{ width: '95%' }} 
                            placeholder="- 请选择一个 -" 
                          />
                        </QuestionItem>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 美国直系亲属部分 */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您在美国是否有直系亲属（不包括父母）？"
              name="hasUsRelatives"
              required={true}
            >
              <Radio.Group onChange={handleHasUsRelativesChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {watchHasUsRelatives === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <RepeatableFormItem
                  name="relatives"
                  addButtonText="添加另一个"
                  removeButtonText="移除"
                >
                  {(field) => (
                    <div>
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="姓氏"
                          name={[field.name, 'surname']}
                          required={true}
                          validator={nameValidator}
                          validatorMessage={namePatternMessage}
                        >
                          <Input style={{ width: '95%' }} maxLength={maxLengths.name}/>
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="名字"
                          name={[field.name, 'givenName']}
                          required={true}
                          validator={nameValidator}
                          validatorMessage={namePatternMessage}
                        >
                          <Input style={{ width: '95%' }} maxLength={maxLengths.name}/>
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="与您的关系"
                          name={[field.name, 'relationship']}
                          required={true}
                        >
                          <Select 
                            options={relationshipOptions} 
                            style={{ width: '95%' }} 
                            placeholder="- 请选择一个 -" 
                          />
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="在美国的身份"
                          name={[field.name, 'usStatus']}
                          required={true}
                        >
                          <Select 
                            options={usStatusOptions} 
                            style={{ width: '95%' }} 
                            placeholder="- 请选择一个 -" 
                          />
                        </QuestionItem>
                      </div>
                    </div>
                  )}
                </RepeatableFormItem>
              </div>
            )}
            
            {watchHasUsRelatives === 'N' && (
              <div style={{ marginTop: '20px' }}>
                <QuestionItem
                  question="您在美国是否有其他亲属？"
                  name="hasOtherUsRelatives"
                  required={true}
                >
                  <Radio.Group>
                    <Radio value="Y">是</Radio>
                    <Radio value="N">否</Radio>
                  </Radio.Group>
                </QuestionItem>
              </div>
            )}
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：直系亲属</h4>
            <p>直系亲属包括配偶、子女、兄弟姐妹等。</p>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default FamilyInfo;
