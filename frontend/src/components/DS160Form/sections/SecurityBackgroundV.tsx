import React, { useState } from 'react';
import { Radio, Input, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';

interface SecurityBackgroundVProps {
  form: any;
}

const { TextArea } = Input;

const SecurityBackgroundV: React.FC<SecurityBackgroundVProps> = ({ form }) => {
  // State for conditional rendering
  const [hasChildCustody, setHasChildCustody] = useState<string | null>(null);
  const [hasVotingViolation, setHasVotingViolation] = useState<string | null>(null);
  const [hasRenounced, setHasRenounced] = useState<string | null>(null);

  // Handle radio button changes
  const handleChildCustodyChange = (e: any) => {
    setHasChildCustody(e.target.value);
    form.setFieldsValue({ hasChildCustody: e.target.value });
  };

  const handleVotingViolationChange = (e: any) => {
    setHasVotingViolation(e.target.value);
    form.setFieldsValue({ hasVotingViolation: e.target.value });
  };

  const handleRenouncedChange = (e: any) => {
    setHasRenounced(e.target.value);
    form.setFieldsValue({ hasRenounced: e.target.value });
  };

  return (
    <div className="ds160-section">
      <h2>安全和背景: 第五部分</h2>
      <div style={{ marginBottom: '30px' }}>
        <p className="section-description">
          注意：请提供以下安全与背景信息。对于所有要求解释的问题，请提供完整、准确的信息。属于法律规定的特定类别的申请者，即被认为不可进入美国的申请者可能无法获得签证（提前获得豁免的申请人除外）。下列情况是否适用于您？如果您回答"是"，这并不意味您就必然无资格获得签证，但是您可能被要求与签证官员进行面谈。
        </p>
      </div>

      {/* Child Custody Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经拒绝将一在美国境外的美籍儿童的监护权移交给一被美国法庭批准享有法定监护权的人？"
              name="hasChildCustody"
            >
              <Radio.Group onChange={handleChildCustodyChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasChildCustody === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="childCustodyExplanation"
                        noStyle
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={4000}
                          required={true}
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

      {/* Voting Violation Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否违反了法律或规定在美国进行过投票选举？"
              name="hasVotingViolation"
            >
              <Radio.Group onChange={handleVotingViolationChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasVotingViolation === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="votingViolationExplanation"
                        noStyle
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={4000}
                          required={true}
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

      {/* Renounced Citizenship Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾为逃避交税而声明放弃美国公民身份?"
              name="hasRenounced"
            >
              <Radio.Group onChange={handleRenouncedChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasRenounced === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="renouncedExplanation"
                        noStyle
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={4000}
                          required={true}
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

export default SecurityBackgroundV;
