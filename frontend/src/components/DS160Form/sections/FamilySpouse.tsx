import React from 'react';
import { Form, Input, Select } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { countryOptions } from '../utils/formOptions';

interface FamilySpouseProps {
  form: any;
}

const FamilySpouse: React.FC<FamilySpouseProps> = ({ form }) => {
  // 监听配偶信息复选框状态
  const watchSpousePobCityNotKnown = Form.useWatch('spousePobCityNotKnown', form);
  
  // 监听配偶地址类型
  const watchSpouseAddressType = Form.useWatch('spouseAddressType', form);
  
  return (
    <div className="ds160-section">
      <h2>家庭信息：配偶</h2>
      
      <div className="note">
        <p>注意: 输入当前配偶的信息.</p>
      </div>
      
      {/* 配偶姓名和出生日期 */}
      <fieldset className="question-section">
        <h3>
          <span>配偶的全名(包含婚前用名)</span>
        </h3>
        
        <div className="question-row">
          <div className="question-column">
            <div className="highlighted-block">
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="配偶的姓氏"
                  name="spouseSurname"
                  required={true}
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                  />
                </QuestionItem>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="配偶的名字"
                  name="spouseGivenName"
                  required={true}
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={33} 
                  />
                </QuestionItem>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="配偶的出生日期"
                  name="spouseDob"
                  hasNaCheckbox={true}
                  naCheckboxName="spouseDob_na"
                >
                  <DateInput
                    dayName={["spouseDob", "day"]}
                    monthName={["spouseDob", "month"]}
                    yearName={["spouseDob", "year"]}
                  />
                </QuestionItem>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="配偶的国家/地区（国籍）"
                  name="spouseNationality"
                  required={true}
                >
                  <Select 
                    style={{ width: '99%' }} 
                    placeholder="- 请选择一个 -"
                    showSearch
                    optionFilterProp="children"
                  >
                    {countryOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </QuestionItem>
              </div>
            </div>
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 配偶出生地 */}
      <fieldset className="question-section">
        <h3>
          <span>配偶的出生地</span>
        </h3>
        
        <div className="question-row">
          <div className="question-column">
            <div className="highlighted-block">
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="城市"
                  name="spousePobCity"
                  required={true}
                  hasNaCheckbox={true}
                  naCheckboxName="spousePobCity_na"
                >
                  <Input 
                    style={{ width: '99%' }} 
                    maxLength={20} 
                    disabled={!!watchSpousePobCityNotKnown}
                  />
                </QuestionItem>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <QuestionItem
                  question="国家/地区"
                  name="spousePobCountry"
                  required={true}
                >
                  <Select 
                    style={{ width: '99%' }} 
                    placeholder="- 请选择一个 -"
                    showSearch
                    optionFilterProp="children"
                  >
                    {countryOptions.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </QuestionItem>
              </div>
            </div>
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
      
      {/* 配偶地址 */}
      <fieldset className="question-section">
        <div className="question-row">
          <div className="question-column">
            <QuestionItem
              question="配偶的联系地址"
              name="spouseAddressType"
              required={true}
            >
              <Select 
                style={{ width: '99%' }} 
                placeholder="- 请选择一个 -"
              >
                <Select.Option value="">- 请选择一个 -</Select.Option>
                <Select.Option value="H">与家庭住址相同</Select.Option>
                <Select.Option value="M">与邮寄地址相同</Select.Option>
                <Select.Option value="U">与美国联系地址相同</Select.Option>
                <Select.Option value="D">不知道</Select.Option>
                <Select.Option value="O">其他（请指定地址）</Select.Option>
              </Select>
            </QuestionItem>
            
            {watchSpouseAddressType === 'O' && (
              <div style={{ marginTop: '20px' }}>
                <div className="highlighted-block">
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="街道地址（第一行）"
                      name="spouseAddressLine1"
                      required={true}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={40}
                      />
                    </QuestionItem>
                    <span>（不可将邮政信箱号码作为地址信息填写）</span>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="街道地址（第二行）"
                      name="spouseAddressLine2"
                      required={false}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={40}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="城市"
                      name="spouseAddressCity"
                      required={true}
                    >
                      <Input 
                        style={{ width: '99%' }} 
                        maxLength={20}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="州/省份"
                      name="spouseAddressState"
                      required={true}
                      hasNaCheckbox={true}
                      naCheckboxName="spouseAddressState_na"
                      inlineCheckbox={true}
                    >
                      <Input 
                        style={{ width: '90%' }} 
                        maxLength={20}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="邮政区域/邮政编码"
                      name="spouseAddressPostalCode"
                      required={true}
                      hasNaCheckbox={true}
                      naCheckboxName="spouseAddressPostalCode_na"
                      inlineCheckbox={true}
                    >
                      <Input 
                        style={{ width: '90%' }} 
                        maxLength={10}
                      />
                    </QuestionItem>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <QuestionItem
                      question="国家/地区"
                      name="spouseAddressCountry"
                      required={true}
                    >
                      <Select 
                        style={{ width: '99%' }} 
                        options={countryOptions}
                        placeholder="- 请选择一个 -"
                      />
                    </QuestionItem>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="explanation-column"></div>
        </div>
      </fieldset>
    </div>
  );
};

export default FamilySpouse;
