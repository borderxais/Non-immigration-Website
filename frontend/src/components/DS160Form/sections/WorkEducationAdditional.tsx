import React from 'react';
import { Form, Input, Select, Radio } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { countryOptions } from '../utils/formOptions';
import { FormListFieldData } from 'antd/lib/form/FormList';

interface WorkEducationAdditionalProps {
  form: any;
  readOnly?: boolean;
}

const { TextArea } = Input;

const WorkEducationAdditional: React.FC<WorkEducationAdditionalProps> = ({ form, readOnly = false }) => {
  // 监听各个问题的回答
  const watchHasSpecializedSkills = Form.useWatch('hasSpecializedSkills', form);
  const watchBelongsToOrganizations = Form.useWatch('belongsToOrganizations', form);
  const watchHasMilitaryExperience = Form.useWatch('hasMilitaryExperience', form);
  const watchHasArmedForcesMembership = Form.useWatch('hasArmedForcesMembership', form);
  const watchHasRebelGroupMembership = Form.useWatch('hasRebelGroupMembership', form);
  const watchHasWeaponsTraining = Form.useWatch('hasWeaponsTraining', form);
  
  // 处理各个问题的变化，当选择"否"时清除相关字段
  const handleHasSpecializedSkillsChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        specializedSkills: undefined
      });
    }
  };
  
  const handleBelongsToOrganizationsChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        organizations: undefined
      });
    }
  };
  
  const handleHasMilitaryExperienceChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        militaryExperiences: undefined
      });
    }
  };
  
  const handleHasArmedForcesMembershipChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        armedForcesExplanation: undefined
      });
    }
  };
  
  const handleHasRebelGroupMembershipChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        rebelGroups: undefined
      });
    }
  };
  
  const handleHasWeaponsTrainingChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        weaponsTrainingExplanation: undefined
      });
    }
  };
  
  return (
    <div className="ds160-section">
      <h2>额外工作/教育/培训信息</h2>
      
      <div className="note" style={{ border: '1px solid #ccc', padding: '10px' }}>
        <h3>注意: 请提供有关您的专业技能、组织成员资格和军事经验的信息。</h3>
      </div>
      
      {/* 专业技能 */}
      <fieldset className="question-section" style={{marginTop: '20px'}}>
        <div className="question-row">
          <div className="question-column">
            <h4>请列出您掌握的所有语言：</h4>
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
                        question="语言"
                        name={[field.name, 'language']}
                        required={true}
                      >
                        <Input 
                          style={{ width: '99%' }} 
                          maxLength={75}
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
      
      {/* 专业技能 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否有任何专业技能或培训，例如防火武器、爆炸物、核能、生物或化学经验？"
              name="hasSpecializedSkills"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleHasSpecializedSkillsChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的可重复表单项 */}
            {watchHasSpecializedSkills === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供专业技能或培训的详细信息：</h4>
                <RepeatableFormItem
                  name="specializedSkills"
                  addButtonText="增加另一个"
                  removeButtonText="移走"
                >
                  {(field: FormListFieldData) => {
                    return (
                      <>
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="技能或培训类型"
                            name={[field.name, 'skillType']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="描述"
                            name={[field.name, 'skillDescription']}
                            required={true}
                          >
                            <TextArea 
                              style={{ width: '99%' }} 
                              rows={4} 
                              maxLength={4000}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="获得年份"
                            name={[field.name, 'yearAcquired']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '95%' }} 
                              maxLength={4}
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
              question="您是否属于任何专业、社会或慈善组织？"
              name="belongsToOrganizations"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleBelongsToOrganizationsChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的可重复表单项 */}
            {watchBelongsToOrganizations === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供组织的详细信息：</h4>
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
                            question="组织名称"
                            name={[field.name, 'organizationName']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="组织类型"
                            name={[field.name, 'organizationType']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={75}
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
      
      {/* 军事经验 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否有任何军事经验？"
              name="hasMilitaryExperience"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleHasMilitaryExperienceChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的可重复表单项 */}
            {watchHasMilitaryExperience === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供军事经验的详细信息：</h4>
                <RepeatableFormItem
                  name="militaryExperiences"
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
                              style={{ width: '95%' }} 
                              options={countryOptions}
                              placeholder="- 请选择 -"
                              showSearch
                              filterOption={(input, option) => 
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="军种"
                            name={[field.name, 'serviceBranch']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="军衔/职位"
                            name={[field.name, 'rank']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="军事专业"
                            name={[field.name, 'specialty']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="服役开始日期"
                          >
                            <DateInput
                              dayName={[field.name, 'serviceStartDay']}
                              monthName={[field.name, 'serviceStartMonth']}
                              yearName={[field.name, 'serviceStartYear']}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="服役结束日期"
                          >
                            <DateInput
                              dayName={[field.name, 'serviceEndDay']}
                              monthName={[field.name, 'serviceEndMonth']}
                              yearName={[field.name, 'serviceEndYear']}
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
      
      {/* 武装部队成员资格 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经是准军事部队、安全部队、警察部队、民兵或叛乱组织的成员？"
              name="hasArmedForcesMembership"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleHasArmedForcesMembershipChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的解释字段 */}
            {watchHasArmedForcesMembership === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h3>解释说明：</h3>
                <div className="highlighted-block">
                  <Form.Item
                    name="armedForcesExplanation"
                    noStyle
                  >
                    <TextArea 
                      style={{ width: '99%' }} 
                      rows={4} 
                      maxLength={4000}
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
      
      {/* 叛乱组织成员资格 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经是叛乱组织、游击队或武装团体的成员？"
              name="hasRebelGroupMembership"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleHasRebelGroupMembershipChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的可重复表单项 */}
            {watchHasRebelGroupMembership === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供组织的详细信息：</h4>
                <RepeatableFormItem
                  name="rebelGroups"
                  addButtonText="增加另一个"
                  removeButtonText="移走"
                >
                  {(field: FormListFieldData) => {
                    return (
                      <>
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="组织名称"
                            name={[field.name, 'groupName']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="国家/地区"
                            name={[field.name, 'country']}
                            required={true}
                          >
                            <Select 
                              style={{ width: '95%' }} 
                              options={countryOptions}
                              placeholder="- 请选择 -"
                              showSearch
                              filterOption={(input, option) => 
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="您在组织中的角色"
                            name={[field.name, 'role']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={75}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="成员资格开始日期"
                          >
                            <DateInput
                              dayName={[field.name, 'membershipStartDay']}
                              monthName={[field.name, 'membershipStartMonth']}
                              yearName={[field.name, 'membershipStartYear']}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="成员资格结束日期"
                          >
                            <DateInput
                              dayName={[field.name, 'membershipEndDay']}
                              monthName={[field.name, 'membershipEndMonth']}
                              yearName={[field.name, 'membershipEndYear']}
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
      
      {/* 武器培训 */}
      <fieldset className="question-section" style={{marginTop: '30px'}}>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否接受过任何类型的武器培训？"
              name="hasWeaponsTraining"
              required={true}
            >
              <Radio.Group disabled={readOnly} onChange={handleHasWeaponsTrainingChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {/* 当选择"是"时显示的解释字段 */}
            {watchHasWeaponsTraining === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h3>解释说明：</h3>
                <div className="highlighted-block">
                  <Form.Item
                    name="weaponsTrainingExplanation"
                    noStyle
                  >
                    <TextArea 
                      style={{ width: '99%' }} 
                      rows={4} 
                      maxLength={4000}
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
    </div>
  );
};

export default WorkEducationAdditional;
