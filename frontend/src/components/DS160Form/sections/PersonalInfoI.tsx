import React, { useState } from 'react';
import { Input, Select, Radio, Divider, Form, Typography } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { countryOptions } from '../utils/formOptions';
import { FormListFieldData } from 'antd/lib/form/FormList';

const { Paragraph } = Typography;

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
    <div className="personal-info-section">
      <QuestionItem
        question="姓（拼音，与护照一致）"
        name="surname"
        explanation="输入您护照上列出的所有姓氏。如果只有一个，请输入这一个。"
      >
        <Input placeholder="例如：ZHANG" />
      </QuestionItem>

      <QuestionItem
        question="名（拼音，与护照一致）"
        name="givenName"
        explanation="如果您的护照上不包括名字信息，请在名字栏内输入'FNU'。"
      >
        <Input placeholder="例如：SAN" />
      </QuestionItem>

      <QuestionItem
        question="全名（本地语言书写）"
        name="fullNameNative"
        explanation="请用中文填写您的全名。如不适用/技术不可用，请勾选下方的复选框。"
        hasNaCheckbox={true}
        naCheckboxName="fullNameNative_na"
      >
        <Input placeholder="请用中文填写您的全名" />
      </QuestionItem>
      
      <QuestionItem
        question="您是否曾使用其他姓名？（包括曾用名、英文名、别名等）"
        name="hasOtherNames"
        explanation="其它姓名包括您的婚前用名, 宗教用名、职业用名; 或任何为人所知的其它名字；或在过去为别人所知的其它名字。"
      >
        <Radio.Group onChange={handleOtherNamesChange}>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </QuestionItem>

      {hasOtherNames && (
        <div className="field-group callout" style={highlightedBlockStyle}>
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

      <QuestionItem
        question="您是否有代表您姓名的电码？"
        name="hasTelecode"
        explanation="电码由4位数字组成，代表着一些非罗马字母拼写而成的名字的字体。"
      >
        <Radio.Group onChange={handleTelecodeChange}>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </QuestionItem>
      
      {hasTelecode && (
        <div className="field-group callout" style={highlightedBlockStyle}>
          <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: '4px', padding: '16px' }}>
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
        </div>
      )}
      
      <Divider />
      
      <QuestionItem
        question="性别"
        name="gender"
        explanation="请选择您的性别，必须与护照上的信息一致。"
      >
        <Select placeholder="选择一个">
          <Select.Option value="M">男</Select.Option>
          <Select.Option value="F">女</Select.Option>
        </Select>
      </QuestionItem>

      <QuestionItem
        question="婚姻状况"
        name="maritalStatus"
        explanation="请选择您目前的婚姻状况。"
      >
        <Select placeholder="选择一个">
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
      
      <Divider />

      <h4 style={{ marginBottom: '10px', marginTop: '20px' }}>
        <span>出生日期与出生地</span>
      </h4>
    
      <div className="field-group callout" style={highlightedBlockStyle}>
        <QuestionItem
          question="日期"
          explanation="若不知道具体日期或月份，请按护照所示填写。"
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
          <Input placeholder="例如：北京" />
        </QuestionItem>

        <QuestionItem
          question="州/省"
          name="birthState"
          hasNaCheckbox={true}
          naCheckboxName="birthState_na"
        >
          <Input placeholder="例如：北京市" />
        </QuestionItem>

        <QuestionItem
          question="国家/地区"
          name="birthCountry"
          explanation="请选择您出生地的现用国家/地区名称。"
        >
          <Select options={countryOptions} placeholder="- 选择一个 -" />
        </QuestionItem>
      </div>
    </div>
  );
};

export default PersonalInfoI;
