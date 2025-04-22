import React, { useState } from 'react';
import { Input, Radio, Select, Form } from 'antd';
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
        <div className="question-row">
          <div className="question-column">
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
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>
      </fieldset>

      {/* Previous visits section */}
      {hasBeenToUS === 'Y' && (
        <fieldset className="question-section">
          <div className="highlighted-block">
            <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
            <RepeatableFormItem
              name="previousVisits"
              addButtonText="增加另一次访问"
              removeButtonText="移走"
            >
              {(field: FormListFieldData) => (
                <>
                  <Form.Item
                    {...field}
                    name={[field.name, 'arrivalDate']}
                    label="到达日期"
                    rules={[{ required: true, message: '请输入到达日期' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <DateInput
                      dayName={`previousVisits.${field.name}.arrivalDay`}
                      monthName={`previousVisits.${field.name}.arrivalMonth`}
                      yearName={`previousVisits.${field.name}.arrivalYear`}
                    />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'stayLength']}
                    label="停留时间"
                    rules={[{ required: true, message: '请输入停留时间' }]}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input style={{ width: '95%' }} />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'stayUnit']}
                    label="时间单位"
                    rules={[{ required: true, message: '请选择时间单位' }]}
                  >
                    <Select options={losUnitOptions} style={{ width: '95%' }} />
                  </Form.Item>
                </>
              )}
            </RepeatableFormItem>
          </div>
        </fieldset>
      )}

      {/* Previous US Visa Question */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
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
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
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
        <div className="question-row">
          <div className="question-column">
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
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
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
        <div className="question-row">
          <div className="question-column">
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
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
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