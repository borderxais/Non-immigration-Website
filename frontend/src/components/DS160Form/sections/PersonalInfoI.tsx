import React, { useState } from 'react';
import { Input, Select, Radio, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { countryOptions } from '../utils/formOptions';
import { FormListFieldData } from 'antd/lib/form/FormList';
import '../ds160Form.css';  

interface PersonalInfoIProps {
  form: any;
}

const PersonalInfoI: React.FC<PersonalInfoIProps> = ({ form }) => {
  const [hasOtherNames, setHasOtherNames] = useState<boolean>(false);
  const [hasTelecode, setHasTelecode] = useState<boolean>(false);
  const [maritalStatus, setMaritalStatus] = useState<string>('');

  const handleOtherNamesChange = (e: any) => {
    setHasOtherNames(e.target.value === 'Y');
    if (e.target.value === 'N') {
      // Reset all other names fields when selecting No
      form.setFieldsValue({
        otherNames: undefined
      });
    }
  };

  const handleTelecodeChange = (e: any) => {
    setHasTelecode(e.target.value === 'Y');
    if (e.target.value === 'N') {
      // Reset telecode fields when selecting No
      form.setFieldsValue({
        telecode: undefined
      });
    }
  };

  const handleMaritalStatusChange = (value: string) => {
    setMaritalStatus(value);
    // Reset other marital status field if not selecting "Other"
    if (value !== 'O') {  // O for Other
      form.setFieldsValue({
        otherMaritalStatus: undefined  // This matches the Form.Item name="otherMaritalStatus"
      });
    }
  };

  return (
    <div className="personal-infoI-I-section">
      {/* First section - Name fields */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="姓（拼音，与护照一致）"
              name="surname"
            >
              <Input placeholder="例如：ZHANG" />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：姓氏</h4>
            <p>输入您护照上列出的所有姓氏。如果只有一个，请输入这一个。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="名（拼音，与护照一致）"
              name="givenName"
            >
              <Input placeholder="例如：SAN" />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：名字</h4>
            <p>如果您的护照上不包括名字信息，请在名字栏内输入'FNU'。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="全名（本地语言书写）"
              name="fullNameNative"
              hasNaCheckbox={true}
              naCheckboxName="fullNameNative_na"
            >
              <Input placeholder="请用中文填写您的全名" />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：全名（本地语言）</h4>
            <p>请用中文填写您的全名。如不适用/技术不可用，请勾选下方的复选框。</p>
          </div>
        </div>
      </fieldset>

      {/* Second section - Other names & Telecode */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾使用其他姓名？（包括曾用名、英文名、别名等）"
              name="hasOtherNames"
            >
              <Radio.Group onChange={handleOtherNamesChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {hasOtherNames && (
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
                <div>
                  <RepeatableFormItem 
                    name="otherNames" 
                    addButtonText="增加另一个" 
                    removeButtonText="移走"
                  >
                    {(field: FormListFieldData) => {
                      const { key, ...restField } = field;
                      return (
                        <>
                          <Form.Item
                            key={key}
                            {...restField}
                            name={[field.name, 'surname']}
                            label="曾用姓氏"
                            rules={[{ required: true, message: '请输入曾用姓氏' }]}
                            style={{ marginBottom: '16px' }}
                          >
                            <Input style={{ width: '95%' }} maxLength={33} />
                          </Form.Item>
                          
                          <Form.Item
                            key={`${key}-given`}
                            {...restField}
                            name={[field.name, 'givenName']}
                            label="曾用名字"
                            rules={[{ required: true, message: '请输入曾用名字' }]}
                          >
                            <Input style={{ width: '95%' }} maxLength={33} />
                          </Form.Item>
                        </>
                      );
                    }}
                  </RepeatableFormItem>
                </div>
              </>
            )}
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：其它姓名</h4>
            <p>其它姓名包括您的婚前用名, 宗教用名、职业用名; 或任何为人所知的其它名字；或在过去为别人所知的其它名字。</p>
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否有代表您姓名的电码？"
              name="hasTelecode"
            >
              <Radio.Group onChange={handleTelecodeChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {hasTelecode && (
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
                <div className="highlighted-block">
                  <Form.Item
                    name={['telecode', 'surname']}
                    label="姓氏的电码"
                    rules={[{ required: true, message: '请输入姓氏的电码' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input style={{ width: '95%' }} maxLength={20} />
                  </Form.Item>
                  
                  <Form.Item
                    name={['telecode', 'givenName']}
                    label="名字的电码"
                    rules={[{ required: true, message: '请输入名字的电码' }]}
                  >
                    <Input style={{ width: '95%' }} maxLength={20} />
                  </Form.Item>
                </div>
              </>
            )}
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：电码</h4>
            <p>电码由4位数字组成，代表着一些非罗马字母拼写而成的名字的字体。</p>
          </div>
        </div>
      </fieldset>

      {/* Third section - Gender and Marital Status */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="性别"
              name="gender"
            >
              <Select placeholder="选择一个" style={{ width: '98%' }}>
                <Select.Option value="">- 请选择一个 -</Select.Option>
                <Select.Option value="M">男</Select.Option>
                <Select.Option value="F">女</Select.Option>
              </Select>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：性别</h4>
            <p>请选择您的性别，必须与护照上的信息一致。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="婚姻状况"
              name="maritalStatus"
            >
              <Select 
                placeholder="选择一个" 
                style={{ width: '98%' }} 
                onChange={handleMaritalStatusChange}
              >
                <Select.Option value="">- 请选择一个 -</Select.Option>
                <Select.Option value="M">已婚</Select.Option>
                <Select.Option value="C">普通法婚姻</Select.Option>
                <Select.Option value="P">民事结合/同居伴侣关系</Select.Option>
                <Select.Option value="S">未婚</Select.Option>
                <Select.Option value="W">丧偶</Select.Option>
                <Select.Option value="D">离异</Select.Option>
                <Select.Option value="L">合法分居</Select.Option>
                <Select.Option value="O">其他</Select.Option>
              </Select>
            </QuestionItem>

            {maritalStatus === 'O' && (
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
                <div className="highlighted-block">
                  <Form.Item
                    name="otherMaritalStatus"
                    label="请说明您的具体婚姻状况"
                    rules={[{ required: true, message: '请说明您的具体婚姻状况' }]}
                  >
                    <Input.TextArea 
                      style={{ width: '95%' }} 
                      maxLength={500} 
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      placeholder="请详细说明您的婚姻状况"
                    />
                  </Form.Item>
                </div>
              </>
            )}
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：婚姻状况</h4>
            <p>请选择您目前的婚姻状况。</p>
          </div>
        </div>
      </fieldset>

      {/* Fourth section - Birth Date and Place */}
      <fieldset className="question-section">
        <h4 style={{ marginBottom: '10px' }}>
          <span>出生日期与出生地</span>
        </h4>
        <div className="highlighted-block">
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="日期"
              >
                <DateInput 
                  dayName="dobDay" 
                  monthName="dobMonth" 
                  yearName="dobYear"
                />
              </QuestionItem>
            </div>
            <div className="explanation-column">
              <h4 className="help-header">帮助：出生日期</h4>
              <p>若不知道具体日期或月份，请按护照所示填写。</p>
            </div>
          </div>
          
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="城市"
                name="birthCity"
              >
                <Input placeholder="例如：北京" style={{ width: '99%' }} />
              </QuestionItem>
            </div>
            <div className="explanation-column">
              {/* Empty explanation column to maintain layout */}
            </div>
          </div>
          
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="州/省"
                name="birthState"
                hasNaCheckbox={true}
                naCheckboxName="birthState_na"
              >
                <Input placeholder="例如：北京市" style={{ width: '99%' }} />
              </QuestionItem>
            </div>
            <div className="explanation-column">
              {/* Empty explanation column to maintain layout */}
            </div>
          </div>
          
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="国家/地区"
                name="birthCountry"
              >
                <Select options={countryOptions} placeholder="- 选择一个 -" style={{ width: '98%' }} />
              </QuestionItem>
            </div>
            <div className="explanation-column">
              <h4 className="help-header">帮助：出生地国家/地区</h4>
              <p>请选择您出生地的现用国家/地区名称。</p>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default PersonalInfoI;
