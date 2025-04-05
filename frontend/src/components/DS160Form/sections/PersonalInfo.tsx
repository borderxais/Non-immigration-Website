import React from 'react';
import { Input, Select, Radio, Divider } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { countryOptions } from '../utils/formOptions';

interface PersonalInfoProps {
  form: any;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ form }) => {
  // Define highlighted block style
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
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
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </QuestionItem>

      <QuestionItem
        question="您是否有代表您姓名的电码？"
        name="hasTelecode"
        explanation="电码由4位数字组成，代表着一些非罗马字母拼写而成的名字的字体。"
      >
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </QuestionItem>
      
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
          name="dateOfBirth"
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

export default PersonalInfo;
