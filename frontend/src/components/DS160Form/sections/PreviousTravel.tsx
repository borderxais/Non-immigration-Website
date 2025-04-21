import React, { useState } from 'react';
import { Form, Input, Radio, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
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
          <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供您最近5次访问美国的信息：</h4>
          <div className="highlighted-block">
            <RepeatableFormItem
              name="previousVisits"
              addButtonText="增加另一个访问记录"
              removeButtonText="移走"
            >
              {(field: FormListFieldData) => (
                <fieldset className="question-section">
                  <div className="question-row">
                    <div className="question-column">
                      {/* Arrival Date */}
                      <Form.Item
                        {...field}
                        name={[field.name, 'arrivalDate']}
                        label="到达日期"
                        rules={[{ required: true, message: '请输入到达日期' }]}
                        style={{ marginBottom: '16px' }}
                      >
                        <DateInput
                          dayName={`${field.name}_arrivalDay`}
                          monthName={`${field.name}_arrivalMonth`}
                          yearName={`${field.name}_arrivalYear`}
                        />
                      </Form.Item>

                      {/* Length of Stay */}
                      <Form.Item
                        {...field}
                        name={[field.name, 'lengthOfStay']}
                        label="停留时长"
                        rules={[{ required: true, message: '请输入停留时长' }]}
                        style={{ marginBottom: '16px' }}
                      >
                        <Input style={{ width: '95%' }} placeholder="例如：30天" />
                      </Form.Item>

                      {/* Visit Purpose */}
                      <Form.Item
                        {...field}
                        name={[field.name, 'visitPurpose']}
                        label="访问目的"
                        rules={[{ required: true, message: '请输入访问目的' }]}
                        style={{ marginBottom: '16px' }}
                      >
                        <Input style={{ width: '95%' }} placeholder="例如：旅游、商务、学习" />
                      </Form.Item>

                      {/* Visa Type */}
                      <Form.Item
                        {...field}
                        name={[field.name, 'visaType']}
                        label="签证类型"
                        rules={[{ required: true, message: '请选择签证类型' }]}
                        style={{ marginBottom: '16px' }}
                      >
                        <Select style={{ width: '95%' }} placeholder="- 选择一个 -">
                          <Select.Option value="B1/B2">B1/B2 (商务/旅游)</Select.Option>
                          <Select.Option value="F1">F1 (学生)</Select.Option>
                          <Select.Option value="J1">J1 (交流访问)</Select.Option>
                          <Select.Option value="H1B">H1B (工作)</Select.Option>
                          <Select.Option value="other">其他</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：访问信息</h4>
                      <p>请提供您访问美国的详细信息，包括到达日期、停留时长、访问目的和使用的签证类型。</p>
                    </div>
                  </div>
                </fieldset>
              )}
            </RepeatableFormItem>
          </div>
        </fieldset>
      )}

      {/* Previous US Visa Question */}
      <fieldset className="question-section">
        <div className="field-groups">
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Form.Item name="lastVisaDay" noStyle>
                      <Select options={[]} style={{ width: 70 }} placeholder="Day" />
                    </Form.Item>
                    <Form.Item name="lastVisaMonth" noStyle>
                      <Select options={[]} style={{ width: 80 }} placeholder="Month" />
                    </Form.Item>
                    <Form.Item name="lastVisaYear" noStyle>
                      <Input placeholder="Year" style={{ width: '60px' }} maxLength={4} />
                    </Form.Item>
                    <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                      (格式: DD-MMM-YYYY)
                    </div>
                  </div>
                </QuestionItem>

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