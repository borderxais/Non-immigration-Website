import React, { useState } from 'react';
import { Form, Input, Radio } from 'antd';
import { FormInstance } from 'antd/lib/form';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';

interface PreviousTravelProps {
  form: FormInstance;
}

const PreviousTravel: React.FC<PreviousTravelProps> = ({ form }) => {
  const [hasBeenToUS, setHasBeenToUS] = useState<string | null>(null);

  const handleHasBeenToUSChange = (e: any) => {
    setHasBeenToUS(e.target.value);
    form.setFieldsValue({ hasBeenToUS: e.target.value });
  };

  return (
    <fieldset className="question-section">
      <div className="question-row">
        <div className="question-column">
          <QuestionItem
            question="您是否去过美国？"
            name="hasBeenToUS"
          >
            <Radio.Group onChange={handleHasBeenToUSChange}>
              <Radio value="Y">是</Radio>
              <Radio value="N">否</Radio>
            </Radio.Group>
          </QuestionItem>
        </div>
        <div className="explanation-column">
          <h4 className="help-header">帮助：过往美国旅行</h4>
          <p>请提供您过去是否去过美国的信息。如果去过，需要提供最近5次访问的详细信息。</p>
        </div>
      </div>

      {hasBeenToUS === 'Y' && (
        <>
          <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供您最近5次访问美国的信息：</h4>
          <div className="highlighted-block">
            <RepeatableFormItem
              name="previousVisits"
              addButtonText="增加另一个访问记录"
              removeButtonText="移走"
            >
              {(field: FormListFieldData) => (
                <>
                  <div className="question-row">
                    <div className="question-column">
                      <Form.Item
                        {...field}
                        name={[field.name, 'arrivalDate']}
                        label="到达日期"
                        rules={[{ required: true, message: '请输入到达日期' }]}
                        style={{ marginBottom: '16px' }}
                      >
                        <DateInput
                          dayName={`${field.name}_arrivalDay`}
                          monthName={`${field.name}_arrivalMonth`}
                          yearName={`${field.name}_arrivalYear`}
                        />
                      </Form.Item>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：到达日期</h4>
                      <p>请输入您抵达美国的具体日期。</p>
                    </div>
                  </div>

                  <div className="question-row">
                    <div className="question-column">
                      <Form.Item
                        {...field}
                        name={[field.name, 'lengthOfStay']}
                        label="停留时长"
                        rules={[{ required: true, message: '请输入停留时长' }]}
                        style={{ marginBottom: '16px' }}
                      >
                        <Input style={{ width: '95%' }} placeholder="例如：30天" />
                      </Form.Item>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：停留时长</h4>
                      <p>请输入您在美国停留的时间长度，可以用天数表示。</p>
                    </div>
                  </div>

                  <div className="question-row">
                    <div className="question-column">
                      <Form.Item
                        {...field}
                        name={[field.name, 'visitPurpose']}
                        label="访问目的"
                        rules={[{ required: true, message: '请输入访问目的' }]}
                        style={{ marginBottom: '16px' }}
                      >
                        <Input style={{ width: '95%' }} placeholder="例如：旅游、商务、学习" />
                      </Form.Item>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：访问目的</h4>
                      <p>请简要说明您访问美国的主要目的。</p>
                    </div>
                  </div>
                </>
              )}
            </RepeatableFormItem>
          </div>
        </>
      )}
    </fieldset>
  );
};

export default PreviousTravel;