import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Radio } from 'antd';
import type { FormListFieldData } from 'antd/es/form/FormList';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import RepeatableFormItem from '../common/RepeatableFormItem';
import { isDependentSelection, losUnitOptions, permanentResidenceOptions, usStateOptions } from '../utils/formOptions';
import { 
  nameValidator,
  namePatternMessage,
  numericPattern,
  numericPatternMessage,
  receiptNumberValidator,
  receiptNumberPatternMessage,
  flightNumberValidator,
  flightNumberPatternMessage,
  zipCodeValidator,
  zipCodePatternMessage,
  locationValidator,
  locationPatternMessage,
  stateZipCodeValidator,
  stateZipCodePatternMessage,
  numPhoneValidator,
  numPhonePatternMessage,
  relationshipValidator,
  relationshipPatternMessage,
  maxLengths,
  emailValidator,
  emailPatternMessage
} from '../utils/validationRules';
import '../ds160Form.css';

interface TravelInfoProps {
  form: any;
}

const TravelInfo: React.FC<TravelInfoProps> = ({ form }) => {
  // Get form values
  const formValues = form.getFieldsValue(true);
  
  // Initialize state from form values
  const [visaClass, setVisaClass] = useState<string | null>(formValues?.visaClass || null);
  const [specificPurpose, setSpecificPurpose] = useState<string | null>(formValues?.specificPurpose || null);
  const [hasSpecificPlans, setHasSpecificPlans] = useState<string | null>(formValues?.hasSpecificPlans || null);
  const [whoIsPaying, setWhoIsPaying] = useState<string | null>(formValues?.whoIsPaying || null);
  const [isSameAddress, setIsSameAddress] = useState<string | null>(formValues?.isSameAddress || null);

  // Update state when form values change
  useEffect(() => {
    const values = form.getFieldsValue(true);
    if (values.visaClass !== undefined) {
      setVisaClass(values.visaClass);
    }
    if (values.specificPurpose !== undefined) {
      setSpecificPurpose(values.specificPurpose);
    }
    if (values.hasSpecificPlans !== undefined) {
      setHasSpecificPlans(values.hasSpecificPlans);
    }
    if (values.whoIsPaying !== undefined) {
      setWhoIsPaying(values.whoIsPaying);
    }
    if (values.isSameAddress !== undefined) {
      setIsSameAddress(values.isSameAddress);
    }
  }, [form]);

  // Handle visa class change
  const handleVisaClassChange = (value: string, fieldName: number) => {
    // First clear all dependent fields
    form.setFieldsValue({
      travelPurposes: {
        [fieldName]: {
          visaClass: value,
          specificPurpose: undefined,
          applicationReceiptNumber: undefined,
          applicationReceiptNumber_na: undefined,
          principalApplicantSurname: undefined,
          principalApplicantGivenName: undefined,
          principalApplicantReceiptNumber: undefined
        }
      },
      sponsoringMission: undefined,
      contactSurname: undefined,
      contactGivenName: undefined,
      missionAddressLine1: undefined,
      missionAddressLine2: undefined,
      missionCity: undefined,
      missionState: undefined,
      missionZipCode: undefined,
      missionPhoneNumber: undefined
    });
    setVisaClass(value);
    setSpecificPurpose(null);
  };

  // Handle specific purpose change
  const handleSpecificPurposeChange = (value: string, fieldName: number) => {
    // First clear all dependent fields
    form.setFieldsValue({
      travelPurposes: {
        [fieldName]: {
          specificPurpose: value,
          applicationReceiptNumber: undefined,
          applicationReceiptNumber_na: undefined,
          principalApplicantSurname: undefined,
          principalApplicantGivenName: undefined,
          principalApplicantReceiptNumber: undefined
        }
      },
      sponsoringMission: undefined,
      contactSurname: undefined,
      contactGivenName: undefined,
      missionAddressLine1: undefined,
      missionAddressLine2: undefined,
      missionCity: undefined,
      missionState: undefined,
      missionZipCode: undefined,
      missionPhoneNumber: undefined
    });
    setSpecificPurpose(value);
  };

  // Handle specific plans change
  const handleSpecificPlansChange = (e: any) => {
    const value = e.target.value;
    // First clear all dependent fields
    form.setFieldsValue({
      hasSpecificPlans: value,
      // Reset all fields that are conditionally rendered based on hasSpecificPlans
      // selected 'Yes' for specific plans
      'intendedDateOfArrival.arrivalDay': undefined,
      'intendedDateOfArrival.arrivalMonth': undefined,
      'intendedDateOfArrival.arrivalYear': undefined,
      arrivalFlight: undefined,
      arrivalCity: undefined,
      "departureUSDate.departureDay": undefined,
      "departureUSDate.departureMonth": undefined,
      "departureUSDate.departureYear": undefined,
      departureFlight: undefined,
      departureCity: undefined,
      visitLocations: [], // Reset repeatable form item to empty array
      // selected 'No' for specific plans
      "arrivalUSDate.arrivalDay": undefined,
      "arrivalUSDate.arrivalMonth": undefined,
      "arrivalUSDate.arrivalYear": undefined,
      stayDuration: undefined,
      stayDurationType: undefined,
      streetAddress1: undefined,
      streetAddress2: undefined,
      city: undefined,
      state: undefined,
      zipCode: undefined
    });
    setHasSpecificPlans(value);
  };

  // Handle who is paying change
  const handleWhoIsPayingChange = (value: string) => {
    // First clear all dependent fields
    form.setFieldsValue({
      whoIsPaying: value,
      // Reset all fields that are conditionally rendered based on whoIsPaying
      // Fields for "其他个人" (O)
      payerSurname: undefined,
      payerGivenName: undefined,
      payerPhone: undefined,
      payerEmail: undefined,
      payerRelationship: undefined,
      isSameAddress: undefined,
      payerAddress1: undefined,
      payerAddress2: undefined,
      payerCity: undefined,
      payerState: undefined,
      payerZipCode: undefined,
      payerCountry: undefined,
      // Fields for "其他公司/组织" (C)
      companyName: undefined,
      companyPhone: undefined,
      companyEmail: undefined,
      companyRelation: undefined,
      companyAddress: undefined,
      companyStreetAddress1: undefined,
      companyStreetAddress2: undefined,
      companyCity: undefined,
      companyStateProvince: undefined,
      companyPostalZIPCode: undefined,
      companyCountry: undefined
    });
    setWhoIsPaying(value);
    setIsSameAddress(null);
  };

  // Handle same address change
  const handleSameAddressChange = (e: any) => {
    const value = e.target.value;
    // First clear all dependent fields
    form.setFieldsValue({
      isSameAddress: value,
      // Reset all fields that are conditionally rendered based on isSameAddress
      payerAddress1: undefined,
      payerAddress2: undefined,
      payerCity: undefined,
      payerState: undefined,
      payerZipCode: undefined,
      payerCountry: undefined
    });
    setIsSameAddress(value);
  };

  // Get specific options based on visa class
  const getSpecificOptions = (visaClass: string) => {
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
        <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供以下信息：</h4>
        <div>
          <RepeatableFormItem
            name="travelPurposes"
            addButtonText="增加另一个目的"
            removeButtonText="移走"
          >
            {(field: FormListFieldData) => (
              <>
                <div className="question-row">
                  <div className="question-column">
                    <QuestionItem
                      question="赴美访问目的"
                      name={[field.name, 'visaClass']}
                    >
                      <Select 
  showSearch
  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                        placeholder="- 请选择一个 -" 
                        style={{ width: '95%' }}
                        onChange={(value) => handleVisaClassChange(value, field.name)}
                        options={[
                          { value: '', label: '- 请选择一个 -' },
                          { value: 'A', label: '外国政府官员 (A)' },
                          { value: 'B', label: '临时商务或旅游访客 (B)' },
                          { value: 'C', label: '过境外国人 (C)' },
                          { value: 'CNMI', label: 'CNMI 工作者或投资者 (CW/E2C)' },
                          { value: 'D', label: '机组人员 (D)' },
                          { value: 'E', label: '条约贸易商或投资者 (E)' },
                          { value: 'F', label: '学术或语言学生 (F)' },
                          { value: 'G', label: '国际组织代表/雇员 (G)' },
                          { value: 'H', label: '临时工作者 (H)' },
                          { value: 'I', label: '外国媒体代表 (I)' },
                          { value: 'J', label: '交流访问学者 (J)' },
                          { value: 'K', label: '美国公民的未婚夫(妻)或配偶 (K)' },
                          { value: 'L', label: '公司内部调动人员 (L)' },
                          { value: 'M', label: '职业/非学术学生 (M)' },
                          { value: 'N', label: '其他 (N)' },
                          { value: 'NATO', label: '北约工作人员 (NATO)' },
                          { value: 'O', label: '具有特殊能力的外国人 (O)' },
                          { value: 'P', label: '国际知名外国人 (P)' },
                          { value: 'Q', label: '文化交流访问者 (Q)' },
                          { value: 'R', label: '宗教工作者 (R)' },
                          { value: 'S', label: '信息提供者或证人 (S)' }
                        ]}
                      />
                    </QuestionItem>
                  </div>
                  <div className="explanation-column"></div>
                </div>

                {form.getFieldValue(['travelPurposes', field.name, 'visaClass']) && (
                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="具体目的"
                        name={[field.name, 'specificPurpose']}
                      >
                        <Select 
  showSearch
  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                          placeholder="- 请选择一个 -" 
                          style={{ width: '95%' }}
                          onChange={(value) => handleSpecificPurposeChange(value, field.name)}
                          options={[
                            { value: '', label: '- 请选择一个 -' },
                            ...getSpecificOptions(form.getFieldValue(['travelPurposes', field.name, 'visaClass']))
                          ]}
                        />
                      </QuestionItem>
                    </div>
                    <div className="explanation-column">
                      {/* Empty explanation column to maintain layout */}
                    </div>
                  </div>
                )}

                {/* Add Application Receipt/Petition Number field for H-type visas (except H1B1) */}
                {form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']) && 
                 form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']).startsWith('H') && 
                 !form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']).includes('H1B1') && 
                 !form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']).includes('H4') && (
                  <div className="question-row">
                    <div className="question-column">
                      <QuestionItem
                        question="申请收据/申请号码"
                        name={[field.name, 'applicationReceiptNumber']}
                        hasNaCheckbox={Boolean(form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']) && 
                                       form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']).includes('H2'))}
                        naCheckboxName={[field.name, 'applicationReceiptNumber_na']}
                        key={`receipt-${form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']) || 'default'}`}
                        validator={receiptNumberValidator}
                        validatorMessage={receiptNumberPatternMessage}
                      >
                        <Input 
                          style={{ width: '95%' }} 
                          placeholder="例如: ABC1234567890" 
                          maxLength={maxLengths.receiptNumber}
                        />
                      </QuestionItem>
                    </div>
                    <div className="explanation-column">
                      <h4 className="help-header">帮助：申请收据/申请号码</h4>
                      <p>您的申请收据/申请号码是在您向美国国土安全部的美国公民及移民服务局（USCIS）的服务中心提交申请后由USCIS提供给您的。申请收据/申请号码由13个字符组成，前三个字符是字母。</p>
                    </div>
                  </div>
                )}

                {/* Principal Applicant Information blocks for different visa types */}
                {form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']) && 
                 isDependentSelection(form.getFieldValue(['travelPurposes', field.name, 'specificPurpose'])) && (
                  <>
                    <div className="question-row">
                      <div className="question-column">
                        <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>主申请人信息</h4>
                        <div className="block-inside-highlight">
                          <QuestionItem
                            question="主申请人姓氏"
                            name={[field.name, 'principalApplicantSurname']}
                            required
                            validator={nameValidator}
                            validatorMessage={namePatternMessage}
                          >
                            <Input 
                              style={{ width: '95%' }} 
                              maxLength={maxLengths.name}
                              placeholder="例如：ZHANG"
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="主申请人名字"
                            name={[field.name, 'principalApplicantGivenName']}
                            required
                            validator={nameValidator}
                            validatorMessage={namePatternMessage}
                          >
                            <Input 
                              style={{ width: '95%' }} 
                              maxLength={maxLengths.name}
                              placeholder="例如：WEI"
                            />
                          </QuestionItem>
                          
                          {/* Add Application Receipt/Petition Number field for H4 dependents */}
                          {form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']) && 
                           (form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']) === 'H4-CH' || 
                            form.getFieldValue(['travelPurposes', field.name, 'specificPurpose']) === 'H4-SP') && (
                            <QuestionItem
                              question="申请收据/申请号码"
                              name={[field.name, 'principalApplicantReceiptNumber']}
                              required
                              validator={receiptNumberValidator}
                              validatorMessage={receiptNumberPatternMessage}
                            >
                              <Input 
                                style={{ width: '95%' }} 
                                placeholder="例如: ABC1234567890" 
                                maxLength={maxLengths.receiptNumber}
                              />
                            </QuestionItem>
                          )}
                        </div>
                      </div>
                      <div className="explanation-column">
                        <h4 className="help-header">帮助：主申请人信息</h4>
                        <p>请提供主申请人的姓名信息。如果您是H4签证申请人，还需要提供主申请人的申请收据/申请号码。</p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </RepeatableFormItem>
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
        </div>

        {/* Specific Travel Plans Section */}
        {hasSpecificPlans === 'Y' && (
          <fieldset className="question-section">
            <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供您来美国的旅行的详细行程</h4>
            <div className="question-row">
              <div className="question-column">
                <div className="highlighted-block">
                  <QuestionItem
                    question="入境美国日期"
                    name="arrivalUSDate"
                  >
                    <DateInput 
                      dayName={["arrivalUSDate","day"]}
                      monthName={["arrivalUSDate","month"]}
                      yearName={["arrivalUSDate","year"]}
                      validateFutureDate={true}
                    />
                  </QuestionItem>

                  <QuestionItem
                    question="抵达航班"
                    name="arrivalFlight"
                    required={false}
                    validator={flightNumberValidator}
                    validatorMessage={flightNumberPatternMessage}
                  >
                    <Input 
                      style={{ width: '99%' }} 
                      maxLength={maxLengths.flightNumber} 
                      placeholder="例如: AA 123 或 UA 456"
                    />
                  </QuestionItem>
                
                  <QuestionItem
                    question="抵达城市"
                    name="arrivalCity"
                    validator={locationValidator}
                    validatorMessage={locationPatternMessage}
                  >
                    <Input 
                      style={{ width: '99%' }} 
                      maxLength={maxLengths.city} 
                      placeholder="例如: NEW YORK"
                    />
                  </QuestionItem>
                
                  <QuestionItem
                    question="离开美国日期"
                    name="departureUSDate"
                  >
                    <DateInput 
                      dayName={["departureUSDate", "day"]} 
                      monthName={["departureUSDate", "month"]} 
                      yearName={["departureUSDate", "year"]}
                      validateFutureDate={true}
                    />
                  </QuestionItem>

                  <QuestionItem
                    question="离开航班"
                    name="departureFlight"
                    required={false}
                    validator={flightNumberValidator}
                    validatorMessage={flightNumberPatternMessage}
                  >
                    <Input style={{ width: '99%' }} maxLength={maxLengths.flightNumber} />
                  </QuestionItem>

                  <QuestionItem
                    question="离开城市"
                    name="departureCity"
                    validator={locationValidator}
                    validatorMessage={locationPatternMessage}
                  >
                    <Input 
                      style={{ width: '99%' }} 
                      maxLength={maxLengths.city}
                      placeholder="例如: LOS ANGELES"
                    />
                  </QuestionItem>
                </div>
              </div>
              <div className="explanation-column">                 
                <h4 className="help-header">帮助：旅行计划</h4>                 
                <p>如果您不确定您到达美国的日期或离开美国的日期，请提供一个估计日期。</p>               
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
                    blockStyle="highlighted"
                  >
                    {(field) => (
                      <Form.Item
                        {...field}
                        name={[field.name, 'location']}
                        rules={[{ required: true, message: '请输入访问地点' }]}
                      >
                        <Input placeholder="请输入访问地点" maxLength={maxLengths.address} style={{ width: '95%' }} />
                      </Form.Item>
                    )}
                  </RepeatableFormItem>
                </QuestionItem>
              </div>
                <div className="explanation-column"></div>
              </div>
            
          </fieldset>
        )}

        {/* Approximate Travel Plans Section */}
        {hasSpecificPlans === 'N' && (
          <fieldset className="question-section">
            <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>请提供您预计的旅行信息</h4>
            <div className="question-row">
              <div className="question-column">
                <QuestionItem
                  question="计划到达日期"
                  name="intendedDateOfArrival"
                >
                  <DateInput 
                    dayName={["intendedDateOfArrival", "day"]} 
                    monthName={["intendedDateOfArrival", "month"]} 
                    yearName={["intendedDateOfArrival", "year"]}
                    validateFutureDate={true}
                  />
                </QuestionItem>

                <QuestionItem
                  question="计划在美停留时间"
                  name="intendedLengthOfStay"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Form.Item name="stayDuration" noStyle 
                      rules={[{ required: true, message: '请输入停留时间' },
                        { pattern: numericPattern, message: numericPatternMessage }
                      ]}>
                      <Input style={{ width: '80px' }} maxLength={3} placeholder="数量" />
                    </Form.Item>
                    
                    <Form.Item name="stayDurationType" noStyle 
                      rules={[{ required: true, message: '请选择单位' }]}>
                      <Select 
  showSearch
  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                        options={losUnitOptions} 
                        style={{ width: '120px' }}
                        placeholder="- 请选择一个 -"
                      />
                    </Form.Item>
                  </div>
                </QuestionItem>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：计划到达日期</h4>
                <p>请提供您计划入境美国的日期。如果您还不确定，请提供一个预计日期。</p>
              </div>
            </div>
          </fieldset>
        )}

        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="在美住址"
            >
              <div className="highlighted-block">
                <QuestionItem
                  question="街道地址 (第1行)"
                  name="streetAddress1"
                >
                  <Input style={{ width: '99%' }} maxLength={maxLengths.address} />
                </QuestionItem>
                
                <QuestionItem
                  question="街道地址 (第2行)"
                  name="streetAddress2"
                  required={false}
                >
                  <Input style={{ width: '99%' }} maxLength={maxLengths.address} />
                </QuestionItem>
                
                <QuestionItem
                  question="城市"
                  name="city"
                  validator={locationValidator}
                  validatorMessage={locationPatternMessage}
                >
                  <Input style={{ width: '99%' }} maxLength={maxLengths.city} />
                </QuestionItem>
                
                <QuestionItem
                  question="州"
                  name="state"
                >
                  <Select 
  showSearch
  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                    options={usStateOptions}
                    style={{ width: '99%' }}
                    placeholder="- 请选择一个 -"
                  />
                </QuestionItem>
                
                <QuestionItem
                  question="邮政编码"
                  name="zipCode"
                  required={false}
                  validator={zipCodeValidator}
                  validatorMessage={zipCodePatternMessage}
                >
                  <Input style={{ width: '60%' }} maxLength={maxLengths.zipCode} />
                </QuestionItem>
              </div>
            </QuestionItem>
            </div>
          <div className="explanation-column">
          </div>
        </div>
      </fieldset>

      {/* Mission Information Section */}
      {visaClass === 'A' && specificPurpose && !isDependentSelection(specificPurpose) && (
        <fieldset className="question-section">
          <h4 style={{ marginBottom: '16px', fontWeight: 'normal' }}>使团信息</h4>
          <div className="question-row">
            <div className="question-column">
              <div className="highlighted-block">
                <QuestionItem
                  question="赞助使团/组织"
                  name="sponsoringMission"
                >
                  <Input style={{ width: '99%' }} placeholder="请输入赞助使团/组织名称" maxLength={40} />
                </QuestionItem>
              
                <QuestionItem
                  question="联络人姓氏"
                  name="contactSurname"
                >
                  <Input style={{ width: '99%' }} placeholder="请输入联络人姓氏" maxLength={maxLengths.name} />
                </QuestionItem>
              
                <QuestionItem
                  question="联络人名字"
                  name="contactGivenName"
                >
                  <Input style={{ width: '99%' }} placeholder="请输入联络人名字" maxLength={maxLengths.name} />
                </QuestionItem>
              
                <QuestionItem
                  question="美国地址（第一行）"
                  name="missionAddressLine1"
                >
                  <Input style={{ width: '99%' }} placeholder="请输入地址第一行" maxLength={maxLengths.address} />
                </QuestionItem>
              
                <QuestionItem
                  question="美国地址（第二行）"
                  name="missionAddressLine2"
                  required={false}
                >
                  <Input style={{ width: '99%' }} placeholder="请输入地址第二行（可选）" maxLength={maxLengths.address} />
                </QuestionItem>
              
                <QuestionItem
                  question="城市"
                  name="missionCity"
                  validator={locationValidator}
                  validatorMessage={locationPatternMessage}
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={maxLengths.city}
                    placeholder="例如: Washington"
                  />
                </QuestionItem>
              
                <QuestionItem
                  question="州"
                  name="missionState"
                >
                  <Select 
  showSearch
  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                    options={usStateOptions} 
                    style={{ width: '99%' }} 
                    placeholder="- 请选择一个 -" 
                  />  
                </QuestionItem>
              
                <QuestionItem
                  question="邮政编码"
                  name="missionZipCode"
                  validator={stateZipCodeValidator}
                  validatorMessage={stateZipCodePatternMessage}
                >
                  <Input style={{ width: '60%' }} placeholder="例如：12345 或 12345-1234" maxLength={maxLengths.zipCode} />
                </QuestionItem>
              
                <QuestionItem
                  question="电话号码"
                  name="missionPhoneNumber"
                  validator={numPhoneValidator}
                  validatorMessage={numPhonePatternMessage}
                >
                  <Input style={{ width: '60%' }} placeholder="例如：5555555555" minLength={5} maxLength={15} />
                </QuestionItem>
              </div>
            </div>
            <div className="explanation-column">
              <h4 className="help-header">帮助：电话号码</h4>
              <p>请输入使团的联系电话，包括区号</p>
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
  showSearch
  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                className="select-input" 
                placeholder="- 请选择一个 -"
                onChange={handleWhoIsPayingChange}
                options={[
                  { value: '', label: '- 请选择一个 -' },
                  { value: 'S', label: '本人' },
                  { value: 'O', label: '其他个人' },
                  { value: 'P', label: '当前雇主' },
                  { value: 'U', label: '美国雇主' },
                  { value: 'C', label: '其他公司/组织' }
                ]}
              />
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
            <div className="question-row">
              <div className="question-column">
                <div className="highlighted-block">
                  <QuestionItem
                    question="付款人姓氏"
                    name="payerSurname"
                    validator={nameValidator}
                    validatorMessage={namePatternMessage}
                  >
                    <Input maxLength={maxLengths.name} placeholder="例如：FERNANDEZ GARCIA" />
                  </QuestionItem>
                
                  <QuestionItem
                    question="付款人名字"
                    name="payerGivenName"
                    validator={nameValidator}
                    validatorMessage={namePatternMessage}
                  >
                    <Input maxLength={maxLengths.name} placeholder="例如：JUAN MIGUEL" />
                  </QuestionItem>
                
                  <QuestionItem
                    question="电话号码"
                    name="payerPhone"
                    validator={numPhoneValidator}
                    validatorMessage={numPhonePatternMessage}
                  >
                    <Input maxLength={15} minLength={5} placeholder="例如：5555555555" />
                  </QuestionItem>
                
                  <QuestionItem
                    question="电子邮件地址"
                    name="payerEmail"
                    hasNaCheckbox={true}
                    naCheckboxName="payerEmail_na"
                    inlineCheckbox={true}
                    validator={emailValidator}
                    validatorMessage={emailPatternMessage}
                  >
                    <Input 
                      placeholder="例如：example@email.com" 
                      style={{ width: '99%' }} 
                      maxLength={maxLengths.email}
                    />
                  </QuestionItem>
                
                  <QuestionItem
                    question="与您的关系"
                    name="payerRelationship"
                  >
                    <Select 
  showSearch
  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                      className="select-input" 
                      placeholder="- 请选择一个 -"
                      options={[
                        { value: '', label: '- 请选择一个 -' },
                        { value: 'C', label: '子女' },
                        { value: 'P', label: '父母' },
                        { value: 'S', label: '配偶' },
                        { value: 'R', label: '其他亲属' },
                        { value: 'F', label: '朋友' },
                        { value: 'O', label: '其他' }
                      ]}
                    />
                  </QuestionItem>
                
                  <QuestionItem
                    question="付款人地址是否与您的家庭/通信地址相同？"
                    name="isSameAddress"
                  >
                    <Radio.Group onChange={handleSameAddressChange}>
                      <Radio value="Y">是</Radio>
                      <Radio value="N">否</Radio>
                    </Radio.Group>
                  </QuestionItem>

                  {isSameAddress === 'N' && (
                    <>                 
                      <div className="question-row">
                        <div className="question-column">
                          <div className="block-inside-highlight">
                            <QuestionItem
                              question="付款人地址（第1行）"
                              name="payerAddress1"
                            >
                              <Input maxLength={maxLengths.address} placeholder="例如：123 MAIN STREET" />
                            </QuestionItem>
                          
                            <QuestionItem
                              question="付款人地址（第2行）"
                              name="payerAddress2"
                              required={false}
                            >
                              <Input maxLength={maxLengths.address} placeholder="例如：公寓号，套房号等（如有）" />
                            </QuestionItem>
                          
                            <QuestionItem
                              question="城市"
                              name="payerCity"
                              validator={locationValidator}
                              validatorMessage={locationPatternMessage}
                            >
                              <Input 
                                style={{ width: '99%' }} 
                                maxLength={maxLengths.city}
                                placeholder="例如: Chicago"
                              />
                            </QuestionItem>
                          
                            <QuestionItem
                              question="州/省"
                              name="payerStateProvince"
                              hasNaCheckbox={true}
                              naCheckboxName="payerStateProvince_na"
                              inlineCheckbox={true}
                              validator={locationValidator}
                              validatorMessage={locationPatternMessage}
                            >
                              <Input maxLength={maxLengths.state} />
                            </QuestionItem>
                          
                            <QuestionItem
                              question="邮政编码"
                              name="payerPostalZIPCode"
                              hasNaCheckbox={true}
                              naCheckboxName="payerPostalZIPCode_na"
                              inlineCheckbox={true}
                              validator={stateZipCodeValidator}
                              validatorMessage={stateZipCodePatternMessage}
                            >
                              <Input maxLength={maxLengths.zipCode} />
                            </QuestionItem>
                          
                            <QuestionItem
                              question="国家/地区"
                              name="payerCountry"
                            >
                              <Select 
  showSearch
  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={permanentResidenceOptions } placeholder="- 请选择一个 -" style={{ width: '98%' }} />
                            </QuestionItem>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="explanation-column">
                <h4 className="help-header">帮助：付款人地址</h4>
                <p>请选择付款人地址是否与您的家庭/通信地址相同</p>
              </div>
            </div>
          </>
        )}

        {whoIsPaying === 'C' && (
          <>
            <h4 className="question-header">提供以下信息：</h4>
            <div className="question-row">
              <div className="question-column">
                <div className="highlighted-block">
                  <QuestionItem
                    question="支付旅行费用的公司/组织名称"
                    name="companyName"
                  >
                    <Input maxLength={maxLengths.name} />
                  </QuestionItem>
                
                  <QuestionItem
                    question="电话号码"
                    name="companyPhone"
                    validator={numPhoneValidator}
                    validatorMessage={numPhonePatternMessage}
                  >
                    <Input maxLength={15} minLength={5} placeholder="例如：5555555555" />
                  </QuestionItem>
                
                  <QuestionItem
                    question="与您的关系"
                    name="companyRelation"
                    validator={relationshipValidator}
                    validatorMessage={relationshipPatternMessage}
                  >
                    <Input maxLength={maxLengths.name} placeholder="例如：EMPLOYER" />
                  </QuestionItem>
                
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
                            <Input maxLength={maxLengths.address} />
                          </QuestionItem>

                          <QuestionItem
                            question="街道地址 (第2行)"
                            name="companyStreetAddress2"
                            required={false}
                          >
                            <Input maxLength={maxLengths.address} />
                            <span className="optional-label">*可选</span>
                          </QuestionItem>

                          <QuestionItem
                            question="城市"
                            name="companyCity"
                            validator={locationValidator}
                            validatorMessage={locationPatternMessage}
                          >
                            <Input 
                              style={{ width: '99%' }} 
                              maxLength={maxLengths.city}
                              placeholder="例如: San Francisco"
                            />
                          </QuestionItem>

                          <QuestionItem
                            question="州/省"
                            name="companyStateProvince"
                            hasNaCheckbox={true}
                            naCheckboxName="companyStateProvince_na"
                            inlineCheckbox={true}
                            validator={locationValidator}
                            validatorMessage={locationPatternMessage}
                          >
                            <Input maxLength={maxLengths.state} />
                          </QuestionItem>

                          <QuestionItem
                            question="邮政编码"
                            name="companyPostalZIPCode"
                            hasNaCheckbox={true}
                            naCheckboxName="companyPostalZIPCode_na"
                            inlineCheckbox={true}
                            validator={stateZipCodeValidator}
                            validatorMessage={stateZipCodePatternMessage}
                          >
                            <Input maxLength={maxLengths.zipCode} />
                          </QuestionItem>

                          <QuestionItem
                            question="国家/地区"
                            name="companyCountry"
                          >
                            <Select 
  showSearch
  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} options={permanentResidenceOptions} placeholder="- 请选择一个 -" style={{ width: '98%' }} />
                          </QuestionItem>
                        </div>
                      </div>
                    </div>
                  </QuestionItem>
                </div>
              </div>
              <div className="explanation-column"></div>
            </div>
          </>
        )}
      </fieldset>
    </div>
  );
};

export default TravelInfo;
