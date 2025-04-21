import React, { useState } from 'react';
import { Radio, Input, Select, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import RepeatableFormItem from '../common/RepeatableFormItem';
import '../ds160Form.css';

interface TravelCompanionsProps {
  form: any;
}

const TravelCompanions: React.FC<TravelCompanionsProps> = ({ form }) => {
  const [hasCompanions, setHasCompanions] = useState<string | null>(null);
  const [groupTravel, setGroupTravel] = useState<string | null>(null);

  const handleCompanionsChange = (e: any) => {
    setHasCompanions(e.target.value);
    form.setFieldsValue({ hasCompanions: e.target.value });
  };

  const handleGroupTravelChange = (e: any) => {
    setGroupTravel(e.target.value);
    form.setFieldsValue({ groupTravel: e.target.value });
  };

  return (
    <div className="travel-companions-section">
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否有同行人？"
              name="hasCompanions"
            >
              <Radio.Group onChange={handleCompanionsChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：同行人</h4>
            <p>请选择是否有人与您一同旅行</p>
          </div>
        </div>

        {hasCompanions === 'Y' && (
          <>
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="您是否作为一个团队或者组织的成员去旅行？"
                  name="groupTravel"
                >
                  <Radio.Group onChange={handleGroupTravelChange}>
                    <Radio value="Y">是</Radio>
                    <Radio value="N">否</Radio>
                  </Radio.Group>
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：团队旅行</h4>
                <p>如果您是作为一个组织、团队或旅行团的成员旅行，请选择'是'</p>
              </div>
            </div>

            {groupTravel === 'Y' ? (
              <div className="highlighted-block">
                <div className="question-row">
                  <div className="question-column">
                    <QuestionItem
                      question="团队或组织名称"
                      name="groupName"
                    >
                      <Input style={{ width: '99%' }} maxLength={40} placeholder="请输入团队或组织名称" />
                    </QuestionItem>
                  </div>
                  <div className="explanation-column">
                    <h4 className="help-header">帮助：团队名称</h4>
                    <p>请输入您所属团队或组织的名称</p>
                  </div>
                </div>
              </div>
            ) : groupTravel === 'N' && (
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供同行人信息：</h4>
                <div className="highlighted-block">
                  <RepeatableFormItem
                    name="companions"
                    addButtonText="增加另一个同行人"
                    removeButtonText="移走"
                  >
                    {(field) => (
                      <>
                        <div className="question-row">
                          <div className="question-column">
                            <Form.Item
                              {...field}
                              name={[field.name, 'surname']}
                            >
                              <QuestionItem
                                question="姓氏"
                                name="surname"
                              >
                                <Input maxLength={33} placeholder="例如：ZHANG" style={{ width: '95%' }} />
                              </QuestionItem>
                            </Form.Item>
                          </div>
                          <div className="explanation-column">
                            <h4 className="help-header">帮助：同行人姓氏</h4>
                            <p>请输入同行人的姓氏（与护照一致）</p>
                          </div>
                        </div>

                        <div className="question-row">
                          <div className="question-column">
                            <Form.Item
                              {...field}
                              name={[field.name, 'givenName']}
                            >
                              <QuestionItem
                                question="名字"
                                name="givenName"
                              >
                                <Input maxLength={33} placeholder="例如：SAN" style={{ width: '95%' }} />
                              </QuestionItem>
                            </Form.Item>
                          </div>
                          <div className="explanation-column">
                            <h4 className="help-header">帮助：同行人名字</h4>
                            <p>请输入同行人的名字（与护照一致）</p>
                          </div>
                        </div>

                        <div className="question-row">
                          <div className="question-column">
                            <Form.Item
                              {...field}
                              name={[field.name, 'relationship']}
                            >
                              <QuestionItem
                                question="关系"
                                name="relationship"
                              >
                                <Select style={{ width: '95%' }} placeholder="- 选择一个 -">
                                  <Select.Option value="spouse">配偶</Select.Option>
                                  <Select.Option value="child">子女</Select.Option>
                                  <Select.Option value="parent">父母</Select.Option>
                                  <Select.Option value="sibling">兄弟姐妹</Select.Option>
                                  <Select.Option value="relative">其他亲属</Select.Option>
                                  <Select.Option value="friend">朋友</Select.Option>
                                  <Select.Option value="business">商业伙伴</Select.Option>
                                  <Select.Option value="other">其他</Select.Option>
                                </Select>
                              </QuestionItem>
                            </Form.Item>
                          </div>
                          <div className="explanation-column">
                            <h4 className="help-header">帮助：关系</h4>
                            <p>请选择此同行人与您的关系</p>
                          </div>
                        </div>
                      </>
                    )}
                  </RepeatableFormItem>
                </div>
              </>
            )}
          </>
        )}
      </fieldset>
    </div>
  );
};

export default TravelCompanions;