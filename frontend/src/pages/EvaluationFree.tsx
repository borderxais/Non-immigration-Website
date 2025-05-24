import React, { useState } from 'react';
import { Card, Typography, Form, Button, Space, Radio, Checkbox, Modal, message, Tooltip, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import evaluationService, { EvaluationFormData, EvaluationResult } from '../services/evaluationService';

const { Title, Paragraph, Text } = Typography;

interface Question {
  key: string;
  question: string;
  explanation: string;
  options: string[];
  type: 'radio' | 'checkbox';
}

// Extend the imported EvaluationFormData interface to include email
type ExtendedEvaluationFormData = EvaluationFormData & {
  email: string;  // 用户邮箱
};

const EvaluationFree: React.FC = () => {
  // Add state for disabled options
  const [disabledAssets, setDisabledAssets] = useState<boolean>(false);
  const [disabledTravelHistory, setDisabledTravelHistory] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [disclaimerVisible, setDisclaimerVisible] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const questions: Question[] = [
    {
      key: 'Q1',
      question: '目前这份工作/生意/学业，你做/经营/读了多久？',
      explanation: '你的全职状态是什么，体现为你的全职工作或全职上学；如果你只是法人代表但并不工作，那法人代表不算工作。什么是全职工作呢，一周40个小时，你超过35小时在做的事情就是你的全职。比如你每天都在上学，你就是学生，或者你拥有五家公司，但是你每天就是打牌、炒股、遛狗，那就是无业。',
      options: ['三年以上', '一年到三年', '不足一年', '无固定工作/自雇职业', '无业', '未满14岁', '14岁以上，上学中', '退休中'],
      type: 'radio'
    },
    {
      key: 'Q2',
      question: '你的旅行费用占月可支配收入的比例是多少？',
      explanation: '比如你一个月收入3500块钱人民币，你要来美国玩十天，按照一天花费200美元计算，你可能要花上一万多块钱，算上机票就更多了，那么你的旅行费用就是月收入的2到3倍了。如果你月收入3万，按照同样的标准，你的旅行费用占月可支配收入在二分之一左右。旅行费用通常只计算机票和住宿。',
      options: ['小于三分之一', '三分之一到五分之三', '五分之三到一倍', '一倍以上', '全部由他人赞助'],
      type: 'radio'
    },
    {
      key: 'Q3',
      question: '国内核心资产',
      explanation: '房产、车产或所有者权益以及存款等都算，未成年或在校学生则选择无可用资产证明。',
      options: ['自有住房', '企业主（有社保≥10人）', '存款/股票≥10万', '自有车辆≥10万', '企业主（无社保或<10人）', '几乎无可用资产证明'],
      type: 'checkbox'
    },
    {
      key: 'Q4',
      question: '过去五年内已按期离境的国家/地区签证和出入境记录',
      explanation: '出入境记录是指有签证有出入境经历，而不是只有签证没有出入境经历。',
      options: ['北美', '澳洲', '欧洲', '东北亚', '南美/非洲', '东南亚', '无出境记录'],
      type: 'checkbox'
    },
    {
      key: 'Q5',
      question: '赴美同行人组合',
      explanation: '一起去签证的人，或同行人有签证并不需要一起面签',
      options: ['夫妻不带孩子', '单一家庭父母带孩子', '全家三代', '情侣 / 朋友', '与同事出差', '单独出行', '父或母单方带孩子'],
      type: 'radio'
    },
    {
      key: 'Q6',
      question: '在美亲属情况',
      explanation: '父母子女配偶亲兄弟姐妹算直系亲属，除此之外都算普通亲属或一般亲属',
      options: ['无亲属在美国', '一般亲属非移民身份', '一般亲属绿卡/公民', '直系亲属非移民身份', '直系亲属绿卡', '直系亲属公民', '直系或一般亲属身份不合法'],
      type: 'radio'
    },
    {
      key: 'Q7',
      question: '美签记录',
      explanation: 'B/F/J/M类型的美国签证是否被拒签',
      options: ['无拒签史', '上次拒签 > 2 年', '上次拒签 0.5–2 年', '上次拒签 ≤ 0.5 年', '半年内多次拒签'],
      type: 'radio'
    }
  ];

  const onFinish = async (values: ExtendedEvaluationFormData) => {
    if (!disclaimerAccepted) {
      message.error('请先阅读并同意免责声明');
      setDisclaimerVisible(true);
      return;
    }

    setLoading(true);
    try {
      const checkboxFields = questions
        .filter(q => q.type === 'checkbox')
        .map(q => q.key);
      
      for (const field of checkboxFields) {
        if (!values[field as keyof EvaluationFormData] || 
            (values[field as keyof EvaluationFormData] as string[]).length === 0) {
          throw new Error(`请至少选择一个${questions.find(q => q.key === field)?.question}的选项`);
        }
      }

      // Calculate evaluation score
      const result: EvaluationResult = evaluationService.calculateEvaluation(values);
      console.log('Evaluation result:', result);
      
      // Display result to user
      Modal.success({
        title: '签证风险评估结果',
        content: (
          <div>
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a', marginBottom: '8px' }}>
                评估报告已生成！
              </p>
              <p>详细报告将发送至您的邮箱: <strong>{values.email}</strong></p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>风险评估概要：</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div style={{ textAlign: 'center', padding: '10px', width: '48%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>风险分数</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: result.score > 60 ? '#ff4d4f' : result.score > 30 ? '#faad14' : '#52c41a' }}>
                    {result.score}/100
                  </p>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', width: '48%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>风险级别</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: result.score > 60 ? '#ff4d4f' : result.score > 30 ? '#faad14' : '#52c41a' }}>
                    {result.riskLevel}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>分类分数详情：</p>
              <ul style={{ paddingLeft: '20px' }}>
                {Object.entries(result.categoryScores).map(([category, score]) => (
                  <li key={category} style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>{questions.find(q => q.key === category)?.question}:</span> 
                    <span style={{ marginLeft: '8px', color: score > 6 ? '#ff4d4f' : score > 3 ? '#faad14' : '#52c41a' }}>
                      {score.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),
        width: 700,
      });
      
      // Save email for future contact if provided
      if (values.email) {
        console.log('Saving email for future contact:', values.email);
        // TODO: Add API call to save email
      }
      
      message.success('评估完成！');
    } catch (error: any) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('提交失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const disclaimer = (
    <>
      <Title level={3}>免责声明</Title>
      <Paragraph>
        <Text strong>非官方性质</Text><br />
        本问卷仅为提供赴美 B 类签证（B1/B2）风险自评之参考工具，与美国驻华使领馆、美国政府任何部门及签证官员均无隶属或授权关系。
      </Paragraph>
      <Paragraph>
        <Text strong>结果仅供参考</Text><br />
        问卷评分基于公开资料与历史案例总结，无法覆盖所有个案情形，也不构成对签证结果的承诺、保证或法律意见。最终签证结论由美国领事官员依据面谈及实际材料自主裁量。
      </Paragraph>
      <Paragraph>
        <Text strong>不承担法律责任</Text><br />
        因使用或依赖本问卷结果而采取的任何行动（包括但不限于预约面谈、提交申请、财务及行程安排），所产生的直接或间接损失、费用或法律后果，均由使用者自行承担，本平台及作者不承担任何责任。
      </Paragraph>
      <Paragraph>
        <Text strong>信息安全</Text><br />
        若您在填写过程中提交个人资料，本平台将尽力按照《中华人民共和国个人信息保护法》等相关法规妥善保管，但不对因不可抗力或第三方非法侵入导致的泄露承担责任。
      </Paragraph>
      <Paragraph>
        <Text strong>使用即视为接受</Text><br />
        使用、复制或传播本问卷即表示您已充分阅读、理解并同意以上条款。若不同意，请立即停止使用。
      </Paragraph>
    </>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Modal
        title="免责声明"
        open={disclaimerVisible}
        onOk={() => {
          setDisclaimerAccepted(true);
          setDisclaimerVisible(false);
        }}
        onCancel={() => navigate(-1)}
        okText="我知道了，开始评测"
        cancelText="返回"
        width={700}
      >
        {disclaimer}
      </Modal>

      <Card>
        <Title level={2}>免费签证评估</Title>
        <Paragraph>
          通过回答以下7个问题，我们将为您提供初步的签证申请建议。
          这份评估将帮助您了解自己的签证申请优势和可能需要注意的方面。
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {questions.map((question, index) => (
            <Form.Item
              key={question.key}
              label={
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={4} style={{ margin: 0 }}>问题{index + 1}：</Title>
                  <Space>
                    {question.question}
                    <Tooltip title={question.explanation}>
                      <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    </Tooltip>
                  </Space>
                </Space>
              }
              name={question.key}
              rules={[{ required: true, message: `请选择${question.question}` }]}
            >
              {question.type === 'radio' ? (
                <Radio.Group>
                  <Space direction="vertical">
                    {question.options.map((option: string) => (
                      <Radio key={option} value={option}>{option}</Radio>
                    ))}
                  </Space>
                </Radio.Group>
              ) : (
                <Checkbox.Group
                  value={form.getFieldValue(question.key)}
                  onChange={(checkedValues: string[]) => {
                    // Handle assets question (Q3)
                    if (question.key === 'Q3') {
                      const hasNoAssets = checkedValues.includes('几乎无可用资产证明');
                      setDisabledAssets(hasNoAssets);
                      if (hasNoAssets) {
                        form.setFieldValue('Q3', ['几乎无可用资产证明']);
                      }
                    }
                    // Handle travel history question (Q4)
                    if (question.key === 'Q4') {
                      const hasNoTravel = checkedValues.includes('无出境记录');
                      setDisabledTravelHistory(hasNoTravel);
                      if (hasNoTravel) {
                        form.setFieldValue('Q4', ['无出境记录']);
                      }
                    }
                  }}
                >
                  <Space direction="vertical">
                    {question.options.map((option: string) => {
                      // Determine if this option should be disabled
                      let isDisabled = false;
                      if (question.key === 'Q3') {
                        isDisabled = disabledAssets && option !== '几乎无可用资产证明';
                      } else if (question.key === 'Q4') {
                        isDisabled = disabledTravelHistory && option !== '无出境记录';
                      }
                      
                      return (
                        <Checkbox 
                          key={option} 
                          value={option} 
                          disabled={isDisabled}
                        >
                          {option}
                        </Checkbox>
                      );
                    })}
                  </Space>
                </Checkbox.Group>
              )}
            </Form.Item>
          ))}

          <Form.Item
            name="email"
            label={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4} style={{ margin: 0 }}>您的邮箱：</Title>
                <Space>
                  请留下您的邮箱，以便我们发送详细的评估报告
                  <Tooltip title="您的邮箱将仅用于发送评估报告和相关信息，我们不会将其用于其他目的。">
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
                </Space>
              </Space>
            }
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' },
              { required: true, message: '请输入您的邮箱' }
            ]}
          >
            <Input placeholder="example@domain.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交评估
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EvaluationFree;
