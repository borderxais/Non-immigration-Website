import React, { useState, useEffect } from 'react';
import { Radio, Input, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { maxLengths, explanationPattern, explanationPatternMessage } from '../utils/validationRules';

interface SecurityBackgroundIVProps {
  form: any;
}

const { TextArea } = Input;

const SecurityBackgroundIV: React.FC<SecurityBackgroundIVProps> = ({ form }) => {
  // Get form values
  const formValues = form.getFieldsValue(true);
  
  // Initialize state from form values
  const [hasImmigrationFraud, setHasImmigrationFraud] = useState<string | null>(formValues?.hasImmigrationFraud || null);
  const [hasDeportation, setHasDeportation] = useState<string | null>(formValues?.hasDeportation || null);
  const [hasRemovalHearing, setHasRemovalHearing] = useState<string | null>(formValues?.hasRemovalHearing || null);
  const [hasFailedToAttend, setHasFailedToAttend] = useState<string | null>(formValues?.hasFailedToAttend || null);
  const [hasViolatedVisa, setHasViolatedVisa] = useState<string | null>(formValues?.hasViolatedVisa || null);

  // Update state when form values change
  useEffect(() => {
    const values = form.getFieldsValue(true);
    if (values.hasImmigrationFraud !== undefined) {
      setHasImmigrationFraud(values.hasImmigrationFraud);
    }
    if (values.hasDeportation !== undefined) {
      setHasDeportation(values.hasDeportation);
    }
    if (values.hasRemovalHearing !== undefined) {
      setHasRemovalHearing(values.hasRemovalHearing);
    }
    if (values.hasFailedToAttend !== undefined) {
      setHasFailedToAttend(values.hasFailedToAttend);
    }
    if (values.hasViolatedVisa !== undefined) {
      setHasViolatedVisa(values.hasViolatedVisa);
    }
  }, [form]);

  // Handle radio button changes
  const handleImmigrationFraudChange = (e: any) => {
    const value = e.target.value;
    setHasImmigrationFraud(value);
    form.setFieldsValue({ hasImmigrationFraud: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ immigrationFraudExplanation: undefined });
    }
  };

  const handleDeportationChange = (e: any) => {
    const value = e.target.value;
    setHasDeportation(value);
    form.setFieldsValue({ hasDeportation: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ deportationExplanation: undefined });
    }
  };

  const handleRemovalHearingChange = (e: any) => {
    const value = e.target.value;
    setHasRemovalHearing(value);
    form.setFieldsValue({ hasRemovalHearing: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ removalHearingExplanation: undefined });
    }
  };

  const handleFailedToAttendChange = (e: any) => {
    const value = e.target.value;
    setHasFailedToAttend(value);
    form.setFieldsValue({ hasFailedToAttend: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ failedToAttendExplanation: undefined });
    }
  };

  const handleViolatedVisaChange = (e: any) => {
    const value = e.target.value;
    setHasViolatedVisa(value);
    form.setFieldsValue({ hasViolatedVisa: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ violatedVisaExplanation: undefined });
    }
  };

  return (
    <div className="ds160-section">
      <h2>安全和背景: 第四部分</h2>
      <div style={{ marginBottom: '30px' }}>
        <p className="section-description">
          注意：请提供以下安全与背景信息。对于所有要求解释的问题，请提供完整、准确的信息。属于法律规定的不可进入美国的特定类别的申请者可能无法获得签证（提前获得豁免的申请人除外）。下列情况是否适用于您？如果您回答"是"，这并不意味您就必然无资格获得签证，但是您可能被要求与签证官员进行面谈。
        </p>
      </div>

      {/* Removal Hearing Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经是一移送或遣返出境听证会的当事人？"
              name="hasRemovalHearing"
            >
              <Radio.Group onChange={handleRemovalHearingChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasRemovalHearing === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="removalHearingExplanation"
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
            <h4 className="help-header">帮助：移送或遣返出境听证会</h4>
            <p>如果您曾经参与过移民法庭的遣返或驱逐出境程序，请选择"是"。</p>
          </div>
        </div>
      </fieldset>

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
            <h4 className="help-header">帮助：移民欺诈</h4>
            <p>如果您曾经通过提供虚假信息或欺骗手段获取美国签证或入境许可，请选择"是"。</p>
          </div>
        </div>
      </fieldset>

      {/* Failed to Attend Hearing Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="在最近5年内，您是否曾经缺席过相关遣返或拒绝入境的听证会？"
              name="hasFailedToAttend"
            >
              <Radio.Group onChange={handleFailedToAttendChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasFailedToAttend === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="failedToAttendExplanation"
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
            <h4 className="help-header">帮助：缺席听证会</h4>
            <p>如果您在过去5年内被要求参加移民听证会但未出席，请选择"是"。</p>
          </div>
        </div>
      </fieldset>

      {/* Visa Violation Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经在美非法逗留、超出移民官批准的逗留时间逾期不归、或违反了一美国签证的相关条款？"
              name="hasViolatedVisa"
            >
              <Radio.Group onChange={handleViolatedVisaChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasViolatedVisa === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="violatedVisaExplanation"
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
            <h4 className="help-header">帮助：签证违规</h4>
            <p>如果您曾经超过签证允许的停留时间或违反了签证条款（如以旅游签证工作），请选择"是"。</p>
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
            <h4 className="help-header">帮助：驱逐出境</h4>
            <p>如果您曾经被任何国家正式驱逐或遣返，请选择"是"。</p>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default SecurityBackgroundIV;
