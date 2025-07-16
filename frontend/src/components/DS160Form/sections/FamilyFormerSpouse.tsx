import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { countryOptions, nationalityOptions } from '../utils/formOptions';
import { 
  englishNameValidator, 
  englishNamePatternMessage, 
  locationValidator, 
  locationPatternMessage, 
  maxLengths, 
  numericValidator,
  explanationPattern,
  explanationPatternMessage
 } from '../utils/validationRules';
import { FormListFieldData } from 'antd/lib/form/FormList';

const { TextArea } = Input;

interface FamilyFormerSpouseProps {
  form: any;
  readOnly?: boolean;
}

const FamilyFormerSpouse: React.FC<FamilyFormerSpouseProps> = ({ form, readOnly = false }) => {
  const [formerSpouseCount, setFormerSpouseCount] = useState<number>(1);

  // Update the form value when count changes
  useEffect(() => {
    form.setFieldsValue({ 
      formerSpouseCount: formerSpouseCount 
    });
  }, [formerSpouseCount, form]);

  // Handle count change
  const handleCountChange = (value: number | null) => {
    if (value !== null) {
      setFormerSpouseCount(value);
      
      // Get current former spouses
      const currentSpouses = form.getFieldValue('formerSpouses') || [];
      
      // If increasing, no need to do anything as RepeatableFormItem will handle it
      // If decreasing, we need to trim the array
      if (value < currentSpouses.length) {
        form.setFieldsValue({
          formerSpouses: currentSpouses.slice(0, value)
        });
      }
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
              question="前配偶数量"
              name="formerSpouseCount"
              required={true}
              validator={numericValidator}
            >
              <InputNumber
                max={2}
                value={formerSpouseCount}
                onChange={handleCountChange}
                style={{ width: '100px' }}
                disabled={readOnly}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column"></div>
        </div>
        
        <h4>前配偶信息</h4>
        <div className="question-row">
          <div className="question-column">
            <RepeatableFormItem 
              name="formerSpouses"
              addButtonText="添加另一个前配偶"
              removeButtonText="移除此前配偶"
            >
              {(field: FormListFieldData, listName: string) => (
                <div>
                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="姓氏"
                        name={[field.name, 'surname']}
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
                        name={[field.name, 'givenName']}
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
                        name={[field.name, 'birth']}
                        required={true}
                      >
                        <DateInput
                          dayName={[field.name, 'birth', 'day']}
                          monthName={[field.name, 'birth', 'month']}
                          yearName={[field.name, 'birth', 'year']}
                          validateEarlierThanToday={true}
                          validateHistoricalDate={true}
                          listName={listName}
                        />
                      </QuestionItem>

                      <QuestionItem
                        question="所属国家/地区（国籍）"
                        name={[field.name, 'nationality']}
                        required={true}
                      >
                        <Select 
                          showSearch
                          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                          style={{ width: '99%' }}
                          options={nationalityOptions}
                          placeholder="- 请选择 -"
                          disabled={readOnly}
                        />
                      </QuestionItem>
                    </div>
                  </div>

                  <div className="question-row">
                    <div className="question-column">
                      <h4>出生地</h4>
                      <div className="block-inside-highlight">
                        <QuestionItem
                          question="城市"
                          name={[field.name, 'pobCity']}
                          required={true}
                          validator={locationValidator}
                          validatorMessage={locationPatternMessage}
                        >
                          <Input 
                            maxLength={maxLengths.city}
                            disabled={readOnly}
                          />
                        </QuestionItem>

                        <QuestionItem
                          question="国家/地区"
                          name={[field.name, 'pobCountry']}
                          required={true}
                        >
                          <Select 
                            showSearch
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                            style={{ width: '99%' }}
                            options={countryOptions}
                            placeholder="- 请选择 -"
                            disabled={readOnly}
                          />
                        </QuestionItem>
                      </div>
                    </div>
                  </div>
                  
                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="结婚日期"
                        name={[field.name, 'marriageDate']}
                        required={true}
                      >
                        <DateInput
                          dayName={[field.name, 'marriageDate', 'day']}
                          monthName={[field.name, 'marriageDate', 'month']}
                          yearName={[field.name, 'marriageDate', 'year']}
                          validateEarlierThanToday={true}
                          listName={listName}
                        />
                      </QuestionItem>
                      
                      <QuestionItem
                        question="婚姻结束日期"
                        name={[field.name, 'marriageEndDate']}
                        required={true}
                      >
                        <DateInput
                          dayName={[field.name, 'marriageEndDate', 'day']}
                          monthName={[field.name, 'marriageEndDate', 'month']}
                          yearName={[field.name, 'marriageEndDate', 'year']}
                          validateEarlierThanToday={true}
                          listName={listName}
                        />
                      </QuestionItem>
                      
                      <h4>婚姻如何结束:</h4>
                      <Form.Item
                        name="marriageEndReason"
                        rules={[{ required: true, message: '请说明婚姻如何结束' },
                          { pattern: explanationPattern, message: explanationPatternMessage }
                        ]}
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={maxLengths.explanation}
                          placeholder="请详细说明您的婚姻如何结束"
                        />
                      </Form.Item>
                      
                      <QuestionItem
                        question="婚姻终止的国家/地区"
                        name={[field.name, 'marriageEndCountry']}
                        required={true}
                      >
                        <Select 
                          showSearch
                          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                          style={{ width: '99%' }}
                          options={countryOptions}
                          placeholder="- 请选择 -"
                          disabled={readOnly}
                        />
                      </QuestionItem>
                    </div>
                  </div>
                </div>
              )}
            </RepeatableFormItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：</h4>
            <p>请输入您拥有的前配偶数量，并确保添加相应数量的前配偶信息。</p>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default FamilyFormerSpouse;