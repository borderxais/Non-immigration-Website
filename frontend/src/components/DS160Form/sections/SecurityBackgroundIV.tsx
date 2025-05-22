import React, { useState } from 'react';
import { Radio, Input, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { maxLengths, explanationPattern, explanationPatternMessage } from '../utils/validationRules';

interface SecurityBackgroundIVProps {
  form: any;
}

const { TextArea } = Input;

const SecurityBackgroundIV: React.FC<SecurityBackgroundIVProps> = ({ form }) => {
  // State for conditional rendering
  const [hasImmigrationFraud, setHasImmigrationFraud] = useState<string | null>(null);
  const [hasDeportation, setHasDeportation] = useState<string | null>(null);
  const [hasRemovalHearing, setHasRemovalHearing] = useState<string | null>(null);
  const [hasFailedToAttend, setHasFailedToAttend] = useState<string | null>(null);
  const [hasViolatedVisa, setHasViolatedVisa] = useState<string | null>(null);
  const [hasAttendedWithoutReimbursement, setHasAttendedWithoutReimbursement] = useState<string | null>(null);

  // Handle radio button changes
  const handleImmigrationFraudChange = (e: any) => {
    setHasImmigrationFraud(e.target.value);
    form.setFieldsValue({ hasImmigrationFraud: e.target.value });
  };

  const handleDeportationChange = (e: any) => {
    setHasDeportation(e.target.value);
    form.setFieldsValue({ hasDeportation: e.target.value });
  };

  const handleRemovalHearingChange = (e: any) => {
    setHasRemovalHearing(e.target.value);
    form.setFieldsValue({ hasRemovalHearing: e.target.value });
  };

  const handleFailedToAttendChange = (e: any) => {
    setHasFailedToAttend(e.target.value);
    form.setFieldsValue({ hasFailedToAttend: e.target.value });
  };

  const handleViolatedVisaChange = (e: any) => {
    setHasViolatedVisa(e.target.value);
    form.setFieldsValue({ hasViolatedVisa: e.target.value });
  };

  const handleAttendedWithoutReimbursementChange = (e: any) => {
    setHasAttendedWithoutReimbursement(e.target.value);
    form.setFieldsValue({ hasAttendedWithoutReimbursement: e.target.value });
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

export default SecurityBackgroundIV;
