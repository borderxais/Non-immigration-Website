import React from 'react';
import { Input, Select, Radio, Divider, Button, Typography } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import QuestionItem from '../common/QuestionItem';
import { countryOptions } from '../utils/formOptions';

const { Text } = Typography;

interface WorkHistoryProps {
  form: any;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ form }) => {
  // Define highlighted block style
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  return (
    <div className="work-history-section">
      <h3>工作经历</h3>
      
      <QuestionItem
        question="您目前的主要职业是什么？"
        name="primaryOccupation"
        explanation="请选择最能描述您当前职业的选项。"
      >
        <Select
          placeholder="选择职业"
          options={[
            { value: 'agriculture', label: '农业' },
            { value: 'arts', label: '艺术/娱乐' },
            { value: 'business', label: '商业' },
            { value: 'communications', label: '通信' },
            { value: 'computer', label: '计算机科学' },
            { value: 'culinary', label: '烹饪/食品服务' },
            { value: 'education', label: '教育' },
            { value: 'engineering', label: '工程' },
            { value: 'government', label: '政府' },
            { value: 'homemaker', label: '家庭主妇/夫' },
            { value: 'legal', label: '法律' },
            { value: 'medical', label: '医疗/健康' },
            { value: 'military', label: '军事' },
            { value: 'natural_science', label: '自然科学' },
            { value: 'physical_science', label: '物理科学' },
            { value: 'religious', label: '宗教' },
            { value: 'researcher', label: '研究人员' },
            { value: 'retired', label: '退休人员' },
            { value: 'social_science', label: '社会科学' },
            { value: 'student', label: '学生' },
            { value: 'unemployed', label: '无业' },
            { value: 'other', label: '其他' }
          ]}
        />
      </QuestionItem>

      <Divider />

      <div style={highlightedBlockStyle}>
        <h4>当前工作信息</h4>
        
        <QuestionItem
          question="您目前是否受雇？"
          name="currentlyEmployed"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.currentlyEmployed !== currentValues.currentlyEmployed
        }>
          {({ getFieldValue }) => 
            getFieldValue('currentlyEmployed') === true ? (
              <>
                <QuestionItem
                  question="雇主/公司名称"
                  name="currentEmployerName"
                >
                  <Input placeholder="例如：ABC科技有限公司" />
                </QuestionItem>

                <QuestionItem
                  question="雇主/公司地址"
                  name="currentEmployerAddress"
                >
                  <Input.TextArea rows={2} placeholder="例如：北京市海淀区中关村南大街5号" />
                </QuestionItem>

                <QuestionItem
                  question="城市"
                  name="currentEmployerCity"
                >
                  <Input placeholder="例如：北京" />
                </QuestionItem>

                <QuestionItem
                  question="州/省"
                  name="currentEmployerState"
                >
                  <Input placeholder="例如：北京" />
                </QuestionItem>

                <QuestionItem
                  question="邮政编码"
                  name="currentEmployerPostalCode"
                >
                  <Input placeholder="例如：100080" />
                </QuestionItem>

                <QuestionItem
                  question="国家/地区"
                  name="currentEmployerCountry"
                >
                  <Select
                    showSearch
                    placeholder="选择国家/地区"
                    optionFilterProp="children"
                    options={countryOptions}
                  />
                </QuestionItem>

                <QuestionItem
                  question="电话号码"
                  name="currentEmployerPhone"
                >
                  <Input placeholder="例如：+86 10 12345678" />
                </QuestionItem>

                <QuestionItem
                  question="您的职位"
                  name="currentJobTitle"
                >
                  <Input placeholder="例如：软件工程师" />
                </QuestionItem>

                <QuestionItem
                  question="您的职责描述"
                  name="currentJobDuties"
                >
                  <Input.TextArea rows={3} placeholder="简要描述您的工作职责" />
                </QuestionItem>

                <QuestionItem
                  question="入职日期"
                  name="currentEmploymentDate"
                >
                  <div style={{ display: 'flex' }}>
                    <Form.Item name="currentEmploymentMonth" noStyle>
                      <Select placeholder="月" style={{ width: 100, marginRight: 8 }}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <Select.Option key={month} value={month}>{month}月</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="currentEmploymentYear" noStyle>
                      <Input placeholder="年" style={{ width: 100 }} />
                    </Form.Item>
                  </div>
                </QuestionItem>

                <QuestionItem
                  question="月收入（美元）"
                  name="monthlyIncome"
                  explanation="请提供您的月收入，以美元为单位。如需换算，请使用当前汇率。"
                >
                  <Input prefix="$" type="number" min={0} placeholder="例如：3000" />
                </QuestionItem>
              </>
            ) : null
          }
        </Form.Item>
      </div>

      <Divider />

      <h4>过去五年的工作经历</h4>
      <Text type="secondary">请列出您过去五年内的所有工作经历，不包括当前工作。如果您在此期间有超过一个工作，请添加所有工作经历。</Text>
      
      <Form.List name="previousEmployment">
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
                  label="雇主/公司名称"
                  name={[name, 'employerName']}
                  rules={[{ required: true, message: '请输入雇主/公司名称' }]}
                >
                  <Input placeholder="例如：XYZ企业有限公司" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="雇主/公司地址"
                  name={[name, 'employerAddress']}
                  rules={[{ required: true, message: '请输入雇主/公司地址' }]}
                >
                  <Input.TextArea rows={2} placeholder="例如：上海市浦东新区陆家嘴环路1000号" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="城市"
                  name={[name, 'employerCity']}
                  rules={[{ required: true, message: '请输入城市' }]}
                >
                  <Input placeholder="例如：上海" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="州/省"
                  name={[name, 'employerState']}
                  rules={[{ required: true, message: '请输入州/省' }]}
                >
                  <Input placeholder="例如：上海" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="邮政编码"
                  name={[name, 'employerPostalCode']}
                  rules={[{ required: true, message: '请输入邮政编码' }]}
                >
                  <Input placeholder="例如：200120" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="国家/地区"
                  name={[name, 'employerCountry']}
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
                  label="电话号码"
                  name={[name, 'employerPhone']}
                  rules={[{ required: true, message: '请输入电话号码' }]}
                >
                  <Input placeholder="例如：+86 21 12345678" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="您的职位"
                  name={[name, 'jobTitle']}
                  rules={[{ required: true, message: '请输入您的职位' }]}
                >
                  <Input placeholder="例如：市场经理" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="您的职责描述"
                  name={[name, 'jobDuties']}
                  rules={[{ required: true, message: '请描述您的工作职责' }]}
                >
                  <Input.TextArea rows={3} placeholder="简要描述您的工作职责" />
                </Form.Item>

                <div style={{ marginBottom: 16 }}>
                  <Text strong>入职日期</Text>
                  <div style={{ display: 'flex', marginTop: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'employmentFromMonth']}
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
                      name={[name, 'employmentFromYear']}
                      rules={[{ required: true, message: '请输入年份' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="年" style={{ width: 100 }} />
                    </Form.Item>
                  </div>
                </div>

                <div>
                  <Text strong>离职日期</Text>
                  <div style={{ display: 'flex', marginTop: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'employmentToMonth']}
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
                      name={[name, 'employmentToYear']}
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
                添加过去的工作经历
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default WorkHistory;
