import React, { useState } from 'react';
import { Input, Select, Radio, Form, Checkbox } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { countryOptions, usStateOptions } from '../utils/formOptions';
import '../ds160Form.css';

const { TextArea } = Input;

interface AddressAndPhoneProps {
  form: any;
}

const AddressAndPhone: React.FC<AddressAndPhoneProps> = ({ form }) => {
  const [sameMailingAddress, setSameMailingAddress] = useState<boolean>(true);
  const [hasEmail, setHasEmail] = useState<string>('Y');
  const [hasPhone, setHasPhone] = useState<string>('Y');
  const [hasWorkPhone, setHasWorkPhone] = useState<string>('Y');

  // Handle mailing address same as home address change
  const handleSameAddressChange = (e: any) => {
    const value = e.target.value;
    setSameMailingAddress(value === 'Y');
    if (value === 'Y') {
      // Copy home address fields to mailing address fields
      const homeValues = form.getFieldsValue([
        'homeAddressStreet1',
        'homeAddressStreet2',
        'homeAddressCity',
        'homeAddressState',
        'homeAddressZipCode',
        'homeAddressCountry'
      ]);
      
      form.setFieldsValue({
        mailingAddressStreet1: homeValues.homeAddressStreet1,
        mailingAddressStreet2: homeValues.homeAddressStreet2,
        mailingAddressCity: homeValues.homeAddressCity,
        mailingAddressState: homeValues.homeAddressState,
        mailingAddressZipCode: homeValues.homeAddressZipCode,
        mailingAddressCountry: homeValues.homeAddressCountry
      });
    } else {
      // Clear mailing address fields
      form.setFieldsValue({
        mailingAddressStreet1: undefined,
        mailingAddressStreet2: undefined,
        mailingAddressCity: undefined,
        mailingAddressState: undefined,
        mailingAddressState_na: undefined,
        mailingAddressZipCode: undefined,
        mailingAddressZipCode_na: undefined,
        mailingAddressCountry: undefined
      });
    }
  };

  // Handle email radio change
  const handleEmailChange = (e: any) => {
    setHasEmail(e.target.value);
    if (e.target.value === 'N') {
      // Clear email field
      form.setFieldsValue({
        email: undefined,
        email_na: undefined
      });
    }
  };

  // Handle phone radio change
  const handlePhoneChange = (e: any) => {
    setHasPhone(e.target.value);
    if (e.target.value === 'N') {
      // Clear phone fields
      form.setFieldsValue({
        primaryPhone: undefined,
        primaryPhone_na: undefined
      });
    }
  };

  // Handle work phone radio change
  const handleWorkPhoneChange = (e: any) => {
    setHasWorkPhone(e.target.value);
    if (e.target.value === 'N') {
      // Clear work phone fields
      form.setFieldsValue({
        workPhone: undefined,
        workPhone_na: undefined
      });
    }
  };

  return (
    <div className="address-phone-section">
      {/* Home Address Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <h3 className="section-header">家庭住址</h3>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="街道地址（第一行）"
              name="homeAddressStreet1"
            >
              <Input style={{ width: '99%' }} placeholder="例如：123 Main Street" />
            </QuestionItem>
          </div>
          <div className="explanation-column">
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="街道地址（第二行）"
              name="homeAddressStreet2"
              required={false}
            >
              <Input style={{ width: '99%' }} placeholder="例如：Apt 4B" />
            </QuestionItem>
          </div>
          <div className="explanation-column">
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="城市"
              name="homeAddressCity"
            >
              <Input style={{ width: '99%' }} placeholder="例如：Beijing" />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="州/省/地区"
              name="homeAddressState"
              hasNaCheckbox={true}
              naCheckboxName="homeAddressState_na"
              inlineCheckbox={true}
            >
              <Input style={{ width: '90%' }} placeholder="例如：Hebei" />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="邮政编码"
              name="homeAddressZipCode"
              hasNaCheckbox={true}
              naCheckboxName="homeAddressZipCode_na"
              inlineCheckbox={true}
            >
              <Input style={{ width: '80%' }} placeholder="例如：100001" />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="国家/地区"
              name="homeAddressCountry"
            >
              <Select 
                options={countryOptions} 
                placeholder="- 选择一个 -" 
                style={{ width: '99%' }}
              />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>
      </fieldset>

      {/* Mailing Address Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <h3 className="section-header">邮寄地址</h3>
            <QuestionItem
              question="您的邮寄地址同于您的家庭地址吗？"
              name="isMailingAddressSame"
            >
              <Radio.Group onChange={handleSameAddressChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：邮寄地址</h4>
            <p>如果您的邮寄地址与家庭住址相同，请选择"是"。否则，请选择"否"并提供您的邮寄地址。</p>
          </div>
        </div>

        {!sameMailingAddress && (
          <>
          <h4 style={{ marginLeft: '14px' }}>请提供你的邮寄地址:</h4>
            <div className="highlighted-block" style={{ marginLeft: '14px' }}>
                <div className="question-row">
                <div className="question-column">
                    <QuestionItem
                    question="街道地址（第一行）"
                    name="mailingAddressStreet1"
                    >
                    <Input style={{ width: '99%' }} placeholder="例如：123 Main Street" />
                    </QuestionItem>
                </div>
                <div className="explanation-column">
                    {/* Empty explanation column to maintain layout */}
                </div>
                </div>

                <div className="question-row">
                <div className="question-column">
                    <QuestionItem
                    question="街道地址（第二行）"
                    name="mailingAddressStreet2"
                    required={false}
                    >
                    <Input style={{ width: '99%' }} placeholder="例如：Apt 4B" />
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
                    name="mailingAddressCity"
                    >
                    <Input style={{ width: '99%' }} placeholder="例如：Beijing" />
                    </QuestionItem>
                </div>
                <div className="explanation-column">
                    {/* Empty explanation column to maintain layout */}
                </div>
                </div>

                <div className="question-row">
                <div className="question-column">
                    <QuestionItem
                    question="州/省/地区"
                    name="mailingAddressState"
                    hasNaCheckbox={true}
                    naCheckboxName="mailingAddressState_na"
                    inlineCheckbox={true}
                    >
                    <Input style={{ width: '90%' }} placeholder="例如：Hebei" />
                    </QuestionItem>
                </div>
                <div className="explanation-column">
                    {/* Empty explanation column to maintain layout */}
                </div>
                </div>

                <div className="question-row">
                <div className="question-column">
                    <QuestionItem
                    question="邮政编码"
                    name="mailingAddressZipCode"
                    hasNaCheckbox={true}
                    naCheckboxName="mailingAddressZipCode_na"
                    inlineCheckbox={true}
                    >
                    <Input style={{ width: '80%' }} placeholder="例如：100001" />
                    </QuestionItem>
                </div>
                <div className="explanation-column">
                    {/* Empty explanation column to maintain layout */}
                </div>
                </div>

                <div className="question-row">
                <div className="question-column">
                    <QuestionItem
                    question="国家/地区"
                    name="mailingAddressCountry"
                    >
                    <Select 
                        options={countryOptions} 
                        placeholder="- 选择一个 -" 
                        style={{ width: '99%' }}
                    />
                    </QuestionItem>
                </div>
                <div className="explanation-column">
                    {/* Empty explanation column to maintain layout */}
                </div>
                </div>
            </div>
          </>
        )}
      </fieldset>

      {/* Phone and Email Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <h3 className="section-header">电话和电子邮件</h3>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否有电子邮件地址？"
              name="hasEmail"
            >
              <Radio.Group onChange={handleEmailChange} value={hasEmail}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：电子邮件</h4>
            <p>请提供您的电子邮件地址，以便在需要时与您联系。如果您没有电子邮件地址，请选择"否"。</p>
          </div>
        </div>

        {hasEmail === 'Y' && (
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="电子邮件地址"
                name="email"
                hasNaCheckbox={true}
                naCheckboxName="email_na"
              >
                <Input placeholder="例如：example@email.com" style={{ width: '99%' }} />
              </QuestionItem>
            </div>
            <div className="explanation-column">
              <h4 className="help-header">帮助：电子邮件格式</h4>
              <p>请使用标准格式输入您的电子邮件地址，例如 example@domain.com。</p>
            </div>
          </div>
        )}

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否有电话号码？"
              name="hasPhone"
            >
              <Radio.Group onChange={handlePhoneChange} value={hasPhone}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：电话号码</h4>
            <p>请提供您的主要联系电话号码。如果您没有电话号码，请选择"否"。</p>
          </div>
        </div>

        {hasPhone === 'Y' && (
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="主要电话号码"
                name="primaryPhone"
                hasNaCheckbox={true}
                naCheckboxName="primaryPhone_na"
              >
                <Input placeholder="例如：5555555555" style={{ width: '99%' }} />
              </QuestionItem>
            </div>
            <div className="explanation-column">
              <h4 className="help-header">帮助：电话号码格式</h4>
              <p>请输入您的电话号码，不包括国家代码和特殊字符。例如，如果您的电话号码是 +1 (555) 555-5555，请输入 5555555555。</p>
            </div>
          </div>
        )}

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否有工作电话号码？"
              name="hasWorkPhone"
            >
              <Radio.Group onChange={handleWorkPhoneChange} value={hasWorkPhone}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：工作电话</h4>
            <p>请提供您的工作电话号码，如果适用。如果您没有工作电话号码，请选择"否"。</p>
          </div>
        </div>

        {hasWorkPhone === 'Y' && (
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="工作电话号码"
                name="workPhone"
                hasNaCheckbox={true}
                naCheckboxName="workPhone_na"
              >
                <Input placeholder="例如：5555555555" style={{ width: '99%' }} />
              </QuestionItem>
            </div>
            <div className="explanation-column">
              <h4 className="help-header">帮助：工作电话格式</h4>
              <p>请输入您的工作电话号码，不包括国家代码和特殊字符。</p>
            </div>
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default AddressAndPhone;