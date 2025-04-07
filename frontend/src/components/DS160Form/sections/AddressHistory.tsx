import React from 'react';
import { Input, Select, Divider, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
// import DateInput from '../common/DateInput';
import { countryOptions } from '../utils/formOptions';

interface AddressHistoryProps {
  form: any;
}

const AddressHistory: React.FC<AddressHistoryProps> = ({ form }) => {
  // Define highlighted block style
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  return (
    <div className="address-history-section">
      <h3>地址历史</h3>
      
      <div style={highlightedBlockStyle}>
        <QuestionItem
          question="当前住址"
          name="currentAddress"
          explanation="请提供您目前的居住地址。"
        >
          <Input.TextArea rows={3} placeholder="例如：123 Main Street, Apt 4B, City, State/Province, Postal Code" />
        </QuestionItem>

        <QuestionItem
          question="城市"
          name="currentCity"
        >
          <Input placeholder="例如：北京" />
        </QuestionItem>

        <QuestionItem
          question="州/省"
          name="currentState"
        >
          <Input placeholder="例如：北京" />
        </QuestionItem>

        <QuestionItem
          question="邮政编码"
          name="currentPostalCode"
        >
          <Input placeholder="例如：100000" />
        </QuestionItem>

        <QuestionItem
          question="国家/地区"
          name="currentCountry"
        >
          <Select
            showSearch
            placeholder="选择国家/地区"
            optionFilterProp="children"
            options={countryOptions}
          />
        </QuestionItem>

        <QuestionItem
          question="您在此地址居住多久了？"
          name="currentAddressDuration"
        >
          <Space>
            <Form.Item name="currentAddressYears" noStyle>
              <Input type="number" min={0} style={{ width: 100 }} />
            </Form.Item>
            <span>年</span>
            <Form.Item name="currentAddressMonths" noStyle>
              <Input type="number" min={0} max={11} style={{ width: 100 }} />
            </Form.Item>
            <span>月</span>
          </Space>
        </QuestionItem>
      </div>

      <Divider />

      <h4>过去五年内的其他地址</h4>
      <p>如果您在过去五年内居住在其他地址，请提供这些地址的信息。</p>

      <Form.List name="previousAddresses">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ ...highlightedBlockStyle, position: 'relative' }}>
                <Button
                  type="text"
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(name)}
                  style={{ position: 'absolute', top: 8, right: 8 }}
                  danger
                />
                
                <Form.Item
                  {...restField}
                  label="地址"
                  name={[name, 'address']}
                  rules={[{ required: true, message: '请输入地址' }]}
                >
                  <Input.TextArea rows={3} placeholder="例如：123 Main Street, Apt 4B, City, State/Province, Postal Code" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="城市"
                  name={[name, 'city']}
                  rules={[{ required: true, message: '请输入城市' }]}
                >
                  <Input placeholder="例如：北京" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="州/省"
                  name={[name, 'state']}
                  rules={[{ required: true, message: '请输入州/省' }]}
                >
                  <Input placeholder="例如：北京" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="邮政编码"
                  name={[name, 'postalCode']}
                  rules={[{ required: true, message: '请输入邮政编码' }]}
                >
                  <Input placeholder="例如：100000" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="国家/地区"
                  name={[name, 'country']}
                  rules={[{ required: true, message: '请选择国家/地区' }]}
                >
                  <Select
                    showSearch
                    placeholder="选择国家/地区"
                    optionFilterProp="children"
                    options={countryOptions}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="居住时间"
                  style={{ marginBottom: 0 }}
                >
                  <Space>
                    <Form.Item
                      {...restField}
                      name={[name, 'yearsAtAddress']}
                      noStyle
                      rules={[{ required: true, message: '请输入年数' }]}
                    >
                      <Input type="number" min={0} style={{ width: 100 }} />
                    </Form.Item>
                    <span>年</span>
                    <Form.Item
                      {...restField}
                      name={[name, 'monthsAtAddress']}
                      noStyle
                      rules={[{ required: true, message: '请输入月数' }]}
                    >
                      <Input type="number" min={0} max={11} style={{ width: 100 }} />
                    </Form.Item>
                    <span>月</span>
                  </Space>
                </Form.Item>
              </div>
            ))}
            
            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
              >
                添加过去的地址
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default AddressHistory;
