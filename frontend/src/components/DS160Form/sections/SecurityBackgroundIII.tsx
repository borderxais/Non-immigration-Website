import React, { useState, useEffect } from 'react';
import { Radio, Input, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { maxLengths, explanationPattern, explanationPatternMessage } from '../utils/validationRules';

interface SecurityBackgroundIIIProps {
  form: any;
}

const { TextArea } = Input;

const SecurityBackgroundIII: React.FC<SecurityBackgroundIIIProps> = ({ form }) => {
  // Get form values
  const formValues = form.getFieldsValue(true);
  
  // Initialize state from form values
  const [hasIllegalActivity, setHasIllegalActivity] = useState<string | null>(formValues?.hasIllegalActivity || null);
  const [hasTerroristActivity, setHasTerroristActivity] = useState<string | null>(formValues?.hasTerroristActivity || null);
  const [hasTerroristSupport, setHasTerroristSupport] = useState<string | null>(formValues?.hasTerroristSupport || null);
  const [hasTerroristOrg, setHasTerroristOrg] = useState<string | null>(formValues?.hasTerroristOrg || null);
  const [hasTerroristRel, setHasTerroristRel] = useState<string | null>(formValues?.hasTerroristRel || null);
  const [hasGenocide, setHasGenocide] = useState<string | null>(formValues?.hasGenocide || null);
  const [hasTorture, setHasTorture] = useState<string | null>(formValues?.hasTorture || null);
  const [hasExViolence, setHasExViolence] = useState<string | null>(formValues?.hasExViolence || null);
  const [hasChildSoldier, setHasChildSoldier] = useState<string | null>(formValues?.hasChildSoldier || null);
  const [hasReligiousFreedom, setHasReligiousFreedom] = useState<string | null>(formValues?.hasReligiousFreedom || null);
  const [hasPopulationControls, setHasPopulationControls] = useState<string | null>(formValues?.hasPopulationControls || null);
  const [hasTransplant, setHasTransplant] = useState<string | null>(formValues?.hasTransplant || null);

  // Update state when form values change
  useEffect(() => {
    const values = form.getFieldsValue(true);
    if (values.hasIllegalActivity !== undefined) {
      setHasIllegalActivity(values.hasIllegalActivity);
    }
    if (values.hasTerroristActivity !== undefined) {
      setHasTerroristActivity(values.hasTerroristActivity);
    }
    if (values.hasTerroristSupport !== undefined) {
      setHasTerroristSupport(values.hasTerroristSupport);
    }
    if (values.hasTerroristOrg !== undefined) {
      setHasTerroristOrg(values.hasTerroristOrg);
    }
    if (values.hasTerroristRel !== undefined) {
      setHasTerroristRel(values.hasTerroristRel);
    }
    if (values.hasGenocide !== undefined) {
      setHasGenocide(values.hasGenocide);
    }
    if (values.hasTorture !== undefined) {
      setHasTorture(values.hasTorture);
    }
    if (values.hasExViolence !== undefined) {
      setHasExViolence(values.hasExViolence);
    }
    if (values.hasChildSoldier !== undefined) {
      setHasChildSoldier(values.hasChildSoldier);
    }
    if (values.hasReligiousFreedom !== undefined) {
      setHasReligiousFreedom(values.hasReligiousFreedom);
    }
    if (values.hasPopulationControls !== undefined) {
      setHasPopulationControls(values.hasPopulationControls);
    }
    if (values.hasTransplant !== undefined) {
      setHasTransplant(values.hasTransplant);
    }
  }, [form]);

  // Handle radio button changes
  const handleIllegalActivityChange = (e: any) => {
    const value = e.target.value;
    setHasIllegalActivity(value);
    form.setFieldsValue({ hasIllegalActivity: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ illegalActivityExplanation: undefined });
    }
  };

  const handleTerroristActivityChange = (e: any) => {
    const value = e.target.value;
    setHasTerroristActivity(value);
    form.setFieldsValue({ hasTerroristActivity: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ terroristActivityExplanation: undefined });
    }
  };

  const handleTerroristSupportChange = (e: any) => {
    const value = e.target.value;
    setHasTerroristSupport(value);
    form.setFieldsValue({ hasTerroristSupport: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ terroristSupportExplanation: undefined });
    }
  };

  const handleTerroristOrgChange = (e: any) => {
    const value = e.target.value;
    setHasTerroristOrg(value);
    form.setFieldsValue({ hasTerroristOrg: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ terroristOrgExplanation: undefined });
    }
  };

  const handleTerroristRelChange = (e: any) => {
    const value = e.target.value;
    setHasTerroristRel(value);
    form.setFieldsValue({ hasTerroristRel: value });
    
    // Clear explanation if "No" is selected
    if (value === 'N') {
      form.setFieldsValue({ terroristRelExplanation: undefined });
    }
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
    </div>
  );
};

export default SecurityBackgroundIII;
