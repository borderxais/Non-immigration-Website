import React, { useState, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { countryOptions, currentNationalityOptions, permanentResidenceOptions } from '../utils/formOptions';
import {
  maxLengths,
  nameValidator, 
  namePatternMessage,
  locationValidator,
  locationPatternMessage,
  addressValidator,
  addressPatternMessage,
  stateZipCodeValidator,
  stateZipCodePatternMessage
} from '../utils/validationRules';

interface FamilySpouseProps {
  form: any;
  formValues?: any;
}

const FamilySpouse: React.FC<FamilySpouseProps> = ({ form, formValues }) => {
  // State variables for conditional rendering
  const [spouseAddressType, setSpouseAddressType] = useState<string>(formValues?.spouseAddressType || '');
  
  // Watch form field changes
  const watchSpousePobCityNotKnown = Form.useWatch('spousePobCityNotKnown', form);
  const watchSpouseAddressType = Form.useWatch('spouseAddressType', form);
  
  // Update state when form values change
  useEffect(() => {
    if (formValues) {
      setSpouseAddressType(formValues.spouseAddressType || '');
    }
  }, [formValues]);

  // Update state when form field changes
  useEffect(() => {
    setSpouseAddressType(watchSpouseAddressType || '');
  }, [watchSpouseAddressType]);
  
  return (
    <div className="ds160-section">
      <h2>家庭信息：配偶</h2>
      
      <div className="note">
        <p>注意: 输入当前配偶的信息.</p>
      </div>
      
      {/* 配偶姓名和出生日期 */}
      <fieldset className="question-section">
        <h3>
          <span>配偶的全名(包含婚前用名)</span>
        </h3>
        
        <div className="question-row">
          <div className="question-column">
            <div className="highlighted-block">
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="配偶的姓氏"
                  name="spouseSurname"
                  required={true}
                  validator={nameValidator}
                  validatorMessage={namePatternMessage}
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={maxLengths.name} 
                  />
                </QuestionItem>

                <QuestionItem
                  question="配偶的名字"
                  name="spouseGivenName"
                  required={true}
                  validator={nameValidator}
                  validatorMessage={namePatternMessage}
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={maxLengths.name} 
                  />
                </QuestionItem>

                <QuestionItem
                  question="配偶的出生日期"
                  name="spouseDob"
                  hasNaCheckbox={true}
                >
                  <DateInput
                    dayName={["spouseDob", "day"]}
                    monthName={["spouseDob", "month"]}
                    yearName={["spouseDob", "year"]}
                    naCheckboxName="spouseDob_na"
                    validateHistoricalDate={true}
                    validateEarlierThanToday={true}
                  />
                </QuestionItem>

                <QuestionItem
                  question="配偶的国家/地区（国籍）"
                  name="spouseNationality"
                  required={true}
                >
                  <Select
  showSearch
  filterOption={(input, option) => typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())}
  style={{ width: '99%' }}
  placeholder="- 请选择一个 -"
  optionFilterProp="children"
  options={currentNationalityOptions}
/>
                </QuestionItem>
              </div>
            </div>
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 配偶出生地 */}
      <fieldset className="question-section">
        <h3>
          <span>配偶的出生地</span>
        </h3>
        
        <div className="question-row">
          <div className="question-column">
            <div className="highlighted-block">
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="城市"
                  name="spousePobCity"
                  required={true}
                  hasNaCheckbox={true}
                  naCheckboxName="spousePobCity_na"
                  validator={locationValidator}
                  validatorMessage={locationPatternMessage}
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={maxLengths.city} 
                    disabled={!!watchSpousePobCityNotKnown}
                  />
                </QuestionItem>

                <QuestionItem
                  question="国家/地区"
                  name="spousePobCountry"
                  required={true}
                >
                  <Select
  showSearch
  filterOption={(input, option) => typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())}
  style={{ width: '99%' }}
  placeholder="- 请选择一个 -"
  options={countryOptions}
/>
                </QuestionItem>
              </div>
            </div>
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 配偶地址 */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="配偶的联系地址"
              name="spouseAddressType"
              required={true}
            >
              <Select
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                style={{ width: '99%' }}
                placeholder="- 请选择一个 -"
                onChange={(value) => {
                  setSpouseAddressType(value);
                  if (value !== 'O') {
                    // Reset form fields when not selecting "Other"
                    form.setFieldsValue({
                      spouseAddressLine1: undefined,
                      spouseAddressLine2: undefined,
                      spouseAddressCity: undefined,
                      spouseAddressState: undefined,
                      spouseAddressState_na: undefined,
                      spouseAddressPostalCode: undefined,
                      spouseAddressPostalCode_na: undefined,
                      spouseAddressCountry: undefined
                    });
                  }
                }}
              >
                <Select.Option value="">- 请选择一个 -</Select.Option>
                <Select.Option value="H">与家庭住址相同</Select.Option>
                <Select.Option value="M">与邮寄地址相同</Select.Option>
                <Select.Option value="U">与美国联系地址相同</Select.Option>
                <Select.Option value="D">不知道</Select.Option>
                <Select.Option value="O">其他（请指定地址）</Select.Option>
              </Select>
            </QuestionItem>
            
            {spouseAddressType === 'O' && (
              <div style={{ marginTop: '20px' }}>
                <div className="highlighted-block">
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="街道地址（第一行）"
                      name="spouseAddressLine1"
                      required={true}
                      validator={addressValidator}
                      validatorMessage={addressPatternMessage}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={maxLengths.address}
                      />
                    </QuestionItem>
                  
                    <QuestionItem
                      question="街道地址（第二行）"
                      name="spouseAddressLine2"
                      required={false}
                      validator={addressValidator}
                      validatorMessage={addressPatternMessage}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={maxLengths.address}
                      />
                    </QuestionItem>
                  
                    <QuestionItem
                      question="城市"
                      name="spouseAddressCity"
                      required={true}
                      validator={locationValidator}
                      validatorMessage={locationPatternMessage}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={maxLengths.city}
                      />
                    </QuestionItem>

                    <QuestionItem
                      question="州/省份"
                      name="spouseAddressState"
                      required={true}
                      hasNaCheckbox={true}
                      naCheckboxName="spouseAddressState_na"
                      inlineCheckbox={true}
                      validator={locationValidator}
                      validatorMessage={locationPatternMessage}
                    >
                      <Input 
                        style={{ width: '90%' }} 
                        maxLength={maxLengths.state}
                      />
                    </QuestionItem>

                    <QuestionItem
                      question="邮政区域/邮政编码"
                      name="spouseAddressPostalCode"
                      required={true}
                      hasNaCheckbox={true}
                      naCheckboxName="spouseAddressPostalCode_na"
                      inlineCheckbox={true}
                      validator={stateZipCodeValidator}
                      validatorMessage={stateZipCodePatternMessage}
                    >
                      <Input 
                        style={{ width: '90%' }} 
                        maxLength={maxLengths.zipCode}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="国家/地区"
                      name="spouseAddressCountry"
                      required={true}
                    >
                      <Select
  showSearch
  filterOption={(input, option) => typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())}
  style={{ width: '99%' }}
  options={permanentResidenceOptions}
  placeholder="- 请选择一个 -"
/>
                    </QuestionItem>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
    </div>
  );
};

export default FamilySpouse;
