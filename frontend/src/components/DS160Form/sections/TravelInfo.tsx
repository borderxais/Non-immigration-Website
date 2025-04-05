import React from 'react';
import { Form, Input, Select, Radio, Divider } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { losUnitOptions } from '../utils/formOptions';

interface TravelInfoProps {
  form: any;
}

const TravelInfo: React.FC<TravelInfoProps> = ({ form }) => {
  // Define highlighted block style
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  return (
    <div className="travel-info-section">
      <h3>旅行信息</h3>
      
      <QuestionItem
        question="您计划何时抵达美国？"
        name="arrivalDate"
        explanation="如果您不确定具体的日期，请提供您预计抵达的大致日期。"
      >
        <DateInput 
          dayName="arrivalDay" 
          monthName="arrivalMonth" 
          yearName="arrivalYear"
        />
      </QuestionItem>

      <QuestionItem
        question="您计划在美国停留多长时间？"
        name="lengthOfStay"
        explanation="请提供您计划在美国停留的时间长度。"
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <Form.Item name="losLength" noStyle>
            <Input style={{ width: '100px' }} placeholder="例如：6" />
          </Form.Item>
          <Form.Item name="losUnit" noStyle>
            <Select options={losUnitOptions} style={{ width: '120px' }} placeholder="- 选择单位 -" />
          </Form.Item>
        </div>
      </QuestionItem>

      <QuestionItem
        question="您在美国的住址"
        name="usAddress"
        explanation="请提供您在美国期间计划居住的地址。如果您将入住酒店，请提供酒店名称和地址。"
      >
        <div style={highlightedBlockStyle}>
          <QuestionItem
            question="街道地址（第1行）"
            name="usAddressLine1"
          >
            <Input placeholder="例如：123 Main Street" />
          </QuestionItem>

          <QuestionItem
            question="街道地址（第2行）"
            name="usAddressLine2"
            required={false}
            hasNaCheckbox={true}
          >
            <Input placeholder="例如：Apt 4B" />
          </QuestionItem>

          <QuestionItem
            question="城市"
            name="usCity"
          >
            <Input placeholder="例如：New York" />
          </QuestionItem>

          <QuestionItem
            question="州/省"
            name="usState"
          >
            <Select
              placeholder="- 选择州 -"
              options={[
                { value: 'AL', label: 'Alabama' },
                { value: 'AK', label: 'Alaska' },
                { value: 'AZ', label: 'Arizona' },
                { value: 'AR', label: 'Arkansas' },
                { value: 'CA', label: 'California' },
                { value: 'CO', label: 'Colorado' },
                { value: 'CT', label: 'Connecticut' }
              ]}
            />
          </QuestionItem>

          <QuestionItem
            question="邮政编码"
            name="usZipCode"
          >
            <Input placeholder="例如：10001" />
          </QuestionItem>
        </div>
      </QuestionItem>

      <Divider />

      <QuestionItem
        question="谁将支付您的旅行费用？"
        name="travelFunder"
        explanation="请选择谁将支付您此次旅行的费用。"
      >
        <Select placeholder="- 选择一个 -">
          <Select.Option value="SELF">自己</Select.Option>
          <Select.Option value="OTHER_PERSON">其他个人</Select.Option>
          <Select.Option value="COMPANY">公司/组织</Select.Option>
        </Select>
      </QuestionItem>

      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
        prevValues.travelFunder !== currentValues.travelFunder
      }>
        {({ getFieldValue }) => {
          const funder = getFieldValue('travelFunder');
          
          if (funder === 'OTHER_PERSON') {
            return (
              <div style={highlightedBlockStyle}>
                <h4>其他个人信息</h4>
                
                <QuestionItem
                  question="姓"
                  name="funderSurname"
                >
                  <Input placeholder="例如：ZHANG" />
                </QuestionItem>
                
                <QuestionItem
                  question="名"
                  name="funderGivenName"
                >
                  <Input placeholder="例如：SAN" />
                </QuestionItem>
                
                <QuestionItem
                  question="电话号码"
                  name="funderPhone"
                >
                  <Input placeholder="例如：+86 123 4567 8901" />
                </QuestionItem>
                
                <QuestionItem
                  question="与您的关系"
                  name="funderRelationship"
                >
                  <Select placeholder="- 选择一个 -">
                    <Select.Option value="SPOUSE">配偶</Select.Option>
                    <Select.Option value="CHILD">子女</Select.Option>
                    <Select.Option value="PARENT">父母</Select.Option>
                    <Select.Option value="RELATIVE">其他亲属</Select.Option>
                    <Select.Option value="FRIEND">朋友</Select.Option>
                    <Select.Option value="OTHER">其他</Select.Option>
                  </Select>
                </QuestionItem>
                
                <QuestionItem
                  question="地址"
                  name="funderAddress"
                >
                  <Input.TextArea rows={3} placeholder="例如：123 Main Street, Apt 4B, New York, NY 10001" />
                </QuestionItem>
              </div>
            );
          }
          
          if (funder === 'COMPANY') {
            return (
              <div style={highlightedBlockStyle}>
                <h4>公司/组织信息</h4>
                
                <QuestionItem
                  question="公司/组织名称"
                  name="funderCompanyName"
                >
                  <Input placeholder="例如：ABC Company" />
                </QuestionItem>
                
                <QuestionItem
                  question="电话号码"
                  name="funderCompanyPhone"
                >
                  <Input placeholder="例如：+86 123 4567 8901" />
                </QuestionItem>
                
                <QuestionItem
                  question="关系"
                  name="funderCompanyRelationship"
                >
                  <Select placeholder="- 选择一个 -">
                    <Select.Option value="EMPLOYER">雇主</Select.Option>
                    <Select.Option value="SCHOOL">学校</Select.Option>
                    <Select.Option value="OTHER">其他</Select.Option>
                  </Select>
                </QuestionItem>
                
                <QuestionItem
                  question="地址"
                  name="funderCompanyAddress"
                >
                  <Input.TextArea rows={3} placeholder="例如：123 Business Avenue, Suite 500, San Francisco, CA 94107" />
                </QuestionItem>
              </div>
            );
          }
          
          return null;
        }}
      </Form.Item>

      <Divider />
      
      <QuestionItem
        question="是否有其他人与您一同旅行？"
        name="travelingWithOthers"
        explanation="如果有其他人与您一同旅行，请选择 ‘是’。"
      >
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </QuestionItem>
      
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
        prevValues.travelingWithOthers !== currentValues.travelingWithOthers
      }>
        {({ getFieldValue }) => {
          const travelingWithOthers = getFieldValue('travelingWithOthers');
          
          if (travelingWithOthers) {
            return (
              <div style={highlightedBlockStyle}>
                <h4>同行人信息</h4>
                
                <QuestionItem
                  question="同行人是否为旅行团的一部分？"
                  name="partOfGroup"
                >
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </QuestionItem>
                
                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
                  prevValues.partOfGroup !== currentValues.partOfGroup
                }>
                  {({ getFieldValue }) => {
                    const partOfGroup = getFieldValue('partOfGroup');
                    
                    if (partOfGroup === false) {
                      return (
                        <>
                          <QuestionItem
                            question="同行人数"
                            name="travelCompanionCount"
                            explanation="请输入与您一同旅行的人数（不包括您自己）。"
                          >
                            <Input type="number" min={1} placeholder="例如：2" />
                          </QuestionItem>
                          
                          <QuestionItem
                            question="同行人关系"
                            name="travelCompanionRelationship"
                            explanation="请选择与您一同旅行的人的关系。"
                          >
                            <Select mode="multiple" placeholder="- 选择关系 -">
                              <Select.Option value="SPOUSE">配偶</Select.Option>
                              <Select.Option value="CHILD">子女</Select.Option>
                              <Select.Option value="PARENT">父母</Select.Option>
                              <Select.Option value="RELATIVE">其他亲属</Select.Option>
                              <Select.Option value="FRIEND">朋友</Select.Option>
                              <Select.Option value="BUSINESS">商业伙伴</Select.Option>
                              <Select.Option value="OTHER">其他</Select.Option>
                            </Select>
                          </QuestionItem>
                        </>
                      );
                    }
                    
                    if (partOfGroup === true) {
                      return (
                        <QuestionItem
                          question="旅行团名称"
                          name="groupName"
                        >
                          <Input placeholder="例如：ABC旅行团" />
                        </QuestionItem>
                      );
                    }
                    
                    return null;
                  }}
                </Form.Item>
              </div>
            );
          }
          
          return null;
        }}
      </Form.Item>
    </div>
  );
};

export default TravelInfo;
