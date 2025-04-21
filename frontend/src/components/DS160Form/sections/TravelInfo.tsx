import React, { useState } from 'react';
import { Form, Input, Select, Radio } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { isDependentSelection, losUnitOptions, usStateOptions, countryOptions } from '../utils/formOptions';
import '../ds160Form.css';

interface TravelInfoProps {
  form: any;
}

const TravelInfo: React.FC<TravelInfoProps> = ({ form }) => {
  const [visaClass, setVisaClass] = useState<string | null>(null);
  const [specificPurpose, setSpecificPurpose] = useState<string | null>(null);
  const [hasSpecificPlans, setHasSpecificPlans] = useState<string | null>(null);
  const [whoIsPaying, setWhoIsPaying] = useState<string | null>(null);

  // Handle visa class change
  const handleVisaClassChange = (value: string) => {
    setVisaClass(value);
    form.setFieldsValue({ 
      specificPurpose: undefined, 
      principalApplicantSurname: undefined, 
      principalApplicantGivenName: undefined 
    });
    setTimeout(() => form.validateFields(['specificPurpose']), 100);
  };


  // Handle specific purpose change
  const handleSpecificPurposeChange = (value: string) => {
    setSpecificPurpose(value);
    form.setFieldsValue({ selectedPurpose: value });

    if (!isDependentSelection(value)) {
      form.setFieldsValue({
        principalApplicantSurname: undefined,
        principalApplicantGivenName: undefined
      });
    }
    form.validateFields(['principalApplicantSurname', 'principalApplicantGivenName']);
  };

  // Handle specific plans change
  const handleSpecificPlansChange = (e: any) => {
    setHasSpecificPlans(e.target.value);
    form.setFieldsValue({ hasSpecificPlans: e.target.value });
  };

  // Handle who is paying change
  const handleWhoIsPayingChange = (value: string) => {
    setWhoIsPaying(value);
    form.setFieldsValue({ whoIsPaying: value });
  };

  // Get specific options based on visa class
  const getSpecificOptions = () => {
    switch(visaClass) {
      case 'A':
        return [
          { value: 'A1-AM', label: '大使或公使 (A1)' },
          { value: 'A1-CH', label: 'A1持有者的子女 (A1)' },
          { value: 'A1-DP', label: '职业外交官/领事官员 (A1)' },
          { value: 'A1-SP', label: 'A1持有者的配偶 (A1)' },
          { value: 'A2-CH', label: 'A2持有者的子女 (A2)' },
          { value: 'A2-EM', label: '外国官员/雇员 (A2)' },
          { value: 'A2-SP', label: 'A2持有者的配偶 (A2)' },
          { value: 'A3-CH', label: 'A3持有者的子女 (A3)' },
          { value: 'A3-EM', label: 'A1或A2持有者的个人雇员 (A3)' },
          { value: 'A3-SP', label: 'A3持有者的配偶 (A3)' }
        ];
      case 'B':
        return [
          { value: 'B1-B2', label: '商务或旅游（临时访客）(B1/B2)' },
          { value: 'B1-CF', label: '商务/会议 (B1)' },
          { value: 'B2-TM', label: '旅游/医疗治疗 (B2)' }
        ];
      // Additional cases would go here
      default:
        return [{ value: 'OTHER', label: '其他' }];
    }
  };

  return (
    <div className="travel-info-section">
      {/* Travel Purpose Section */}
      <fieldset className="question-section">
        <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>提供以下信息：</h4>
        <div className="highlighted-block">
          <div className="question-row">
            <div className="question-column">
              <QuestionItem
                question="赴美访问目的"
                name="visaClass"
              >
                <Select 
                  placeholder="请选择签证类别" 
                  style={{ width: '99%' }}
                  onChange={handleVisaClassChange}
                >
                  <Select.Option value="A">外国政府官员 (A)</Select.Option>
                  <Select.Option value="B">临时商务或旅游访客 (B)</Select.Option>
                  <Select.Option value="C">过境外国人 (C)</Select.Option>
                  <Select.Option value="CNMI">CNMI 工作者或投资者 (CW/E2C)</Select.Option>
                  <Select.Option value="D">机组人员 (D)</Select.Option>
                  <Select.Option value="E">条约贸易商或投资者 (E)</Select.Option>
                  <Select.Option value="F">学术或语言学生 (F)</Select.Option>
                  <Select.Option value="G">国际组织代表/雇员 (G)</Select.Option>
                  <Select.Option value="H">临时工作者 (H)</Select.Option>
                  <Select.Option value="I">外国媒体代表 (I)</Select.Option>
                  <Select.Option value="J">交流访问学者 (J)</Select.Option>
                  <Select.Option value="K">美国公民的未婚夫(妻)或配偶 (K)</Select.Option>
                  <Select.Option value="L">公司内部调动人员 (L)</Select.Option>
                  <Select.Option value="M">职业/非学术学生 (M)</Select.Option>
                  <Select.Option value="N">其他 (N)</Select.Option>
                  <Select.Option value="NATO">北约工作人员 (NATO)</Select.Option>
                  <Select.Option value="O">具有特殊能力的外国人 (O)</Select.Option>
                  <Select.Option value="P">国际知名外国人 (P)</Select.Option>
                  <Select.Option value="Q">文化交流访问者 (Q)</Select.Option>
                  <Select.Option value="R">宗教工作者 (R)</Select.Option>
                  <Select.Option value="S">信息提供者或证人 (S)</Select.Option>
                  <Select.Option value="T">人口贩运受害者 (T)</Select.Option>
                  <Select.Option value="TD/TN">北美自由贸易协定专业人士 (TD/TN)</Select.Option>
                  <Select.Option value="U">犯罪活动受害者 (U)</Select.Option>
                  <Select.Option value="PAROLE-BEN">假释受益人 (PARCIS)</Select.Option>
                </Select>
              </QuestionItem>
            </div>
            <div className="explanation-column">
              <h4 className="help-header">帮助：赴美目的</h4>
              <p>请选择与您赴美目的最相符的签证类别。</p>
            </div>
          </div>

          {visaClass && (
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="具体说明"
                  name="specificPurpose"
                >
                  <Select 
                    placeholder="请选择一个"
                    style={{ width: '99%' }}
                    onChange={handleSpecificPurposeChange}
                  >
                    {getSpecificOptions().map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </QuestionItem>
              </div>
              <div className="explanation-column">
                {/* Empty explanation column to maintain layout */}
              </div>
            </div>
          )}
        </div>

        {specificPurpose && isDependentSelection(specificPurpose) && (
          <>
            <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>主申请人信息</h4>
            <div className="highlighted-block">
              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="主申请人姓氏"
                    name="principalApplicantSurname"
                  >
                    <Input style={{ width: '99%' }} placeholder="请输入主申请人姓氏" />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：主申请人姓氏</h4>
                  <p>请输入持有签证的主申请人的姓氏（与护照一致）</p>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="主申请人名字"
                    name="principalApplicantGivenName"
                  >
                    <Input style={{ width: '99%' }} placeholder="请输入主申请人名字" />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：主申请人名字</h4>
                  <p>请输入持有签证的主申请人的名字（与护照一致）</p>
                </div>
              </div>
            </div>
          </>
        )}
      </fieldset>

      {/* Travel Plans Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="您是否已经制定了具体的旅行计划？"
              name="hasSpecificPlans"
            >
              <Radio.Group onChange={handleSpecificPlansChange}>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：旅行计划</h4>
            <p>如果您已确定行程，请选择'是'；如果尚未确定，请选择'否'并提供预计的信息。</p>
          </div>
        </div>
      

        {/* Specific Travel Plans Section */}
        {hasSpecificPlans === 'Y' && (
          <fieldset className="question-section">
            <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供您来美国的旅行的详细行程</h4>
            <div className="highlighted-block">
              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="入境美国日期"
                    name="arrivalUSDate"
                  >
                    <DateInput 
                      dayName="arrivalDay" 
                      monthName="arrivalMonth" 
                      yearName="arrivalYear"
                    />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：入境日期</h4>
                  <p>请输入您计划入境美国的日期</p>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="抵达航班"
                    name="arrivalFlight"
                    required={false}
                  >
                    <Input style={{ width: '99%' }} maxLength={20} />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：抵达航班</h4>
                  <p>请输入您的抵达航班号（如果知道）</p>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="抵达城市"
                    name="arrivalCity"
                  >
                    <Input style={{ width: '99%' }} maxLength={20} />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：抵达城市</h4>
                  <p>请输入您入境的美国城市</p>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                <QuestionItem
                    question="离开美国日期"
                    name="departureUSDate"
                  >
                    <DateInput 
                      dayName="departureDay" 
                      monthName="departureMonth" 
                      yearName="departureYear"
                    />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：离开日期</h4>
                  <p>请输入您计划离开美国的日期</p>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="离开航班"
                    name="departureFlight"
                    required={false}
                  >
                    <Input style={{ width: '99%' }} maxLength={20} />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：离开航班</h4>
                  <p>请输入您的离开航班号（如果知道）</p>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="离开城市"
                    name="departureCity"
                  >
                    <Input style={{ width: '99%' }} maxLength={20} />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：离开城市</h4>
                  <p>请输入您离开美国的城市</p>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="您计划在美国访问的地点"
                    name="visitLocations"
                  >
                    <RepeatableFormItem
                      name="visitLocations"
                      addButtonText="增加另一个"
                      removeButtonText="移走"
                    >
                      {(field) => (
                        <Form.Item
                          {...field}
                          name={[field.name, 'location']}
                          rules={[{ required: true, message: '请输入访问地点' }]}
                        >
                          <Input placeholder="请输入访问地点" maxLength={40} style={{ width: '95%' }} />
                        </Form.Item>
                      )}
                    </RepeatableFormItem>
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：访问地点</h4>
                  <p>请提供您计划在美国访问的地点</p>
                </div>
              </div>
            </div>
          </fieldset>
        )}

        {/* Approximate Travel Plans Section */}
        {hasSpecificPlans === 'N' && (
          <fieldset className="question-section">
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="计划到达日期"
                  name="intendedDateOfArrival"
                >
                  <DateInput 
                    dayName="arrivalDay" 
                    monthName="arrivalMonth" 
                    yearName="arrivalYear"
                  />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：计划到达日期</h4>
                <p>请提供您计划入境美国的日期。如果您还不确定，请提供一个预计日期。</p>
              </div>
            </div>

            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="计划在美停留时间"
                  name="intendedLengthOfStay"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Form.Item name="stayDuration" noStyle rules={[{ required: true, message: '请输入停留时间' }]}>
                      <Input style={{ width: '80px' }} maxLength={3} placeholder="数量" />
                    </Form.Item>
                    
                    <Form.Item name="stayDurationType" noStyle rules={[{ required: true, message: '请选择单位' }]}>
                      <Select options={losUnitOptions} style={{ width: '120px' }} placeholder="单位" />
                    </Form.Item>
                  </div>
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：停留时间</h4>
                <p>请输入您计划在美国停留的时间长度和单位。</p>
              </div>
            </div>

            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="在美住址"
                  name="addressWhereYouWillStay"
                >
                  <div className="highlighted-block">
                    <QuestionItem
                      question="街道地址 (第1行)"
                      name="streetAddress1"
                    >
                      <Input style={{ width: '99%' }} maxLength={40} />
                    </QuestionItem>
                    
                    <QuestionItem
                      question="街道地址 (第2行)"
                      name="streetAddress2"
                      required={false}
                    >
                      <Input style={{ width: '99%' }} maxLength={40} />
                    </QuestionItem>
                    
                    <QuestionItem
                      question="城市"
                      name="city"
                    >
                      <Input style={{ width: '99%' }} maxLength={20} />
                    </QuestionItem>
                    
                    <QuestionItem
                      question="州"
                      name="state"
                      hasNaCheckbox={true}
                      naCheckboxName="state_na"
                    >
                      <Select style={{ width: '99%' }} placeholder="- 选择州 -">
                        {usStateOptions.map(option => (
                          <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                        ))}
                      </Select>
                    </QuestionItem>
                    
                    <QuestionItem
                      question="邮政编码"
                      name="zipCode"
                      hasNaCheckbox={true}
                      naCheckboxName="zipCode_na"
                    >
                      <Input style={{ width: '99%' }} maxLength={10} />
                    </QuestionItem>
                  </div>
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：在美住址</h4>
                <p>请提供您在美国期间的详细住址，如酒店名称和地址、朋友或亲戚的住址等。</p>
              </div>
            </div>
          </fieldset>
        )}
      </fieldset>

        
      {/* Mission Information Section for A-type visas */}
      {visaClass === 'A' && (
        <fieldset className="question-section">
          <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>使团信息</h4>
          <div className="highlighted-block">
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="使团名称"
                  name="missionName"
                >
                  <Input style={{ width: '99%' }} maxLength={40} />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：使团名称</h4>
                <p>请输入您所属使团的完整名称（英文）</p>
              </div>
            </div>

            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="使团地址（第1行）"
                  name="missionAddress1"
                >
                  <Input style={{ width: '99%' }} maxLength={40} placeholder="街道地址" />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：使团地址</h4>
                <p>请输入使团在美国的详细地址（英文）</p>
              </div>
            </div>

            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="使团地址（第2行）"
                  name="missionAddress2"
                  required={false}
                >
                  <Input style={{ width: '99%' }} maxLength={40} placeholder="公寓号，套房号等（如有）" />
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
                  name="missionCity"
                >
                  <Input style={{ width: '99%' }} maxLength={40} />
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
                  name="missionState"
                  hasNaCheckbox={true}
                  naCheckboxName="missionState_na"
                >
                  <Select style={{ width: '99%' }} placeholder="- 选择州 -">
                    {usStateOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                    ))}
                  </Select>
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
                  name="missionZipCode"
                  hasNaCheckbox={true}
                  naCheckboxName="missionZipCode_na"
                >
                  <Input style={{ width: '99%' }} maxLength={10} />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                {/* Empty explanation column to maintain layout */}
              </div>
            </div>

            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="使团电话"
                  name="missionPhone"
                >
                  <Input style={{ width: '99%' }} maxLength={20} placeholder="例如：+1-202-555-0123" />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：使团电话</h4>
                <p>请输入使团的联系电话，包括国家代码和区号</p>
              </div>
            </div>

            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="主管姓名（英文）"
                  name="supervisorName"
                >
                  <Input style={{ width: '99%' }} maxLength={40} placeholder="例如：JOHN SMITH" />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：主管姓名</h4>
                <p>请输入您在使团的直接主管姓名（英文）</p>
              </div>
            </div>

            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="主管职务（英文）"
                  name="supervisorTitle"
                >
                  <Input style={{ width: '99%' }} maxLength={40} placeholder="例如：DIRECTOR OF MISSION" />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：主管职务</h4>
                <p>请输入您主管在使团中的职务（英文）</p>
              </div>
            </div>

            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="您的职务（英文）"
                  name="applicantTitle"
                >
                  <Input style={{ width: '99%' }} maxLength={40} placeholder="例如：DIPLOMATIC OFFICER" />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：您的职务</h4>
                <p>请输入您在使团中的职务（英文）</p>
              </div>
            </div>
          </div>
        </fieldset>
      )}
      
      {/* Trip Payment Section */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="支付您旅行费用的个人或组织"
              name="whoIsPaying"
            >
              <Select 
                className="select-input" 
                placeholder="- 请选择一个 -"
                onChange={handleWhoIsPayingChange}
              >
                <Select.Option value="S">本人</Select.Option>
                <Select.Option value="H">美国申请人</Select.Option>
                <Select.Option value="O">其他个人</Select.Option>
                <Select.Option value="P">当前雇主</Select.Option>
                <Select.Option value="U">美国雇主</Select.Option>
                <Select.Option value="C">其他公司/组织</Select.Option>
              </Select>
            </QuestionItem>
          </div>
          <div className="explanation-column">
            <h4 className="help-header">帮助：旅行费用</h4>
            <p>请选择谁将支付您此次旅行的费用，包括机票、住宿等费用</p>
          </div>
        </div>

        {whoIsPaying === 'O' && (
              <>
                <h4 className="question-header">提供以下信息：</h4>
                <div className="highlighted-block">
                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="付款人姓氏"
                        name="payerSurname"
                      >
                        <Input maxLength={33} placeholder="例如：FERNANDEZ GARCIA" />
                      </QuestionItem>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：付款人姓氏</h4>
                      <p>请输入付款人的姓氏（英文）</p>
                    </div>
                  </div>

                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="付款人名字"
                        name="payerGivenName"
                      >
                        <Input maxLength={33} placeholder="例如：JUAN MIGUEL" />
                      </QuestionItem>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：付款人名字</h4>
                      <p>请输入付款人的名字（英文）</p>
                    </div>
                  </div>

                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="电话号码"
                        name="payerPhone"
                      >
                        <Input maxLength={15} minLength={5} placeholder="例如：5555555555" />
                      </QuestionItem>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：电话号码</h4>
                      <p>请输入付款人的联系电话</p>
                    </div>
                  </div>

                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="电子邮件地址"
                        name="payerEmail"
                        hasNaCheckbox={true}
                        naCheckboxName="payerEmail_na"
                      >
                        <Input 
                          placeholder="例如：example@email.com" 
                          style={{ width: '99%' }} 
                        />
                      </QuestionItem>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：电子邮件</h4>
                      <p>请输入付款人的电子邮件地址，如不适用请勾选</p>
                    </div>
                  </div>

                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="与您的关系"
                        name="payerRelationship"
                      >
                        <Select className="select-input" placeholder="- 请选择一个 -">
                          <Select.Option value="C">子女</Select.Option>
                          <Select.Option value="P">父母</Select.Option>
                          <Select.Option value="S">配偶</Select.Option>
                          <Select.Option value="R">其他亲属</Select.Option>
                          <Select.Option value="F">朋友</Select.Option>
                          <Select.Option value="O">其他</Select.Option>
                        </Select>
                      </QuestionItem>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：关系</h4>
                      <p>请选择付款人与您的关系</p>
                    </div>
                  </div>
                </div>
              </>
        )}

        {whoIsPaying === 'C' && (
          <>
            <h4 className="question-header">提供以下信息：</h4>
            <div className="highlighted-block">
              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="支付旅行费用的公司/组织名称"
                    name="companyName"
                  >
                    <Input maxLength={33} />
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
                    name="companyPhone"
                  >
                    <Input maxLength={15} minLength={5} placeholder="例如：5555555555" />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：电话号码</h4>
                  <p>请输入公司或组织的联系电话</p>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="电子邮件地址"
                    name="companyEmail"
                    hasNaCheckbox={true}
                    naCheckboxName="companyEmail_na"
                  >
                    <Input 
                      placeholder="例如：example@email.com" 
                      style={{ width: '99%' }} 
                    />
                  </QuestionItem>
                </div>
                <div className="explanation-column">
                  <h4 className="help-header">帮助：电子邮件</h4>
                  <p>请输入公司或组织的电子邮件地址，如不适用请勾选</p>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="与您的关系"
                    name="companyRelation"
                  >
                    <Input />
                  </QuestionItem>
                </div>
              </div>

              <div className="question-row">
                <div className="question-column">
                  <QuestionItem
                    question="公司/组织地址"
                    name="companyAddress"
                  >
                    <div className="block-inside-highlight">
                      <div className="question-row">
                        <div className="question-column">
                          <QuestionItem
                            question="街道地址 (第1行)"
                            name="companyStreetAddress1"
                          >
                            <Input maxLength={40} />
                          </QuestionItem>
                        </div>
                        <div className="explanation-column">
                          <h4 className="help-header">帮助：公司地址</h4>
                          <p>请输入公司或组织的详细地址（英文）</p>
                        </div>
                      </div>

                      <div className="question-row">
                        <div className="question-column">
                          <QuestionItem
                            question="街道地址 (第2行)"
                            name="companyStreetAddress2"
                            required={false}
                          >
                            <Input maxLength={40} />
                            <span className="optional-label">*可选</span>
                          </QuestionItem>
                        </div>
                      </div>

                      <div className="question-row">
                        <div className="question-column">
                          <QuestionItem
                            question="城市"
                            name="companyCity"
                          >
                            <Input maxLength={20} />
                          </QuestionItem>
                        </div>
                      </div>

                      <div className="question-row">
                        <div className="question-column">
                          <QuestionItem
                            question="州/省"
                            name="companyStateProvince"
                            hasNaCheckbox={true}
                            naCheckboxName="companyStateProvince_na"
                          >
                            <Input maxLength={20} />
                          </QuestionItem>
                        </div>
                      </div>

                      <div className="question-row">
                        <div className="question-column">
                          <QuestionItem
                            question="邮政编码"
                            name="companyPostalZIPCode"
                            hasNaCheckbox={true}
                            naCheckboxName="companyPostalZIPCode_na"
                          >
                            <Input maxLength={10} />
                          </QuestionItem>
                        </div>
                      </div>

                      <div className="question-row">
                        <div className="question-column">
                          <QuestionItem
                            question="国家/地区"
                            name="companyCountry"
                          >
                            <Select className="select-input" options={countryOptions} placeholder="- 选择一个 -" />
                          </QuestionItem>
                        </div>
                      </div>
                    </div>
                  </QuestionItem>
                </div>
              </div>
            </div>
          </>
        )}
      </fieldset>
    </div>
  );
};

export default TravelInfo;
