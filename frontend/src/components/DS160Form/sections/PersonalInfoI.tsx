import React, { useState } from 'react';
import { Input, Select, Radio, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { countryOptions } from '../utils/formOptions';
import { FormListFieldData } from 'antd/lib/form/FormList';
import '../ds160Form.css';  // Add this import
interface PersonalInfoIProps {
  form: any;
}

const PersonalInfoI: React.FC<PersonalInfoIProps> = ({ form }) => {
  // Define highlighted block style
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  // State to track if user has other names
  const [hasOtherNames, setHasOtherNames] = useState<boolean | null>(null);
  
  // Handle radio button change for other names
  const handleOtherNamesChange = (e: any) => {
    setHasOtherNames(e.target.value);
    if (!e.target.value) {
      form.setFieldsValue({ otherNames: [] });
    } else if (e.target.value && (!form.getFieldValue('otherNames') || form.getFieldValue('otherNames').length === 0)) {
      form.setFieldsValue({ otherNames: [{ surname: '', givenName: '' }] });
    }
  };

  // State to track if user has telecode
  const [hasTelecode, setHasTelecode] = useState<boolean | null>(null);
  
  // Handle radio button change for telecode
  const handleTelecodeChange = (e: any) => {
    setHasTelecode(e.target.value);
    if (!e.target.value) {
      form.setFieldsValue({ telecodes: [] });
    } else if (e.target.value && (!form.getFieldValue('telecodes') || form.getFieldValue('telecodes').length === 0)) {
      form.setFieldsValue({ telecodes: [{ surname: '', givenName: '' }] });
    }
  };

  return (
    <div className="personal-infoI-I-section">
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
            <h4 style={{ color: '#891300' }}>帮助：姓氏</h4>
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
            <h4 style={{ color: '#891300' }}>帮助：名字</h4>
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
            <h4 style={{ color: '#891300' }}>帮助：全名（本地语言）</h4>
            <p>请用中文填写您的全名。如不适用/技术不可用，请勾选下方的复选框。</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="question-section">
        <div className="section-content">
          <div className="questions-column">
            <QuestionItem
              question="您是否曾使用其他姓名？（包括曾用名、英文名、别名等）"
              name="hasOtherNames"
            >
              <Radio.Group onChange={handleOtherNamesChange}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {hasOtherNames && (
              <div className="field-group" style={highlightedBlockStyle}>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
                
                <RepeatableFormItem 
                  name="otherNames" 
                  addButtonText="增加另一个" 
                  removeButtonText="移走"
                >
                  {(field: FormListFieldData) => (
                    <>
                      <Form.Item
                        {...field}
                        name={[field.name, 'surname']}
                        label="曾用姓氏 (婚前姓氏、宗教姓氏、职业姓氏、别姓等)"
                        rules={[{ required: true, message: '请输入曾用姓氏' }]}
                        style={{ marginBottom: '16px' }}
                      >
                        <Input style={{ width: '95%' }} maxLength={33} />
                      </Form.Item>
                      
                      <Form.Item
                        {...field}
                        name={[field.name, 'givenName']}
                        label="曾用名字"
                        rules={[{ required: true, message: '请输入曾用名字' }]}
                      >
                        <Input style={{ width: '95%' }} maxLength={33} />
                      </Form.Item>
                    </>
                  )}
                </RepeatableFormItem>
              </div>
            )}
          </div>
          
          <div className="explanations-column">
            <div className="explanation-item">
              <h4 style={{ color: '#891300' }}>帮助：其它姓名</h4>
              <p>其它姓名包括您的婚前用名, 宗教用名、职业用名; 或任何为人所知的其它名字；或在过去为别人所知的其它名字。</p>
            </div>
          </div>
        </div>
      </fieldset>
      
      <fieldset className="question-section">
        <div className="section-content">
          <div className="questions-column">
            <QuestionItem
              question="您是否有代表您姓名的电码？"
              name="hasTelecode"
            >
              <Radio.Group onChange={handleTelecodeChange}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {hasTelecode && (
              <div className="field-group" style={highlightedBlockStyle}>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
                
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
            )}
          </div>
          
          <div className="explanations-column">
            <div className="explanation-item">
              <h4 style={{ color: '#891300' }}>帮助：电码</h4>
              <p>电码由4位数字组成，代表着一些非罗马字母拼写而成的名字的字体。</p>
            </div>
          </div>
        </div>
      </fieldset>
      
      <fieldset className="question-section">
        <div className="section-content">
          <div className="questions-column">
            <QuestionItem
              question="性别"
              name="gender"
            >
              <Select placeholder="选择一个" style={{ width: '98%' }}>
                <Select.Option value="M">男</Select.Option>
                <Select.Option value="F">女</Select.Option>
              </Select>
            </QuestionItem>

            <QuestionItem
              question="婚姻状况"
              name="maritalStatus"
            >
              <Select placeholder="选择一个" style={{ width: '98%' }}>
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
          </div>
          
          <div className="explanations-column">
            <div className="explanation-item">
              <h4 style={{ color: '#891300' }}>帮助：性别</h4>
              <p>请选择您的性别，必须与护照上的信息一致。</p>
            </div>
            
            <div className="explanation-item">
              <h4 style={{ color: '#891300' }}>帮助：婚姻状况</h4>
              <p>请选择您目前的婚姻状况。</p>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="question-section">
        <div className="section-content">
          <div className="questions-column">
            <h4 style={{ marginBottom: '10px' }}>
              <span>出生日期与出生地</span>
            </h4>
            
            <div className="field-group" style={highlightedBlockStyle}>
              <QuestionItem
                question="日期"
              >
                <DateInput 
                  dayName="dobDay" 
                  monthName="dobMonth" 
                  yearName="dobYear"
                />
              </QuestionItem>

              <QuestionItem
                question="城市"
                name="birthPlace"
              >
                <Input placeholder="例如：北京" style={{ width: '99%' }} />
              </QuestionItem>

              <QuestionItem
                question="州/省"
                name="birthState"
                hasNaCheckbox={true}
                naCheckboxName="birthState_na"
              >
                <Input placeholder="例如：北京市" style={{ width: '99%' }} />
              </QuestionItem>

              <QuestionItem
                question="国家/地区"
                name="birthCountry"
              >
                <Select options={countryOptions} placeholder="- 选择一个 -" style={{ width: '98%' }} />
              </QuestionItem>
            </div>
          </div>
          
          <div className="explanations-column">
            <div className="explanation-item">
              <h4 style={{ color: '#891300' }}>帮助：出生日期</h4>
              <p>若不知道具体日期或月份，请按护照所示填写。</p>
            </div>
            
            <div className="explanation-item">
              <h4 style={{ color: '#891300' }}>帮助：出生地国家/地区</h4>
              <p>请选择您出生地的现用国家/地区名称。</p>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default PersonalInfoI;
