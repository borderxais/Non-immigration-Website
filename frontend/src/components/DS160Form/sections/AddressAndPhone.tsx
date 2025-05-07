import React, { useState } from 'react';
import { Input, Select, Radio } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { countryOptions } from '../utils/formOptions';
import '../ds160Form.css';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';

// const { TextArea } = Input;

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
            <fieldset className="question-section">
                <h4 style={{ marginLeft: '14px' }}>请提供你的邮寄地址:</h4>
                <div className="question-row">
                    <div className="question-column">
                        <div className="highlighted-block" style={{ marginLeft: '14px' }}>
                            <QuestionItem
                                question="街道地址（第一行）"
                                name="mailingAddressStreet1"
                                >
                                <Input style={{ width: '99%' }} placeholder="例如：123 Main Street" />
                            </QuestionItem>

                            <QuestionItem
                                question="街道地址（第二行）"
                                name="mailingAddressStreet2"
                                required={false}
                                >
                                <Input style={{ width: '99%' }} placeholder="例如：Apt 4B" />
                            </QuestionItem>

                            <QuestionItem
                                question="城市"
                                name="mailingAddressCity"
                                >
                                <Input style={{ width: '99%' }} placeholder="例如：Beijing" />
                                </QuestionItem>

                            <QuestionItem
                                question="州/省/地区"
                                name="mailingAddressState"
                                hasNaCheckbox={true}
                                naCheckboxName="mailingAddressState_na"
                                inlineCheckbox={true}
                                >
                            <Input style={{ width: '90%' }} placeholder="例如：Hebei" />
                            </QuestionItem>

                            <QuestionItem
                                question="邮政编码"
                                name="mailingAddressZipCode"
                                hasNaCheckbox={true}
                                naCheckboxName="mailingAddressZipCode_na"
                                inlineCheckbox={true}
                                >
                                <Input style={{ width: '80%' }} placeholder="例如：100001" />
                            </QuestionItem>

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
                    </div>
                    <div className="explanation-column">
                    </div>
                </div>
            </fieldset>
          </>
        )}
      </fieldset>

      {/* Phone and Email Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <h3 className="section-header">
              <span>电话</span>
            </h3>
            <QuestionItem
            question="主要电话号码"
            name="primaryPhone"
            >
            <Input style={{ width: '60%' }} maxLength={15} minLength={5} />
            </QuestionItem>

            <QuestionItem
            question="备用电话号码"
            name="secondaryPhone"
            hasNaCheckbox={true}
            naCheckboxName="secondaryPhone_na"
            inlineCheckbox={true}
            >
            <Input style={{ width: '90%' }} maxLength={15} minLength={5} />
            </QuestionItem>

            <QuestionItem
            question="工作电话号码"
            name="workPhone"
            hasNaCheckbox={true}
            naCheckboxName="workPhone_na"
            inlineCheckbox={true}
            >
            <Input style={{ width: '90%' }} maxLength={15} minLength={5} />
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：电话号码</h4>
            <p>您需要提供您的主要电话号码。此电话应该是最容易接通您的电话。这个电话可以是座机，也可以是手机/移动电话。如果您还有另外一个座机或手机/移动电话，您可以将它列为备用电话号码。</p>
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否在过去5年中使用过其他的电话号码？"
              name="hasOtherPhones"
            >
              <Radio.Group onChange={(e) => {
                form.setFieldsValue({ hasOtherPhones: e.target.value });
                setHasPhone(e.target.value);
              }}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        {hasPhone === 'Y' && (
          <div className="question-row">
            <div className="question-column">
              <RepeatableFormItem
                name="otherPhones"
                addButtonText="增加另一个"
                removeButtonText="移除"
              >
                {(field: FormListFieldData) => (
                  <QuestionItem
                    question="电话号码"
                    name={[field.name,"phoneNumber"]}
                  >
                    <Input style={{ width: '60%' }} maxLength={15} minLength={5} placeholder="例如：5555555555" />
                  </QuestionItem>
                )}
              </RepeatableFormItem>
            </div>
            <div className="explanation-column">
              {/* Empty explanation column to maintain layout */}
            </div>
          </div>
        )}
      </fieldset>

      {/* Email Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <h3 className="section-header">
              <span>电子邮件</span>
              <span> (Email)</span>
            </h3>
            
            <div className="highlighted-block">
              <QuestionItem
                question="电子邮件地址"
                name="emailAddress"
              >
                <Input style={{ width: '95%' }} maxLength={50} />
              </QuestionItem>
              <div className="hint" style={{ marginTop: 4, color: '#666' }}>
                <span>(e.g., emailaddress@example.com)</span>
              </div>
            </div>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：电子邮件地址</h4>
            <p>您必须提供一个电子邮件地址。您所提供的电子邮件地址将用于通信目的。请提供一个安全的且您可以正常进入的电子邮件地址。</p>
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否在过去5年中使用过其他的电子邮件地址？"
              name="hasOtherEmails"
            >
              <Radio.Group onChange={(e) => {
                form.setFieldsValue({ hasOtherEmails: e.target.value });
                setHasEmail(e.target.value);
              }}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        {hasEmail === 'Y' && (
          <div className="question-row">
            <div className="question-column">
              <RepeatableFormItem
                name="otherEmails"
                addButtonText="增加另一个"
                removeButtonText="移除"
              >
                {(field) => (
                  <QuestionItem
                    question="电子邮件地址"
                    name="emailAddress"
                  >
                    <Input style={{ width: '95%' }} maxLength={50} placeholder="例如：example@email.com" />
                  </QuestionItem>
                )}
              </RepeatableFormItem>
            </div>
            <div className="explanation-column">
              {/* Empty explanation column to maintain layout */}
            </div>
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default AddressAndPhone;