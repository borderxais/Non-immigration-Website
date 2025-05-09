import React from 'react';
import { Form, Input, Select } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { countryOptions, occupationOptions } from '../utils/formOptions';

interface WorkEducationProps {
  form: any;
}

const { TextArea } = Input;

const WorkEducation: React.FC<WorkEducationProps> = ({ form }) => {
  // 监听职业选择
  const watchOccupation = Form.useWatch('presentOccupation', form);
  
  return (
    <div className="ds160-section">
      <h2>当前工作/教育/培训信息</h2>
      
      <div className="note" style={{ border: '1px solid #ccc', padding: '10px' }}>
        <h3>注意: 请提供以下关于您当前工作及教育的信息。</h3>
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
                style={{ width: '99%' }} 
                options={occupationOptions}
                placeholder="- 请选择一个 -"
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：职业类别</h4>
            <p>请选择最能描述您当前主要职业的类别。</p>
          </div>
        </div>
      </fieldset>
      
      {/* 当前工作/学校信息 */}
      {watchOccupation && watchOccupation !== '' && (
        <fieldset className="question-section">
          <div className="question-row">
            <div className="question-column">
              <div className="highlighted-block">
                <div style={{ marginBottom: '24px' }}>
                  <QuestionItem
                    question="当前工作单位或学校的名称"
                    name="employerSchoolName"
                    required={true}
                  >
                    <Input 
                      style={{ width: '99%' }} 
                      maxLength={75}
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
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={40}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="街道地址（第二行）"
                      name="employerAddressLine2"
                      required={false}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={40}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="城市"
                      name="employerCity"
                      required={true}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={20}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="州/省份"
                      name="employerState"
                      required={true}
                      hasNaCheckbox={true}
                      naCheckboxName="employerState_na"
                      inlineCheckbox={true}
                    >
                      <Input 
                        style={{ width: '90%' }} 
                        maxLength={20}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="邮政区域/邮政编码"
                      name="employerPostalCode"
                      required={true}
                      hasNaCheckbox={true}
                      naCheckboxName="employerPostalCode_na"
                      inlineCheckbox={true}
                    >
                      <Input 
                        style={{ width: '90%' }} 
                        maxLength={10}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="电话号码"
                      name="employerPhone"
                      required={true}
                    >
                      <Input 
                        style={{ width: '65%' }} 
                        maxLength={15}
                        placeholder="例如：5555555555"
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="国家/地区"
                      name="employerCountry"
                      required={true}
                    >
                      <Select 
                        style={{ width: '95%' }} 
                        options={countryOptions}
                        placeholder="- 请选择一个 -"
                      />
                    </QuestionItem>
                  </div>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <QuestionItem
                    question="开始日期"
                  >
                    <DateInput
                      dayName="employerStartDay"
                      monthName="employerStartMonth"
                      yearName="employerStartYear"
                    />
                  </QuestionItem>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <QuestionItem
                    question="月收入（如有工作，当地货币）"
                    name="monthlySalary"
                    required={true}
                    hasNaCheckbox={true}
                    naCheckboxName="monthlySalary_na"
                    inlineCheckbox={true}
                  >
                    <Input 
                      style={{ width: '90%' }} 
                      maxLength={15}
                    />
                  </QuestionItem>
                </div>
                
                <div>
                  <p>请简单说明你的职责：</p>
                  <Form.Item
                    name="jobDuties"
                    noStyle
                  >
                    <TextArea 
                      style={{ width: '99%' }} 
                      rows={4} 
                      maxLength={4000}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="explanation-column">
              <h4 className="help-header">帮助：工作/学校信息</h4>
              <p>请提供您当前工作单位或学校的详细信息。如果您是学生，请填写您就读的学校信息。如果您已退休或未就业，请填写您最后工作的单位信息。</p>
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
};

export default WorkEducation;
