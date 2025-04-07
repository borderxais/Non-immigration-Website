import React from 'react';
import { Input, Select, Radio, Divider, Button, Typography} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import DateInput from '../common/DateInput';
import { countryOptions } from '../utils/formOptions';

const { Text } = Typography;

interface FamilyInformationProps {
  form: any;
}

const FamilyInformation: React.FC<FamilyInformationProps> = ({ form }) => {
  // Define highlighted block style
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  // Relationship options
  const relationshipOptions = [
    { value: 'spouse', label: '配偶' },
    { value: 'father', label: '父亲' },
    { value: 'mother', label: '母亲' },
    { value: 'son', label: '儿子' },
    { value: 'daughter', label: '女儿' },
    { value: 'brother', label: '兄弟' },
    { value: 'sister', label: '姐妹' },
    { value: 'fiance', label: '未婚夫/妻' },
    { value: 'other', label: '其他' }
  ];

  return (
    <div className="family-information-section">
      <h3>家庭信息</h3>
      
      <div style={highlightedBlockStyle}>
        <h4>婚姻状况</h4>
        
        <QuestionItem
          question="您的婚姻状况是什么？"
          name="maritalStatus"
        >
          <Select
            placeholder="选择婚姻状况"
            options={[
              { value: 'single', label: '未婚' },
              { value: 'married', label: '已婚' },
              { value: 'divorced', label: '离异' },
              { value: 'widowed', label: '丧偶' },
              { value: 'separated', label: '分居' },
              { value: 'civil_union', label: '民事结合' }
            ]}
          />
        </QuestionItem>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.maritalStatus !== currentValues.maritalStatus
        }>
          {({ getFieldValue }) => {
            const maritalStatus = getFieldValue('maritalStatus');
            return maritalStatus === 'married' || maritalStatus === 'civil_union' ? (
              <>
                <Divider />
                <h4>配偶信息</h4>
                
                <QuestionItem
                  question="配偶姓氏"
                  name="spouseSurname"
                >
                  <Input placeholder="例如：ZHANG" />
                </QuestionItem>

                <QuestionItem
                  question="配偶名字"
                  name="spouseGivenName"
                >
                  <Input placeholder="例如：WEI" />
                </QuestionItem>

                <QuestionItem
                  question="配偶出生日期"
                  name="spouseBirthDate"
                >
                  <DateInput 
                    dayName="spouseBirthDay" 
                    monthName="spouseBirthMonth" 
                    yearName="spouseBirthYear" 
                  />
                </QuestionItem>

                <QuestionItem
                  question="配偶国籍"
                  name="spouseNationality"
                >
                  <Select
                    showSearch
                    placeholder="选择国家/地区"
                    optionFilterProp="children"
                    options={countryOptions}
                  />
                </QuestionItem>

                <QuestionItem
                  question="配偶出生城市"
                  name="spouseBirthCity"
                >
                  <Input placeholder="例如：北京" />
                </QuestionItem>

                <QuestionItem
                  question="配偶出生国家/地区"
                  name="spouseBirthCountry"
                >
                  <Select
                    showSearch
                    placeholder="选择国家/地区"
                    optionFilterProp="children"
                    options={countryOptions}
                  />
                </QuestionItem>

                <QuestionItem
                  question="配偶地址与您相同吗？"
                  name="spouseAddressSameAsApplicant"
                >
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </QuestionItem>

                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
                  prevValues.spouseAddressSameAsApplicant !== currentValues.spouseAddressSameAsApplicant
                }>
                  {({ getFieldValue }) => 
                    getFieldValue('spouseAddressSameAsApplicant') === false ? (
                      <>
                        <QuestionItem
                          question="配偶地址"
                          name="spouseAddress"
                        >
                          <Input.TextArea rows={3} placeholder="例如：123 Main Street, Apt 4B, City, State/Province, Postal Code" />
                        </QuestionItem>

                        <QuestionItem
                          question="配偶城市"
                          name="spouseCity"
                        >
                          <Input placeholder="例如：北京" />
                        </QuestionItem>

                        <QuestionItem
                          question="配偶州/省"
                          name="spouseState"
                        >
                          <Input placeholder="例如：北京" />
                        </QuestionItem>

                        <QuestionItem
                          question="配偶邮政编码"
                          name="spousePostalCode"
                        >
                          <Input placeholder="例如：100000" />
                        </QuestionItem>

                        <QuestionItem
                          question="配偶国家/地区"
                          name="spouseCountry"
                        >
                          <Select
                            showSearch
                            placeholder="选择国家/地区"
                            optionFilterProp="children"
                            options={countryOptions}
                          />
                        </QuestionItem>
                      </>
                    ) : null
                  }
                </Form.Item>
              </>
            ) : null;
          }}
        </Form.Item>
      </div>

      <Divider />

      <div style={highlightedBlockStyle}>
        <h4>父母信息</h4>
        
        <QuestionItem
          question="您父亲的姓氏"
          name="fatherSurname"
        >
          <Input placeholder="例如：ZHANG" />
        </QuestionItem>

        <QuestionItem
          question="您父亲的名字"
          name="fatherGivenName"
        >
          <Input placeholder="例如：MING" />
        </QuestionItem>

        <QuestionItem
          question="您父亲的出生日期"
          name="fatherBirthDate"
        >
          <DateInput 
            dayName="fatherBirthDay" 
            monthName="fatherBirthMonth" 
            yearName="fatherBirthYear" 
          />
        </QuestionItem>

        <QuestionItem
          question="您父亲是否在美国？"
          name="fatherInUS"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.fatherInUS !== currentValues.fatherInUS
        }>
          {({ getFieldValue }) => 
            getFieldValue('fatherInUS') === true ? (
              <QuestionItem
                question="您父亲的美国移民身份"
                name="fatherUSStatus"
              >
                <Select
                  placeholder="选择身份"
                  options={[
                    { value: 'citizen', label: '美国公民' },
                    { value: 'permanent_resident', label: '永久居民（绿卡持有者）' },
                    { value: 'nonimmigrant', label: '非移民（临时签证）' },
                    { value: 'other', label: '其他' }
                  ]}
                />
              </QuestionItem>
            ) : null
          }
        </Form.Item>

        <Divider />

        <QuestionItem
          question="您母亲的姓氏"
          name="motherSurname"
        >
          <Input placeholder="例如：LI" />
        </QuestionItem>

        <QuestionItem
          question="您母亲的名字"
          name="motherGivenName"
        >
          <Input placeholder="例如：JUAN" />
        </QuestionItem>

        <QuestionItem
          question="您母亲的出生日期"
          name="motherBirthDate"
        >
          <DateInput 
            dayName="motherBirthDay" 
            monthName="motherBirthMonth" 
            yearName="motherBirthYear" 
          />
        </QuestionItem>

        <QuestionItem
          question="您母亲是否在美国？"
          name="motherInUS"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.motherInUS !== currentValues.motherInUS
        }>
          {({ getFieldValue }) => 
            getFieldValue('motherInUS') === true ? (
              <QuestionItem
                question="您母亲的美国移民身份"
                name="motherUSStatus"
              >
                <Select
                  placeholder="选择身份"
                  options={[
                    { value: 'citizen', label: '美国公民' },
                    { value: 'permanent_resident', label: '永久居民（绿卡持有者）' },
                    { value: 'nonimmigrant', label: '非移民（临时签证）' },
                    { value: 'other', label: '其他' }
                  ]}
                />
              </QuestionItem>
            ) : null
          }
        </Form.Item>
      </div>

      <Divider />

      <h4>其他亲属信息</h4>
      <Text type="secondary">请提供在美国的其他直系亲属信息（如子女、兄弟姐妹等）。</Text>
      
      <Form.List name="otherRelatives">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ ...highlightedBlockStyle, position: 'relative', marginTop: 16 }}>
                <Button
                  type="text"
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(name)}
                  style={{ position: 'absolute', top: 8, right: 8 }}
                  danger
                />
                
                <Form.Item
                  {...restField}
                  label="亲属关系"
                  name={[name, 'relationship']}
                  rules={[{ required: true, message: '请选择亲属关系' }]}
                >
                  <Select
                    placeholder="选择关系"
                    options={relationshipOptions}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="姓氏"
                  name={[name, 'surname']}
                  rules={[{ required: true, message: '请输入姓氏' }]}
                >
                  <Input placeholder="例如：ZHANG" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="名字"
                  name={[name, 'givenName']}
                  rules={[{ required: true, message: '请输入名字' }]}
                >
                  <Input placeholder="例如：LI" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="美国移民身份"
                  name={[name, 'usStatus']}
                  rules={[{ required: true, message: '请选择美国移民身份' }]}
                >
                  <Select
                    placeholder="选择身份"
                    options={[
                      { value: 'citizen', label: '美国公民' },
                      { value: 'permanent_resident', label: '永久居民（绿卡持有者）' },
                      { value: 'nonimmigrant', label: '非移民（临时签证）' },
                      { value: 'other', label: '其他' }
                    ]}
                  />
                </Form.Item>
              </div>
            ))}
            
            <Form.Item style={{ marginTop: 16 }}>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
              >
                添加在美亲属
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default FamilyInformation;
