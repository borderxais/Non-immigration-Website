import React from 'react';
import { Form, Input, Select } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { countryOptions, nationalityOptions } from '../utils/formOptions';
import { englishNameValidator, englishNamePatternMessage, locationValidator, locationPatternMessage, maxLengths } from '../utils/validationRules';

const { TextArea } = Input;

interface FamilyFormerSpouseProps {
  form: any;
  readOnly?: boolean;
}

const FamilyFormerSpouse: React.FC<FamilyFormerSpouseProps> = ({ form, readOnly = false }) => {

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
              validator={englishNameValidator}
              validatorMessage={englishNamePatternMessage}
            >
              <Input 
                style={{ width: '95%' }} 
                maxLength={maxLengths.name}
                disabled={readOnly}
              />
            </QuestionItem>
          
            <QuestionItem
              question="名字"
              name="formerSpouseGivenName"
              required={true}
              validator={englishNameValidator}
              validatorMessage={englishNamePatternMessage}
            >
              <Input 
                style={{ width: '95%' }} 
                maxLength={maxLengths.name}
                disabled={readOnly}
              />
            </QuestionItem>
          
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
                validateHistoricalDate={true}
              />
            </QuestionItem>

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
          </div>
        </div>

        <h4>前配偶的出生地</h4>
        <div className="question-row">
          <div className="question-column">
            <div className="highlighted-block">
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
          </div>
          <div className="explanation-column"></div>
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
          
            <h4>婚姻如何结束:</h4>
            <Form.Item
              name="formerSpouseMarriageEndReason"
            >
              <TextArea 
                style={{ width: '99%' }} 
                rows={4} 
                maxLength={maxLengths.explanation}
                required={true}
                disabled={readOnly}
              />
            </Form.Item>
          
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
          <div className="explanation-column"></div>
        </div>
      </fieldset>
    </div>
  );
};

export default FamilyFormerSpouse;