import React, { useState } from 'react';
import { Card, Typography, List, Button, Tag, message } from 'antd';
import { CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const EvaluationPay: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      title: '基础评估',
      price: '299',
      features: [
        '详细的个人背景分析',
        '签证申请成功率评估',
        '基础申请建议',
        '3个工作日内出具评估报告'
      ],
      recommended: false
    },
    {
      title: '专业评估',
      price: '599',
      features: [
        '所有基础评估内容',
        '个性化申请策略制定',
        '材料准备清单及建议',
        '面签问题重点提示',
        '1对1在线咨询30分钟',
        '2个工作日内出具评估报告'
      ],
      recommended: true
    },
    {
      title: 'VIP评估',
      price: '999',
      features: [
        '所有专业评估内容',
        '材料审核及优化建议',
        '模拟面签演练',
        '签证官提问重点分析',
        '1对1在线咨询60分钟',
        '1个工作日内出具评估报告',
        '额外30天咨询支持'
      ],
      recommended: false
    }
  ];

  const handlePurchase = (plan: string, price: string) => {
    setLoading(true);
    // TODO: Implement payment integration
    message.info(`即将跳转到${plan}支付页面，价格${price}元`);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={2}>专业签证评估服务</Title>
      <Paragraph>
        选择适合您的评估套餐，获取专业的签证申请建议和支持。
        我们的评估团队由经验丰富的签证顾问组成，将为您提供最专业的指导。
      </Paragraph>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '24px' }}>
        {plans.map(plan => (
          <Card 
            key={plan.title}
            style={{ 
              flex: 1,
              minWidth: '300px',
              border: plan.recommended ? '2px solid #1890ff' : undefined
            }}
            title={
              <div style={{ textAlign: 'center' }}>
                <Title level={3}>{plan.title}</Title>
                {plan.recommended && (
                  <Tag color="blue" style={{ margin: '8px 0' }}>
                    推荐方案
                  </Tag>
                )}
                <div style={{ fontSize: '24px', margin: '16px 0' }}>
                  <Text strong>¥{plan.price}</Text>
                </div>
              </div>
            }
          >
            <List
              dataSource={plan.features}
              renderItem={item => (
                <List.Item>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  {item}
                </List.Item>
              )}
            />
            <Button
              type={plan.recommended ? 'primary' : 'default'}
              block
              size="large"
              icon={<DollarOutlined />}
              style={{ marginTop: '16px' }}
              loading={loading}
              onClick={() => handlePurchase(plan.title, plan.price)}
            >
              立即购买
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EvaluationPay;
