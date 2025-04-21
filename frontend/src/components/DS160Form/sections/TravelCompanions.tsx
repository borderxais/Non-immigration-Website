import React from 'react';
import { Form, Radio, Input, Select } from 'antd';
import QuestionItem from '../common/QuestionItem';
import RepeatableFormItem from '../common/RepeatableFormItem';
import DateInput from '../common/DateInput';
import { countryOptions } from '../utils/formOptions';
import '../ds160Form.css';

interface TravelCompanionsProps {
  form: any;
}

const TravelCompanions: React.FC<TravelCompanionsProps> = ({ form }) => {
  const handleCompanionsChange = (e: any) => {
    form.setFieldsValue({ hasCompanions: e.target.value });
  };

  return (
    <div className="travel-companions-section">
      <div className="question-section">
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

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.hasCompanions !== currentValues.hasCompanions
          }
        >
          {({ getFieldValue }) => {
            const hasCompanions = getFieldValue('hasCompanions');
            
            if (hasCompanions === 'Y') {
              return (
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
                              <QuestionItem
                                question="姓氏"
                                name="surname"
                              >
                                <Input maxLength={33} placeholder="例如：ZHANG" style={{ width: '95%' }} />
                              </QuestionItem>
                            </div>
                            <div className="explanation-column">
                              {/* Empty explanation column to maintain layout */}
                            </div>
                          </div>

                          <div className="question-row">
                            <div className="question-column">
                              <QuestionItem
                                question="名字"
                                name="givenName"
                              >
                                <Input maxLength={33} placeholder="例如：SAN" style={{ width: '95%' }} />
                              </QuestionItem>
                            </div>
                            <div className="explanation-column">
                              {/* Empty explanation column to maintain layout */}
                            </div>
                          </div>

                          <div className="question-row">
                            <div className="question-column">
                              <QuestionItem
                                question="关系"
                                name="relationship"
                              >
                                <Select style={{ width: '95%' }} placeholder="- 选择一个 -">
                                  <Select.Option value="spouse">配偶</Select.Option>
                                  <Select.Option value="child">子女</Select.Option>
                                  <Select.Option value="parent">父母</Select.Option>
                                  <Select.Option value="relative">其他亲属</Select.Option>
                                  <Select.Option value="friend">朋友</Select.Option>
                                  <Select.Option value="business">商业伙伴</Select.Option>
                                  <Select.Option value="other">其他</Select.Option>
                                </Select>
                              </QuestionItem>
                            </div>
                            <div className="explanation-column">
                              {/* Empty explanation column to maintain layout */}
                            </div>
                          </div>
                        </>
                      )}
                    </RepeatableFormItem>
                  </div>
                </>
              );
            }
            return null;
          }}
        </Form.Item>
      </div>
    </div>
  );
};

export default TravelCompanions;