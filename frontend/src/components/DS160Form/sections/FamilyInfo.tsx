import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Radio, DatePicker, Checkbox, Button, Space, Divider } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { relationshipOptions, usStatusOptions } from '../utils/formOptions';

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
  
  // 管理亲属列表
  const [relatives, setRelatives] = useState<number[]>([0]);
  
  // 添加亲属
  const addRelative = () => {
    setRelatives([...relatives, relatives.length]);
  };
  
  // 移除亲属
  const removeRelative = (index: number) => {
    if (relatives.length > 1) {
      const newRelatives = [...relatives];
      newRelatives.splice(index, 1);
      setRelatives(newRelatives);
      
      // 清除表单中该亲属的数据
      form.setFieldsValue({
        [`relativeSurname_${index}`]: undefined,
        [`relativeGivenName_${index}`]: undefined,
        [`relativeRelationship_${index}`]: undefined,
        [`relativeStatus_${index}`]: undefined
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
        <h4 style={{ marginBottom: '10px' }}>
          <span>父亲的全名和出生日期</span>
        </h4>
        
        <div className="question-row">
          <div className="question-column">
            <div className="highlighted-block">
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="姓氏"
                  name="fatherSurname"
                  required={true}
                  hasNaCheckbox={true}
                  naCheckboxName="fatherSurnameNotKnown"
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                    disabled={!!watchFatherSurnameNotKnown}
                    placeholder={!!watchFatherSurnameNotKnown ? '' : '请输入父亲姓氏'}
                  />
                </QuestionItem>
                <div className="hint">
                  <span>(例如：Hernandez Garcia)</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="名字"
                  name="fatherGivenName"
                  required={true}
                  hasNaCheckbox={true}
                  naCheckboxName="fatherGivenNameNotKnown"
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                    disabled={!!watchFatherGivenNameNotKnown}
                    placeholder={!!watchFatherGivenNameNotKnown ? '' : '请输入父亲名字'}
                  />
                </QuestionItem>
                <div className="hint">
                  <span>(例如：Juan Miguel)</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="出生日期"
                  name="fatherDob"
                  required={true}
                  hasNaCheckbox={true}
                  naCheckboxName="fatherDobNotKnown"
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="DD-MMM-YYYY"
                    disabled={!!watchFatherDobNotKnown}
                    placeholder={!!watchFatherDobNotKnown ? '' : '请选择日期'}
                  />
                </QuestionItem>
                <div className="hint">
                  <span>(格式：DD-MMM-YYYY)</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="您的父亲是否在美国？"
                  name="fatherInUs"
                  required={true}
                >
                  <Radio.Group>
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
                      <Select style={{ width: '100%' }}>
                        {usStatusOptions.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </QuestionItem>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 母亲信息部分 */}
      <fieldset className="question-section">
        <h4 style={{ marginBottom: '10px' }}>
          <span>母亲的全名和出生日期</span>
        </h4>
        
        <div className="question-row">
          <div className="question-column">
            <div className="highlighted-block">
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="姓氏"
                  name="motherSurname"
                  required={true}
                  hasNaCheckbox={true}
                  naCheckboxName="motherSurnameNotKnown"
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                    disabled={!!watchMotherSurnameNotKnown}
                    placeholder={!!watchMotherSurnameNotKnown ? '' : '请输入母亲姓氏'}
                  />
                </QuestionItem>
                <div className="hint">
                  <span>(例如：Hernandez Garcia)</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="名字"
                  name="motherGivenName"
                  required={true}
                  hasNaCheckbox={true}
                  naCheckboxName="motherGivenNameNotKnown"
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                    disabled={!!watchMotherGivenNameNotKnown}
                    placeholder={!!watchMotherGivenNameNotKnown ? '' : '请输入母亲名字'}
                  />
                </QuestionItem>
                <div className="hint">
                  <span>(例如：Juanita Miguel)</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="出生日期"
                  name="motherDob"
                  required={true}
                  hasNaCheckbox={true}
                  naCheckboxName="motherDobNotKnown"
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="DD-MMM-YYYY"
                    disabled={!!watchMotherDobNotKnown}
                    placeholder={!!watchMotherDobNotKnown ? '' : '请选择日期'}
                  />
                </QuestionItem>
                <div className="hint">
                  <span>(格式：DD-MMM-YYYY)</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="您的母亲是否在美国？"
                  name="motherInUs"
                  required={true}
                >
                  <Radio.Group>
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
                      <Select style={{ width: '100%' }}>
                        {usStatusOptions.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </QuestionItem>
                  </div>
                )}
              </div>
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
              <Radio.Group>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {watchHasUsRelatives === 'Y' && (
              <div className="highlighted-block" style={{ marginTop: '16px' }}>
                <h4 style={{ marginBottom: '10px' }}>
                  <span>提供以下信息：</span>
                </h4>
                
                {relatives.map((index) => (
                  <div key={index} className="relative-item" style={{ marginBottom: '24px', padding: '16px', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <QuestionItem
                        question="姓氏"
                        name={`relativeSurname_${index}`}
                        required={true}
                      >
                        <Input 
                          style={{ width: '99%' }} 
                          maxLength={33} 
                          placeholder="请输入亲属姓氏"
                        />
                      </QuestionItem>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <QuestionItem
                        question="名字"
                        name={`relativeGivenName_${index}`}
                        required={true}
                      >
                        <Input 
                          style={{ width: '99%' }} 
                          maxLength={33} 
                          placeholder="请输入亲属名字"
                        />
                      </QuestionItem>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <QuestionItem
                        question="与您的关系"
                        name={`relativeRelationship_${index}`}
                        required={true}
                      >
                        <Select style={{ width: '100%' }} placeholder="请选择关系">
                          <Select.Option value="S">配偶</Select.Option>
                          <Select.Option value="F">未婚夫/未婚妻</Select.Option>
                          <Select.Option value="C">子女</Select.Option>
                          <Select.Option value="B">兄弟姐妹</Select.Option>
                        </Select>
                      </QuestionItem>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <QuestionItem
                        question="亲属的身份"
                        name={`relativeStatus_${index}`}
                        required={true}
                      >
                        <Select style={{ width: '100%' }} placeholder="请选择身份">
                          {usStatusOptions.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </QuestionItem>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {relatives.length > 1 && (
                        <Button onClick={() => removeRelative(index)}>移除</Button>
                      )}
                      {index === relatives.length - 1 && (
                        <Button type="primary" onClick={addRelative}>添加另一个</Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="help-section">
                  <h4 style={{ color: '#891300' }}>帮助：</h4>
                  <h4>直系亲属</h4>
                  <p>指未婚夫/未婚妻、配偶（丈夫/妻子）、子女（儿子/女儿）或兄弟姐妹（兄弟/姐妹）。</p>
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

export default FamilyInfo;
