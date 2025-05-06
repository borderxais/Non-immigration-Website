import React, { useState, useEffect } from 'react';
import { Input, Radio, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { losUnitOptions, usStateOptions } from '../utils/formOptions';
import '../ds160Form.css';

const { TextArea } = Input;

interface PreviousTravelProps {
  form: FormInstance;
}

const PreviousTravel: React.FC<PreviousTravelProps> = ({ form }) => {
  const [hasBeenToUS, setHasBeenToUS] = useState<string | null>(form.getFieldValue('hasBeenToUS') || null);
  const [hadUSVisa, setHadUSVisa] = useState<string | null>(form.getFieldValue('previousUsVisa') || null);
  const [visaRefused, setVisaRefused] = useState<string | null>(form.getFieldValue('visaRefused') || null);
  const [immigrantPetition, setImmigrantPetition] = useState<string | null>(form.getFieldValue('immigrantPetition') || null);
  const [hasUSDriverLicense, setHasUSDriverLicense] = useState<string | null>(form.getFieldValue('hasUSDriverLicense') || null);
  const [sameTypeVisa, setSameTypeVisa] = useState<string | null>(form.getFieldValue('sameTypeVisa') || null);
  const [sameCountry, setSameCountry] = useState<string | null>(form.getFieldValue('sameCountry') || null);
  const [tenPrinted, setTenPrinted] = useState<string | null>(form.getFieldValue('tenPrinted') || null);
  const [visaLostStolen, setVisaLostStolen] = useState<string | null>(form.getFieldValue('visaLostStolen') || null);
  const [visaCancelled, setVisaCancelled] = useState<string | null>(form.getFieldValue('visaCancelled') || null);

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
      lostStolenExplanation: undefined,
      lostStolenYear: undefined
    });
    setVisaLostStolen(value);
  };

  const handleVisaCancelledChange = (e: any) => {
    const value = e.target.value;
    // Reset all dependent fields
    form.setFieldsValue({
      visaCancelled: value,
      // Reset fields that appear when visaCancelled is 'Y'
      cancellationExplanation: undefined
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
      </fieldset>

      {/* Previous visits section */}
      {hasBeenToUS === 'Y' && (
        <>
          <fieldset className="question-section">
            <div className="highlighted-block">
              <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
              <RepeatableFormItem
                name="previousTrips"
                addButtonText="增加另一次访问"
                removeButtonText="移走"
              >
                {(field: FormListFieldData) => (
                  <>
                    <QuestionItem
                      question="到达日期"
                    >
                      <DateInput
                        dayName={[field.name, 'arrivalDate', 'day']}
                        monthName={[field.name, 'arrivalDate', 'month']}
                        yearName={[field.name, 'arrivalDate', 'year']}
                        required={true}
                      />
                    </QuestionItem>

                    <QuestionItem
                      question="停留时间"
                      name={[field.name, 'stayDuration']}
                    >
                      <Input style={{ width: '95%' }} maxLength={3} />
                    </QuestionItem>

                    <QuestionItem
                      question="时间单位"
                      name={[field.name, 'stayUnit']}
                    >
                      <Select options={losUnitOptions} style={{ width: '95%' }} />
                    </QuestionItem>
                  </>
                )}
              </RepeatableFormItem>
            </div>
            
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
              <div className="explanation-column">
                <h4 className="help-header">帮助：美国驾照</h4>
                <p>包括任何州颁发的驾驶证。如果您持有或曾经持有美国驾照，请选择"是"。</p>
              </div>
            </div>
          </fieldset>

          {hasUSDriverLicense === 'Y' && (
            <fieldset className="question-section">
              <div className="highlighted-block">
                <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供驾照信息：</h4>
                <RepeatableFormItem
                  name="driverLicenses"
                  addButtonText="增加另一个驾照"
                  removeButtonText="移走"
                >
                  {(field: FormListFieldData) => (
                    <>
                      <QuestionItem
                        question="驾照号码"
                        name={[field.name, 'licenseNumber']}
                        hasNaCheckbox={true}
                        naCheckboxName={[field.name, 'licenseNumber_na']}
                      >
                        <Input 
                          style={{ width: '95%' }} 
                          maxLength={20}
                          disabled={form.getFieldValue(['driverLicenses', field.name, 'licenseNumber_na'])}
                        />
                      </QuestionItem>

                      <QuestionItem
                        question="发证州"
                        name={[field.name, 'driver_license_issue_state']}
                      >
                        <Select options={usStateOptions} style={{ width: '95%' }} />
                      </QuestionItem>
                    </>
                  )}
                </RepeatableFormItem>
              </div>
            </fieldset>
          )}
        </>
      )}

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
      </fieldset>

      {hadUSVisa === 'Y' && (
        <fieldset className="question-section">
          <div className="highlighted-block">
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
                  />
                </QuestionItem>
              </div>
              <div className="explanation-column">
              </div>
            </div>
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="上一次签证的签证号码"
                  name="lastVisaNumber"
                >
                  <Input style={{ width: '98%' }} />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：签证信息</h4>
                <p>请提供您最近一次美国签证的签发日期和签证号码。</p>
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
              <div className="explanation-column">
                <h4 className="help-header">帮助：签证类型</h4>
                <p>如果您此次申请的签证类型与上次获得的签证类型相同，请选择"是"。</p>
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
              <div className="explanation-column">
                <h4 className="help-header">帮助：申请地点</h4>
                <p>如果您此次申请的地点与上次获得签证的地点相同，并且该地点是您的主要居住地，请选择"是"。</p>
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
              <div className="explanation-column">
                <h4 className="help-header">帮助：十指指纹</h4>
                <p>如果您在之前的签证申请或入境美国时提供过十指指纹（而不仅仅是两个手指的指纹），请选择"是"。</p>
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
              <div className="explanation-column">
                <h4 className="help-header">帮助：签证丢失</h4>
                <p>如果您的美国签证曾经丢失或被盗，请选择"是"。</p>
              </div>
            </div>

            {visaLostStolen === 'Y' && (
              <>
                <div className="question-row">
                  <div className="question-column">
                    <QuestionItem
                      question="签证丢失或被盗的年份"
                      name="visaLostYear"
                    >
                      <Input style={{ width: '98%' }} placeholder="例如：2020" />
                    </QuestionItem>
                  </div>
                  <div className="explanation-column">
                    {/* Empty explanation column to maintain layout */}
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
                  <div className="explanation-column">
                    <h4 className="help-header">帮助：说明</h4>
                    <p>请简要说明您的签证是如何丢失或被盗的。</p>
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
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：签证取消</h4>
                <p>如果您的美国签证曾经被取消或撤销，请选择"是"。</p>
              </div>
            </div>

            {visaCancelled === 'Y' && (
              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="请说明签证被取消或撤销的情况"
                    name="visaCancelledExplanation"
                  >
                    <TextArea rows={4} style={{ width: '98%' }} />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：说明</h4>
                  <p>请简要说明您的签证被取消或撤销的原因和情况。</p>
                </div>
              </div>
            )}
          </div>
        </fieldset>
      )}

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
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>
      </fieldset>

      {visaRefused === 'Y' && (
        <fieldset className="question-section">
          <div className="highlighted-block">
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="请说明被拒绝签证或入境的原因及日期"
                  name="refusalDetails"
                >
                  <TextArea rows={4} style={{ width: '98%' }} />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：拒签说明</h4>
                <p>请详细说明您被拒签或拒绝入境的具体原因、时间和情况。</p>
              </div>
            </div>
          </div>
        </fieldset>
      )}

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
          </div>
          <div className="explanation-column">
            {/* Empty explanation column to maintain layout */}
          </div>
        </div>
      </fieldset>

      {immigrantPetition === 'Y' && (
        <fieldset className="question-section">
          <div className="highlighted-block">
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="请提供申请人信息"
                  name="petitionerInfo"
                >
                  <TextArea rows={4} style={{ width: '98%' }} />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：申请人信息</h4>
                <p>请提供为您申请移民的申请人的详细信息。</p>
              </div>
            </div>
          </div>
        </fieldset>
      )}
    </>
  );
};

export default PreviousTravel;