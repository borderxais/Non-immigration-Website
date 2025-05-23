import React from 'react';
import { Form, Input, Select, Radio } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { countryOptions, nationalityOptions } from '../utils/formOptions';
import { nameValidator, namePatternMessage, locationValidator, locationPatternMessage, maxLengths, explanationPattern, explanationPatternMessage } from '../utils/validationRules';

const { TextArea } = Input;

interface FamilyFormerSpouseProps {
  form: any;
  readOnly?: boolean;
}

const FamilyFormerSpouse: React.FC<FamilyFormerSpouseProps> = ({ form, readOnly = false }) => {
  // Handle "Do Not Know" checkbox for place of birth city
  const handlePobCityDoNotKnowChange = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      form.setFieldsValue({ 'formerSpouse.pobCity': undefined });
    }
  };

  return (
    <div className="ds160-section">
      <h2>家庭信息：前配偶</h2>
      
      <div className="note" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        <h3>注意: 请提供您前配偶的信息。</h3>
      </div>
      
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="姓氏"
              name="formerSpouseSurname"
              required={true}
              validator={nameValidator}
              validatorMessage={namePatternMessage}
            >
              <Input 
                style={{ width: '95%' }} 
                maxLength={maxLengths.name}
                disabled={readOnly}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：</h4>
            <p>请输入您前配偶的姓氏。如果您不确定确切的拼写，请尽可能准确地输入。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="名字"
              name="formerSpouseGivenName"
              required={true}
              validator={nameValidator}
              validatorMessage={namePatternMessage}
            >
              <Input 
                style={{ width: '95%' }} 
                maxLength={maxLengths.name}
                disabled={readOnly}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：</h4>
            <p>请输入您前配偶的名字。如果您不确定确切的拼写，请尽可能准确地输入。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="出生日期"
              name="formerSpouseBirth"
              required={true}
            >
              <DateInput
                dayName={["formerSpouseBirth", "day"]}
                monthName={["formerSpouseBirth", "month"]}
                yearName={["formerSpouseBirth", "year"]}
                disabled={readOnly}
                validateEarlierThanToday={true}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：</h4>
            <p>请输入您前配偶的出生日期。如果您不知道确切日期，请尽可能准确地估计。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="所属国家/地区（国籍）"
              name="formerSpouseNationality"
              required={true}
            >
              <Select
                style={{ width: '99%' }}
                options={nationalityOptions}
                placeholder="- 请选择 -"
                showSearch
                filterOption={(input, option) => 
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                disabled={readOnly}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：</h4>
            <p>请选择您前配偶的国籍。</p>
          </div>
        </div>

        <h4>前配偶的出生地</h4>
        <div className="highlighted-block">
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="城市"
                name="formerSpousePobCity"
                required={true}
                naCheckboxName="formerSpousePobCityNa"
                hasNaCheckbox={true}
                validator={locationValidator}
                validatorMessage={locationPatternMessage}
              >
                <Input 
                  style={{ width: '95%' }} 
                  maxLength={maxLengths.city}
                  disabled={readOnly}
                />
              </QuestionItem>
            </div>
            <div className="explanation-column"></div>
          </div>
          
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="国家/地区"
                name="formerSpousePobCountry"
                required={true}
              >
                <Select
                  style={{ width: '99%' }}
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
            <div className="explanation-column"></div>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="结婚日期"
              name="formerSpouseMarriageDate"
              required={true}
            >
              <DateInput
                dayName={["formerSpouseMarriageDate", "day"]}
                monthName={["formerSpouseMarriageDate", "month"]}
                yearName={["formerSpouseMarriageDate", "year"]}
                disabled={readOnly}
                validateEarlierThanToday={true}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：</h4>
            <p>请输入您与前配偶的结婚日期。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="婚姻结束日期"
              name="formerSpouseMarriageEndDate"
              required={true}
            >
              <DateInput
                dayName={["formerSpouseMarriageEndDate", "day"]}
                monthName={["formerSpouseMarriageEndDate", "month"]}
                yearName={["formerSpouseMarriageEndDate", "year"]}
                disabled={readOnly}
                validateEarlierThanToday={true}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：</h4>
            <p>请输入您与前配偶的婚姻结束日期。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="婚姻如何结束"
              name="formerSpouseMarriageEndReason"
              required={true}
            >
              <TextArea 
                style={{ width: '99%' }} 
                rows={4} 
                maxLength={maxLengths.explanation}
                disabled={readOnly}
                placeholder="请描述您的婚姻如何结束，例如：离婚、婚姻无效等"
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：</h4>
            <p>请简要说明您的婚姻如何结束，例如：离婚、婚姻无效等。</p>
          </div>
        </div>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="婚姻终止的国家/地区"
              name="formerSpouseMarriageEndCountry"
              required={true}
            >
              <Select
                style={{ width: '99%' }}
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
          <div className="explanation-column">
            <h4 className="help-header">帮助：</h4>
            <p>请选择您的婚姻终止的国家或地区。</p>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default FamilyFormerSpouse;