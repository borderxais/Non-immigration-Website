import React, { useState } from 'react';
import { Radio, Input, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';

interface SecurityBackgroundIIProps {
  form: any;
}

const { TextArea } = Input;

const SecurityBackgroundII: React.FC<SecurityBackgroundIIProps> = ({ form }) => {
  // State for conditional rendering
  const [hasArrest, setHasArrest] = useState<string | null>(null);
  const [hasControlledSubstances, setHasControlledSubstances] = useState<string | null>(null);
  const [hasProstitution, setHasProstitution] = useState<string | null>(null);
  const [hasMoneyLaundering, setHasMoneyLaundering] = useState<string | null>(null);
  const [hasHumanTrafficking, setHasHumanTrafficking] = useState<string | null>(null);
  const [hasAssistedTrafficking, setHasAssistedTrafficking] = useState<string | null>(null);
  const [hasTraffickingRelated, setHasTraffickingRelated] = useState<string | null>(null);

  // Handle radio button changes
  const handleArrestChange = (e: any) => {
    setHasArrest(e.target.value);
    form.setFieldsValue({ hasArrest: e.target.value });
  };

  const handleControlledSubstancesChange = (e: any) => {
    setHasControlledSubstances(e.target.value);
    form.setFieldsValue({ hasControlledSubstances: e.target.value });
  };

  const handleProstitutionChange = (e: any) => {
    setHasProstitution(e.target.value);
    form.setFieldsValue({ hasProstitution: e.target.value });
  };

  const handleMoneyLaunderingChange = (e: any) => {
    setHasMoneyLaundering(e.target.value);
    form.setFieldsValue({ hasMoneyLaundering: e.target.value });
  };

  const handleHumanTraffickingChange = (e: any) => {
    setHasHumanTrafficking(e.target.value);
    form.setFieldsValue({ hasHumanTrafficking: e.target.value });
  };

  const handleAssistedTraffickingChange = (e: any) => {
    setHasAssistedTrafficking(e.target.value);
    form.setFieldsValue({ hasAssistedTrafficking: e.target.value });
  };

  const handleTraffickingRelatedChange = (e: any) => {
    setHasTraffickingRelated(e.target.value);
    form.setFieldsValue({ hasTraffickingRelated: e.target.value });
  };

  return (
    <div className="ds160-section">
      <h2>安全和背景: 第二部分</h2>
      <div style={{ marginBottom: '30px' }}>
        <p className="section-description">
          注意：请提供以下安全与背景信息。对于所有要求解释的问题，请提供完整、准确的信息。对于那些属于法律特定范畴内不许入境的人员，我们不能颁发签证（提前获得豁免的申请人除外）。下列情况有适用于您的吗？如果您回答"是"，这并不意味着您就无资格获得签证，但是您可能需要与签证官员进行面谈。
        </p>
      </div>

      {/* Arrest or Conviction Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经因任何违法或犯罪行为被逮捕或定罪，即使后来获得赦免、特赦或其他类似的宽恕？"
              name="hasArrest"
            >
              <Radio.Group onChange={handleArrestChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasArrest === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="arrestExplanation"
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

      {/* Controlled Substances Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经违反或参与阴谋违反有关管制物质的任何法律？"
              name="hasControlledSubstances"
            >
              <Radio.Group onChange={handleControlledSubstancesChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasControlledSubstances === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="controlledSubstancesExplanation"
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

      {/* Prostitution Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否前往美国从事卖淫或非法商业化色情活动，或者您在过去10年内是否从事过卖淫或为卖淫提供中介服务？"
              name="hasProstitution"
            >
              <Radio.Group onChange={handleProstitutionChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasProstitution === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="prostitutionExplanation"
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

      {/* Money Laundering Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经参与或试图参与洗钱活动？"
              name="hasMoneyLaundering"
            >
              <Radio.Group onChange={handleMoneyLaunderingChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasMoneyLaundering === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="moneyLaunderingExplanation"
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

      {/* Human Trafficking Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经在美国境内或境外实施或参与阴谋实施人口贩运犯罪？"
              name="hasHumanTrafficking"
            >
              <Radio.Group onChange={handleHumanTraffickingChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasHumanTrafficking === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="humanTraffickingExplanation"
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

      {/* Assisted Trafficking Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经明知而援助、教唆、协助或勾结在美国境内或境外实施或参与阴谋实施严重人口贩运犯罪的个人？"
              name="hasAssistedTrafficking"
            >
              <Radio.Group onChange={handleAssistedTraffickingChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasAssistedTrafficking === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="assistedTraffickingExplanation"
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

      {/* Trafficking Related Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否是在美国境内或境外实施或参与阴谋实施人口贩运犯罪的个人的配偶、子女，并且在过去五年内明知而从贩运活动中获益？"
              name="hasTraffickingRelated"
            >
              <Radio.Group onChange={handleTraffickingRelatedChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasTraffickingRelated === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="traffickingRelatedExplanation"
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

export default SecurityBackgroundII;
