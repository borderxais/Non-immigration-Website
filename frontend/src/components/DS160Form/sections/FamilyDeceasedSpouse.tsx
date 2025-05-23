import React from 'react';
import { Form, Input, Select, Checkbox } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { countryOptions, nationalityOptions } from '../utils/formOptions';
import { nameValidator, namePatternMessage, locationValidator, locationPatternMessage, maxLengths } from '../utils/validationRules';

interface FamilyDeceasedSpouseProps {
  form: any;
  readOnly?: boolean;
}

const FamilyDeceasedSpouse: React.FC<FamilyDeceasedSpouseProps> = ({ form, readOnly = false }) => {
  // Get birth date values for validation
  const birthDate = {
    day: form.getFieldValue('personalInfo.birthDay'),
    month: form.getFieldValue('personalInfo.birthMonth'),
    year: form.getFieldValue('personalInfo.birthYear')
  };

  // Handle "Do Not Know" checkbox for place of birth city
  const handlePobCityDoNotKnowChange = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      form.setFieldsValue({ 'deceasedSpouse.pobCity': undefined });
    }
  };

  return (
    <div className="ds160-section">
      <h2>家庭信息：已故配偶</h2>
      
      <div className="note" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        <h3>注意: 请提供您已故配偶的信息。</h3>
      </div>
      
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="姓氏"
              name="deceasedSpouseSurname"
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
            
            <QuestionItem
              question="名字"
              name="deceasedSpouseGivenName"
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
            
            <QuestionItem
              question="出生日期"
              name="deceasedSpouseBirth"
              required={true}
            >
              <DateInput
                dayName={["deceasedSpouseBirth", "day"]}
                monthName={["deceasedSpouseBirth", "month"]}
                yearName={["deceasedSpouseBirth", "year"]}
                disabled={readOnly}
                validateEarlierThanToday={true}
              />
            </QuestionItem>
            
            <QuestionItem
              question="所属国家/地区（国籍）"
              name="deceasedSpouseNationality"
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

            <h4>已故配偶的出生地</h4>
            <div className="highlighted-block">
              <QuestionItem
                question="城市"
                name="deceasedSpousePobCity"
                required={true}
                naCheckboxName="deceasedSpousePobCityNa"
                hasNaCheckbox={true}
                validator={locationValidator}
                validatorMessage={locationPatternMessage}
              >
                <Input 
                  style={{ width: '99%' }} 
                  maxLength={maxLengths.city}
                  disabled={readOnly || form.getFieldValue('deceasedSpouse.pobCity_na')}
                />
              </QuestionItem>
              
              <QuestionItem
                question="国家/地区"
                name="deceasedSpousePobCountry"
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
          <div className="explanation-column">
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default FamilyDeceasedSpouse;