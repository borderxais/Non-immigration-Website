import React, { useState, useEffect } from 'react';
import { Form , Input, Radio, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { losUnitOptions, usStateOptions } from '../utils/formOptions';
import '../ds160Form.css';
import { 
  maxLengths, 
  driverLicenseValidator, 
  driverLicensePatternMessage,
} from '../utils/validationRules';

const { TextArea } = Input;

interface PreviousTravelProps {
  form: FormInstance;
}

const PreviousTravel: React.FC<PreviousTravelProps> = ({ form }) => {
  const [hasBeenToUS, setHasBeenToUS] = useState<string | null>(form.getFieldValue('hasBeenToUS') || null);
  const [hadUSVisa, setHadUSVisa] = useState<string | null>(form.getFieldValue('previousUsVisa') || null);
  const [visaRefused, setVisaRefused] = useState<string | null>(form.getFieldValue('visaRefused') || null);
  const [hasUSDriverLicense, setHasUSDriverLicense] = useState<string | null>(form.getFieldValue('hasUSDriverLicense') || null);
  const [sameTypeVisa, setSameTypeVisa] = useState<string | null>(form.getFieldValue('sameTypeVisa') || null);
  const [sameCountry, setSameCountry] = useState<string | null>(form.getFieldValue('sameCountry') || null);
  const [tenPrinted, setTenPrinted] = useState<string | null>(form.getFieldValue('tenPrinted') || null);
  const [visaLostStolen, setVisaLostStolen] = useState<string | null>(form.getFieldValue('visaLostStolen') || null);
  const [visaCancelled, setVisaCancelled] = useState<string | null>(form.getFieldValue('visaCancelled') || null);
  const [immigrantPetition, setImmigrantPetition] = useState<string | null>(form.getFieldValue('immigrantPetition') || null);

  // Watch birth date fields for changes - try multiple possible paths
  const birthDayDirect = Form.useWatch(['dob', 'day'], form);
  const birthMonthDirect = Form.useWatch(['dob', 'month'], form);
  const birthYearDirect = Form.useWatch(['dob', 'year'], form);

  // Get birth date from form data
  const [birthDate, setBirthDate] = useState<{day: string, month: string, year: string} | undefined>(() => {
    // Initialize with direct path values if available
    const directDay = form.getFieldValue(['dob', 'day']);
    const directMonth = form.getFieldValue(['dob', 'month']);
    const directYear = form.getFieldValue(['dob', 'year']);
    
    if (directDay && directMonth && directYear) {
      console.log('Birth date initialized (direct path):', { directDay, directMonth, directYear });
      return {
        day: directDay,
        month: directMonth,
        year: directYear
      };
    }
    
    console.log('Birth date not found during initialization');
    return undefined;
  });
  
  // Update birth date when watched fields change
  useEffect(() => {
    // Try direct path first
    if (birthDayDirect && birthMonthDirect && birthYearDirect) {
      setBirthDate({
        day: birthDayDirect,
        month: birthMonthDirect,
        year: birthYearDirect
      });
      console.log('Birth date updated (direct watch):', { birthDayDirect, birthMonthDirect, birthYearDirect });
    } 
    
  }, [birthDayDirect, birthMonthDirect, birthYearDirect]);

  // Update state when form values change
  useEffect(() => {
    const updateFromForm = () => {
      setHasBeenToUS(form.getFieldValue('hasBeenToUS'));
      setHadUSVisa(form.getFieldValue('previousUsVisa'));
      setVisaRefused(form.getFieldValue('visaRefused'));
      setImmigrantPetition(form.getFieldValue('immigrantPetition'));
      setHasUSDriverLicense(form.getFieldValue('hasUSDriverLicense'));
      setSameTypeVisa(form.getFieldValue('sameTypeVisa'));
      setSameCountry(form.getFieldValue('sameCountry'));
      setTenPrinted(form.getFieldValue('tenPrinted'));
      setVisaLostStolen(form.getFieldValue('visaLostStolen'));
      setVisaCancelled(form.getFieldValue('visaCancelled'));
    };
    
    // Initial update
    updateFromForm();
    
    // Listen for form field changes
    const formValues = form.getFieldsValue();
    form.setFields(Object.keys(formValues).map(name => ({
      name,
      touched: false,
    })));

    return () => {
      // No cleanup needed for this implementation
    };
  }, [form]);

  const handleHasBeenToUSChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      hasBeenToUS: value,
      // Reset fields that appear when hasBeenToUS is 'Y'
      previousTrips: [],
      hasUSDriverLicense: undefined,
      driverLicenses: []
    });
    setHasBeenToUS(value);
    // Reset dependent state variables
    setHasUSDriverLicense(null);
  };

  const handleHadUSVisaChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      previousUsVisa: value,
      // Reset fields that appear when previousUsVisa is 'Y'
      lastVisaIssueDate: undefined,
      "lastVisaIssueDate.day": undefined,
      "lastVisaIssueDate.month": undefined,
      "lastVisaIssueDate.year": undefined,
      lastVisaNumber: undefined,
      lastVisaNumber_na: undefined,
      sameTypeVisa: undefined,
      sameCountry: undefined,
      tenPrinted: undefined,
      visaLostStolen: undefined,
      visaCancelled: undefined
    });
    setHadUSVisa(value);
    // Reset dependent state variables
    setSameTypeVisa(null);
    setSameCountry(null);
    setTenPrinted(null);
    setVisaLostStolen(null);
    setVisaCancelled(null);
  };

  const handleVisaRefusedChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      visaRefused: value,
      // Reset fields that appear when visaRefused is 'Y'
      refusalDetails: undefined
    });
    setVisaRefused(value);
  };

  const handleImmigrantPetitionChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      immigrantPetition: value,
      // Reset fields that appear when immigrantPetition is 'Y'
      petitionerInfo: undefined
    });
    setImmigrantPetition(value);
  };

  const handleUSDriverLicenseChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      hasUSDriverLicense: value,
      // Reset fields that appear when hasUSDriverLicense is 'Y'
      driverLicenses: []
    });
    setHasUSDriverLicense(value);
  };

  const handleSameTypeVisaChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      sameTypeVisa: value
    });
    setSameTypeVisa(value);
  };

  const handleSameCountryChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      sameCountry: value
    });
    setSameCountry(value);
  };

  const handleTenPrintedChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      tenPrinted: value
    });
    setTenPrinted(value);
  };

  const handleVisaLostStolenChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      visaLostStolen: value,
      // Reset fields that appear when visaLostStolen is 'Y'
      visaLostYear: undefined,
      visaLostExplanation: undefined
    });
    setVisaLostStolen(value);
  };

  const handleVisaCancelledChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      visaCancelled: value,
      // Reset fields that appear when visaCancelled is 'Y'
      visaCancelledExplanation: undefined
    });
    setVisaCancelled(value);
  };

  return (
    <>
      {/* Previous US Travel Question */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否去过美国？"
              name="hasBeenToUS"
            >
              <Radio.Group onChange={handleHasBeenToUSChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>
      
      {/* Previous visits section */}
      {hasBeenToUS === 'Y' && (
        <>
          <fieldset className="question-section">
            <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
            <div className="question-row">
              <div className="question-column" style={{ width: '100%' }}>
                <div className="highlighted-block">
                  <RepeatableFormItem
                    name="previousTrips"
                    addButtonText="增加另一次"
                    removeButtonText="移走"
                    blockStyle="white"
                  >
                    {(field: FormListFieldData) => (
                      <>
                        <QuestionItem
                          question="到达日期"
                          name={[field.name, 'arrivalDate']}
                        >
                          <DateInput
                            dayName={[field.name, 'arrivalDate', 'day']}
                            monthName={[field.name, 'arrivalDate', 'month']}
                            yearName={[field.name, 'arrivalDate', 'year']}
                            required={true}
                            validateNotFutureDate={true}
                            validateNotEarlierThanBirthDate={!!birthDate}
                            birthDate={birthDate}
                          />
                        </QuestionItem>

                        <QuestionItem
                          question="停留时间"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Form.Item name={[field.name, 'stayDuration']} noStyle rules={[{ required: true, message: '请输入停留时间' }]}>
                              <Input style={{ width: '80px' }} maxLength={3} placeholder="数量" />
                            </Form.Item>
                            
                            <Form.Item name={[field.name, 'stayUnit']} noStyle rules={[{ required: true, message: '请选择单位' }]}>
                              <Select 
                                options={losUnitOptions} 
                                style={{ width: '150px' }}
                                placeholder="- 请选择一个 -"
                              />
                            </Form.Item>
                          </div>
                        </QuestionItem>
                      </>
                    )}
                  </RepeatableFormItem>
                
                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="您是否持有或者曾经持有美国驾照？"
                        name="hasUSDriverLicense"
                      >
                        <Radio.Group onChange={handleUSDriverLicenseChange}>
                          <Radio value="Y">是 (Yes)</Radio>
                          <Radio value="N">否 (No)</Radio>
                        </Radio.Group>
                      </QuestionItem>
                    </div>
                  </div>

                  {hasUSDriverLicense === 'Y' && (
                    <div>
                      <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供驾照信息：</h4>
                      <RepeatableFormItem
                        name="driverLicenses"
                        addButtonText="增加另一个"
                        removeButtonText="移走"
                        blockStyle="white"
                      >
                        {(field: FormListFieldData) => (
                          <>
                            <QuestionItem
                              question="驾照号码"
                              name={[field.name, 'licenseNumber']}
                              hasNaCheckbox={true}
                              naCheckboxName={[field.name, 'licenseNumber_na']}
                              parentFieldName="driverLicenses"
                              validator={driverLicenseValidator}
                              validatorMessage={driverLicensePatternMessage}
                            >
                              <Input 
                                style={{ width: '95%' }} 
                                maxLength={maxLengths.driverLicenseNumber}
                                disabled={form.getFieldValue(['driverLicenses', field.name, 'licenseNumber_na'])}
                              />
                            </QuestionItem>

                            <QuestionItem
                              question="发证州"
                              name={[field.name, 'driver_license_issue_state']}
                              parentFieldName="driverLicenses"
                            >
                              <Select options={usStateOptions} style={{ width: '95%' }} placeholder="- 请选择一个 -"/>
                            </QuestionItem>
                          </>
                        )}
                      </RepeatableFormItem>
                    </div>
                  )}
                </div>
              </div> 
              <div className="explanation-column">
                <h4 className="help-header">帮助：以前赴美信息</h4>
                <p>如果您不能确定您以前赴美访问的时间，请估计一个最接近的时间。</p>
              </div>
            </div>     
          </fieldset>

          
        </>
      )}
      </fieldset>

      {/* Previous US Visa Question */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经获得过美国签证?"
              name="previousUsVisa"
            >
              <Radio.Group onChange={handleHadUSVisaChange}>
              <Radio value="Y">是 (Yes)</Radio>
              <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>
      

        {hadUSVisa === 'Y' && (
          <fieldset className="question-section">
            <p>过往美国签证信息</p>
            <div className="highlighted-block">
              <div className="question-row">
                <div className="question-column" style={{ width: '100%' }}>
                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="上一次美国签证签发日期"
                        name="lastVisaIssueDate"
                    >
                      <DateInput 
                        dayName={["lastVisaIssueDate", "day"]}
                        monthName={["lastVisaIssueDate", "month"]}
                        yearName={["lastVisaIssueDate", "year"]}
                        required={true}
                        validateNotFutureDate={true}
                        validateNotEarlierThanBirthDate={!!birthDate}
                        birthDate={birthDate}
                      />
                    </QuestionItem>
                  </div>
                </div>
                <div className="question-row">
                  <div className="question-column">
                    <QuestionItem
                      question="签证号码"
                      name="lastVisaNumber"
                      hasNaCheckbox={true}
                      naCheckboxName="lastVisaNumber_na"
                      inlineCheckbox={true}
                    >
                      <Input style={{ width: '98%' }} />
                    </QuestionItem>
                  </div>
                </div>

                <div className="question-row">
                  <div className="question-column">
                    <QuestionItem
                      question="您是否申请相同类型的签证？"
                      name="sameTypeVisa"
                    >
                      <Radio.Group onChange={handleSameTypeVisaChange} value={sameTypeVisa}>
                        <Radio value="Y">是 (Yes)</Radio>
                        <Radio value="N">否 (No)</Radio>
                      </Radio.Group>
                    </QuestionItem>
                  </div>
                </div>

                <div className="question-row">
                  <div className="question-column">
                    <QuestionItem
                      question="您是否在签发上述签证的同一国家或地点申请，并且该国家或地点是您的主要居住地？"
                      name="sameCountry"
                    >
                      <Radio.Group onChange={handleSameCountryChange} value={sameCountry}>
                        <Radio value="Y">是 (Yes)</Radio>
                        <Radio value="N">否 (No)</Radio>
                      </Radio.Group>
                    </QuestionItem>
                  </div>
                </div>

                <div className="question-row">
                  <div className="question-column">
                    <QuestionItem
                      question="您是否曾经提供过十指指纹？"
                      name="tenPrinted"
                    >
                      <Radio.Group onChange={handleTenPrintedChange} value={tenPrinted}>
                        <Radio value="Y">是 (Yes)</Radio>
                        <Radio value="N">否 (No)</Radio>
                      </Radio.Group>
                    </QuestionItem>
                  </div>
                </div>

                <div className="question-row">
                  <div className="question-column">
                    <QuestionItem
                      question="您的美国签证是否曾经丢失或被盗？"
                      name="visaLostStolen"
                    >
                      <Radio.Group onChange={handleVisaLostStolenChange} value={visaLostStolen}>
                        <Radio value="Y">是 (Yes)</Radio>
                        <Radio value="N">否 (No)</Radio>
                      </Radio.Group>
                    </QuestionItem>
                  </div>
                </div>

                {visaLostStolen === 'Y' && (
                  <>
                  <h4>请回答以下问题：</h4>
                    <div className="block-inside-highlight">
                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="签证丢失或被盗的年份"
                          name="visaLostYear"
                        >
                          <Input style={{ width: '98%' }} />
                        </QuestionItem>
                      </div>
                    </div>

                    <div className="question-row">
                      <div className="question-column">
                        <QuestionItem
                          question="请说明签证丢失或被盗的情况"
                          name="visaLostExplanation"
                        >
                          <TextArea rows={4} style={{ width: '98%' }} />
                        </QuestionItem>
                      </div>
                    </div>
                    </div>
                  </>
                )}

                <div className="question-row">
                  <div className="question-column">
                    <QuestionItem
                      question="您的美国签证是否曾经被取消或撤销？"
                      name="visaCancelled"
                    >
                      <Radio.Group onChange={handleVisaCancelledChange} value={visaCancelled}>
                        <Radio value="Y">是 (Yes)</Radio>
                        <Radio value="N">否 (No)</Radio>
                      </Radio.Group>
                    </QuestionItem>

                    {visaCancelled === 'Y' && (
                      <>
                        <h4>解释说明</h4>
                        <div className="question-row">
                          <div className="question-column">
                            <div className="block-inside-highlight">
                              <Form.Item
                                name="visaCancelledExplanation"
                                noStyle
                              >
                                <TextArea 
                                  style={{ width: '99%' }} 
                                  rows={4} 
                                  maxLength={4000}
                                  required={true}
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                </div>


                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：签证号码</h4>
                  <p>输入您签证右下方的红色8位数字号码，如果您以前签证是一边境通行卡，请输入位于可机读区域第一行的12位数字。</p>
                  <h4 className="help-header">帮助：十指指纹</h4>
                  <p>与仅留了两个手指指纹相比，您已经提供了全部十个手指的指纹。</p>
                </div>
                
              </div>
            </div>
          </fieldset>
        )}

      </fieldset>

      {/* Visa Refusal Question */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否曾经被拒绝美国签证，或在入境口岸被拒入境，或撤销入境申请？"
              name="visaRefused"
            >
              <Radio.Group onChange={handleVisaRefusedChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {visaRefused === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="refusalDetails"
                        noStyle
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={maxLengths.explanation}
                          required={true}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>
      </fieldset>



      {/* Immigrant Petition Question */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="曾有人在公民及移民服务局为您申请过移民吗？"
              name="immigrantPetition"
            >
              <Radio.Group onChange={handleImmigrantPetitionChange}>
                <Radio value="Y">是 (Yes)</Radio>
                <Radio value="N">否 (No)</Radio>
              </Radio.Group>
            </QuestionItem>

            {immigrantPetition === 'Y' && (
              <>
                <h4>解释说明</h4>
                <div className="question-row">
                  <div className="question-column">
                    <div className="highlighted-block">
                      <Form.Item
                        name="petitionerInfo"
                        noStyle
                      >
                        <TextArea 
                          style={{ width: '99%' }} 
                          rows={4} 
                          maxLength={maxLengths.explanation}
                          required={true}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>
      </fieldset>


    </>
  );
};

export default PreviousTravel;