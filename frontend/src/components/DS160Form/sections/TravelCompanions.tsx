import React, { useState, useEffect } from 'react';
import { Radio, Input, Select, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
import '../ds160Form.css';
import { locationValidator, locationPatternMessage, maxLengths, namePattern, namePatternMessage } from '../utils/validationRules';

interface TravelCompanionsProps {
  form: any;
}

const TravelCompanions: React.FC<TravelCompanionsProps> = ({ form }) => {
  const [hasCompanions, setHasCompanions] = useState<string | null>(form.getFieldValue('hasCompanions') || null);
  const [groupTravel, setGroupTravel] = useState<string | null>(form.getFieldValue('groupTravel') || null);

  // Initialize state from form values when component mounts
  useEffect(() => {
    const formHasCompanions = form.getFieldValue('hasCompanions');
    const formGroupTravel = form.getFieldValue('groupTravel');
    
    if (formHasCompanions) setHasCompanions(formHasCompanions);
    if (formGroupTravel) setGroupTravel(formGroupTravel);
  }, [form]);

  // Clear companions data when groupTravel changes to 'Y'
  useEffect(() => {
    if (groupTravel === 'Y') {
      form.setFieldsValue({ companions: undefined });
    } else if (groupTravel === 'N') {
      // Clear group name when individual companions are selected
      form.setFieldsValue({ groupName: undefined });
    }
  }, [groupTravel, form]);

  const handleCompanionsChange = (e: any) => {
    setHasCompanions(e.target.value);
    form.setFieldsValue({ hasCompanions: e.target.value });
    
    // If no companions, clear both group travel and companions data
    if (e.target.value === 'N') {
      setGroupTravel(null);
      form.setFieldsValue({ 
        groupTravel: undefined,
        groupName: undefined,
        companions: undefined 
      });
    }
  };

  const handleGroupTravelChange = (e: any) => {
    setGroupTravel(e.target.value);
    form.setFieldsValue({ groupTravel: e.target.value });
    
    // If group travel is selected, clear any existing companions data
    if (e.target.value === 'Y') {
      form.setFieldsValue({ companions: undefined });
    } else if (e.target.value === 'N') {
      // If individual companions are selected, clear group name
      form.setFieldsValue({ groupName: undefined });
    }
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
              <Radio.Group onChange={handleCompanionsChange} value={hasCompanions}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：同行人</h4>
            <p>如果您与家人一起旅行，或作为组织旅游团、表演团体或运动队的一部分旅行，请回答"是"。如果您与同一雇主的其他员工一起出差，则无需列出这些人员。</p>
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
                  <Radio.Group onChange={handleGroupTravelChange} value={groupTravel}>
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
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请输入您所属团队或组织的名称</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <QuestionItem
                        question="团队或组织名称"
                        name="groupName"
                        validator={locationValidator}
                        validatorMessage={locationPatternMessage}
                      >
                        <Input style={{ width: '99%' }} maxLength={40} placeholder="请输入团队或组织名称" />
                      </QuestionItem>
                    </div>
                  </div>
                  <div className="explanation-column">
                  </div>
              </div>
              </>
            ) : groupTravel === 'N' && (
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供同行人信息：</h4>
                <div className="question-row">
                  <div className="question-column">
                    <RepeatableFormItem
                      name="companions"
                      addButtonText="增加另一个"
                      removeButtonText="移走"
                    >
                      {(field: FormListFieldData) => (
                        <>
                          <Form.Item
                            {...field}
                            name={[field.name, 'surname']}
                            label="姓氏"
                            rules={[{ required: true, message: '请输入同行人姓氏' }, 
                              { max: maxLengths.name, message: `不能超过${maxLengths.name}个字符` }, 
                              { pattern: namePattern, message: namePatternMessage }]}
                            style={{ marginBottom: '16px' }}
                          >
                            <Input style={{ width: '95%' }} maxLength={33} placeholder="例如：ZHANG" />
                          </Form.Item>

                          <Form.Item
                            {...field}
                            name={[field.name, 'givenName']}
                            label="名字"
                            rules={[{ required: true, message: '请输入同行人名字' }, 
                              { max: maxLengths.name, message: `不能超过${maxLengths.name}个字符` }, 
                              { pattern: namePattern, message: namePatternMessage }]}
                            style={{ marginBottom: '16px' }}
                          >
                            <Input style={{ width: '95%' }} maxLength={33} placeholder="例如：SAN" />
                          </Form.Item>

                          <Form.Item
                            {...field}
                            name={[field.name, 'relationship']}
                            label="关系"
                            rules={[{ required: true, message: '请选择与同行人的关系' }]}
                          >
                            <Select style={{ width: '95%' }} placeholder="- 选择一个 -">
                              <Select.Option value="S">配偶</Select.Option>
                              <Select.Option value="C">子女</Select.Option>
                              <Select.Option value="P">父母</Select.Option>
                              <Select.Option value="R">其他亲属</Select.Option>
                              <Select.Option value="F">朋友</Select.Option>
                              <Select.Option value="B">商业伙伴</Select.Option>
                              <Select.Option value="O">其他</Select.Option>
                            </Select>
                          </Form.Item>
                        </>
                      )}
                    </RepeatableFormItem>
                  </div>
                  <div className="explanation-column">
                  </div>
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