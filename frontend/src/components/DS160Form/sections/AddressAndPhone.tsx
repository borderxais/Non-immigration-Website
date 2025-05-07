import React, { useState } from 'react';
import { Input, Select, Radio } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { countryOptions } from '../utils/formOptions';
import '../ds160Form.css';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';

interface AddressAndPhoneProps {
  form: any;
}

const AddressAndPhone: React.FC<AddressAndPhoneProps> = ({ form }) => {
  const [isMailingAddressSameAsHome, setIsMailingAddressSameAsHome] = useState<string | null>(null);
  const [hasOtherEmailAddresses, setHasOtherEmailAddresses] = useState<string | null>(null);
  const [hasOtherPhoneNumbers, setHasOtherPhoneNumbers] = useState<string | null>(null);

  // Handle mailing address same as home address change
  const handleSameAddressChange = (e: any) => {
    const value = e.target.value;
    
    // Update form values first
    form.setFieldsValue({ 
      isMailingAddressSame: value,
      // Always reset mailing address fields when value changes
      mailingAddressStreet1: undefined,
      mailingAddressStreet2: undefined,
      mailingAddressCity: undefined,
      mailingAddressState: undefined,
      mailingAddressState_na: undefined,
      mailingAddressZipCode: undefined,
      mailingAddressZipCode_na: undefined,
      mailingAddressCountry: undefined
    });
    
    // Update state after form values
    setIsMailingAddressSameAsHome(value);
  };

  // Handle other phone numbers change
  const handleOtherPhoneNumbersChange = (e: any) => {
    const value = e.target.value;
    form.setFieldsValue({ 
      hasOtherPhones: value,
      otherPhones: undefined
    });
    setHasOtherPhoneNumbers(value);
  };

  // Handle other email addresses change
  const handleOtherEmailAddressesChange = (e: any) => {
    const value = e.target.value;
    form.setFieldsValue({ 
      hasOtherEmails: value,
      otherEmails: undefined
    });
    setHasOtherEmailAddresses(value);
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
              <Input style={{ width: '99%' }} placeholder="" />
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
              <Input style={{ width: '99%' }}/>
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
              <Input style={{ width: '99%' }}/>
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
              <Input style={{ width: '90%' }}/>
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
              <Input style={{ width: '80%' }}/>
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
                placeholder="- 请选择一个 -" 
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
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：邮寄地址</h4>
            <p>如果您的邮寄地址与家庭住址相同，请选择"是"。否则，请选择"否"并提供您的邮寄地址。</p>
          </div>
        </div>

        {isMailingAddressSameAsHome === 'N' && (
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
                                <Input style={{ width: '99%' }}/>
                            </QuestionItem>

                            <QuestionItem
                                question="街道地址（第二行）"
                                name="mailingAddressStreet2"
                                required={false}
                                >
                                <Input style={{ width: '99%' }}/>
                            </QuestionItem>

                            <QuestionItem
                                question="城市"
                                name="mailingAddressCity"
                                >
                                <Input style={{ width: '99%' }}/>
                                </QuestionItem>

                            <QuestionItem
                                question="州/省/地区"
                                name="mailingAddressState"
                                hasNaCheckbox={true}
                                naCheckboxName="mailingAddressState_na"
                                inlineCheckbox={true}
                                >
                            <Input style={{ width: '90%' }}/>
                            </QuestionItem>

                            <QuestionItem
                                question="邮政编码"
                                name="mailingAddressZipCode"
                                hasNaCheckbox={true}
                                naCheckboxName="mailingAddressZipCode_na"
                                inlineCheckbox={true}
                                >
                                <Input style={{ width: '80%' }}/>
                            </QuestionItem>

                            <QuestionItem
                                question="国家/地区"
                                name="mailingAddressCountry"
                                >
                                <Select 
                                    options={countryOptions} 
                                    placeholder="- 请选择一个 -" 
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
              <Radio.Group onChange={handleOtherPhoneNumbersChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        {hasOtherPhoneNumbers === 'Y' && (
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
              <Radio.Group onChange={handleOtherEmailAddressesChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

        {hasOtherEmailAddresses === 'Y' && (
          <div className="question-row">
            <div className="question-column">
              <RepeatableFormItem
                name="otherEmails"
                addButtonText="增加另一个"
                removeButtonText="移除"
              >
                {(field: FormListFieldData) => (
                  <QuestionItem
                    question="电子邮件地址"
                    name={[field.name,"emailAddress"]}
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