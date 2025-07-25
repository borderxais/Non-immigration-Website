import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Radio } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { militaryServiceCountryOptions, permanentResidenceOptions } from '../utils/formOptions';
import { FormListFieldData } from 'antd/lib/form/FormList';
import {
  maxLengths,
  organizationNameValidator, 
  organizationNamePatternMessage,
} from '../utils/validationRules';

interface WorkEducationAdditionalProps {
  form: any;
  readOnly?: boolean;
  formValues?: any;
}

const { TextArea } = Input;

const WorkEducationAdditional: React.FC<WorkEducationAdditionalProps> = ({ form, readOnly = false, formValues }) => {
  // State variables for conditional rendering
  const [clanTribeInd, setClanTribeInd] = useState<string>(formValues?.clanTribeInd || '');
  const [countriesVisitedInd, setCountriesVisitedInd] = useState<string>(formValues?.countriesVisitedInd || '');
  const [organizationInd, setOrganizationInd] = useState<string>(formValues?.organizationInd || '');
  const [specializedSkillsInd, setSpecializedSkillsInd] = useState<string>(formValues?.specializedSkillsInd || '');
  const [militaryServiceInd, setMilitaryServiceInd] = useState<string>(formValues?.militaryServiceInd || '');
  const [insurgentOrgInd, setInsurgentOrgInd] = useState<string>(formValues?.insurgentOrgInd || '');
  const [talibanMemberInd, setTalibanMemberInd] = useState<string>(formValues?.talibanMemberInd || '');
  
  // Watch form field changes
  const watchClanTribeInd = Form.useWatch('clanTribeInd', form);
  const watchCountriesVisitedInd = Form.useWatch('countriesVisitedInd', form);
  const watchOrganizationInd = Form.useWatch('organizationInd', form);
  const watchSpecializedSkillsInd = Form.useWatch('specializedSkillsInd', form);
  const watchMilitaryServiceInd = Form.useWatch('militaryServiceInd', form);
  const watchInsurgentOrgInd = Form.useWatch('insurgentOrgInd', form);
  const watchTalibanMemberInd = Form.useWatch('talibanMemberInd', form);
  
  // Update state when form values change
  useEffect(() => {
    if (formValues) {
      setClanTribeInd(formValues.clanTribeInd || '');
      setCountriesVisitedInd(formValues.countriesVisitedInd || '');
      setOrganizationInd(formValues.organizationInd || '');
      setSpecializedSkillsInd(formValues.specializedSkillsInd || '');
      setMilitaryServiceInd(formValues.militaryServiceInd || '');
      setInsurgentOrgInd(formValues.insurgentOrgInd || '');
      setTalibanMemberInd(formValues.talibanMemberInd || '');
    }
  }, [formValues]);

  // Update state when form field changes
  useEffect(() => {
    setClanTribeInd(watchClanTribeInd || '');
  }, [watchClanTribeInd]);

  useEffect(() => {
    setCountriesVisitedInd(watchCountriesVisitedInd || '');
  }, [watchCountriesVisitedInd]);

  useEffect(() => {
    setOrganizationInd(watchOrganizationInd || '');
  }, [watchOrganizationInd]);

  useEffect(() => {
    setSpecializedSkillsInd(watchSpecializedSkillsInd || '');
  }, [watchSpecializedSkillsInd]);

  useEffect(() => {
    setMilitaryServiceInd(watchMilitaryServiceInd || '');
  }, [watchMilitaryServiceInd]);

  useEffect(() => {
    setInsurgentOrgInd(watchInsurgentOrgInd || '');
  }, [watchInsurgentOrgInd]);

  useEffect(() => {
    setTalibanMemberInd(watchTalibanMemberInd || '');
  }, [watchTalibanMemberInd]);
  
  // 处理各个问题的变化，当选择"否"时清除相关字段
  const handleClanTribeIndChange = (e: any) => {
    const value = e.target.value;
    setClanTribeInd(value);
    if (value === 'N') {
      form.setFieldsValue({
        clanTribeName: undefined
      });
    }
  };
  
  const handleCountriesVisitedIndChange = (e: any) => {
    const value = e.target.value;
    setCountriesVisitedInd(value);
    if (value === 'N') {
      form.setFieldsValue({
        countriesVisited: undefined
      });
    }
  };
  
  const handleOrganizationIndChange = (e: any) => {
    const value = e.target.value;
    setOrganizationInd(value);
    if (value === 'N') {
      form.setFieldsValue({
        organizations: undefined
      });
    }
  };
  
  const handleSpecializedSkillsIndChange = (e: any) => {
    const value = e.target.value;
    setSpecializedSkillsInd(value);
    if (value === 'N') {
      form.setFieldsValue({
        specializedSkillsExpl: undefined
      });
    }
  };
  
  const handleMilitaryServiceIndChange = (e: any) => {
    const value = e.target.value;
    setMilitaryServiceInd(value);
    if (value === 'N') {
      form.setFieldsValue({
        militaryService: undefined
      });
    }
  };
  
  const handleInsurgentOrgIndChange = (e: any) => {
    const value = e.target.value;
    setInsurgentOrgInd(value);
    if (value === 'N') {
      form.setFieldsValue({
        insurgentOrgExpl: undefined
      });
    }
  };

  const handleTalibanMemberIndChange = (e: any) => {
    const value = e.target.value;
    setTalibanMemberInd(value);
    if (value === 'N') {
      form.setFieldsValue({
        talibanMemberExplanation: undefined
      });
    }
  };
  
  return (
    <div className="ds160-section">
      <h2>额外工作/教育/培训信息</h2>
      
      <div className="note" style={{ border: '1px solid #ccc', padding: '10px' }}>
        <h3>注意: 请提供以下有关工作、学历或培训的信息。对于所有要求解释的问题，请提供完整、准确的信息。</h3>
      </div>
      
      {/* 宗族或部落 */}
      <fieldset className="question-section" style={{marginTop: '20px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否属于一个宗族或者部落？"
              name="clanTribeInd"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleClanTribeIndChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的输入框 */}
            {clanTribeInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供以下信息：</h4>
                <div className="highlighted-block">
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="宗族或者部落名称"
                      name="clanTribeName"
                      required={true}
                      validator={organizationNameValidator}
                      validatorMessage={organizationNamePatternMessage}              >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={80}
                        disabled={readOnly}
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
      
      {/* 语言 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <h4>请列出您所说语言的种类</h4>
            <RepeatableFormItem
              name="languages"
              addButtonText="增加另一个"
              removeButtonText="移走"
            >
              {(field: FormListFieldData) => {
                return (
                  <>
                    <div style={{ marginBottom: '24px' }}>
                      <QuestionItem
                        question="语言名字"
                        name={[field.name, 'languageName']}
                        required={true}
                        validator={organizationNameValidator}
                        validatorMessage={organizationNamePatternMessage}
                      >
                        <Input 
                          style={{ width: '99%' }} 
                          maxLength={maxLengths.organizationName}
                          disabled={readOnly}
                        />
                      </QuestionItem>
                    </div>
                  </>
                );
              }}
            </RepeatableFormItem>
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 最近五年里访问的国家 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="最近五年里您是否去过其他国家？"
              name="countriesVisitedInd"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleCountriesVisitedIndChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的可重复表单项 */}
            {countriesVisitedInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请列出您访问过的国家</h4>
                <RepeatableFormItem
                  name="countriesVisited"
                  addButtonText="增加另一个"
                  removeButtonText="移走"
                >
                  {(field: FormListFieldData) => {
                    return (
                      <>
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="国家/地区"
                            name={[field.name, 'country']}
                            required={true}
                          >
                            <Select
                              showSearch
                              filterOption={(input, option) => typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())}
                              style={{ width: '95%' }}
                              options={permanentResidenceOptions}
                              placeholder="- 请选择 -"
                              disabled={readOnly}
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
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 组织成员资格 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否从属于任何一个专业的、社会或慈善组织？并为其做过贡献、或为其工作过？"
              name="organizationInd"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleOrganizationIndChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的可重复表单项 */}
            {organizationInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供机构列表</h4>
                <RepeatableFormItem
                  name="organizations"
                  addButtonText="增加另一个"
                  removeButtonText="移走"
                >
                  {(field: FormListFieldData) => {
                    return (
                      <>
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="机构名称"
                            name={[field.name, 'organizationName']}
                            required={true}
                            validator={organizationNameValidator}
                            validatorMessage={organizationNamePatternMessage}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={maxLengths.organizationName}
                              disabled={readOnly}
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
          <div className="explanation-column"></div>
        </div>
      </fieldset>

      
      
      {/* 专业技能 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否具有特殊技能或接受过特殊培训，例如有关枪械、炸药、核装置、生物或化学方面的经验？"
              name="specializedSkillsInd"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleSpecializedSkillsIndChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的解释字段 */}
            {specializedSkillsInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供详细解释：</h4>
                <div className="highlighted-block">
                  <Form.Item
                    name="specializedSkillsExpl"
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
              </div>
            )}
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 军事经验 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经在军队服役？"
              name="militaryServiceInd"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleMilitaryServiceIndChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的可重复表单项 */}
            {militaryServiceInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供以下信息：</h4>
                <RepeatableFormItem
                  name="militaryService"
                  addButtonText="增加另一个"
                  removeButtonText="移走"
                >
                  {(field: FormListFieldData, listName: string) => {
                    return (
                      <>
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="国家/地区名称"
                            name={[field.name, 'country']}
                            required={true}
                          >
                            <Select 
                              showSearch
                              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                              style={{ width: '95%' }} 
                              options={militaryServiceCountryOptions}
                              placeholder="- 请选择 -"
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="军种"
                            name={[field.name, 'serviceBranch']}
                            required={true}
                            validator={organizationNameValidator}
                            validatorMessage={organizationNamePatternMessage}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={40}
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="级别/职位"
                            name={[field.name, 'rank']}
                            required={true}
                            validator={organizationNameValidator}
                            validatorMessage={organizationNamePatternMessage}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={40}
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="军事特长"
                            name={[field.name, 'specialty']}
                            required={true}
                            validator={organizationNameValidator}
                            validatorMessage={organizationNamePatternMessage}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={40}
                              disabled={readOnly}
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="服役开始日期"
                            name={[field.name, 'serviceFrom']}
                          >
                            <DateInput
                              dayName={[field.name, 'serviceFrom', 'day']}
                              monthName={[field.name, 'serviceFrom', 'month']}
                              yearName={[field.name, 'serviceFrom', 'year']}
                              disabled={readOnly}
                              listName={listName}
                              validateEarlierThanToday={true}
                              validateNotEarlierThanBirthDate={true}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="服役结束日期"
                            name={[field.name, 'serviceTo']}
                          >
                            <DateInput
                              dayName={[field.name, 'serviceTo', 'day']}
                              monthName={[field.name, 'serviceTo', 'month']}
                              yearName={[field.name, 'serviceTo', 'year']}
                              disabled={readOnly}
                              listName={listName}
                              validateEarlierThanToday={true}
                              validateNotEarlierThanStartDate={true}
                              startDate={{
                                day: form.getFieldValue([listName, field.name, 'serviceFrom', 'day']),
                                month: form.getFieldValue([listName, field.name, 'serviceFrom', 'month']),
                                year: form.getFieldValue([listName, field.name, 'serviceFrom', 'year'])
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
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 塔利班成员问题 */}
      <fieldset className="question-section" style={{marginTop: '20px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您曾经是塔利班成员吗？"
              name="talibanMemberInd"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleTalibanMemberIndChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的输入框 */}
            {talibanMemberInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供详细解释：</h4>
                <div className="highlighted-block">
                  <Form.Item
                    name="talibanMemberExplanation"
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
              </div>
            )}
          </div>
          <div className="explanation-column">
          </div>
        </div>
      </fieldset>
      
      {/* 叛乱组织成员资格 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="你是否曾经服务于或参与过准军事性单位、治安团体、造反组织、游击队或暴动组织，或曾经是其成员之一？"
              name="insurgentOrgInd"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleInsurgentOrgIndChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的解释字段 */}
            {insurgentOrgInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>解释</h4>
                <div className="highlighted-block">
                  <Form.Item
                    name="insurgentOrgExpl"
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
              </div>
            )}
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
    </div>
  );
};

export default WorkEducationAdditional;
