import React, { useState } from 'react';
import { Form, Input, Select, Radio, Checkbox } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { countryOptions } from '../utils/formOptions';

interface WorkEducationPreviousProps {
  form: any;
}

const { TextArea } = Input;

const WorkEducationPrevious: React.FC<WorkEducationPreviousProps> = ({ form }) => {
  // 监听是否有过往工作
  const watchPreviouslyEmployed = Form.useWatch('previouslyEmployed', form);
  
  // 监听是否上过学
  const watchAttendedEducation = Form.useWatch('attendedEducation', form);
  
  // 监听主管姓氏不知道
  const [supervisorSurnameNotKnown, setSupervisorSurnameNotKnown] = useState(false);
  const [supervisorGivenNameNotKnown, setSupervisorGivenNameNotKnown] = useState(false);
  
  return (
    <div className="ds160-section">
      <h2>以往工作/教育/培训信息</h2>
      
      <div className="note" style={{ border: '1px solid #ccc', padding: '10px' }}>
        <h3>注意: 如果您在过去的五年里曾就业,请提供这五年的就业信息（如适用）。</h3>
      </div>
      
      {/* 以往工作经历 */}
      <fieldset className="question-section" style={{marginTop: '20px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您之前有工作吗？"
              name="previouslyEmployed"
              required={true}
            >
              <Radio.Group>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的可重复表单项 */}
            {watchPreviouslyEmployed === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>单位/工作信息：</h4>
                <RepeatableFormItem
                  name="previousEmployments"
                  addButtonText="增加另一个"
                  removeButtonText="移走"
                >
                  {(field) => (
                    <>
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="单位名称"
                          name="employerName"
                          required={true}
                          parentFieldName={`previousEmployments.${field.name}`}
                        >
                          <Input 
                            style={{ width: '99%' }} 
                            maxLength={75}
                          />
                        </QuestionItem>
                      </div>
                      
                      <h4>单位地址：</h4>
                      <div className="block-inside-highlight">
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="街道地址（第一行）"
                            name="employerAddressLine1"
                            required={true}
                            parentFieldName={`previousEmployments.${field.name}`}
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
                            parentFieldName={`previousEmployments.${field.name}`}
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
                            parentFieldName={`previousEmployments.${field.name}`}
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
                            parentFieldName={`previousEmployments.${field.name}`}
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
                            parentFieldName={`previousEmployments.${field.name}`}
                          >
                            <Input 
                              style={{ width: '90%' }} 
                              maxLength={10}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="国家/地区"
                            name="employerCountry"
                            required={true}
                            parentFieldName={`previousEmployments.${field.name}`}
                          >
                            <Select 
                              style={{ width: '95%' }} 
                              options={countryOptions}
                              placeholder="- 请选择一个 -"
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="电话号码"
                            name="employerPhone"
                            required={true}
                            parentFieldName={`previousEmployments.${field.name}`}
                          >
                            <Input 
                              style={{ width: '65%' }} 
                              maxLength={15}
                              placeholder="例如：5555555555"
                            />
                          </QuestionItem>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="职务名称"
                          name="jobTitle"
                          required={true}
                          parentFieldName={`previousEmployments.${field.name}`}
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            maxLength={75}
                          />
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="主管姓氏"
                          name="supervisorSurname"
                          required={!supervisorSurnameNotKnown}
                          parentFieldName={`previousEmployments.${field.name}`}
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            maxLength={33}
                            disabled={supervisorSurnameNotKnown}
                          />
                        </QuestionItem>
                        <div style={{ textAlign: 'right', marginTop: '5px' }}>
                          <Form.Item
                            name={[`previousEmployments`, field.name, 'supervisorSurname_na']}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox 
                              onChange={(e) => setSupervisorSurnameNotKnown(e.target.checked)}
                            >
                              未知
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="主管名字"
                          name="supervisorGivenName"
                          required={!supervisorGivenNameNotKnown}
                          parentFieldName={`previousEmployments.${field.name}`}
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            maxLength={33}
                            disabled={supervisorGivenNameNotKnown}
                          />
                        </QuestionItem>
                        <div style={{ textAlign: 'right', marginTop: '5px' }}>
                          <Form.Item
                            name={[`previousEmployments`, field.name, 'supervisorGivenName_na']}
                            valuePropName="checked"
                            noStyle
                          >
                            <Checkbox 
                              onChange={(e) => setSupervisorGivenNameNotKnown(e.target.checked)}
                            >
                              未知
                            </Checkbox>
                          </Form.Item>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="工作开始日期"
                          parentFieldName={`previousEmployments.${field.name}`}
                        >
                          <DateInput
                            dayName={`previousEmployments.${field.name}.employmentStartDay`}
                            monthName={`previousEmployments.${field.name}.employmentStartMonth`}
                            yearName={`previousEmployments.${field.name}.employmentStartYear`}
                          />
                        </QuestionItem>
                        <div className="hint">
                          <span>(格式: DD-MMM-YYYY)</span>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="工作结束日期"
                          parentFieldName={`previousEmployments.${field.name}`}
                        >
                          <DateInput
                            dayName={`previousEmployments.${field.name}.employmentEndDay`}
                            monthName={`previousEmployments.${field.name}.employmentEndMonth`}
                            yearName={`previousEmployments.${field.name}.employmentEndYear`}
                          />
                        </QuestionItem>
                        <div className="hint">
                          <span>(格式: DD-MMM-YYYY)</span>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="请简要描述您的工作职责："
                          name="jobDuties"
                          required={true}
                          parentFieldName={`previousEmployments.${field.name}`}
                        >
                          <TextArea 
                            style={{ width: '99%' }} 
                            rows={4} 
                            maxLength={4000}
                          />
                        </QuestionItem>
                      </div>
                    </>
                  )}
                </RepeatableFormItem>
              </div>
            )}
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 教育经历 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否在任何相当于中学水平或以上的教育机构里学习过？"
              name="attendedEducation"
              required={true}
            >
              <Radio.Group>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的可重复表单项 */}
            {watchAttendedEducation === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请回答以下有关您曾学习过的教育机构的信息。</h4>
                <RepeatableFormItem
                  name="previousEducations"
                  addButtonText="增加另一个"
                  removeButtonText="移走"
                >
                  {(field) => (
                    <>
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="机构名称"
                          name="institutionName"
                          required={true}
                          parentFieldName={`previousEducations.${field.name}`}
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            maxLength={75}
                          />
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="街道地址（第一行）"
                          name="institutionAddressLine1"
                          required={true}
                          parentFieldName={`previousEducations.${field.name}`}
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            maxLength={40}
                          />
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="街道地址（第二行）"
                          name="institutionAddressLine2"
                          required={false}
                          parentFieldName={`previousEducations.${field.name}`}
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            maxLength={40}
                          />
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="城市"
                          name="institutionCity"
                          required={true}
                          parentFieldName={`previousEducations.${field.name}`}
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            maxLength={20}
                          />
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="州/省份"
                          name="institutionState"
                          required={true}
                          hasNaCheckbox={true}
                          naCheckboxName="institutionState_na"
                          inlineCheckbox={true}
                          parentFieldName={`previousEducations.${field.name}`}
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
                          name="institutionPostalCode"
                          required={true}
                          hasNaCheckbox={true}
                          naCheckboxName="institutionPostalCode_na"
                          inlineCheckbox={true}
                          parentFieldName={`previousEducations.${field.name}`}
                        >
                          <Input 
                            style={{ width: '90%' }} 
                            maxLength={10}
                          />
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="国家/地区"
                          name="institutionCountry"
                          required={true}
                          parentFieldName={`previousEducations.${field.name}`}
                        >
                          <Select 
                            style={{ width: '95%' }} 
                            options={countryOptions}
                            placeholder="- 请选择一个 -"
                          />
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="课程"
                          name="courseOfStudy"
                          required={true}
                          parentFieldName={`previousEducations.${field.name}`}
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            maxLength={66}
                          />
                        </QuestionItem>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="就读开始日期"
                          parentFieldName={`previousEducations.${field.name}`}
                        >
                          <DateInput
                            dayName={`previousEducations.${field.name}.attendanceStartDay`}
                            monthName={`previousEducations.${field.name}.attendanceStartMonth`}
                            yearName={`previousEducations.${field.name}.attendanceStartYear`}
                          />
                        </QuestionItem>
                        <div className="hint">
                          <span>(格式: DD-MMM-YYYY)</span>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <QuestionItem
                          question="就读结束日期"
                          parentFieldName={`previousEducations.${field.name}`}
                        >
                          <DateInput
                            dayName={`previousEducations.${field.name}.attendanceEndDay`}
                            monthName={`previousEducations.${field.name}.attendanceEndMonth`}
                            yearName={`previousEducations.${field.name}.attendanceEndYear`}
                          />
                        </QuestionItem>
                        <div className="hint">
                          <span>(格式: DD-MMM-YYYY)</span>
                        </div>
                      </div>
                    </>
                  )}
                </RepeatableFormItem>
              </div>
            )}
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：教育程度</h4>
            <p>如果您曾上过高中/职业学校（或相当于本国这个程度的教育院校）、或大专、大学、研究生学校、博士项目或职业项目等，不管多长时间，您对这个问题均须回答"是"。</p>
            
            <div style={{ marginTop: '310px' }}>
              <h4 className="help-header">帮助：课程</h4>
              <p>对于中学/初中或高中阶段的课程，请注明是"学术性"的，或者是"职业性"的。对于其它程度的教育，请注明其专业或主要学习方向。</p>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default WorkEducationPrevious;
