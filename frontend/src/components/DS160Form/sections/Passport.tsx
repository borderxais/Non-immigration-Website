import React, { useState } from 'react';
import { Input, Select, Radio, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { passportIssuingOptions, permanentResidenceOptions } from '../utils/formOptions';
import '../ds160Form.css';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { 
  idDocumentPatternMessage, 
  idDocumentValidator, 
  historicalDateValidator, 
  notFutureDateValidator, 
  futureDateValidator, 
  locationPatternMessage,
  locationValidator,
  maxLengths, 
  notEarlierThanBirthDateValidator
} from '../utils/validationRules';

const { TextArea } = Input;

interface PassportProps {
  form: any;
}

const Passport: React.FC<PassportProps> = ({ form }) => {
  // Get birth date from form data
  const formValues = form.getFieldsValue(true);
  const dobData = formValues?.dob;
  const watchSelfBirthDate = dobData ? {
    day: dobData.day,
    month: dobData.month,
    year: dobData.year
  } : undefined;
  const [hasLostPassport, setHasLostPassport] = useState<string | null>(null);
  const [passportType, setPassportType] = useState<string>('');

  // Handle lost passport change
  const handleLostPassportChange = (e: any) => {
    const value = e.target.value;
    form.setFieldsValue({ 
      hasLostPassport: value,
      lostPassports: undefined
    });
    setHasLostPassport(value);
  };

  const handlePassportTypeChange = (value: string) => {
    setPassportType(value);
  };

  return (
    <div className="passport-section">
      {/* Passport Information Section */}
      <fieldset className="question-section">
        <h3 className="section-header">
          <span>护照信息</span>
          <span> (Passport Information)</span>
        </h3>
        
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="护照/旅行证件种类"
              name="passportType"
              required={true}
            >
              <Select 
                placeholder="- 请选择一个 -" 
                style={{ width: '99%' }}
                onChange={handlePassportTypeChange}
              >
                <Select.Option value="">- 请选择一个 -</Select.Option>
                <Select.Option value="R">普通护照 (REGULAR)</Select.Option>
                <Select.Option value="O">公务护照 (OFFICIAL)</Select.Option>
                <Select.Option value="D">外交护照 (DIPLOMATIC)</Select.Option>
                <Select.Option value="L">通行证 (LAISSEZ-PASSER)</Select.Option>
                <Select.Option value="T">其他 (OTHER)</Select.Option>
              </Select>
            </QuestionItem>

            {passportType === 'T' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="passportTypeExplanation"
                        noStyle
                        rules={[{ required: true, message: '请说明护照种类' }]}
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={maxLengths.explanation}
                          placeholder="请详细说明您的护照/旅行证件种类"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="护照/旅行证件号码"
              name="passportNumber"
              validator={idDocumentValidator}
              validatorMessage={idDocumentPatternMessage}
            >
              <Input style={{ width: '99%' }} maxLength={maxLengths.idDocument} />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：护照/旅行证件号码</h4>
            <p>
              请输入您去美国时将使用的旅行证件信息。您的旅行证件必须是有效的、未过期的护照或者其它有效文件，其足以证明您的身份和国籍。
            </p>
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="护照本编号"
              name="passportBookNumber"
              hasNaCheckbox={true}
              naCheckboxName="passportBookNumber_na"
              inlineCheckbox={true}
              validator={idDocumentValidator}
              validatorMessage={idDocumentPatternMessage}
            >
              <Input style={{ width: '90%' }} maxLength={maxLengths.idDocument} />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：护照簿号码</h4>
            <p>
            护照簿号码通常被称为库存控制号码。您的护照上可能有也可能没有护照簿号码。护照簿号码在您护照上的位置可能因发行护照的国家而异。如果您无法确定您的护照是否包含护照簿号码，请联系您的护照发行机构。
            </p>
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="颁发护照/旅行证件的国家/机构"
              name="passportIssuedCountry"
            >
              <Select 
                options={passportIssuingOptions}
                style={{ width: '99%' }}
                placeholder="- 请选择一个 -"
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <div>
              <span>哪里是护照/旅行文件签发地？</span>
            </div>
            <div className='highlighted-block'>
                <QuestionItem
                    question="城市"
                    name="passportIssuedCity"
                    validator={locationValidator}
                    validatorMessage={locationPatternMessage}
                >
                    <Input style={{ width: '99%' }} maxLength={25} />
                </QuestionItem>

                <QuestionItem
                    question="州/省份 *如果显示在护照上"
                    name="passportIssuedState"
                    required={false}
                >
                    <Input style={{ width: '99%' }} maxLength={25} />
                </QuestionItem>

                <QuestionItem
                    question="国家/地区"
                    name="passportIssuedInCountry"
                    validator={locationValidator}
                    validatorMessage={locationPatternMessage}
                >
                    <Select 
                        options={permanentResidenceOptions}
                        style={{ width: '99%' }}
                        placeholder="- 请选择一个 -"
                    />
                </QuestionItem>
            </div>
          </div>
          <div className="explanation-column"></div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="签发日期"
              name="passportIssuedDate"
              required={true}
            >
              <DateInput
                dayName={["passportIssuedDate", "day"]}
                monthName={["passportIssuedDate", "month"]}
                yearName={["passportIssuedDate", "year"]}
                validateNotFutureDate={true}
                validateNotEarlierThanBirthDate={true}
                birthDate={watchSelfBirthDate}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="失效日期"
              name="passportExpirationDate"
              hasNaCheckbox={true}
              naCheckboxName="passportExpirationDate_na"
              inlineCheckbox={true}
              required={true}
            >
              <DateInput
                dayName={["passportExpirationDate", "day"]}
                monthName={["passportExpirationDate", "month"]}
                yearName={["passportExpirationDate", "year"]}
                naCheckboxName="passportExpirationDate_na"
                validateNotEarlierThanToday={true}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：失效日期</h4>
            <p>
              通常情况下，您的护照/旅行证件有效期必须距您签证申请和/或抵达美国的日期至少要长出六个月。
            </p>
          </div>
        </div>
      </fieldset>

      {/* Lost Passport Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您的护照是否曾遗失或者被盗？"
              name="hasLostPassport"
              required={true}
            >
              <Radio.Group onChange={handleLostPassportChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>
        
        {hasLostPassport === 'Y' && (
          <>
          <div>
                <span>请提供以下信息：</span>
          </div>
            <RepeatableFormItem
            name="lostPassports"
            addButtonText="添加另一个"
            removeButtonText="移除"
            >
            {(field: FormListFieldData) => (
                <>
                <div className="question-row">
                    <div className="question-column">
                    <QuestionItem
                        question="护照号码"
                        name={[field.name, 'passportNumber']}
                        hasNaCheckbox={true}
                        naCheckboxName={[field.name, 'passportNumber_na']}
                        inlineCheckbox={true}
                        parentFieldName="lostPassports"
                        validator={idDocumentValidator}
                        validatorMessage={idDocumentPatternMessage}
                        maxLength={maxLengths.idDocument}
                    >
                        <Input 
                          style={{ width: '95%' }} 
                          maxLength={maxLengths.idDocument} 
                        />
                    </QuestionItem>
                    </div>
                    <div className="explanation-column">
                    {/* Empty explanation column to maintain layout */}
                    </div>
                </div>
                
                <div className="question-row">
                    <div className="question-column">
                    <QuestionItem
                        question="颁发国家/机构"
                        name={[field.name, 'issuingCountry']}
                        required={true}
                    >
                        <Select 
                        options={passportIssuingOptions}
                        style={{ width: '95%' }}
                        placeholder="- 选择一个 -"
                        />
                    </QuestionItem>
                    </div>
                    <div className="explanation-column">
                    {/* Empty explanation column to maintain layout */}
                    </div>
                </div>
                
                <h4>解释说明</h4>
                <div className="question-row">                
                  <div className="question-column">
                    <Form.Item
                      name={[field.name, 'explanation']}
                      noStyle
                      rules={[{ required: true, message: '请说明护照遗失情况' }]}
                    >
                      <TextArea 
                        style={{ width: '99%' }} 
                        rows={4} 
                        maxLength={maxLengths.explanation}
                        placeholder="请详细说明您的情况"
                      />
                    </Form.Item>
              
                  </div>
                  <div className="explanation-column"></div>
                </div>
              </>
            )}
            </RepeatableFormItem>
          </>
        )}
      </fieldset>
    </div>
  );
};

export default Passport;
