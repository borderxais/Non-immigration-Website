import React, { useState, useEffect } from 'react';
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
  const [visaClass, setVisaClass] = useState<string | null>(form.getFieldValue('visaClass') || null);
  const [specificPurpose, setSpecificPurpose] = useState<string | null>(form.getFieldValue('specificPurpose') || null);
  const [hasSpecificPlans, setHasSpecificPlans] = useState<string | null>(form.getFieldValue('hasSpecificPlans') || null);
  const [whoIsPaying, setWhoIsPaying] = useState<string | null>(form.getFieldValue('whoIsPaying') || null);
  const [isSameAddress, setIsSameAddress] = useState<string | null>(form.getFieldValue('isSameAddress') || null);

  // Initialize state from form values when component mounts
  useEffect(() => {
    const formVisaClass = form.getFieldValue('visaClass');
    const formSpecificPurpose = form.getFieldValue('specificPurpose');
    const formHasSpecificPlans = form.getFieldValue('hasSpecificPlans');
    const formWhoIsPaying = form.getFieldValue('whoIsPaying');
    const formIsSameAddress = form.getFieldValue('isSameAddress');
    
    if (formVisaClass) setVisaClass(formVisaClass);
    if (formSpecificPurpose) setSpecificPurpose(formSpecificPurpose);
    if (formHasSpecificPlans) setHasSpecificPlans(formHasSpecificPlans);
    if (formWhoIsPaying) setWhoIsPaying(formWhoIsPaying);
    if (formIsSameAddress) setIsSameAddress(formIsSameAddress);
  }, [form]);

  // Handle visa class change
  const handleVisaClassChange = (value: string) => {
    setVisaClass(value);
    setSpecificPurpose(null);  // Reset the state with null instead of undefined
    // Reset all dependent fields when visa class changes
    form.setFieldsValue({ 
      specificPurpose: undefined,
      selectedPurpose: undefined,
      principalApplicantSurname: undefined, 
      principalApplicantGivenName: undefined,
      applicationReceiptNumber: undefined
    });
    setTimeout(() => form.validateFields(['specificPurpose']), 100);
  };


  // Handle specific purpose change
  const handleSpecificPurposeChange = (value: string) => {
    setSpecificPurpose(value);
    // Reset all fields in the scrollable window
    form.setFieldsValue({ 
      selectedPurpose: value,
      principalApplicantSurname: undefined,
      principalApplicantGivenName: undefined,
      applicationReceiptNumber: undefined
    });
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
    
    // Reset the isSameAddress value when changing who is paying
    if (value !== 'O') {
      setIsSameAddress(null);
      form.setFieldsValue({ isSameAddress: null });
    }
  };

  // Handle same address change
  const handleSameAddressChange = (e: any) => {
    setIsSameAddress(e.target.value);
    form.setFieldsValue({ isSameAddress: e.target.value });
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
      case 'C':
        return [
          { value: 'C1-D', label: '过境机组人员 (C1/D)' },
          { value: 'C1-TR', label: '过境 (C1)' },
          { value: 'C2-UN', label: '过境前往联合国总部 (C2)' },
          { value: 'C3-CH', label: 'C3持有者的子女 (C3)' },
          { value: 'C3-EM', label: 'C3持有者的个人雇员 (C3)' },
          { value: 'C3-FR', label: '过境外国官员 (C3)' },
          { value: 'C3-SP', label: 'C3持有者的配偶 (C3)' },
          { value: 'C4-NO', label: '非公民过境驳船操作 (C4)' },
          { value: 'C4-D3', label: '过境驳船机组人员 (C4/D3)' }
        ];
      case 'CNMI':
        return [
          { value: 'CW1-CW1', label: 'CNMI临时工作者 (CW1)' },
          { value: 'CW2-CH', label: 'CW1持有者的子女 (CW2)' },
          { value: 'CW2-SP', label: 'CW1持有者的配偶 (CW2)' },
          { value: 'E2C-E2C', label: 'CNMI长期投资者 (E2C)' }
        ];
      case 'D':
        return [
          { value: 'D-D', label: '机组人员 (D)' },
          { value: 'D3-LI', label: '驳船机组人员 (D3)' }
        ];
      case 'E':
        return [
          { value: 'E1-CH', label: 'E1持有者的子女 (E1)' },
          { value: 'E1-EX', label: '高管/经理/重要雇员 (E1)' },
          { value: 'E1-SP', label: 'E1持有者的配偶 (E1)' },
          { value: 'E1-TR', label: '条约贸易商 (E1)' },
          { value: 'E2-CH', label: 'E2持有者的子女 (E2)' },
          { value: 'E2-EX', label: '高管/经理/重要雇员 (E2)' },
          { value: 'E2-SP', label: 'E2持有者的配偶 (E2)' },
          { value: 'E2-TR', label: '条约投资者 (E2)' },
          { value: 'E3D-CH', label: 'E3持有者的子女 (E3D)' },
          { value: 'E3D-SP', label: 'E3持有者的配偶 (E3D)' }
        ];
      case 'F':
        return [
          { value: 'F1-F1', label: '学生 (F1)' },
          { value: 'F2-CH', label: 'F1持有者的子女 (F2)' },
          { value: 'F2-SP', label: 'F1持有者的配偶 (F2)' }
        ];
      case 'G':
        return [
          { value: 'G1-CH', label: 'G1持有者的子女 (G1)' },
          { value: 'G1-G1', label: '首席代表 (G1)' },
          { value: 'G1-SP', label: 'G1持有者的配偶 (G1)' },
          { value: 'G1-ST', label: '首席代表的工作人员 (G1)' },
          { value: 'G2-CH', label: 'G2持有者的子女 (G2)' },
          { value: 'G2-RP', label: '代表 (G2)' },
          { value: 'G2-SP', label: 'G2持有者的配偶 (G2)' },
          { value: 'G3-CH', label: 'G3持有者的子女 (G3)' },
          { value: 'G3-RP', label: '非认可/非成员国家代表 (G3)' },
          { value: 'G3-SP', label: 'G3持有者的配偶 (G3)' },
          { value: 'G4-CH', label: 'G4持有者的子女 (G4)' },
          { value: 'G4-G4', label: '国际组织雇员 (G4)' },
          { value: 'G4-SP', label: 'G4持有者的配偶 (G4)' },
          { value: 'G5-CH', label: 'G5持有者的子女 (G5)' },
          { value: 'G5-EM', label: 'G1、G2、G3或G4持有者的个人雇员 (G5)' },
          { value: 'G5-SP', label: 'G5持有者的配偶 (G5)' }
        ];
      case 'H':
        return [
          { value: 'H1B-H1B', label: '特殊职业 (H1B)' },
          { value: 'H1B1-CHL', label: '智利特殊职业 (H1B1)' },
          { value: 'H1B1-SGP', label: '新加坡特殊职业 (H1B1)' },
          { value: 'H1C-NR', label: '短缺地区护士 (H1C)' },
          { value: 'H2A-AG', label: '农业工人 (H2A)' },
          { value: 'H2B-NA', label: '非农业工人 (H2B)' },
          { value: 'H3-TR', label: '实习生 (H3)' },
          { value: 'H4-CH', label: 'H签证持有者的子女 (H4)' },
          { value: 'H4-SP', label: 'H签证持有者的配偶 (H4)' }
        ];
      case 'I':
        return [
          { value: 'I-CH', label: 'I签证持有者的子女 (I)' },
          { value: 'I-FR', label: '外国媒体代表 (I)' },
          { value: 'I-SP', label: 'I签证持有者的配偶 (I)' }
        ];
      case 'J':
        return [
          { value: 'J1-J1', label: '交流访问者 (J1)' },
          { value: 'J2-CH', label: 'J1持有者的子女 (J2)' },
          { value: 'J2-SP', label: 'J1持有者的配偶 (J2)' }
        ];
      case 'K':
        return [
          { value: 'K1-K1', label: '美国公民的未婚夫(妻) (K1)' },
          { value: 'K2-K2', label: 'K1持有者的子女 (K2)' },
          { value: 'K3-K3', label: '美国公民的配偶 (K3)' },
          { value: 'K4-K4', label: 'K3持有者的子女 (K4)' }
        ];
      case 'L':
        return [
          { value: 'L1-L1', label: '公司内部调动人员 (L1)' },
          { value: 'L2-CH', label: 'L1持有者的子女 (L2)' },
          { value: 'L2-SP', label: 'L1持有者的配偶 (L2)' }
        ];
      case 'M':
        return [
          { value: 'M1-M1', label: '学生 (M1)' },
          { value: 'M2-CH', label: 'M1持有者的子女 (M2)' },
          { value: 'M2-SP', label: 'M1持有者的配偶 (M2)' },
          { value: 'M3-M3', label: '通勤学生 (M3)' }
        ];
      case 'N':
        return [
          { value: 'N8-N8', label: '特殊移民的父母 (N8)' },
          { value: 'N8-CH', label: 'N8持有者的子女 (N9)' }
        ];
      case 'NATO':
        return [
          { value: 'NATO1-PR', label: '首席代表 (NATO1)' },
          { value: 'NATO1-SP', label: 'NATO1持有者的配偶 (NATO1)' },
          { value: 'NATO1-CH', label: 'NATO1持有者的子女 (NATO1)' },
          { value: 'NATO2-RP', label: '代表 (NATO2)' },
          { value: 'NATO2-SP', label: 'NATO2持有者的配偶 (NATO2)' },
          { value: 'NATO2-CH', label: 'NATO2持有者的子女 (NATO2)' },
          { value: 'NATO3-ST', label: '文职人员 (NATO3)' },
          { value: 'NATO3-SP', label: 'NATO3持有者的配偶 (NATO3)' },
          { value: 'NATO3-CH', label: 'NATO3持有者的子女 (NATO3)' },
          { value: 'NATO4-OF', label: '官员 (NATO4)' },
          { value: 'NATO4-SP', label: 'NATO4持有者的配偶 (NATO4)' },
          { value: 'NATO4-CH', label: 'NATO4持有者的子女 (NATO4)' },
          { value: 'NATO5-EX', label: '专家 (NATO5)' },
          { value: 'NATO5-SP', label: 'NATO5持有者的配偶 (NATO5)' },
          { value: 'NATO5-CH', label: 'NATO5持有者的子女 (NATO5)' },
          { value: 'NATO6-ST', label: '平民工作人员 (NATO6)' },
          { value: 'NATO6-SP', label: 'NATO6持有者的配偶 (NATO6)' },
          { value: 'NATO6-CH', label: 'NATO6持有者的子女 (NATO6)' },
          { value: 'NATO7-EM', label: 'NATO1-NATO6雇佣的个人员工 (NATO7)' },
          { value: 'NATO7-SP', label: 'NATO7持有者的配偶 (NATO7)' },
          { value: 'NATO7-CH', label: 'NATO7持有者的子女 (NATO7)' }
        ];
      case 'O': 
        return [
          { value: 'O1-EX', label: '杰出能力者 (O1)' },
          { value: 'O2-AL', label: '随行/协助人员 (O2)' },
          { value: 'O3-SP', label: 'O1或O2持有者的配偶 (O3)' },
          { value: 'O3-CH', label: 'O1或O2持有者的子女 (O3)' }
        ];
      case 'P':
        return [
          { value: 'P1-P1', label: '国际公认人员 (P1)' },
          { value: 'P2-P2', label: '艺术家/艺人交流项目 (P2)' },
          { value: 'P3-P3', label: '文化项目中的艺术家/艺人 (P3)' },
          { value: 'P4-SP', label: 'P1、P2或P3持有者的配偶 (P4)' },
          { value: 'P4-CH', label: 'P1、P2或P3持有者的子女 (P4)' }
        ];
      case 'Q':
        return [
          { value: 'Q1-Q1', label: '文化交流访问者 (Q1)' }
        ];
      case 'R':
        return [
          { value: 'R1-R1', label: '宗教工作者 (R1)' },
          { value: 'R2-R2', label: '宗教工作者的配偶 (R2)' },
          { value: 'R3-R3', label: '宗教工作者的子女 (R3)' }
        ];
      case 'S':
        return [
          { value: 'S7-S7', label: '线人的家庭成员 (S7)' }
        ];
      case 'T':
        return [
          { value: 'T1-T1', label: '人口贩卖受害者 (T1)' },
          { value: 'T2-SP', label: 'T1持有者的配偶 (T2)' },
          { value: 'T3-CH', label: 'T1持有者的子女 (T3)' },
          { value: 'T4-PR', label: 'T1持有者的父母 (T4)' },
          { value: 'T5-SB', label: 'T1持有者的兄弟姐妹 (T5)' },
          { value: 'T6-CB', label: 'T1派生受益人的成年/未成年子女 (T6)' }
        ];
      case 'TD/TN':
        return [
          { value: 'TD-SP', label: 'TN持有者的配偶 (TD)' },
          { value: 'TD-CH', label: 'TN持有者的子女 (TD)' }
        ];
      case 'U':
        return [
          { value: 'U1-U1', label: '犯罪受害者 (U1)' },
          { value: 'U2-SP', label: 'U1持有者的配偶 (U2)' },
          { value: 'U3-CH', label: 'U1持有者的子女 (U3)' },
          { value: 'U4-PR', label: 'U1持有者的父母 (U4)' },
          { value: 'U5-SB', label: 'U1持有者的兄弟姐妹 (U5)' }
        ];
      case 'PAROLE-BEN':
        return [
          { value: 'PRL-PARCIS', label: 'PARCIS (USCIS批准的临时入境许可)' }
        ];
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

          {/* Add Application Receipt/Petition Number field for H-type visas (except H1B1) */}
          {specificPurpose && specificPurpose.startsWith('H') && 
           !specificPurpose.includes('H1B1') && 
           !specificPurpose.includes('H4') && (
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="申请收据/申请号码"
                  name="applicationReceiptNumber"
                >
                  <Input 
                    style={{ width: '99%' }} 
                    placeholder="例如: ABC1234567890" 
                    maxLength={13}
                  />
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：申请收据/申请号码</h4>
                <p>请输入您的H类签证申请收据号码或申请号码。这通常是由USCIS提供的，格式为三个字母后跟10个数字。</p>
              </div>
            </div>
          )}

          {/* Principal Applicant Information blocks for different visa types */}
          {specificPurpose && isDependentSelection(specificPurpose) && (
            <>
              <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>主申请人信息</h4>
              <div className="question-row">
                <div className="question-column">
                  <div className="block-inside-highlight">
                    {/* A Visa Principal Applicant Info */}
                    {visaClass === 'A' && (
                      <>
                        <div className="question-row">
                          <div className="question-column">
                            <QuestionItem
                              question="Surnames"
                              name="principalApplicantSurname"
                              required
                            >
                              <Input 
                                style={{ width: '95%' }} 
                                maxLength={33}
                              />
                            </QuestionItem>
                          </div>
                        </div>

                        <div className="question-row">
                          <div className="question-column">
                            <QuestionItem
                              question="Given Names"
                              name="principalApplicantGivenName"
                              required
                            >
                              <Input 
                                style={{ width: '95%' }} 
                                maxLength={33}
                              />
                            </QuestionItem>
                          </div>
                        </div>
                      </>
                    )}

                    {/* H Visa Principal Applicant Info */}
                    {visaClass === 'H' && (
                      <>
                        <div className="question-row">
                          <div className="question-column">
                            <QuestionItem
                              question="主申请人姓氏"
                              name="principalApplicantSurname"
                              required
                            >
                              <Input style={{ width: '99%' }} placeholder="请输入主申请人姓氏" />
                            </QuestionItem>
                          </div>
                        </div>

                        <div className="question-row">
                          <div className="question-column">
                            <QuestionItem
                              question="主申请人名字"
                              name="principalApplicantGivenName"
                              required
                            >
                              <Input style={{ width: '99%' }} placeholder="请输入主申请人名字" />
                            </QuestionItem>
                          </div>
                        </div>

                        {specificPurpose.includes('H4') && (
                          <div className="question-row">
                            <div className="question-column">
                              <QuestionItem
                                question="申请收据/申请号码"
                                name="applicationReceiptNumber"
                                required
                              >
                                <Input 
                                  style={{ width: '99%' }} 
                                  placeholder="例如: ABC1234567890" 
                                  maxLength={13}
                                />
                              </QuestionItem>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Add other visa types here as needed */}
                  </div>
                </div>
                <div className="explanation-column">
                  {/* Empty explanation column */}
                </div>
              </div>
            </>
          )}
        </div>
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
                    // name="arrivalUSDate"
                  >
                    <DateInput 
                      dayName="arrivalUSDate.arrivalDay" 
                      monthName="arrivalUSDate.arrivalMonth" 
                      yearName="arrivalUSDate.arrivalYear"
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
                    // name="departureUSDate"
                  >
                    <DateInput 
                      dayName="departureUSDate.departureDay" 
                      monthName="departureUSDate.departureMonth" 
                      yearName="departureUSDate.departureYear"
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
                  >
                    <DateInput 
                      dayName="intendedDateOfArrival.arrivalDay" 
                      monthName="intendedDateOfArrival.arrivalMonth" 
                      yearName="intendedDateOfArrival.arrivalYear"
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

                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="付款人地址是否与您的家庭/通信地址相同？"
                        name="isSameAddress"
                      >
                        <Radio.Group onChange={handleSameAddressChange}>
                          <Radio value="Y">是</Radio>
                          <Radio value="N">否</Radio>
                        </Radio.Group>
                      </QuestionItem>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：付款人地址</h4>
                      <p>请选择付款人地址是否与您的家庭/通信地址相同</p>
                    </div>
                  </div>

                  {isSameAddress === 'N' && (
                    <>
                      <div className="question-row">
                        <div className="question-column">
                          <QuestionItem
                            question="付款人地址（第1行）"
                            name="payerAddress1"
                          >
                            <Input maxLength={40} placeholder="例如：123 MAIN STREET" />
                          </QuestionItem>
                        </div>
                        <div className="explanation-column">
                          <h4 className="help-header">帮助：付款人地址</h4>
                          <p>请输入付款人的详细地址（英文）</p>
                        </div>
                      </div>

                      <div className="question-row">
                        <div className="question-column">
                          <QuestionItem
                            question="付款人地址（第2行）"
                            name="payerAddress2"
                            required={false}
                          >
                            <Input maxLength={40} placeholder="例如：公寓号，套房号等（如有）" />
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
                            name="payerCity"
                          >
                            <Input maxLength={20} />
                          </QuestionItem>
                        </div>
                        <div className="explanation-column">
                          {/* Empty explanation column to maintain layout */}
                        </div>
                      </div>

                      <div className="question-row">
                        <div className="question-column">
                          <QuestionItem
                            question="州/省"
                            name="payerStateProvince"
                            hasNaCheckbox={true}
                            naCheckboxName="payerStateProvince_na"
                          >
                            <Input maxLength={20} />
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
                            name="payerPostalZIPCode"
                            hasNaCheckbox={true}
                            naCheckboxName="payerPostalZIPCode_na"
                          >
                            <Input maxLength={10} />
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
                            name="payerCountry"
                          >
                            <Select className="select-input" options={countryOptions} placeholder="- 选择一个 -" />
                          </QuestionItem>
                        </div>
                        <div className="explanation-column">
                          {/* Empty explanation column to maintain layout */}
                        </div>
                      </div>
                    </>
                  )}
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
