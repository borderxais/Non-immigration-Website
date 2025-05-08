import React, { useState } from 'react';
import { Form, Input, Radio, Select, Checkbox } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { usStateOptions } from '../utils/formOptions';

interface USContactProps {
    form: any;
}
const USContact: React.FC<USContactProps> = ({ form }) => {
  // State for conditional rendering if needed
  const [nameNotKnown, setNameNotKnown] = useState<boolean>(false);
  const [relationship, setRelationship] = useState<string>('');

  // Handle checkbox change for "Do Not Know" name
  const handleNameNotKnownChange = (e: any) => {
    const checked = e.target.checked;
    setNameNotKnown(checked);
    
    // Clear name fields if checkbox is checked
    if (checked) {
      form.setFieldsValue({
        usPocSurname: undefined,
        usPocGivenName: undefined
      });
    }
  };

  // Handle relationship selection change
  const handleRelationshipChange = (value: string) => {
    setRelationship(value);
  };

  return (
    <div className="ds160-section">
      <h2>美国联系人信息</h2>
      <p className="section-description">
        请提供您在美国的联系人信息。如果您没有特定的联系人，请提供您计划访问的地点信息。
      </p>

      {/* Contact Person Section */}
      <fieldset className="question-section">
        <h4 style={{ marginBottom: '10px' }}>
          <span>在美国的联系人或组织</span>
        </h4>
        
        <div className="highlighted-block">
          <h4 style={{ marginBottom: '16px' }}>
            <span>联系人</span>
          </h4>
          
          <div className="highlighted-block" style={{ backgroundColor: '#f9f9f9' }}>
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="姓氏"
                  name="usPocSurname"
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                    disabled={nameNotKnown}
                  />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：美国联系人</h4>
                <p>
                  您的美国联络人可以是任何在美国的个人。他/她认识您，如有需要，并可以证明您的身份。如果您在美国没有认识的人，您可以输入您此行将要访问的商店、公司或者组织的名称。
                </p>
              </div>
            </div>
            
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="名字"
                  name="usPocGivenName"
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                    disabled={nameNotKnown}
                  />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                {/* Empty explanation column to maintain layout */}
              </div>
            </div>
            
            <div className="question-row">
              <div className="question-column" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Form.Item 
                  name="usPocNameNotKnown" 
                  valuePropName="checked"
                  style={{ marginTop: '8px', marginBottom: '16px' }}
                >
                  <Checkbox onChange={handleNameNotKnownChange}>不知道 (Do Not Know)</Checkbox>
                </Form.Item>
              </div>
              <div className="explanation-column">
                {/* Empty explanation column to maintain layout */}
              </div>
            </div>
          </div>
          
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="组织名称"
                name="usPocOrganization"
                hasNaCheckbox={true}
                naCheckboxName="usPocOrganizationNotKnown"
              >
                <Input style={{ width: '99%' }} maxLength={33} />
              </QuestionItem>
            </div>
            <div className="explanation-column">
              {/* Empty explanation column to maintain layout */}
            </div>
          </div>
          
        </div>

      </fieldset>

      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="与您的关系"
              name="usPocRelationship"
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
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
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
                  >
                    <Input style={{ width: '99%' }} maxLength={40} />
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
                  >
                    <Input style={{ width: '99%' }} maxLength={20} />
                  </QuestionItem>

                  <QuestionItem
                    question="州"
                    name="usPocState"
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
                    <Input style={{ width: '99%' }} maxLength={10} placeholder="例如：55555 或 55555-5555" />
                  </QuestionItem>

                  <QuestionItem
                    question="电话号码"
                    name="usPocPhone"
                  >
                    <Input style={{ width: '99%' }} maxLength={15} minLength={5} placeholder="例如：5555555555" />
                  </QuestionItem>

                  <QuestionItem
                    question="电子邮件地址"
                    name="usPocEmail"
                    hasNaCheckbox={true}
                    naCheckboxName="usPocEmail_na"
                  >
                    <Input 
                      style={{ width: '99%' }} 
                      maxLength={50} 
                      placeholder="例如：emailaddress@example.com"
                    />
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
