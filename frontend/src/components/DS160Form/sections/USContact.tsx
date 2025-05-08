import React, { useState } from 'react';
import { Input, Radio, Select } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { countryOptions, usStateOptions } from '../utils/formOptions';
import RepeatableFormItem from '../common/RepeatableFormItem';


interface USContactProps {
    form: any;
  }
  
const USContact: React.FC<USContactProps> = ({ form }) => {
  // State for conditional rendering
  const [knowsPersonInUS, setKnowsPersonInUS] = useState<string | null>(null);
  const [hasUSCompany, setHasUSCompany] = useState<string | null>(null);
  const [hasSchoolInUS, setHasSchoolInUS] = useState<string | null>(null);

  // Handle radio button changes
  const handleKnowsPersonChange = (e: any) => {
    setKnowsPersonInUS(e.target.value);
    form.setFieldsValue({ knowsPersonInUS: e.target.value });
  };

  const handleHasUSCompanyChange = (e: any) => {
    setHasUSCompany(e.target.value);
    form.setFieldsValue({ hasUSCompany: e.target.value });
  };

  const handleHasSchoolChange = (e: any) => {
    setHasSchoolInUS(e.target.value);
    form.setFieldsValue({ hasSchoolInUS: e.target.value });
  };

  return (
    <div className="ds160-section">
      <h2>美国联系人信息</h2>
      <p className="section-description">
        请提供您在美国的联系人信息。如果您没有特定的联系人，请提供您计划访问的地点信息。
      </p>

      {/* Person in US Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您在美国认识的人"
              name="knowsPersonInUS"
            >
              <Radio.Group onChange={handleKnowsPersonChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：美国联系人</h4>
            <p>
              如果您在美国有认识的人（亲戚、朋友等），请选择"是"并提供详细信息。
            </p>
          </div>
        </div>

        {knowsPersonInUS === 'Y' && (
          <>
            <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
            <div className="highlighted-block">
              <RepeatableFormItem
                name="usContacts"
                addButtonText="增加另一个联系人"
                removeButtonText="移走"
              >
                {(field) => (
                  <>
                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="姓氏"
                          name="surname"
                          parentFieldName="usContacts"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：SMITH" 
                            maxLength={50}
                          />
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
                          parentFieldName="usContacts"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：JOHN" 
                            maxLength={50}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="与您的关系"
                          name="relationship"
                          parentFieldName="usContacts"
                        >
                          <Select
                            style={{ width: '95%' }}
                            placeholder="- 请选择一个 -"
                            options={[
                              { value: 'SPOUSE', label: '配偶' },
                              { value: 'CHILD', label: '子女' },
                              { value: 'PARENT', label: '父母' },
                              { value: 'RELATIVE', label: '其他亲属' },
                              { value: 'FRIEND', label: '朋友' },
                              { value: 'BUSINESS_ASSOCIATE', label: '商业伙伴' },
                              { value: 'SCHOOL_OFFICIAL', label: '学校官员' },
                              { value: 'OTHER', label: '其他' }
                            ]}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="联系人地址"
                          name="address"
                          parentFieldName="usContacts"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：123 MAIN STREET" 
                            maxLength={100}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="城市"
                          name="city"
                          parentFieldName="usContacts"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：NEW YORK" 
                            maxLength={50}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="州"
                          name="state"
                          parentFieldName="usContacts"
                        >
                          <Select 
                            options={usStateOptions} 
                            style={{ width: '95%' }} 
                            placeholder="- 请选择一个 -"
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="邮编"
                          name="zipCode"
                          parentFieldName="usContacts"
                          hasNaCheckbox={true}
                          naCheckboxName="zipCode_na"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：10001" 
                            maxLength={10}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="电话号码"
                          name="phoneNumber"
                          parentFieldName="usContacts"
                          hasNaCheckbox={true}
                          naCheckboxName="phoneNumber_na"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：5555555555" 
                            maxLength={15}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="电子邮件地址"
                          name="email"
                          parentFieldName="usContacts"
                          hasNaCheckbox={true}
                          naCheckboxName="email_na"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：example@email.com" 
                            maxLength={50}
                          />
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
        )}
      </fieldset>

      {/* US Company/Organization Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您在美国有联系的公司或组织"
              name="hasUSCompany"
            >
              <Radio.Group onChange={handleHasUSCompanyChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：美国公司或组织</h4>
            <p>
              如果您在美国有联系的公司、组织或学校，请选择"是"并提供详细信息。
            </p>
          </div>
        </div>

        {hasUSCompany === 'Y' && (
          <>
            <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
            <div className="highlighted-block">
              <RepeatableFormItem
                name="usCompanies"
                addButtonText="增加另一个公司/组织"
                removeButtonText="移走"
              >
                {(field) => (
                  <>
                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="公司/组织名称"
                          name="name"
                          parentFieldName="usCompanies"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：ACME CORPORATION" 
                            maxLength={100}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="公司/组织地址"
                          name="address"
                          parentFieldName="usCompanies"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：123 BUSINESS AVENUE" 
                            maxLength={100}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="城市"
                          name="city"
                          parentFieldName="usCompanies"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：CHICAGO" 
                            maxLength={50}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="州"
                          name="state"
                          parentFieldName="usCompanies"
                        >
                          <Select 
                            options={usStateOptions} 
                            style={{ width: '95%' }} 
                            placeholder="- 请选择一个 -"
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="邮编"
                          name="zipCode"
                          parentFieldName="usCompanies"
                          hasNaCheckbox={true}
                          naCheckboxName="zipCode_na"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：60601" 
                            maxLength={10}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="电话号码"
                          name="phoneNumber"
                          parentFieldName="usCompanies"
                          hasNaCheckbox={true}
                          naCheckboxName="phoneNumber_na"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：5555555555" 
                            maxLength={15}
                          />
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
        )}
      </fieldset>

      {/* US School Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您在美国有联系的学校"
              name="hasSchoolInUS"
            >
              <Radio.Group onChange={handleHasSchoolChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：美国学校</h4>
            <p>
              如果您计划在美国就读或访问学校，请选择"是"并提供详细信息。
            </p>
          </div>
        </div>

        {hasSchoolInUS === 'Y' && (
          <>
            <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
            <div className="highlighted-block">
              <RepeatableFormItem
                name="usSchools"
                addButtonText="增加另一个学校"
                removeButtonText="移走"
              >
                {(field) => (
                  <>
                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="学校名称"
                          name="name"
                          parentFieldName="usSchools"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：UNIVERSITY OF CALIFORNIA" 
                            maxLength={100}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="学校地址"
                          name="address"
                          parentFieldName="usSchools"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：123 CAMPUS DRIVE" 
                            maxLength={100}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="城市"
                          name="city"
                          parentFieldName="usSchools"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：LOS ANGELES" 
                            maxLength={50}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="州"
                          name="state"
                          parentFieldName="usSchools"
                        >
                          <Select 
                            options={usStateOptions} 
                            style={{ width: '95%' }} 
                            placeholder="- 请选择一个 -"
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="邮编"
                          name="zipCode"
                          parentFieldName="usSchools"
                          hasNaCheckbox={true}
                          naCheckboxName="zipCode_na"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：90095" 
                            maxLength={10}
                          />
                        </QuestionItem>
                      </div>
                      <div className="explanation-column">
                        {/* Empty explanation column to maintain layout */}
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="课程名称"
                          name="courseName"
                          parentFieldName="usSchools"
                          hasNaCheckbox={true}
                          naCheckboxName="courseName_na"
                        >
                          <Input 
                            style={{ width: '95%' }} 
                            placeholder="例如：COMPUTER SCIENCE" 
                            maxLength={100}
                          />
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
        )}
      </fieldset>

    </div>
  );
};

export default USContact;
