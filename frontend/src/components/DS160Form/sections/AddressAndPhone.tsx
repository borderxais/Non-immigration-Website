import React, { useState, useEffect } from 'react';
import { Input, Select, Radio, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { permanentResidenceOptions } from '../utils/formOptions';
import '../ds160Form.css';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { 
  maxLengths, 
  addressValidator,
  addressPatternMessage,
  emailValidator,
  emailPatternMessage,
  stateZipCodeValidator,
  stateZipCodePatternMessage,
  locationValidator,
  locationPatternMessage,
  numericValidator,
  numericPatternMessage
} from '../utils/validationRules';

interface AddressAndPhoneProps {
  form: any;
}

const AddressAndPhone: React.FC<AddressAndPhoneProps> = ({ form }) => {
  // Get form values
  const formValues = form.getFieldsValue(true);
  
  // Initialize state from form values
  const [isMailingAddressSameAsHome, setIsMailingAddressSameAsHome] = useState<string | null>(formValues?.isMailingAddressSameAsHome || null);
  const [hasOtherEmailAddresses, setHasOtherEmailAddresses] = useState<string | null>(formValues?.hasOtherEmails || null);
  const [hasOtherPhoneNumbers, setHasOtherPhoneNumbers] = useState<string | null>(formValues?.hasOtherPhones || null);
  const [hasOtherSocialMedia, setHasOtherSocialMedia] = useState<string | null>(formValues?.hasOtherSocialMedia || null);

  // Update state when form values change
  useEffect(() => {
    const values = form.getFieldsValue(true);
    if (values.isMailingAddressSameAsHome !== undefined) {
      setIsMailingAddressSameAsHome(values.isMailingAddressSameAsHome);
    }
    if (values.hasOtherEmails !== undefined) {
      setHasOtherEmailAddresses(values.hasOtherEmails);
    }
    if (values.hasOtherPhones !== undefined) {
      setHasOtherPhoneNumbers(values.hasOtherPhones);
    }
    if (values.hasOtherSocialMedia !== undefined) {
      setHasOtherSocialMedia(values.hasOtherSocialMedia);
    }
  }, [form]);

  // Handle mailing address same as home change
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

  // Handle other social media change
  const handleOtherSocialMediaChange = (e: any) => {
    const value = e.target.value;
    form.setFieldsValue({ 
      hasOtherSocialMedia: value,
      otherSocialMediaPlatform: undefined
    });
    setHasOtherSocialMedia(value);
  };

  // Handle social media platform change
  const handleSocialMediaPlatformChange = (value: string, index: number) => {
    // Reset the identifier field when platform changes
    form.setFieldsValue({
      [`socialMediaPlatform`]: {
        ...form.getFieldValue('socialMediaPlatform'),
        [index]: {
          ...form.getFieldValue(['socialMediaPlatform', index]),
          platform: value,
          identifier: undefined
        }
      }
    });
  };

  return (
    <div className="address-phone-section">
      {/* Home Address Section */}
      <fieldset className="question-section">
        <h3 className="section-header">家庭住址</h3>
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="街道地址（第一行）"
              name="homeAddressStreet1"
              maxLength={maxLengths.address}
              validator={addressValidator}
              validatorMessage={addressPatternMessage}
            >
              <Input style={{ width: '99%' }} placeholder="" maxLength={maxLengths.address} />
            </QuestionItem>

            <QuestionItem
              question="街道地址（第二行）"
              name="homeAddressStreet2"
              required={false}
              maxLength={maxLengths.address}
              validator={addressValidator}
              validatorMessage={addressPatternMessage}
            >
              <Input style={{ width: '99%' }} maxLength={maxLengths.address} />
            </QuestionItem>

            <QuestionItem
              question="城市"
              name="homeAddressCity"
              maxLength={maxLengths.city}
              validator={locationValidator}
              validatorMessage={locationPatternMessage}
            >
              <Input style={{ width: '99%' }} maxLength={maxLengths.city} />
            </QuestionItem>

            <QuestionItem
              question="州/省/地区"
              name="homeAddressState"
              maxLength={maxLengths.state}
              validator={locationValidator}
              validatorMessage={locationPatternMessage}
              hasNaCheckbox={true}
              naCheckboxName="homeAddressState_na"
              inlineCheckbox={true}
            >
              <Input style={{ width: '90%' }} maxLength={maxLengths.state}/>
            </QuestionItem>

            <QuestionItem
              question="邮政编码"
              name="homeAddressZipCode"
              maxLength={maxLengths.zipCode}
              validator={stateZipCodeValidator}
              validatorMessage={stateZipCodePatternMessage}
              hasNaCheckbox={true}
              naCheckboxName="homeAddressZipCode_na"
              inlineCheckbox={true}
            >
              <Input style={{ width: '80%' }} maxLength={maxLengths.zipCode}/>
            </QuestionItem>

            <QuestionItem
              question="国家/地区"
              name="homeAddressCountry"
            >
              <Select 
                options={permanentResidenceOptions } 
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
                        maxLength={maxLengths.address}
                        validator={addressValidator}
                        validatorMessage={addressPatternMessage}
                        >
                        <Input style={{ width: '99%' }} maxLength={maxLengths.address} />
                    </QuestionItem>

                    <QuestionItem
                        question="街道地址（第二行）"
                        name="mailingAddressStreet2"
                        required={false}
                        maxLength={maxLengths.address}
                        validator={addressValidator}
                        validatorMessage={addressPatternMessage}
                        >
                        <Input style={{ width: '99%' }} maxLength={maxLengths.address} />
                    </QuestionItem>

                    <QuestionItem
                        question="城市"
                        name="mailingAddressCity"
                        maxLength={maxLengths.city}
                        validator={locationValidator}
                        validatorMessage={locationPatternMessage}
                        >
                        <Input style={{ width: '99%' }} maxLength={maxLengths.city}/>
                        </QuestionItem>

                    <QuestionItem
                        question="州/省/地区"
                        name="mailingAddressState"
                        maxLength={maxLengths.state}
                        hasNaCheckbox={true}
                        naCheckboxName="mailingAddressState_na"
                        inlineCheckbox={true}
                        validator={locationValidator}
                        validatorMessage={locationPatternMessage}
                        >
                        <Input style={{ width: '90%' }} maxLength={maxLengths.state}/>
                    </QuestionItem>

                    <QuestionItem
                        question="邮政编码"
                        name="mailingAddressZipCode"
                        maxLength={maxLengths.zipCode}
                        hasNaCheckbox={true}
                        naCheckboxName="mailingAddressZipCode_na"
                        inlineCheckbox={true}
                        validator={stateZipCodeValidator}
                        validatorMessage={stateZipCodePatternMessage}
                        >
                        <Input style={{ width: '80%' }} maxLength={maxLengths.zipCode}/>
                    </QuestionItem>

                    <QuestionItem
                        question="国家/地区"
                        name="mailingAddressCountry"
                        >
                        <Select 
                            options={permanentResidenceOptions} 
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
              validator={numericValidator}
              validatorMessage={numericPatternMessage}
            >
              <Input style={{ width: '60%' }} maxLength={maxLengths.phone} minLength={5} />
            </QuestionItem>

            <QuestionItem
              question="备用电话号码"
              name="secondaryPhone"
              maxLength={maxLengths.phone}
              validator={numericValidator}
              validatorMessage={numericPatternMessage}
              hasNaCheckbox={true}
              naCheckboxName="secondaryPhone_na"
              inlineCheckbox={true}
            >
            <Input style={{ width: '90%' }} maxLength={maxLengths.phone} minLength={5} />
            </QuestionItem>

            <QuestionItem
              question="工作电话号码"
              name="workPhone"
              maxLength={maxLengths.phone}
              validator={numericValidator}
              validatorMessage={numericPatternMessage}
              hasNaCheckbox={true}
              naCheckboxName="workPhone_na"
              inlineCheckbox={true}
            >
            <Input style={{ width: '90%' }} maxLength={maxLengths.phone} minLength={5} />
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
                    maxLength={maxLengths.phone}
                    validator={numericValidator}
                    validatorMessage={numericPatternMessage}
                  >
                    <Input style={{ width: '60%' }} maxLength={maxLengths.phone} minLength={5} placeholder="例如：5555555555" />
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
                validator={emailValidator}
                validatorMessage={emailPatternMessage}
              >
                <Input style={{ width: '95%' }} maxLength={maxLengths.email} />
              </QuestionItem>
              <p>(例如：emailaddress@example.com)</p>
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
                    validator={emailValidator}
                    validatorMessage={emailPatternMessage}
                  >
                    <Input style={{ width: '95%' }} maxLength={maxLengths.email} placeholder="例如：example@email.com" />
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

      {/* Social Media Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <h3 className="section-header">
              <span>社交媒体</span>
            </h3>         
            <h4>
              <span>从下面的列表中选择您在过去五年中使用过的每个社交媒体平台。在平台名称旁边的空格中，输入您在该平台上使用的用户名或昵称。请不要提供您的密码。如果在使用了多个社交平台或在一个平台上使用了多个用户名或昵称，请点击"添加另一个"按钮分别列出每个平台。如果您在过去五年内没有使用任何列出的社交媒体平台，请选择"无"。
              </span>
            </h4>
            <RepeatableFormItem
                name="socialMediaPlatform"
                addButtonText="增加另一个"
                removeButtonText="移除"
              >
                {(field: FormListFieldData) => (
                  <>
                    <Form.Item
                      {...field}
                      name={[field.name, 'platform']}
                      label="社交媒体平台"
                      rules={[{ required: true, message: '请选择社交媒体平台' }]}
                      style={{ marginBottom: '16px' }}
                    >
                      <Select 
                        style={{ width: '99%' }} 
                        placeholder="- 请选择一个 -"
                        onChange={(value) => handleSocialMediaPlatformChange(value, field.name)}
                      >
                        <Select.Option value="SONE">- 请选择一个 -</Select.Option>
                        <Select.Option value="ASKF">ASK.FM</Select.Option>
                        <Select.Option value="DUBN">豆瓣 (DOUBAN)</Select.Option>
                        <Select.Option value="FCBK">脸书 (FACEBOOK)</Select.Option>
                        <Select.Option value="FLKR">Flickr</Select.Option>
                        <Select.Option value="GOGL">谷歌+ (GOOGLE+)</Select.Option>
                        <Select.Option value="INST">Instagram</Select.Option>
                        <Select.Option value="LINK">领英 (LINKEDIN)</Select.Option>
                        <Select.Option value="MYSP">MySpace</Select.Option>
                        <Select.Option value="PTST">Pinterest</Select.Option>
                        <Select.Option value="QZNE">QQ空间 (QZONE)</Select.Option>
                        <Select.Option value="RDDT">Reddit</Select.Option>
                        <Select.Option value="SWBO">新浪微博 (SINA WEIBO)</Select.Option>
                        <Select.Option value="TWBO">腾讯微博 (TENCENT WEIBO)</Select.Option>
                        <Select.Option value="TUMB">Tumblr</Select.Option>
                        <Select.Option value="TWIT">推特 (TWITTER)</Select.Option>
                        <Select.Option value="TWOO">Twoo</Select.Option>
                        <Select.Option value="VINE">Vine</Select.Option>
                        <Select.Option value="VKON">VK (VKONTAKTE)</Select.Option>
                        <Select.Option value="YUKU">优酷 (YOUKU)</Select.Option>
                        <Select.Option value="YTUB">油管 (YOUTUBE)</Select.Option>
                        <Select.Option value="NONE">无 (NONE)</Select.Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      shouldUpdate={(prevValues, currentValues) => {
                        // This will trigger a re-render when the platform value changes
                        return prevValues?.socialMediaPlatform?.[field.name]?.platform !== 
                              currentValues?.socialMediaPlatforms?.[field.name]?.platform;
                      }}
                    >
                      {({ getFieldValue }) => {
                        const platformValue = getFieldValue(['socialMediaPlatform', field.name, 'platform']);
                        const isDisabled = platformValue === 'NONE';
                        
                        return (
                          <Form.Item
                            {...field}
                            name={[field.name, 'identifier']}
                            label="用户名/标识符"
                            rules={[{ required: !isDisabled, message: '请输入用户名或标识符' }]}
                            style={{ marginBottom: '16px' }}
                          >
                            <Input 
                              style={{ 
                                width: '99%',
                                backgroundColor: isDisabled ? 'LightGrey' : 'white'
                              }} 
                              disabled={isDisabled}
                              placeholder="例如：username123" 
                              maxLength={50}
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  </>
                )}
              </RepeatableFormItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：社交媒体</h4>
            <p>输入与您在线状态相关的信息，包括您用于协作、共享信息和与他人在线互动的提供商/平台、应用程序和网站类型信息。列举出与您的社交媒体相关联的用户名、昵称、网名或其他标识符。（您无需列举那些在一个商业或其他组织中为多个用户设计的帐户名称。）</p>
          </div>
        </div>

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否希望提供有关您在过去五年内用于创建或共享内容（照片、视频、状态更新等）的任何其他网站或应用程序上的状态的信息？"
              name="hasOtherSocialMedia"
            >
              <Radio.Group onChange={handleOtherSocialMediaChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
            
            {hasOtherSocialMedia === 'Y' && (
              <div>
                <p>请提供您想要列出的每个社交媒体平台的名称和相关的唯一社交媒体标识符（用户名或账号）。这不包括在个人对个人的消息服务上的私人消息，例如WhatsApp。</p>
                <RepeatableFormItem
                  name="otherSocialMediaPlatform"
                  addButtonText="增加另一个"
                  removeButtonText="移除"
                >
                  {(field: FormListFieldData) => (
                    <>
                      <QuestionItem
                        question="其他社交媒体平台"
                        name={[field.name, 'otherPlatform']}
                      >
                        <Input style={{ width: '95%' }} maxLength={maxLengths.socialMedia} />
                      </QuestionItem>

                      <QuestionItem
                        question="其他社交媒体平台的用户名/标识符"
                        name={[field.name, 'otherIdentifier']}
                      >
                        <Input style={{ width: '95%' }} maxLength={maxLengths.socialMedia} />
                      </QuestionItem>
                    </>
                  )}
                </RepeatableFormItem>
              </div>
            )}
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>

      </fieldset>
    </div>
  );
};

export default AddressAndPhone;