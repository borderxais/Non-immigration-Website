import React from 'react';
import { Card, Steps, Form, Input, Select, DatePicker, Radio, Space, Button, Typography, Divider, message } from 'antd';
import ds160Service from '../services/ds160Service';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text } = Typography;

const DS160Form: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    try {
      console.log('Submitting form:', values);
      const response = await ds160Service.createForm(values);
      console.log('Form submitted successfully:', response);
      message.success('表格提交成功！');
      // Redirect to a success page
      navigate('/ds160-success');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('提交表格时出错，请稍后再试。');
    }
  };

  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const QuestionItem: React.FC<{
    number: string;
    question: string;
    name: string;
    required?: boolean;
    children: React.ReactNode;
  }> = ({ number, question, name, required = true, children }) => (
    <div style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        <Text strong>{number}. {question}</Text>
        <Form.Item name={name} required={required} style={{ marginBottom: 0 }}>
          {children}
        </Form.Item>
      </Space>
    </div>
  );

  const steps = [
    {
      title: '开始',
      description: '基本信息',
      content: (
        <>
          <Title level={4}>A. 申请地点</Title>
          <QuestionItem
            number="1"
            question="您计划在哪个使领馆申请签证？"
            name="location"
          >
            <Select placeholder="选择申请地点">
              <Select.Option value="beijing">美国驻北京大使馆</Select.Option>
              <Select.Option value="shanghai">美国驻上海领事馆</Select.Option>
              <Select.Option value="guangzhou">美国驻广州领事馆</Select.Option>
              <Select.Option value="shenyang">美国驻沈阳领事馆</Select.Option>
              <Select.Option value="wuhan">美国驻武汉领事馆</Select.Option>
            </Select>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '个人信息',
      description: '姓名和基本信息',
      content: (
        <>
          <Title level={4}>B. 个人信息</Title>
          
          <Title level={5}>姓名信息</Title>
          <QuestionItem
            number="1"
            question="姓（拼音，与护照一致）"
            name="surname"
          >
            <Input placeholder="例如：ZHANG" />
          </QuestionItem>

          
          <QuestionItem
            number="2"
            question="名（拼音，与护照一致）"
            name="givenName"
          >
            <Input placeholder="例如：SAN" />
          </QuestionItem>

          <QuestionItem
            number="3"
            question="全名（本地语言书写）"
            name="fullNameNative"
          >
            <Input placeholder="如不适用/技术不可用，请填写 '不适用'" />
          </QuestionItem>
          
          <QuestionItem
            number="4"
            question="您是否曾使用其他姓名？（包括曾用名、英文名、别名等）"
            name="hasOtherNames"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>

          <QuestionItem
            number="5"
            question="您是否有代表您姓名的电码？"
            name="hasTelecode"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>
          <Divider />
          
          <Title level={5}>基本信息</Title>
          <QuestionItem
            number="6"
            question="性别"
            name="gender"
          >
            <Radio.Group>
              <Radio value="M">男</Radio>
              <Radio value="F">女</Radio>
            </Radio.Group>
          </QuestionItem>

          <QuestionItem
            number="7"
            question="婚姻状况"
            name="maritalStatus"
          >
            <Select placeholder="选择婚姻状况">
              <Select.Option value="single">未婚</Select.Option>
              <Select.Option value="married">已婚</Select.Option>
              <Select.Option value="divorced">离异</Select.Option>
              <Select.Option value="widowed">丧偶</Select.Option>
            </Select>
          </QuestionItem>

          <QuestionItem
            number="8"
            question="出生日期"
            name="dateOfBirth"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="9"
            question="出生地（城市，国家）"
            name="birthPlace"
          >
            <Input placeholder="例如：北京，中国" />
          </QuestionItem>

          <QuestionItem
            number="10"
            question="省/州"
            name="birthState"
            required={false}
          >
            <Input placeholder="例如：北京市" />
          </QuestionItem>

          <QuestionItem
            number="11"
            question="出生国家/地区"
            name="birthCountry"
          >
            <Select placeholder="- 选择一个 -">
              <Select.Option value="CHN">中国</Select.Option>
              <Select.Option value="HKG">中国香港</Select.Option>
              <Select.Option value="MAC">中国澳门</Select.Option>
              <Select.Option value="TWN">中国台湾</Select.Option>
              {/* Add more countries as needed */}
            </Select>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '联系方式',
      description: '地址和电话',
      content: (
        <>
          <Title level={4}>C. 联系方式</Title>
          
          <Title level={5}>住址信息</Title>
          <QuestionItem
            number="1"
            question="街道地址"
            name="streetAddress"
          >
            <Input placeholder="请输入详细的街道地址" />
          </QuestionItem>

          <QuestionItem
            number="2"
            question="所在城市"
            name="city"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="3"
            question="所在省/自治区/直辖市"
            name="state"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="4"
            question="邮政编码"
            name="postalCode"
          >
            <Input />
          </QuestionItem>

          <Divider />
          
          <Title level={5}>联系方式</Title>
          <QuestionItem
            number="5"
            question="手机号码（包含国家代码）"
            name="phone"
          >
            <Input placeholder="例如：+86-13800138000" />
          </QuestionItem>

          <QuestionItem
            number="6"
            question="电子邮箱"
            name="email"
          >
            <Input type="email" placeholder="例如：example@email.com" />
          </QuestionItem>
        </>
      ),
    },
    {
      title: '护照信息',
      description: '护照详细信息',
      content: (
        <>
          <Title level={4}>D. 护照信息</Title>
          
          <Title level={5}>护照信息</Title>
          <QuestionItem
            number="1"
            question="护照号码"
            name="passportNumber"
          >
            <Input placeholder="护照号码" />
          </QuestionItem>

          <QuestionItem
            number="2"
            question="护照本号码（如有）"
            name="passportBookNumber"
          >
            <Input placeholder="如有" />
          </QuestionItem>

          <QuestionItem
            number="3"
            question="护照签发国家"
            name="issuingCountry"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="4"
            question="护照签发地点"
            name="issuingAuthority"
          >
            <Input placeholder="签发机关" />
          </QuestionItem>

          <QuestionItem
            number="5"
            question="护照签发日期"
            name="issuanceDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="6"
            question="护照过期日期"
            name="expirationDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>
        </>
      ),
    },
    {
      title: '旅行信息',
      description: '行程安排',
      content: (
        <>
          <Title level={4}>E. 旅行信息</Title>
          
          <Title level={5}>旅行目的</Title>
          <QuestionItem
            number="1"
            question="旅行目的"
            name="purposeOfTrip"
          >
            <Select placeholder="选择旅行目的">
              <Select.Option value="B1">商务(B1)</Select.Option>
              <Select.Option value="B2">旅游/访友(B2)</Select.Option>
              <Select.Option value="F1">学习(F1)</Select.Option>
              <Select.Option value="J1">交流访问(J1)</Select.Option>
            </Select>
          </QuestionItem>

          <QuestionItem
            number="2"
            question="具体说明"
            name="specificPurpose"
          >
            <TextArea rows={4} placeholder="详细说明您此行的具体目的" />
          </QuestionItem>

          <Divider />
          
          <Title level={5}>行程信息</Title>
          <QuestionItem
            number="3"
            question="计划入境日期"
            name="intendedDateOfArrival"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="4"
            question="计划停留时间"
            name="intendedLengthOfStay"
          >
            <Input placeholder="例如：2周、1个月" />
          </QuestionItem>

          <QuestionItem
            number="5"
            question="在美住址"
            name="addressWhereYouWillStay"
          >
            <TextArea rows={3} placeholder="在美期间的详细住址" />
          </QuestionItem>

          <Divider />
          
          <Title level={5}>费用信息</Title>
          <QuestionItem
            number="6"
            question="谁将支付您的旅行费用？"
            name="whoIsPaying"
          >
            <Radio.Group>
              <Radio value="self">自己</Radio>
              <Radio value="company">公司</Radio>
              <Radio value="other">其他</Radio>
            </Radio.Group>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '同行人',
      description: '同行人信息',
      content: (
        <>
          <Title level={4}>F. 同行人</Title>
          
          <QuestionItem
            number="1"
            question="您是否有同行人？"
            name="hasCompanions"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '美国信息',
      description: '过往美国旅行',
      content: (
        <>
          <Title level={4}>G. 美国信息</Title>
          
          <Title level={5}>过往美国签证</Title>
          <QuestionItem
            number="1"
            question="您是否曾获得美国签证？"
            name="previousUsVisa"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>

          <Divider />
          
          <Title level={5}>美国联系人</Title>
          <QuestionItem
            number="2"
            question="在美联系人/组织名称"
            name="pointOfContact"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="3"
            question="与联系人关系"
            name="relationshipToContact"
          >
            <Input placeholder="例如：朋友、亲戚、学校" />
          </QuestionItem>

          <QuestionItem
            number="4"
            question="联系人地址"
            name="contactAddress"
          >
            <TextArea rows={3} />
          </QuestionItem>

          <QuestionItem
            number="5"
            question="联系人电话"
            name="contactPhone"
          >
            <Input />
          </QuestionItem>
        </>
      ),
    },
    {
      title: '家庭信息',
      description: '家庭成员信息',
      content: (
        <>
          <Title level={4}>H. 家庭信息</Title>
          
          <Title level={5}>父母信息</Title>
          <QuestionItem
            number="1"
            question="父亲姓名"
            name="fatherName"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="2"
            question="父亲出生日期"
            name="fatherBirthDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="3"
            question="父亲是否在美国"
            name="fatherInUs"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>

          <Divider />
          
          <Title level={5}>母亲信息</Title>
          <QuestionItem
            number="4"
            question="母亲姓名"
            name="motherName"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="5"
            question="母亲出生日期"
            name="motherBirthDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="6"
            question="母亲是否在美国"
            name="motherInUs"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '工作教育',
      description: '工作和教育经历',
      content: (
        <>
          <Title level={4}>I. 工作教育</Title>
          
          <Title level={5}>当前职业信息</Title>
          <QuestionItem
            number="1"
            question="主要职业"
            name="primaryOccupation"
          >
            <Select placeholder="选择职业类型">
              <Select.Option value="employed">就业</Select.Option>
              <Select.Option value="self-employed">自雇</Select.Option>
              <Select.Option value="student">学生</Select.Option>
              <Select.Option value="retired">退休</Select.Option>
              <Select.Option value="unemployed">待业</Select.Option>
            </Select>
          </QuestionItem>

          <QuestionItem
            number="2"
            question="雇主/学校名称"
            name="employer"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="3"
            question="工作/学习开始日期"
            name="employmentDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="4"
            question="月收入"
            name="monthlyIncome"
          >
            <Input placeholder="如适用" />
          </QuestionItem>

          <QuestionItem
            number="5"
            question="工作职责描述"
            name="jobDescription"
          >
            <TextArea rows={4} />
          </QuestionItem>

          <Divider />
          
          <Title level={5}>教育信息</Title>
          <QuestionItem
            number="6"
            question="最高学历"
            name="education"
          >
            <Select placeholder="选择最高学历">
              <Select.Option value="highSchool">高中</Select.Option>
              <Select.Option value="bachelor">本科</Select.Option>
              <Select.Option value="master">硕士</Select.Option>
              <Select.Option value="doctorate">博士</Select.Option>
            </Select>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '安全背景',
      description: '安全和背景信息',
      content: (
        <>
          <Title level={4}>J. 安全背景</Title>
          
          <Title level={5}>安全问题</Title>
          <QuestionItem
            number="1"
            question="您是否曾被拒签或被拒绝入境美国？"
            name="previouslyDenied"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>

          <QuestionItem
            number="2"
            question="您是否曾在美国逾期停留？"
            name="previouslyOverstayed"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '确认提交',
      description: '审核并提交',
      content: (
        <>
          <Title level={4}>K. 确认提交</Title>
          
          <Title level={5}>声明</Title>
          <p>我确认以上信息真实准确。我理解提供虚假信息可能导致签证申请被拒绝或被禁止入境美国。</p>
          <QuestionItem
            number="1"
            question="您是否同意以上声明？"
            name="agreement"
          >
            <Radio.Group>
              <Radio value={true}>我同意以上声明</Radio>
            </Radio.Group>
          </QuestionItem>
        </>
      ),
    },
  ];

  const [formData, setFormData] = React.useState({});
  const next = async () => {
    const values = await form.validateFields();
    setFormData({ ...formData, ...values });
    setCurrentStep(currentStep + 1);
    form.resetFields(); // Optionally reset fields for the next step
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = (values: { [key: string]: any }) => {
    const finalData = { ...formData, ...values };
    handleSubmit(finalData);
    console.log('Success');
  };

  return (
    <Card title="DS-160 非移民签证申请表" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        {...formItemLayout}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        preserve={true}
      >
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Left sidebar with steps */}
          <div style={{ width: '25%', minWidth: '200px' }}>
            <Steps
              current={currentStep}
              direction="vertical"
              items={steps.map(item => ({
                title: item.title,
                description: item.description,
              }))}
             />
          </div>
          
          {/* Right content area */}
          <div style={{ flex: 1 }}>
            <Card>
              {steps[currentStep].content}
            </Card>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              {currentStep > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={prev}>
                  上一步
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={next}>
                  下一步
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="primary" onClick={() => form.submit()}>
                  提交申请
                </Button>
              )}
            </div>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default DS160Form;
