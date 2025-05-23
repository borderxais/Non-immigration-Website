import React, { useState, useEffect } from 'react';
import { Radio, Input, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { maxLengths, explanationPattern, explanationPatternMessage } from '../utils/validationRules';

interface SecurityBackgroundVProps {
  form: any;
}

const { TextArea } = Input;

const SecurityBackgroundV: React.FC<SecurityBackgroundVProps> = ({ form }) => {
  // Get form values
  const formValues = form.getFieldsValue(true);
  
  // Initialize state from form values
  const [hasChildCustody, setHasChildCustody] = useState<string | null>(formValues?.hasChildCustody || null);
  const [hasVotingViolation, setHasVotingViolation] = useState<string | null>(formValues?.hasVotingViolation || null);
  const [hasRenounced, setHasRenounced] = useState<string | null>(formValues?.hasRenounced || null);
  const [hasAttendedWithoutReimbursement, setHasAttendedWithoutReimbursement] = useState<string | null>(formValues?.hasAttendedWithoutReimbursement || null);

  // Update state when form values change
  useEffect(() => {
    const values = form.getFieldsValue(true);
    if (values.hasChildCustody !== undefined) {
      setHasChildCustody(values.hasChildCustody);
    }
    if (values.hasVotingViolation !== undefined) {
      setHasVotingViolation(values.hasVotingViolation);
    }
    if (values.hasRenounced !== undefined) {
      setHasRenounced(values.hasRenounced);
    }
    if (values.hasAttendedWithoutReimbursement !== undefined) {
      setHasAttendedWithoutReimbursement(values.hasAttendedWithoutReimbursement);
    }
  }, [form]);

  // Handle radio button changes
  const handleChildCustodyChange = (e: any) => {
    const value = e.target.value;
    setHasChildCustody(value);
    form.setFieldsValue({ hasChildCustody: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ childCustodyExplanation: undefined });
    }
  };

  const handleVotingViolationChange = (e: any) => {
    const value = e.target.value;
    setHasVotingViolation(value);
    form.setFieldsValue({ hasVotingViolation: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ votingViolationExplanation: undefined });
    }
  };

  const handleRenouncedChange = (e: any) => {
    const value = e.target.value;
    setHasRenounced(value);
    form.setFieldsValue({ hasRenounced: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ renouncedExplanation: undefined });
    }
  };

  const handleAttendedWithoutReimbursementChange = (e: any) => {
    const value = e.target.value;
    setHasAttendedWithoutReimbursement(value);
    form.setFieldsValue({ hasAttendedWithoutReimbursement: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ attendedWithoutReimbursementExplanation: undefined });
    }
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
                        rules={[
                          { pattern: explanationPattern, message: explanationPatternMessage }
                        ]}
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={maxLengths.explanation}
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
                        rules={[
                          { pattern: explanationPattern, message: explanationPatternMessage }
                        ]}
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={maxLengths.explanation}
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
                        rules={[
                          { pattern: explanationPattern, message: explanationPatternMessage }
                        ]}
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={maxLengths.explanation}
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

      {/* Public School Attendance Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经在1996年11月30日之后以学生身份（F类签证持有人）到美国的一公立小学或公立中学就读而没有向学校补交费用？"
              name="hasAttendedWithoutReimbursement"
            >
              <Radio.Group onChange={handleAttendedWithoutReimbursementChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasAttendedWithoutReimbursement === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="attendedWithoutReimbursementExplanation"
                        rules={[
                          { required: true, message: '请提供解释' },
                          { pattern: explanationPattern, message: explanationPatternMessage }
                        ]}
                      >
                        <TextArea
                          rows={4}
                          maxLength={maxLengths.explanation}
                          placeholder="请提供详细信息"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：公立学校就读</h4>
            <p>如果您曾经以F签证身份在美国公立中小学就读且未支付学费，请选择"是"。根据美国法律，F签证持有人在公立中小学就读必须支付全额学费。</p>
          </div>
        </div>
      </fieldset>

    </div>
  );
};

export default SecurityBackgroundV;
