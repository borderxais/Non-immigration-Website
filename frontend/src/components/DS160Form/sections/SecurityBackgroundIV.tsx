import React, { useState } from 'react';
import { Radio, Input, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';

interface SecurityBackgroundIVProps {
  form: any;
}

const { TextArea } = Input;

const SecurityBackgroundIV: React.FC<SecurityBackgroundIVProps> = ({ form }) => {
  // State for conditional rendering
  const [hasImmigrationFraud, setHasImmigrationFraud] = useState<string | null>(null);
  const [hasDeportation, setHasDeportation] = useState<string | null>(null);

  // Handle radio button changes
  const handleImmigrationFraudChange = (e: any) => {
    setHasImmigrationFraud(e.target.value);
    form.setFieldsValue({ hasImmigrationFraud: e.target.value });
  };

  const handleDeportationChange = (e: any) => {
    setHasDeportation(e.target.value);
    form.setFieldsValue({ hasDeportation: e.target.value });
  };

  return (
    <div className="ds160-section">
      <h2>安全和背景: 第四部分</h2>
      <div style={{ marginBottom: '30px' }}>
        <p className="section-description">
          注意：请提供以下安全与背景信息。对于所有要求解释的问题，请提供完整、准确的信息。属于法律规定的不可进入美国的特定类别的申请者可能无法获得签证（提前获得豁免的申请人除外）。下列情况是否适用于您？如果您回答"是"，这并不意味您就必然无资格获得签证，但是您可能被要求与签证官员进行面谈。
        </p>
      </div>

      {/* Immigration Fraud Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经试图以欺骗或故意造假及其他非法手段为自己，或帮助他人获取美国签证，入境美国或获取任何其他移民福利？"
              name="hasImmigrationFraud"
            >
              <Radio.Group onChange={handleImmigrationFraudChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasImmigrationFraud === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="immigrationFraudExplanation"
                        noStyle
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={4000}
                          placeholder="请详细说明您的情况"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="explanation-column">
          </div>
        </div>
      </fieldset>

      {/* Deportation Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您曾经被任何一个国家驱赶或驱逐出境过吗？"
              name="hasDeportation"
            >
              <Radio.Group onChange={handleDeportationChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasDeportation === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="deportationExplanation"
                        noStyle
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={4000}
                          placeholder="请详细说明您的情况"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="explanation-column">
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default SecurityBackgroundIV;
