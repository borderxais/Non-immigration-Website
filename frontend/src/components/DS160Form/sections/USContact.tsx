import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Checkbox } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { usStateOptions } from '../utils/formOptions';
import { maxLengths, englishNameValidator, addressValidator, locationValidator, zipCodeValidator, numPhoneValidator, emailValidator } from '../utils/validationRules';

interface USContactProps {
    form: any;
}

const USContact: React.FC<USContactProps> = ({ form }) => {
  // 使用 Form.useWatch 监听表单值变化，确保状态与表单同步
  const watchNameNotKnown = Form.useWatch('usPocNameNotKnown', form);
  const watchOrgNotKnown = Form.useWatch('usPocOrganizationNotKnown', form);
  
  // 基于表单值设置本地状态
  const [relationship, setRelationship] = useState<string>('');

  // 监听复选框值变化并执行字段清除
  useEffect(() => {
    if (watchNameNotKnown) {
      // 当复选框被选中时，清除相关字段
      form.setFieldsValue({
        usPocSurname: undefined,
        usPocGivenName: undefined
      });
    }
  }, [watchNameNotKnown, form]);
  
  // 监听组织复选框变化
  useEffect(() => {
    if (watchOrgNotKnown) {
      // 如果姓名复选框也被选中，取消选中它
      if (watchNameNotKnown) {
        form.setFieldsValue({
          usPocNameNotKnown: false
        });
      }
    }
  }, [watchOrgNotKnown, watchNameNotKnown, form]);

  // 处理关系选择变化
  const handleRelationshipChange = (value: string) => {
    setRelationship(value);
  };

  return (
    <div className="ds160-section">
      <h2>美国联系人信息</h2>

      {/* Contact Person Section */}
      <fieldset className="question-section">
        <h4 style={{ marginBottom: '10px' }}>
          <span>在美国的联系人或组织</span>
        </h4>

        <div className="question-row">       
          <div className="question-column">
            <div className="highlighted-block">
              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>姓氏</span>
                  <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>
                </div>
                <Form.Item 
                  name="usPocSurname"
                  rules={[{ required: !watchNameNotKnown, message: '请输入姓氏' },
                          { validator: (_, value) => value && englishNameValidator(value) ? Promise.resolve() : Promise.reject('姓氏只能包含英文字母和空格') }]}>
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                    disabled={!!watchNameNotKnown}
                    placeholder={!!watchNameNotKnown ? '' : '请输入姓氏'}
                  />
                </Form.Item>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>名字</span>
                  <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>
                </div>
                <Form.Item 
                  name="usPocGivenName"
                  rules={[{ required: !watchNameNotKnown, message: '请输入名字' },
                          { validator: (_, value) => value && englishNameValidator(value) ? Promise.resolve() : Promise.reject('名字只能包含英文字母和空格') }]}>
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                    disabled={!!watchNameNotKnown}
                    placeholder={!!watchNameNotKnown ? '' : '请输入名字'}
                  />
                </Form.Item>
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px', marginBottom: '16px' }}>
                <Form.Item 
                  name="usPocNameNotKnown" 
                  valuePropName="checked"
                  style={{ marginBottom: 0 }}
                >
                  <Checkbox onChange={(e) => {
                    if (e.target.checked) {
                      // When checkbox is checked, clear the fields and uncheck the other checkbox
                      form.setFieldsValue({
                        usPocSurname: undefined,
                        usPocGivenName: undefined,
                        usPocOrganizationNotKnown: false
                      });
                    }
                  }}>
                    不适用/无法提供
                  </Checkbox>
                </Form.Item>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>组织名称</span>
                  <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>
                </div>
                <Form.Item name="usPocOrganization">
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                    disabled={!!watchOrgNotKnown}
                    placeholder={!!watchOrgNotKnown ? '' : '请输入组织名称'}
                  />
                </Form.Item>
              </div>
              
              <div style={{ textAlign: 'right', marginTop: '8px', marginBottom: '16px' }}>
                <Form.Item 
                  name="usPocOrganizationNotKnown" 
                  valuePropName="checked"
                  style={{ marginBottom: 0 }}
                >
                  <Checkbox onChange={(e) => {
                    if (e.target.checked) {
                      // When organization checkbox is checked, uncheck the name checkbox
                      form.setFieldsValue({
                        usPocNameNotKnown: false,
                        usPocOrganization: undefined
                      });
                    }
                  }}>
                    不适用/无法提供
                  </Checkbox>
                </Form.Item>
              </div>
            </div>        
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>

      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="与您的关系"
              name="usPocRelationship"
              required={true}
            >
              <Select 
                placeholder="- 请选择一个 -" 
                style={{ width: '99%' }}
                onChange={handleRelationshipChange}
              >
                <Select.Option value="">- 请选择一个 -</Select.Option>
                <Select.Option value="R">亲属</Select.Option>
                <Select.Option value="S">配偶</Select.Option>
                <Select.Option value="C">朋友</Select.Option>
                <Select.Option value="B">商业伙伴</Select.Option>
                <Select.Option value="P">雇主</Select.Option>
                <Select.Option value="H">学校官员</Select.Option>
                <Select.Option value="O">其他</Select.Option>
              </Select>
            </QuestionItem>
          </div>
          <div className="explanation-column"></div>
        </div>

        {/* Address and Phone Section - Only show when relationship has a value */}
        {relationship && (
          <fieldset className="question-section">
            <h4 style={{ marginBottom: '10px' }}>
              <span>联系人地址和电话号码</span>
            </h4>
          
            <div className="question-row">``
              <div className="question-column">
                <div className="highlighted-block">
                  <QuestionItem
                    question="美国街道地址(第一行)"
                    name="usPocAddressLine1"
                    required={true}
                  >
                    <Form.Item
                      name="usPocAddressLine1"
                      rules={[{ required: true, message: '请输入街道地址' },
                             { validator: (_, value) => value && addressValidator(value) ? Promise.resolve() : Promise.reject('地址格式不正确') }]}
                    >
                      <Input style={{ width: '99%' }} maxLength={40} />
                    </Form.Item>
                  </QuestionItem>

                  <QuestionItem
                    question="美国街道地址(第二行) *选填"
                    name="usPocAddressLine2"
                    required={false}
                  >
                    <Input style={{ width: '99%' }} maxLength={40} />
                  </QuestionItem>

                  <QuestionItem
                    question="城市"
                    name="usPocCity"
                    required={true}
                  >
                    <Form.Item
                      name="usPocCity"
                      rules={[{ required: true, message: '请输入城市名' },
                             { validator: (_, value) => value && locationValidator(value) ? Promise.resolve() : Promise.reject('城市名格式不正确') }]}
                    >
                      <Input style={{ width: '99%' }} maxLength={20} />
                    </Form.Item>
                  </QuestionItem>

                  <QuestionItem
                    question="州"
                    name="usPocState"
                    required={true}
                  >
                    <Select 
                      options={usStateOptions} 
                      style={{ width: '99%' }} 
                      placeholder="- 请选择一个 -" 
                    />
                  </QuestionItem>

                  <QuestionItem
                    question="邮政编码(如果知道)"
                    name="usPocZipCode"
                    required={false}
                  >
                    <Form.Item
                      name="usPocZipCode"
                      rules={[{ validator: (_, value) => !value || zipCodeValidator(value) ? Promise.resolve() : Promise.reject('邮政编码格式不正确') }]}
                    >
                      <Input style={{ width: '99%' }} maxLength={10} placeholder="例如：55555 或 55555-5555" />
                    </Form.Item>
                  </QuestionItem>

                  <QuestionItem
                    question="电话号码"
                    name="usPocPhone"
                    required={true}
                  >
                    <Form.Item
                      name="usPocPhone"
                      rules={[{ required: true, message: '请输入电话号码' },
                             { validator: (_, value) => value && numPhoneValidator(value) ? Promise.resolve() : Promise.reject('电话号码格式不正确') }]}
                    >
                      <Input style={{ width: '99%' }} maxLength={15} minLength={10} placeholder="例如：5555555555" />
                    </Form.Item>
                  </QuestionItem>

                  <QuestionItem
                    question="电子邮件地址"
                    name="usPocEmail"
                    hasNaCheckbox={true}
                    naCheckboxName="usPocEmail_na"
                  >
                    <Form.Item
                      name="usPocEmail"
                      rules={[{ validator: (_, value) => !value || emailValidator(value) ? Promise.resolve() : Promise.reject('电子邮件地址格式不正确') }]}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={50} 
                        placeholder="例如：emailaddress@example.com"
                      />
                    </Form.Item>
                  </QuestionItem>
                </div>
              </div>
              <div className="explanation-column"></div>
            </div>
          </fieldset>
        )}
      </fieldset>


    </div>
  );
};

export default USContact;
