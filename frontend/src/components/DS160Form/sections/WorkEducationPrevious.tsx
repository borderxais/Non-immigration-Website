import React from 'react';
import { Form, Input, Select, Radio } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { permanentResidenceOptions } from '../utils/formOptions';
import { FormListFieldData } from 'antd/lib/form/FormList';
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
  englishNameValidator,
  englishNamePatternMessage
} from '../utils/validationRules';

interface WorkEducationPreviousProps {
  form: any;
  readOnly?: boolean;
}


const { TextArea } = Input;

const WorkEducationPrevious: React.FC<WorkEducationPreviousProps> = ({ form, readOnly = false }) => {
  // 监听是否有过往工作
  const watchPreviouslyEmployed = Form.useWatch('previouslyEmployed', form);
  
  // 监听是否上过学
  const watchAttendedEducation = Form.useWatch('attendedEducation', form);

  // 监听申请人出生日期
  const formValues = form.getFieldsValue(true);
  const dobData = formValues?.dob;
  const birthDate = dobData ? {
    day: dobData.day,
    month: dobData.month,
    year: dobData.year
  } : undefined;
  
  // 处理是否有过往工作的变化
  const handlePreviouslyEmployedChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      // 如果选择"否"，清除所有相关字段
      form.setFieldsValue({
        previousEmployments: undefined
      });
    }
  };
  
  // 处理是否上过学的变化
  const handleAttendedEducationChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      // 如果选择"否"，清除所有相关字段
      form.setFieldsValue({
        previousEducations: undefined
      });
    }
  };
  
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
              <Radio.Group disabled={readOnly} onChange={handlePreviouslyEmployedChange}>
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
                  maxItems={3}
                >
                  {(field: FormListFieldData, listName: string) => {
                    return (
                      <>
                              <div style={{ marginBottom: '24px' }}>
                                <QuestionItem
                                  question="单位名称"
                                  name={[field.name, 'employerName']}
                                  required={true}
                            validator={organizationNameValidator}
                            validatorMessage={organizationNamePatternMessage}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <h4>单位地址：</h4>
                        <div className="block-inside-highlight">
                          <div style={{ marginBottom: '24px' }}>
                            <QuestionItem
                              question="街道地址（第一行）"
                              name={[field.name, 'employerAddressLine1']}
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
                              name={[field.name, 'employerAddressLine2']}
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
                              name={[field.name, 'employerCity']}
                              required={true}
                              validator={locationValidator}
                              validatorMessage={locationPatternMessage}
                            >
                              <Input 
                                style={{ width: '99%' }} 
                                maxLength={maxLengths.city}
                                disabled={readOnly}
                              />
                            </QuestionItem>

                            <QuestionItem
                              question="州/省份"
                              name={[field.name, 'employerState']}
                              required={true}
                              hasNaCheckbox={true}
                              naCheckboxName={[field.name, 'employerState_na']}
                              parentFieldName="previousEmployments"
                              validator={locationValidator}
                              validatorMessage={locationPatternMessage}
                            >
                              <Input 
                                maxLength={maxLengths.state}
                              />
                            </QuestionItem>

                            <QuestionItem
                              question="邮政区域/邮政编码"
                              name={[field.name, 'employerPostalCode']}
                              required={true}
                              hasNaCheckbox={true}
                              naCheckboxName={[field.name, 'employerPostalCode_na']}
                              inlineCheckbox={true}
                              parentFieldName="previousEmployments"
                              validator={locationValidator}
                              validatorMessage={locationPatternMessage}
                            >
                              <Input 
                                style={{ width: '90%' }} 
                                maxLength={maxLengths.zipCode}
                              />
                            </QuestionItem>

                            <QuestionItem
                              question="国家/地区"
                              name={[field.name, 'employerCountry']}
                              required={true}
                            >
                              <Select 
                                showSearch
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                                style={{ width: '95%' }} 
                                options={permanentResidenceOptions}
                                placeholder="- 请选择 -"
                                disabled={readOnly}
                              />
                            </QuestionItem>

                            <QuestionItem
                              question="电话号码"
                              name={[field.name, 'employerPhone']}
                              required={true}
                              validator={numericValidator}
                              validatorMessage={numericPatternMessage}
                            >
                              <Input 
                                style={{ width: '65%' }} 
                                maxLength={maxLengths.phone}
                                minLength={5}
                                disabled={readOnly}
                              />
                            </QuestionItem>
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="职务名称"
                            name={[field.name, 'jobTitle']}
                            required={true}
                            validator={organizationNameValidator}
                            validatorMessage={organizationNamePatternMessage}
                          >
                            <Input 
                              style={{ width: '95%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="主管姓氏"
                            name={[field.name, 'supervisorSurname']}
                            required={true}
                            hasNaCheckbox={true}
                            naCheckboxName={[field.name, 'supervisorSurname_na']}
                            inlineCheckbox={true}
                            parentFieldName="previousEmployments"
                            validator={englishNameValidator}
                            validatorMessage={englishNamePatternMessage}
                          >
                            <Input 
                              style={{ width: '100%' }} 
                              maxLength={maxLengths.name}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="主管名字"
                            name={[field.name, 'supervisorGivenName']}
                            required={true}
                            hasNaCheckbox={true}
                            naCheckboxName={[field.name, 'supervisorGivenName_na']}
                            inlineCheckbox={true}
                            parentFieldName="previousEmployments"
                            validator={englishNameValidator}
                            validatorMessage={englishNamePatternMessage}
                          >
                            <Input 
                              style={{ width: '100%' }} 
                              maxLength={maxLengths.name}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="工作开始日期"
                            name={[field.name, 'employmentStart']}
                          >
                            <DateInput
                              dayName={[field.name, 'employmentStart', 'day']}
                              monthName={[field.name, 'employmentStart', 'month']}
                              yearName={[field.name, 'employmentStart', 'year']}
                              disabled={readOnly}
                              listName={listName}
                              validateNotEarlierThanBirthDate={true}
                              validateEarlierThanToday={true}
                              birthDate={birthDate}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="工作结束日期"
                            name={[field.name, 'employmentEnd']}
                          >
                            <DateInput
                              dayName={[field.name, 'employmentEnd', 'day']}
                              monthName={[field.name, 'employmentEnd', 'month']}
                              yearName={[field.name, 'employmentEnd', 'year']}
                              disabled={readOnly}
                              listName={listName}
                              validateEarlierThanToday={true}
                              validateNotEarlierThanStartDate={true}
                              startDate={{
                                day: form.getFieldValue([listName, field.name, 'employmentStart', 'day']),
                                month: form.getFieldValue([listName, field.name, 'employmentStart', 'month']),
                                year: form.getFieldValue([listName, field.name, 'employmentStart', 'year'])
                              }}
                            />
                          </QuestionItem>

                          <h3>请简单说明你的职责：</h3>
                          <Form.Item
                            name={[field.name, 'jobDuties']}
                            >
                            <TextArea 
                              style={{ width: '99%' }} 
                              rows={4} 
                              maxLength={maxLengths.explanation}
                              disabled={readOnly}
                              required={true}
                            />
                          </Form.Item>
                        </div>
                      </>
                    );
                  }}
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
              <Radio.Group disabled={readOnly} onChange={handleAttendedEducationChange}>
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
                  {(field: FormListFieldData, listName: string) => {
                    return (
                      <>
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="机构名称"
                            name={[field.name, 'institutionName']}
                            required={true}
                            validator={organizationNameValidator}
                            validatorMessage={organizationNamePatternMessage}
                          >
                            <Input 
                              style={{ width: '95%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="街道地址（第一行）"
                            name={[field.name, 'institutionAddressLine1']}
                            required={true}
                            validator={addressValidator}
                            validatorMessage={addressPatternMessage}
                          >
                            <Input 
                              style={{ width: '95%' }} 
                              maxLength={maxLengths.address}
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="街道地址（第二行）"
                            name={[field.name, 'institutionAddressLine2']}
                            required={false}
                            validator={addressValidator}
                            validatorMessage={addressPatternMessage}
                          >
                            <Input 
                              style={{ width: '95%' }} 
                              maxLength={maxLengths.address}
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="城市"
                            name={[field.name, 'institutionCity']}
                            required={true}
                            validator={locationValidator}
                            validatorMessage={locationPatternMessage}
                          >
                            <Input 
                              style={{ width: '95%' }} 
                              maxLength={maxLengths.city}
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="州/省份"
                            name={[field.name, 'institutionState']}
                            required={true}
                            hasNaCheckbox={true}
                            naCheckboxName={[field.name, 'institutionState_na']}
                            inlineCheckbox={true}
                            parentFieldName="previousEducations"
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
                            name={[field.name, 'institutionPostalCode']}
                            required={true}
                            hasNaCheckbox={true}
                            naCheckboxName={[field.name, 'institutionPostalCode_na']}
                            inlineCheckbox={true}
                            parentFieldName="previousEducations"
                            validator={locationValidator}
                            validatorMessage={locationPatternMessage}
                          >
                            <Input 
                              style={{ width: '90%' }} 
                              maxLength={maxLengths.zipCode}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="国家/地区"
                            name={[field.name, 'institutionCountry']}
                            required={true}
                          >
                            <Select 
                              showSearch
                              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                              style={{ width: '95%' }} 
                              options={permanentResidenceOptions}
                              placeholder="- 请选择 -"
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="课程"
                            name={[field.name, 'courseOfStudy']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '95%' }} 
                              maxLength={maxLengths.organizationName}
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="就读开始日期"
                            name={[field.name, 'attendanceStart']}
                          >
                            <DateInput
                              dayName={[field.name, 'attendanceStart', 'day']}
                              monthName={[field.name, 'attendanceStart', 'month']}
                              yearName={[field.name, 'attendanceStart', 'year']}
                              disabled={readOnly}
                              listName={listName}
                              validateEarlierThanToday={true}
                              validateNotEarlierThanBirthDate={true}
                              birthDate={birthDate}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="就读结束日期"
                            name={[field.name, 'attendanceEnd']}
                          >
                            <DateInput
                              dayName={[field.name, 'attendanceEnd', 'day']}
                              monthName={[field.name, 'attendanceEnd', 'month']}
                              yearName={[field.name, 'attendanceEnd', 'year']}
                              disabled={readOnly}
                              listName={listName}
                              validateEarlierThanToday={true}
                              validateNotEarlierThanStartDate={true}
                              startDate={{
                                day: form.getFieldValue([listName, field.name, 'attendanceStart', 'day']),
                                month: form.getFieldValue([listName, field.name, 'attendanceStart', 'month']),
                                year: form.getFieldValue([listName, field.name, 'attendanceStart', 'year'])
                              }}
                            />
                          </QuestionItem>
                        </div>
                      </>
                    );
                  }}
                </RepeatableFormItem>
              </div>
            )}
          </div>
          <div className="explanation-column">
            {watchAttendedEducation === 'Y' && (
              <>
                <h4 className="help-header">帮助：教育程度</h4>
                <p>如果您曾上过高中/职业学校（或相当于本国这个程度的教育院校）、或大专、大学、研究生学校、博士项目或职业项目等，不管多长时间，您对这个问题均须回答"是"。</p>
                
                <div style={{ marginTop: '310px' }}>
                  <h4 className="help-header">帮助：课程</h4>
                  <p>对于中学/初中或高中阶段的课程，请注明是"学术性"的，或者是"职业性"的。对于其它程度的教育，请注明其专业或主要学习方向。</p>
                </div>
              </>
            )}
          </div>
        </div>
      </fieldset>
    </div>
  );
};


export default WorkEducationPrevious;
