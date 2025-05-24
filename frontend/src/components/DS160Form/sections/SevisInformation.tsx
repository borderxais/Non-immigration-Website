import React from 'react';
import { Input, Select } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { usStateOptions } from '../utils/formOptions';
import { 
  locationValidator, 
  locationPatternMessage, 
  zipCodeValidator, 
  zipCodePatternMessage,
  maxLengths,
  organizationNameValidator,
  organizationNamePatternMessage,
  explanationValidator,
  explanationPatternMessage,
  sevisIdValidator,
  sevisIdPatternMessage
} from '../utils/validationRules';

interface SevisInformationProps {
  form: any;
  readOnly?: boolean;
}

const SevisInformation: React.FC<SevisInformationProps> = ({ form, readOnly = false }) => {
  return (
    <div className="ds160-section">
      <h2>SEVIS 信息</h2>
      
      <div className="note" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        <h3>注意：您已表明您此次美国之行的目的是作为学生或交流学者。请提供下列有关您将就读机构的信息。</h3>
      </div>
      
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="SEVIS ID"
              name="sevisId"
              required={true}
              validator={sevisIdValidator}
              validatorMessage={sevisIdPatternMessage}
            >
              <Input 
                maxLength={11}
                placeholder="N0123456789"
                disabled={readOnly}
              />
            </QuestionItem>
            
            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>请提供以下附加信息：</h4>
            
            <div className="highlighted-block">
              <QuestionItem
                question="学校名称"
                name="schoolName"
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
                question="学习课程"
                name="courseOfStudy"
                required={true}
                validator={locationValidator}
                validatorMessage={locationPatternMessage}
              >
                <Input 
                  style={{ width: '95%' }} 
                  maxLength={66}
                  disabled={readOnly}
                />
              </QuestionItem>
              
              <QuestionItem
                question="街道地址(第一行)"
                name="schoolAddressLine1"
                required={true}
                validator={explanationValidator}
                validatorMessage={explanationPatternMessage}
              >
                <Input 
                  style={{ width: '95%' }} 
                  maxLength={maxLengths.address}
                  disabled={readOnly}
                />
              </QuestionItem>
              
              <QuestionItem
                question="街道地址(第二行) *选填"
                name="schoolAddressLine2"
                required={false}
                validator={explanationValidator}
                validatorMessage={explanationPatternMessage}
              >
                <Input 
                  style={{ width: '95%' }} 
                  maxLength={maxLengths.address}
                  disabled={readOnly}
                />
              </QuestionItem>
              
              <QuestionItem
                question="城市"
                name="schoolCity"
                required={true}
                validator={locationValidator}
                validatorMessage={locationPatternMessage}
              >
                <Input 
                  style={{ width: '75%' }} 
                  maxLength={maxLengths.city}
                  disabled={readOnly}
                />
              </QuestionItem>
              
              <QuestionItem
                question="州"
                name="schoolState"
                required={true}
              >
                <Select
                  style={{ width: '75%' }}
                  options={usStateOptions}
                  placeholder="- 请选择一个 -"
                  disabled={readOnly}
                />
              </QuestionItem>
              
              <QuestionItem
                question="邮政区域/邮政编码"
                name="schoolZipCode"
                required={true}
                validator={zipCodeValidator}
                validatorMessage={zipCodePatternMessage}
              >
                <Input 
                  style={{ width: '75%' }} 
                  maxLength={maxLengths.zipCode}
                  placeholder="例如：12345 或 12345-1234"
                  disabled={readOnly}
                />
              </QuestionItem>
            </div>
          </div>
          
          <div className="explanation-column">
            <h4 className="help-header">帮助：课程</h4>
            <p>对于高中所学课程，请指明是"学术性"或是"职业性"的。其它教育程度的，请指明你的主修课程或专业。</p>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default SevisInformation;
