import React, { useState } from 'react';
import { Form, Input, Radio, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { losUnitOptions } from '../utils/formOptions';
import '../ds160Form.css';

const { TextArea } = Input;

interface PreviousTravelProps {
  form: FormInstance;
}

const PreviousTravel: React.FC<PreviousTravelProps> = ({ form }) => {
  const [hasBeenToUS, setHasBeenToUS] = useState<string | null>(null);
  const [hadUSVisa, setHadUSVisa] = useState<string | null>(null);
  const [visaRefused, setVisaRefused] = useState<string | null>(null);
  const [immigrantPetition, setImmigrantPetition] = useState<string | null>(null);

  const handleHasBeenToUSChange = (e: any) => {
    setHasBeenToUS(e.target.value);
    form.setFieldsValue({ hasBeenToUS: e.target.value });
  };

  const handleHadUSVisaChange = (e: any) => {
    setHadUSVisa(e.target.value);
    form.setFieldsValue({ previousUsVisa: e.target.value });
  };

  const handleVisaRefusedChange = (e: any) => {
    setVisaRefused(e.target.value);
    form.setFieldsValue({ visaRefused: e.target.value });
  };

  const handleImmigrantPetitionChange = (e: any) => {
    setImmigrantPetition(e.target.value);
    form.setFieldsValue({ immigrantPetition: e.target.value });
  };

  return (
    <>
      {/* Previous US Travel Question */}
      <fieldset className="question-section">
        <div className="field-groups">
          <div className="q">
            <QuestionItem
              question="您是否去过美国？"
              name="hasBeenToUS"
            >
              <Radio.Group onChange={handleHasBeenToUSChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
        </div>
      </fieldset>

      {/* Previous visits section */}
      {hasBeenToUS === 'Y' && (
        <fieldset className="question-section">
          <div className="highlighted-block">
            <h4 style={{ marginBottom: '16px' }}>
              <span>请提供最近五次赴美信息：</span>
            </h4>
            <RepeatableFormItem
              name="previousVisits"
              addButtonText="Add Another"
              removeButtonText="Remove"
            >
              {(field: FormListFieldData) => (
                <div className="question-section">
                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="抵达日期"
                        name={`previousVisits[${field.name}].arrivalDate`}
                      >
                        <DateInput 
                          dayName={`previousVisits[${field.name}].day`}
                          monthName={`previousVisits[${field.name}].month`}
                          yearName={`previousVisits[${field.name}].year`}
                        />
                      </QuestionItem>
                    </div>
                  </div>

                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="停留时间"
                        name={`previousVisits[${field.name}].duration`}
                      >
                        <Input 
                          style={{ width: 70 }}
                          maxLength={3}
                        />
                      </QuestionItem>
                    </div>
                  </div>

                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="单位"
                        name={`previousVisits[${field.name}].durationUnit`}
                      >
                        <Select 
                          options={losUnitOptions}
                          style={{ width: 180 }}
                        />
                      </QuestionItem>
                    </div>
                  </div>
                </div>
              )}
            </RepeatableFormItem>
          </div>
        </fieldset>
      )}

      {/* Previous US Visa Question */}
      <fieldset className="question-section">
        <div className="q">
          <QuestionItem
            question="您是否曾经获得过美国签证?"
            name="previousUsVisa"
          >
            <Radio.Group onChange={handleHadUSVisaChange}>
            <Radio value="Y">是 (Yes)</Radio>
            <Radio value="N">否 (No)</Radio>
            </Radio.Group>
          </QuestionItem>
        </div>
      </fieldset>

      {hadUSVisa === 'Y' && (
        <fieldset className="question-section">
          <div className="highlighted-block">
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="上一次美国签证签发日期"
                  name="lastVisaIssueDate"
                >
                  <DateInput 
                    dayName="lastVisaDay"
                    monthName="lastVisaMonth"
                    yearName="lastVisaYear"
                  />
                </QuestionItem>
              </div>
              <div className="explanation-column">
              </div>
            </div>
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="上一次签证的签证号码"
                  name="lastVisaNumber"
                  hasNaCheckbox={true}
                  naCheckboxName="lastVisaNumber_na"
                >
                  <Input style={{ width: '98%' }} />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：签证信息</h4>
                <p>请提供您最近一次美国签证的签发日期和签证号码。如果不记得签证号码，可以选择"不适用"。</p>
              </div>
            </div>
          </div>
        </fieldset>
      )}

      {/* Visa Refusal Question */}
      <fieldset className="question-section">
        <div className="field-groups">
          <div className="q">
            <QuestionItem
              question="您是否曾经被拒绝美国签证，或在入境口岸被拒入境，或撤销入境申请？"
              name="visaRefused"
            >
              <Radio.Group onChange={handleVisaRefusedChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
        </div>
      </fieldset>

      {visaRefused === 'Y' && (
        <fieldset className="question-section">
          <div className="highlighted-block">
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="请说明被拒绝签证或入境的原因及日期"
                  name="refusalDetails"
                >
                  <TextArea rows={4} style={{ width: '98%' }} />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：拒签说明</h4>
                <p>请详细说明您被拒签或拒绝入境的具体原因、时间和情况。</p>
              </div>
            </div>
          </div>
        </fieldset>
      )}

      {/* Immigrant Petition Question */}
      <fieldset className="question-section">
        <div className="field-groups">
          <div className="q">
            <QuestionItem
              question="曾有人在公民及移民服务局为您申请过移民吗？"
              name="immigrantPetition"
            >
              <Radio.Group onChange={handleImmigrantPetitionChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
        </div>
      </fieldset>

      {immigrantPetition === 'Y' && (
        <fieldset className="question-section">
          <div className="highlighted-block">
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="请提供申请人信息"
                  name="petitionerInfo"
                >
                  <TextArea rows={4} style={{ width: '98%' }} />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：申请人信息</h4>
                <p>请提供为您申请移民的申请人的详细信息。</p>
              </div>
            </div>
          </div>
        </fieldset>
      )}
    </>
  );
};

export default PreviousTravel;