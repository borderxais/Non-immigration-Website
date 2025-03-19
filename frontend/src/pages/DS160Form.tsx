import React from 'react';
import { Card, Steps, Form, Input, Select, DatePicker, Radio, Space, Button, Typography, Divider, message, Row, Col, Checkbox } from 'antd';
import ds160Service from '../services/ds160Service';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

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

  // Helper component for form items with explanations
  const QuestionItem: React.FC<{
    number?: string;
    question: string;
    name: string;
    required?: boolean;
    children: React.ReactNode;
    explanation?: string;
    hasNaCheckbox?: boolean;
    naCheckboxName?: string;
  }> = ({ number, question, name, required = true, children, explanation, hasNaCheckbox = false, naCheckboxName }) => {
    const [isNaChecked, setIsNaChecked] = React.useState(false);
    
    const onNaCheckboxChange = (e: any) => {
      setIsNaChecked(e.target.checked);
    };
    
    // Create a custom input with disabled state based on NA checkbox
    const renderDisableableInput = () => {
      // Rather than trying to clone the element, we'll wrap it with our own logic
      if (!React.isValidElement(children)) {
        return children;
      }
      
      // For Input components
      if (children.type === Input || children.type === TextArea) {
        return (
          <Input
            {...(children.props as any)}
            disabled={isNaChecked}
            style={{ 
              ...((children.props as any).style || {}),
              backgroundColor: isNaChecked ? '#f5f5f5' : 'white'
            }}
          />
        );
      }
      
      // For Select components
      if (children.type === Select) {
        return (
          <Select
            {...(children.props as any)}
            disabled={isNaChecked}
            style={{ 
              ...((children.props as any).style || {}),
              backgroundColor: isNaChecked ? '#f5f5f5' : 'white'
            }}
          />
        );
      }
      
      // For DatePicker components
      if (children.type === DatePicker) {
        return (
          <DatePicker
            {...(children.props as any)}
            disabled={isNaChecked}
            style={{ 
              ...((children.props as any).style || {}),
              backgroundColor: isNaChecked ? '#f5f5f5' : 'white'
            }}
          />
        );
      }
      
      // For Radio.Group components
      if (children.type === Radio.Group) {
        return (
          <Radio.Group
            {...(children.props as any)}
            disabled={isNaChecked}
          />
        );
      }
      
      // Default case - return the original element
      return children;
    };
    
    return (
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            <Text strong>{number ? `${number}. ` : ''}{question}{required && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>}</Text>
            <Form.Item 
              name={name} 
              required={required && !isNaChecked} 
              rules={required ? [{ required: !isNaChecked, message: '此字段为必填项' }] : []}
              style={{ marginBottom: 0 }}
            >
              {renderDisableableInput()}
            </Form.Item>
            
            {hasNaCheckbox && (
              <Form.Item 
                name={naCheckboxName || `${name}_na`} 
                valuePropName="checked"
                style={{ marginBottom: 0, marginTop: 8, textAlign: 'right' }}
              >
                <Checkbox onChange={onNaCheckboxChange}>不适用/技术无法提供</Checkbox>
              </Form.Item>
            )}
          </Space>
        </Col>
        {explanation && (
          <Col span={8}>
            <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', height: '100%' }}>
              <Paragraph style={{ fontSize: '13px', color: '#666' }}>{explanation}</Paragraph>
            </div>
          </Col>
        )}
      </Row>
    );
  };

  const steps = [
    {
      title: '开始',
      description: '基本信息',
      content: (
        <>
        <Title level={4}>安全问题</Title>
      
          <QuestionItem
            question="请选择一个安全问题"
            name="securityQuestion"
          >
            <Select placeholder="选择安全问题" style={{ width: '100%' }}>
              <Select.Option value="1">您母亲的母亲的名字是什么？</Select.Option>
              <Select.Option value="2">您父亲的父亲的名字是什么？</Select.Option>
              <Select.Option value="3">您外祖母的娘家姓是什么？</Select.Option>
              <Select.Option value="4">您小时候家人怎么称呼您？</Select.Option>
              <Select.Option value="5">您在哪个城市遇到您的配偶/伴侣？</Select.Option>
              <Select.Option value="6">您最好的童年朋友叫什么名字？</Select.Option>
              <Select.Option value="7">您8岁时住在哪条街？</Select.Option>
              <Select.Option value="8">您最年长的兄弟姐妹的生日月份和年份？（例如：1900年1月）</Select.Option>
              <Select.Option value="9">您最小的孩子的中间名是什么？</Select.Option>
              <Select.Option value="10">您最年长的兄弟姐妹的中间名是什么？</Select.Option>
              <Select.Option value="11">您11岁时就读的学校是什么？</Select.Option>
              <Select.Option value="12">您小时候的家庭电话号码是什么？</Select.Option>
              <Select.Option value="13">您最年长的表亲/堂亲的名字和姓氏是什么？</Select.Option>
              <Select.Option value="14">您最喜欢的毛绒动物或玩具的名字是什么？</Select.Option>
              <Select.Option value="15">您的父母在哪个城市或镇相遇？</Select.Option>
              <Select.Option value="16">您最喜欢的老师的姓氏是什么？</Select.Option>
              <Select.Option value="17">您最近的兄弟姐妹住在哪个城市？</Select.Option>
              <Select.Option value="18">您最年幼的兄弟姐妹的生日月份和年份？（例如：1900年1月）</Select.Option>
              <Select.Option value="19">您的第一份工作在哪个城市或镇？</Select.Option>
              <Select.Option value="20">您的第一个男朋友或女朋友叫什么名字？</Select.Option>
            </Select>
          </QuestionItem>
          
          <QuestionItem
            question="您的回答(英文)"
            name="securityAnswer"
          >
            <Input placeholder="请输入您的安全问题答案" />
          </QuestionItem>
          
          <Title level={5}>提示</Title>
          <p>为了保护您的个人信息安全，请记住您的安全问题和答案。如果您需要恢复您的申请，将需要提供此信息。</p>

          <Divider />

          <Title level={4}>申请地点</Title>
            <QuestionItem
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
          
          <QuestionItem
            question="姓（拼音，与护照一致）"
            name="surname"
            explanation="输入您护照上列出的所有姓氏。如果只有一个，请输入这一个。"
          >
            <Input placeholder="例如：ZHANG" />
          </QuestionItem>

          <QuestionItem
            question="名（拼音，与护照一致）"
            name="givenName"
            explanation="如果您的护照上不包括名字信息，请在名字栏内输入'FNU'。"
          >
            <Input placeholder="例如：SAN" />
          </QuestionItem>

          <QuestionItem
            question="全名（本地语言书写）"
            name="fullNameNative"
            explanation="请用中文填写您的全名。如不适用/技术不可用，请勾选下方的复选框。"
            hasNaCheckbox={true}
            naCheckboxName="fullNameNative_na"
          >
            <Input placeholder="请用中文填写您的全名" />
          </QuestionItem>
          
          <QuestionItem
            question="您是否曾使用其他姓名？（包括曾用名、英文名、别名等）"
            name="hasOtherNames"
            explanation="其它姓名包括您的婚前用名, 宗教用名、职业用名; 或任何为人所知的其它名字；或在过去为别人所知的其它名字。"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>

          <QuestionItem
            question="您是否有代表您姓名的电码？"
            name="hasTelecode"
            explanation="电码由4位数字组成，代表着一些非罗马字母拼写而成的名字的字体。"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>
          
          <Divider />
          
          <QuestionItem
            question="性别"
            name="gender"
            explanation="请选择您的性别，必须与护照上的信息一致。"
          >
            <Select placeholder="选择一个">
              <Select.Option value="M">男</Select.Option>
              <Select.Option value="F">女</Select.Option>
            </Select>
          </QuestionItem>

          <QuestionItem
            question="婚姻状况"
            name="maritalStatus"
            explanation="请选择您目前的婚姻状况。"
          >
            <Select placeholder="选择一个">
            <Select.Option value="M">已婚</Select.Option>
              <Select.Option value="C">普通法婚姻</Select.Option>
              <Select.Option value="P">民事结合/同居伴侣关系</Select.Option>
              <Select.Option value="S">未婚</Select.Option>
              <Select.Option value="W">丧偶</Select.Option>
              <Select.Option value="D">离异</Select.Option>
              <Select.Option value="L">合法分居</Select.Option>
              <Select.Option value="O">其他</Select.Option>
            </Select>
          </QuestionItem>
          <Divider />

          <h4 style={{ marginBottom: '10px', marginTop: '20px' }}>
            <span>出生日期与出生地</span>
          </h4>

          <QuestionItem
            question="日期"
            name="dateOfBirth"
            explanation="若不知道具体日期或月份，请按护照所示填写。"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Form.Item 
                name="dobDay" 
                noStyle
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <Select style={{ width: '60px' }} placeholder="">
                  <Select.Option value="">  </Select.Option>
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = (i + 1).toString().padStart(2, '0');
                    return <Select.Option key={day} value={day}>{day}</Select.Option>;
                  })}
                </Select>
              </Form.Item>

              <Form.Item 
                name="dobMonth" 
                noStyle
                rules={[{ required: true, message: '请选择月份' }]}
              >
                <Select style={{ width: '70px' }} placeholder="">
                  <Select.Option value="">  </Select.Option>
                  <Select.Option value="JAN">JAN</Select.Option>
                  <Select.Option value="FEB">FEB</Select.Option>
                  <Select.Option value="MAR">MAR</Select.Option>
                  <Select.Option value="APR">APR</Select.Option>
                  <Select.Option value="MAY">MAY</Select.Option>
                  <Select.Option value="JUN">JUN</Select.Option>
                  <Select.Option value="JUL">JUL</Select.Option>
                  <Select.Option value="AUG">AUG</Select.Option>
                  <Select.Option value="SEP">SEP</Select.Option>
                  <Select.Option value="OCT">OCT</Select.Option>
                  <Select.Option value="NOV">NOV</Select.Option>
                  <Select.Option value="DEC">DEC</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item 
                name="dobYear" 
                noStyle
                rules={[
                  { required: true, message: '请输入年份' },
                  { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                ]}
              >
                <Input placeholder="" style={{ width: '60px' }} maxLength={4} />
              </Form.Item>

              <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                (格式: DD-MMM-YYYY)
              </div>
            </div>
          </QuestionItem>

          <QuestionItem
            question="城市"
            name="birthPlace"
          >
            <Input placeholder="例如：北京" />
          </QuestionItem>

          <QuestionItem
            question="州/省"
            name="birthState"
            hasNaCheckbox={true}
            naCheckboxName="birthState_na"
          >
            <Input placeholder="例如：北京市" />
          </QuestionItem>

          <QuestionItem
            question="国家/地区"
            name="birthCountry"
            explanation="请选择您出生地的现用国家/地区名称。"
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
    <Card title="DS-160 非移民签证申请表" style={{ maxWidth: 1000, margin: '0 auto' }}>
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
