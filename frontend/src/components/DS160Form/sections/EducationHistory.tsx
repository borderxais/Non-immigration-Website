import React from 'react';
import { Input, Select, Divider, Button, Typography } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
// import DateInput from '../common/DateInput';
import { countryOptions, educationLevelOptions } from '../utils/formOptions';

const { Text } = Typography;

interface EducationHistoryProps {
  form: any;
}

const EducationHistory: React.FC<EducationHistoryProps> = ({ form }) => {
  // Define highlighted block style
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  return (
    <div className="education-history-section">
      <h3>教育背景</h3>
      
      <QuestionItem
        question="您的最高学历是什么？"
        name="highestEducationLevel"
        explanation="请选择您已完成的最高教育水平。"
      >
        <Select
          placeholder="选择最高学历"
          options={educationLevelOptions}
        />
      </QuestionItem>

      <Divider />

      <h4>教育经历</h4>
      <Text type="secondary">请从最近的学校开始，列出您就读过的所有学校，包括中学、大学、研究生院等。</Text>
      
      <Form.List name="educationHistory">
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
                  label="学校名称"
                  name={[name, 'schoolName']}
                  rules={[{ required: true, message: '请输入学校名称' }]}
                >
                  <Input placeholder="例如：北京大学" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="学校地址"
                  name={[name, 'schoolAddress']}
                  rules={[{ required: true, message: '请输入学校地址' }]}
                >
                  <Input.TextArea rows={2} placeholder="例如：北京市海淀区颐和园路5号" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="城市"
                  name={[name, 'schoolCity']}
                  rules={[{ required: true, message: '请输入城市' }]}
                >
                  <Input placeholder="例如：北京" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="州/省"
                  name={[name, 'schoolState']}
                  rules={[{ required: true, message: '请输入州/省' }]}
                >
                  <Input placeholder="例如：北京" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="邮政编码"
                  name={[name, 'schoolPostalCode']}
                  rules={[{ required: true, message: '请输入邮政编码' }]}
                >
                  <Input placeholder="例如：100871" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="国家/地区"
                  name={[name, 'schoolCountry']}
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
                  label="所学专业"
                  name={[name, 'courseOfStudy']}
                  rules={[{ required: true, message: '请输入所学专业' }]}
                >
                  <Input placeholder="例如：计算机科学" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="学位/文凭"
                  name={[name, 'degree']}
                  rules={[{ required: true, message: '请输入学位/文凭' }]}
                >
                  <Input placeholder="例如：学士学位" />
                </Form.Item>

                <div style={{ marginBottom: 16 }}>
                  <Text strong>入学日期</Text>
                  <div style={{ display: 'flex', marginTop: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'attendedFromMonth']}
                      rules={[{ required: true, message: '请选择月份' }]}
                      style={{ marginRight: 8, marginBottom: 0 }}
                    >
                      <Select placeholder="月" style={{ width: 100 }}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <Select.Option key={month} value={month}>{month}月</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'attendedFromYear']}
                      rules={[{ required: true, message: '请输入年份' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="年" style={{ width: 100 }} />
                    </Form.Item>
                  </div>
                </div>

                <div>
                  <Text strong>毕业/结束日期</Text>
                  <div style={{ display: 'flex', marginTop: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'attendedToMonth']}
                      rules={[{ required: true, message: '请选择月份' }]}
                      style={{ marginRight: 8, marginBottom: 0 }}
                    >
                      <Select placeholder="月" style={{ width: 100 }}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <Select.Option key={month} value={month}>{month}月</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'attendedToYear']}
                      rules={[{ required: true, message: '请输入年份' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="年" style={{ width: 100 }} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            ))}
            
            <Form.Item style={{ marginTop: 16 }}>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
              >
                添加教育经历
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default EducationHistory;
