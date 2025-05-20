import React from 'react';
import { Form, Input, Select, Radio } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { militaryServiceCountryOptions, permanentResidenceOptions } from '../utils/formOptions';
import { FormListFieldData } from 'antd/lib/form/FormList';

interface WorkEducationAdditionalProps {
  form: any;
  readOnly?: boolean;
}

const { TextArea } = Input;

const WorkEducationAdditional: React.FC<WorkEducationAdditionalProps> = ({ form, readOnly = false }) => {
  // 监听各个问题的回答
  const watchClanTribeInd = Form.useWatch('clanTribeInd', form);
  const watchCountriesVisitedInd = Form.useWatch('countriesVisitedInd', form);
  const watchOrganizationInd = Form.useWatch('organizationInd', form);
  const watchSpecializedSkillsInd = Form.useWatch('specializedSkillsInd', form);
  const watchMilitaryServiceInd = Form.useWatch('militaryServiceInd', form);
  const watchInsurgentOrgInd = Form.useWatch('insurgentOrgInd', form);
  
  // 处理各个问题的变化，当选择"否"时清除相关字段
  const handleClanTribeIndChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        clanTribeName: undefined
      });
    }
  };
  
  const handleCountriesVisitedIndChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        countriesVisited: undefined
      });
    }
  };
  
  const handleOrganizationIndChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        organizations: undefined
      });
    }
  };
  
  const handleSpecializedSkillsIndChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        specializedSkillsExpl: undefined
      });
    }
  };
  
  const handleMilitaryServiceIndChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        militaryService: undefined
      });
    }
  };
  
  const handleInsurgentOrgIndChange = (e: any) => {
    const value = e.target.value;
    if (value === 'N') {
      form.setFieldsValue({
        insurgentOrgExpl: undefined
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
            {watchClanTribeInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供以下信息：</h4>
                <div className="highlighted-block">
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="宗族或者部落名称"
                      name="clanTribeName"
                      required={true}
                    >
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
                      >
                        <Input 
                          style={{ width: '99%' }} 
                          maxLength={66}
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
            {watchCountriesVisitedInd === 'Y' && (
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
                              style={{ width: '95%' }} 
                              options={permanentResidenceOptions}
                              placeholder="- 请选择 -"
                              showSearch
                              filterOption={(input, option) => 
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
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
            {watchOrganizationInd === 'Y' && (
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
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={66}
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
            {watchSpecializedSkillsInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>解释</h4>
                <div className="highlighted-block">
                  <Form.Item
                    name="specializedSkillsExpl"
                    noStyle
                  >
                    <TextArea 
                      style={{ width: '99%' }} 
                      rows={4} 
                      maxLength={4000}
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
            {watchMilitaryServiceInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>请提供以下信息：</h4>
                <RepeatableFormItem
                  name="militaryService"
                  addButtonText="增加另一个"
                  removeButtonText="移走"
                >
                  {(field: FormListFieldData) => {
                    return (
                      <>
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="国家/地区名称"
                            name={[field.name, 'country']}
                            required={true}
                          >
                            <Select 
                              style={{ width: '95%' }} 
                              options={militaryServiceCountryOptions}
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
                              maxLength={40}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="级别/职位"
                            name={[field.name, 'rank']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={40}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="军事特长"
                            name={[field.name, 'specialty']}
                            required={true}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={40}
                              disabled={readOnly}
                            />
                          </QuestionItem>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <QuestionItem
                            question="服役开始日期"
                            name={[field.name, 'serviceFrom']}
                          >
                            <DateInput
                              dayName={[field.name, 'serviceFrom', 'day']}
                              monthName={[field.name, 'serviceFrom', 'month']}
                              yearName={[field.name, 'serviceFrom', 'year']}
                              disabled={readOnly}
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
            {watchInsurgentOrgInd === 'Y' && (
              <div style={{ marginTop: '20px' }}>
                <h4>解释</h4>
                <div className="highlighted-block">
                  <Form.Item
                    name="insurgentOrgExpl"
                    noStyle
                  >
                    <TextArea 
                      style={{ width: '99%' }} 
                      rows={4} 
                      maxLength={4000}
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
