import React, { useState } from 'react';
import { Radio, Input, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';

interface SecurityBackgroundProps {
    form: any;
}

const { TextArea } = Input;

const SecurityBackground: React.FC<SecurityBackgroundProps> = ({ form }) => {
  // State for conditional rendering
  const [hasDisease, setHasDisease] = useState<string | null>(null);
  const [hasDisorder, setHasDisorder] = useState<string | null>(null);
  const [isDrugUser, setIsDrugUser] = useState<string | null>(null);

  // Handle radio button changes
  const handleDiseaseChange = (e: any) => {
    setHasDisease(e.target.value);
    form.setFieldsValue({ hasDisease: e.target.value });
  };

  const handleDisorderChange = (e: any) => {
    setHasDisorder(e.target.value);
    form.setFieldsValue({ hasDisorder: e.target.value });
  };

  const handleDrugUserChange = (e: any) => {
    setIsDrugUser(e.target.value);
    form.setFieldsValue({ isDrugUser: e.target.value });
  };

  return (
    <div className="ds160-section">
      <h2>安全和背景: 第一部分</h2>
      <div style={{ marginBottom: '30px' }}>
      <p className="section-description">
        注意：请提供以下安全与背景信息。对于所有要求解释的问题，请提供完整、准确的信息。对于那些属于法律特定范畴内不许入境的人员，我们不能颁发签证（提前获得豁免的申请人除外）。下列情况有适用于您的吗？如果您回答"是"，这并不意味着您就无资格获得签证，但是您可能需要与签证官员进行面谈。
      </p>
      </div>

      {/* Communicable Disease Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否患有涉及公共卫生的传染病？（按照美国卫生和公众服务部界定，涉及公共卫生的传染病包括软下疳、淋病、腹股沟肉芽肿、传染性麻风病、性病性淋巴肉芽肿，传染期梅毒，活动性肺结核等。）"
              name="hasDisease"
            >
              <Radio.Group onChange={handleDiseaseChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasDisease === 'Y' && (
                <>
                    <h4>解释说明</h4>
                    <div className="highlighted-block">
                    <div className="question-row">
                        <div className="question-column">
                        <Form.Item
                            name="diseaseExplanation"
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
        <div className="explanation-column"></div>
        </div>
      </fieldset>

      {/* Mental/Physical Disorder Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否患有对其他人的人身安全及利益造成威胁的精神或身体疾病？"
              name="hasDisorder"
            >
              <Radio.Group onChange={handleDisorderChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasDisorder === 'Y' && (
                <>
                    <h4>解释说明</h4>
                    <div className="highlighted-block">
                    <div className="question-row">
                        <div className="question-column">
                        <Form.Item
                            name="disorderExplanation"
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
          <div className="explanation-column"></div>
        </div>
      </fieldset>

      {/* Drug User Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否是或曾经是药物滥用者或药物成瘾者？"
              name="isDrugUser"
            >
              <Radio.Group onChange={handleDrugUserChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {isDrugUser === 'Y' && (
                <>
                    <h4>解释说明</h4>
                    <div className="highlighted-block">
                    <div className="question-row">
                        <div className="question-column">
                        <Form.Item
                            name="drugUserExplanation"
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
          <div className="explanation-column"></div>
        </div>
      </fieldset>
    </div>
  );
};

export default SecurityBackground;
