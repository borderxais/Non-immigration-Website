import React from 'react';
import { Form, Input, Select } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { permanentResidenceOptions , occupationOptions } from '../utils/formOptions';
import {
  maxLengths,
  organizationNameValidator,
  organizationNamePatternMessage,
  addressValidator,
  addressPatternMessage,
  locationValidator,
  locationPatternMessage,
  numericValidator,
  numericPatternMessage,
} from '../utils/validationRules';

interface WorkEducationProps {
  form: any;
  readOnly?: boolean;
}

const { TextArea } = Input;

const WorkEducation: React.FC<WorkEducationProps> = ({ form, readOnly = false }) => {
  // 监听职业选择
  const watchOccupation = Form.useWatch('presentOccupation', form);
  
  // 监听申请人出生日期
  const formValues = form.getFieldsValue(true);
  const dobData = formValues?.dob;
  const birthDate = dobData ? {
    day: dobData.day,
    month: dobData.month,
    year: dobData.year
  } : undefined;

  // 判断是否显示额外字段
  const shouldShowEmploymentDetails = () => {
    if (!watchOccupation) return false;
    // 如果是家庭主妇/夫或退休人员，不显示任何额外字段
    if (watchOccupation === 'H' || watchOccupation === 'RT') return false;
    return true;
  };
  
  // 判断是否只显示说明文本框（未就业）
  const showOnlyExplanation = () => {
    return watchOccupation === 'N'; // 未就业
  };
  
  // 判断是否显示其他职业说明文本框
  const showOtherOccupationField = () => {
    return watchOccupation === 'O'; // 其他
  };
  
  return (
    <div className="ds160-section">
      <h2>当前工作/教育/培训信息</h2>
      
      <div className="note">
        <p>注意: 请提供以下关于您当前工作及教育的信息。</p>
      </div>
      
      {/* 主要职业 */}
      <fieldset className="question-section" style={{marginTop: '20px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="主要职业"
              name="presentOccupation"
              required={true}
            >
              <Select
  showSearch
  filterOption={(input, option) => typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())}
  style={{ width: '99%' }}
  options={occupationOptions}
  placeholder="请选择您的主要职业"
  disabled={readOnly}
/>
            </QuestionItem>
            
            {/* 当选择"其他"时显示的文本框 */}
            {showOtherOccupationField() && (
              <div style={{ marginBottom: '15px' }}>
                <p>请说明您的具体职业：</p>
                <div className="highlighted-block">
                <Form.Item
                  name="otherOccupationExplanation"
                  rules={[{ required: true, message: '请说明您的具体职业' }]}
                >
                  <TextArea 
                    style={{ width: '99%' }} 
                    rows={4} 
                    maxLength={maxLengths.explanation}
                    required={true}
                    disabled={readOnly}
                  />
                </Form.Item>
                </div>
                </div>
            )}
          </div>
          <div className="explanation-column">
          </div>
        </div>
     
      
      {/* 当前工作/学校信息 - 仅当不是家庭主妇/夫或退休人员时显示 */}
      {shouldShowEmploymentDetails() && (
        <fieldset className="question-section">
          <div className="question-row">
            <div className="question-column">
            <h3>请简单说明您当前未就业的情况：</h3>
              {/* 未就业时只显示说明文本框 */}
              {showOnlyExplanation() ? (
                <div className="highlighted-block">
                  <div>  
                    <Form.Item
                      name="unemploymentExplanation"
                    >
                      <TextArea 
                        style={{ width: '99%' }} 
                        rows={4} 
                        maxLength={maxLengths.explanation}
                        required={true}
                        disabled={readOnly}
                      />
                    </Form.Item>
                  </div>
                </div>
              ) : (
                <div className="highlighted-block">
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="当前工作单位或学校的名称"
                      name="employerSchoolName"
                      required={true}
                      validator={organizationNameValidator}
                      validatorMessage={organizationNamePatternMessage}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={75}
                        placeholder="请输入雇主/学校名称"
                        disabled={readOnly}
                      />
                    </QuestionItem>
                  </div>
                  
                  <h4>目前工作单位或学校的地址：</h4>
                  <div className="block-inside-highlight">
                    <div style={{ marginBottom: '24px' }}>
                      <QuestionItem
                        question="街道地址（第一行）"
                        name="employerAddressLine1"
                        required={true}
                        validator={addressValidator}
                        validatorMessage={addressPatternMessage}
                      >
                        <Input 
                          style={{ width: '99%' }} 
                          maxLength={maxLengths.address}
                          placeholder="请输入地址"
                          disabled={readOnly}
                        />
                      </QuestionItem>

                      <QuestionItem
                        question="街道地址（第二行）"
                        name="employerAddressLine2"
                        required={false}
                        validator={addressValidator}
                        validatorMessage={addressPatternMessage}
                      >
                        <Input 
                          style={{ width: '99%' }} 
                          maxLength={maxLengths.address}
                          placeholder="请输入地址"
                          disabled={readOnly}
                        />
                      </QuestionItem>

                      <QuestionItem
                        question="城市"
                        name="employerCity"
                        required={true}
                        validator={locationValidator}
                        validatorMessage={locationPatternMessage}
                      >
                        <Input 
                          style={{ width: '99%' }} 
                          maxLength={maxLengths.city}
                          placeholder="请输入城市"
                          disabled={readOnly}
                        />
                      </QuestionItem>

                      <QuestionItem
                        question="州/省份"
                        name="employerState"
                        required={true}
                        hasNaCheckbox={true}
                        naCheckboxName="employerState_na"
                        inlineCheckbox={true}
                        validator={locationValidator}
                        validatorMessage={locationPatternMessage}
                      >
                        <Input 
                          style={{ width: '90%' }} 
                          maxLength={maxLengths.state}
                          placeholder="请输入州/省"
                          disabled={readOnly}
                        />
                      </QuestionItem>

                      <QuestionItem
                        question="邮政区域/邮政编码"
                        name="employerPostalCode"
                        required={true}
                        hasNaCheckbox={true}
                        naCheckboxName="employerPostalCode_na"
                        inlineCheckbox={true}
                        validator={locationValidator}
                        validatorMessage={locationPatternMessage}
                      >
                        <Input 
                          style={{ width: '90%' }} 
                          maxLength={maxLengths.zipCode}
                          placeholder="请输入邮编"
                          disabled={readOnly}
                        />
                      </QuestionItem>

                      <QuestionItem
                        question="电话号码"
                        name="employerPhone"
                        required={true}
                        validator={numericValidator}
                        validatorMessage={numericPatternMessage}
                      >
                        <Input 
                          style={{ width: '65%' }} 
                          maxLength={maxLengths.phone}
                          minLength={10}
                          placeholder="请输入电话号码"
                          disabled={readOnly}
                        />
                      </QuestionItem>

                      <QuestionItem
                        question="国家/地区"
                        name="employerCountry"
                        required={true}
                      >
                        <Select
  showSearch
  filterOption={(input, option) => typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())}
  style={{ width: '95%' }}
  options={permanentResidenceOptions}
  placeholder="请选择国家/地区"
  disabled={readOnly}
/>
                      </QuestionItem>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="开始日期"
                      name="employerStart"
                    >
                      <DateInput
                        dayName={["employerStart", "day"]}
                        monthName={["employerStart", "month"]}
                        yearName={["employerStart", "year"]}
                        disabled={readOnly}
                        validateEarlierThanToday={true}
                        validateNotEarlierThanBirthDate={true}
                        birthDate={birthDate}
                      />
                    </QuestionItem>

                    <QuestionItem
                      question="月收入（如有工作，当地货币）"
                      name="monthlySalary"
                      required={true}
                      hasNaCheckbox={true}
                      naCheckboxName="monthlySalary_na"
                      inlineCheckbox={true}
                      validator={numericValidator}
                      validatorMessage={numericPatternMessage}
                    >
                      <Input 
                        style={{ width: '90%' }} 
                        maxLength={15}
                        placeholder="请输入月薪（人民币）"
                        disabled={readOnly}
                      />
                    </QuestionItem>

                    <p>请简单说明你的职责：</p>
                    <Form.Item
                      name="jobDuties"
                      noStyle
                    >
                      <TextArea 
                        style={{ width: '99%' }} 
                        rows={4} 
                        maxLength={4000}
                        required={true}
                        disabled={readOnly}
                      />
                    </Form.Item>
                  </div>
                </div>
              )}
            </div>
            <div className="explanation-column"></div>
          </div>
        </fieldset>
      )}
      </fieldset>
    </div>
  );
};

export default WorkEducation;
