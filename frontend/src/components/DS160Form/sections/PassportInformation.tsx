import React from 'react';
import { Input, Select, Radio, Divider, Typography, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { countryOptions } from '../utils/formOptions';

const { Text, Paragraph } = Typography;

interface PassportInformationProps {
  form: any;
}

const PassportInformation: React.FC<PassportInformationProps> = ({ form }) => {
  // Define highlighted block style
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  return (
    <div className="passport-information-section">
      <h3>护照信息</h3>
      <Paragraph type="secondary">
        请提供您当前护照的详细信息。确保所有信息与护照上的信息完全一致。
      </Paragraph>
      
      <div style={highlightedBlockStyle}>
        <h4>护照详情</h4>
        
        <QuestionItem
          question="护照/旅行证件类型"
          name="passportType"
        >
          <Select
            placeholder="选择护照类型"
            options={[
              { value: 'regular', label: '普通护照' },
              { value: 'official', label: '公务护照' },
              { value: 'diplomatic', label: '外交护照' },
              { value: 'other', label: '其他旅行证件' }
            ]}
          />
        </QuestionItem>

        <QuestionItem
          question="护照/旅行证件号码"
          name="passportNumber"
          explanation="输入您护照上的护照号码。"
        >
          <Input placeholder="例如：E12345678" />
        </QuestionItem>

        <QuestionItem
          question="护照签发国家/地区"
          name="passportIssuingCountry"
        >
          <Select
            showSearch
            placeholder="选择国家/地区"
            optionFilterProp="children"
            options={countryOptions}
          />
        </QuestionItem>

        <QuestionItem
          question="护照签发地点"
          name="passportIssuingLocation"
          explanation="输入签发护照的城市。"
        >
          <Input placeholder="例如：北京" />
        </QuestionItem>

        <QuestionItem
          question="护照签发日期"
          name="passportIssuanceDate"
        >
          <DateInput 
            dayName="passportIssuanceDay" 
            monthName="passportIssuanceMonth" 
            yearName="passportIssuanceYear" 
          />
        </QuestionItem>

        <QuestionItem
          question="护照有效期至"
          name="passportExpirationDate"
        >
          <DateInput 
            dayName="passportExpirationDay" 
            monthName="passportExpirationMonth" 
            yearName="passportExpirationYear" 
          />
        </QuestionItem>

        <QuestionItem
          question="您的护照是否曾经丢失或被盗？"
          name="hasLostPassport"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.hasLostPassport !== currentValues.hasLostPassport
        }>
          {({ getFieldValue }) => 
            getFieldValue('hasLostPassport') === true ? (
              <>
                <QuestionItem
                  question="丢失/被盗护照号码"
                  name="lostPassportNumber"
                >
                  <Input placeholder="例如：E87654321" />
                </QuestionItem>

                <QuestionItem
                  question="丢失/被盗护照签发国家/地区"
                  name="lostPassportCountry"
                >
                  <Select
                    showSearch
                    placeholder="选择国家/地区"
                    optionFilterProp="children"
                    options={countryOptions}
                  />
                </QuestionItem>

                <QuestionItem
                  question="解释护照丢失或被盗的情况"
                  name="lostPassportExplanation"
                >
                  <Input.TextArea rows={4} placeholder="请详细说明护照丢失或被盗的情况，包括时间、地点和报警情况等。" />
                </QuestionItem>
              </>
            ) : null
          }
        </Form.Item>
      </div>

      <Divider />

      <div style={highlightedBlockStyle}>
        <h4>国家身份证信息</h4>
        
        <QuestionItem
          question="您是否持有国家身份证？"
          name="hasNationalId"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.hasNationalId !== currentValues.hasNationalId
        }>
          {({ getFieldValue }) => 
            getFieldValue('hasNationalId') === true ? (
              <>
                <QuestionItem
                  question="国家身份证号码"
                  name="nationalIdNumber"
                >
                  <Input placeholder="例如：110101199001011234" />
                </QuestionItem>

                <QuestionItem
                  question="签发国家/地区"
                  name="nationalIdCountry"
                >
                  <Select
                    showSearch
                    placeholder="选择国家/地区"
                    optionFilterProp="children"
                    options={countryOptions}
                  />
                </QuestionItem>

                <QuestionItem
                  question="签发日期"
                  name="nationalIdIssuanceDate"
                >
                  <DateInput 
                    dayName="nationalIdIssuanceDay" 
                    monthName="nationalIdIssuanceMonth" 
                    yearName="nationalIdIssuanceYear" 
                  />
                </QuestionItem>

                <QuestionItem
                  question="有效期至"
                  name="nationalIdExpirationDate"
                  explanation="如果是永久有效，请选择一个较远的未来日期，如2099年12月31日。"
                >
                  <DateInput 
                    dayName="nationalIdExpirationDay" 
                    monthName="nationalIdExpirationMonth" 
                    yearName="nationalIdExpirationYear" 
                  />
                </QuestionItem>
              </>
            ) : null
          }
        </Form.Item>
      </div>

      <Divider />

      <div style={highlightedBlockStyle}>
        <h4>美国签证历史</h4>
        
        <QuestionItem
          question="您是否曾经获得过美国签证？"
          name="hasPreviousVisa"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.hasPreviousVisa !== currentValues.hasPreviousVisa
        }>
          {({ getFieldValue }) => 
            getFieldValue('hasPreviousVisa') === true ? (
              <>
                <QuestionItem
                  question="最近一次签证的签发日期"
                  name="lastVisaIssuanceDate"
                >
                  <DateInput 
                    dayName="lastVisaIssuanceDay" 
                    monthName="lastVisaIssuanceMonth" 
                    yearName="lastVisaIssuanceYear" 
                  />
                </QuestionItem>

                <QuestionItem
                  question="签证号码（如果知道）"
                  name="lastVisaNumber"
                  required={false}
                >
                  <Input placeholder="例如：20180012345678" />
                </QuestionItem>

                <QuestionItem
                  question="您是否提供了十指指纹？"
                  name="hasProvidedFingerprints"
                >
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </QuestionItem>

                <QuestionItem
                  question="您的上一个美国签证是否丢失或被盗？"
                  name="isLastVisaLost"
                >
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </QuestionItem>

                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
                  prevValues.isLastVisaLost !== currentValues.isLastVisaLost
                }>
                  {({ getFieldValue }) => 
                    getFieldValue('isLastVisaLost') === true ? (
                      <QuestionItem
                        question="解释签证丢失或被盗的情况"
                        name="lostVisaExplanation"
                      >
                        <Input.TextArea rows={4} placeholder="请详细说明签证丢失或被盗的情况，包括时间、地点和报警情况等。" />
                      </QuestionItem>
                    ) : null
                  }
                </Form.Item>

                <QuestionItem
                  question="您的美国签证申请是否曾经被拒绝？"
                  name="hasVisaDenial"
                >
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </QuestionItem>

                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
                  prevValues.hasVisaDenial !== currentValues.hasVisaDenial
                }>
                  {({ getFieldValue }) => 
                    getFieldValue('hasVisaDenial') === true ? (
                      <>
                        <QuestionItem
                          question="拒签日期"
                          name="visaDenialDate"
                        >
                          <DateInput 
                            dayName="visaDenialDay" 
                            monthName="visaDenialMonth" 
                            yearName="visaDenialYear" 
                          />
                        </QuestionItem>

                        <QuestionItem
                          question="拒签原因（如果知道）"
                          name="visaDenialReason"
                        >
                          <Input.TextArea rows={4} placeholder="请说明您了解的拒签原因。" />
                        </QuestionItem>
                      </>
                    ) : null
                  }
                </Form.Item>
              </>
            ) : null
          }
        </Form.Item>
      </div>
    </div>
  );
};

export default PassportInformation;
