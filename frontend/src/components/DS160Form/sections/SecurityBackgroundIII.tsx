import React, { useState } from 'react';
import { Radio, Input, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';

interface SecurityBackgroundIIIProps {
  form: any;
}

const { TextArea } = Input;

const SecurityBackgroundIII: React.FC<SecurityBackgroundIIIProps> = ({ form }) => {
  // State for conditional rendering
  const [hasIllegalActivity, setHasIllegalActivity] = useState<string | null>(null);
  const [hasTerroristActivity, setHasTerroristActivity] = useState<string | null>(null);
  const [hasTerroristSupport, setHasTerroristSupport] = useState<string | null>(null);
  const [hasTerroristOrg, setHasTerroristOrg] = useState<string | null>(null);
  const [hasTerroristRel, setHasTerroristRel] = useState<string | null>(null);
  const [hasGenocide, setHasGenocide] = useState<string | null>(null);
  const [hasTorture, setHasTorture] = useState<string | null>(null);
  const [hasExViolence, setHasExViolence] = useState<string | null>(null);
  const [hasChildSoldier, setHasChildSoldier] = useState<string | null>(null);
  const [hasReligiousFreedom, setHasReligiousFreedom] = useState<string | null>(null);
  const [hasPopulationControls, setHasPopulationControls] = useState<string | null>(null);
  const [hasTransplant, setHasTransplant] = useState<string | null>(null);

  // Handle radio button changes
  const handleIllegalActivityChange = (e: any) => {
    setHasIllegalActivity(e.target.value);
    form.setFieldsValue({ hasIllegalActivity: e.target.value });
  };

  const handleTerroristActivityChange = (e: any) => {
    setHasTerroristActivity(e.target.value);
    form.setFieldsValue({ hasTerroristActivity: e.target.value });
  };

  const handleTerroristSupportChange = (e: any) => {
    setHasTerroristSupport(e.target.value);
    form.setFieldsValue({ hasTerroristSupport: e.target.value });
  };

  const handleTerroristOrgChange = (e: any) => {
    setHasTerroristOrg(e.target.value);
    form.setFieldsValue({ hasTerroristOrg: e.target.value });
  };

  const handleTerroristRelChange = (e: any) => {
    setHasTerroristRel(e.target.value);
    form.setFieldsValue({ hasTerroristRel: e.target.value });
  };

  const handleGenocideChange = (e: any) => {
    setHasGenocide(e.target.value);
    form.setFieldsValue({ hasGenocide: e.target.value });
  };

  const handleTortureChange = (e: any) => {
    setHasTorture(e.target.value);
    form.setFieldsValue({ hasTorture: e.target.value });
  };

  const handleExViolenceChange = (e: any) => {
    setHasExViolence(e.target.value);
    form.setFieldsValue({ hasExViolence: e.target.value });
  };

  const handleChildSoldierChange = (e: any) => {
    setHasChildSoldier(e.target.value);
    form.setFieldsValue({ hasChildSoldier: e.target.value });
  };

  const handleReligiousFreedomChange = (e: any) => {
    setHasReligiousFreedom(e.target.value);
    form.setFieldsValue({ hasReligiousFreedom: e.target.value });
  };

  const handlePopulationControlsChange = (e: any) => {
    setHasPopulationControls(e.target.value);
    form.setFieldsValue({ hasPopulationControls: e.target.value });
  };

  const handleTransplantChange = (e: any) => {
    setHasTransplant(e.target.value);
    form.setFieldsValue({ hasTransplant: e.target.value });
  };

  return (
    <div className="ds160-section">
      <h2>安全和背景: 第三部分</h2>
      <div style={{ marginBottom: '30px' }}>
        <p className="section-description">
          注意：请提供以下安全与背景信息。对于所有要求解释的问题，请提供完整、准确的信息。对于那些属于法律特定范畴内不许入境的人员，我们不能颁发签证（提前获得豁免的申请人除外）。下列情况有适用于您的吗？如果您回答"是"，这并不意味着您就无资格获得签证，但是您可能需要与签证官员进行面谈。
        </p>
      </div>

      {/* Illegal Activity Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否在美国期间寻求从事间谍活动、破坏活动、出口管制违法或任何其他非法活动？"
              name="hasIllegalActivity"
            >
              <Radio.Group onChange={handleIllegalActivityChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasIllegalActivity === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="illegalActivityExplanation"
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

      {/* Terrorist Activity Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否在美国期间寻求从事恐怖活动，或者您是否曾经从事过恐怖活动？"
              name="hasTerroristActivity"
            >
              <Radio.Group onChange={handleTerroristActivityChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasTerroristActivity === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="terroristActivityExplanation"
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

      {/* Terrorist Support Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经或打算向恐怖分子或恐怖组织提供财政援助或其他支持？"
              name="hasTerroristSupport"
            >
              <Radio.Group onChange={handleTerroristSupportChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasTerroristSupport === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="terroristSupportExplanation"
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

      {/* Terrorist Organization Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否是恐怖组织的成员或代表？"
              name="hasTerroristOrg"
            >
              <Radio.Group onChange={handleTerroristOrgChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasTerroristOrg === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="terroristOrgExplanation"
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

      {/* Terrorist Related Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否是在过去五年内从事恐怖活动（包括向恐怖分子或恐怖组织提供财政援助或其他支持）的个人的配偶、子女？"
              name="hasTerroristRel"
            >
              <Radio.Group onChange={handleTerroristRelChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasTerroristRel === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="terroristRelExplanation"
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

      {/* Genocide Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经下令、煽动、实施、协助或以其他方式参与种族灭绝？"
              name="hasGenocide"
            >
              <Radio.Group onChange={handleGenocideChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasGenocide === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="genocideExplanation"
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

      {/* Torture Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经实施、下令、煽动、协助或以其他方式参与酷刑？"
              name="hasTorture"
            >
              <Radio.Group onChange={handleTortureChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasTorture === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="tortureExplanation"
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

      {/* Extrajudicial Violence Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经实施、下令、煽动、协助或以其他方式参与法外处决、政治谋杀或其他暴力行为？"
              name="hasExViolence"
            >
              <Radio.Group onChange={handleExViolenceChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasExViolence === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="exViolenceExplanation"
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

      {/* Child Soldier Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经参与招募或使用童兵？"
              name="hasChildSoldier"
            >
              <Radio.Group onChange={handleChildSoldierChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasChildSoldier === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="childSoldierExplanation"
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

      {/* Religious Freedom Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经在担任政府官员期间，在任何时候负责或直接实施特别严重的侵犯宗教自由行为？"
              name="hasReligiousFreedom"
            >
              <Radio.Group onChange={handleReligiousFreedomChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasReligiousFreedom === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="religiousFreedomExplanation"
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

      {/* Population Controls Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经直接参与建立或执行人口控制，迫使妇女违背其自由选择进行堕胎或迫使男性或女性违背其自由意愿进行绝育？"
              name="hasPopulationControls"
            >
              <Radio.Group onChange={handlePopulationControlsChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasPopulationControls === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="populationControlsExplanation"
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

      {/* Transplant Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经直接参与强制移植人体器官或身体组织？"
              name="hasTransplant"
            >
              <Radio.Group onChange={handleTransplantChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {hasTransplant === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="transplantExplanation"
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

export default SecurityBackgroundIII;
