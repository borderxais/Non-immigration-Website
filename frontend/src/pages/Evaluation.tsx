import React from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RobotOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Evaluation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={2}>签证评估服务</Title>
      <Paragraph>
        选择适合您的评估方式，获取专业的签证申请建议。
        我们提供免费快速评估和深度专业评估两种选择。
      </Paragraph>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card 
            hoverable 
            style={{ height: '100%' }}
            onClick={() => navigate('/evaluation/free')}
          >
            <RobotOutlined style={{ fontSize: '48px', color: '#1890ff', display: 'block', marginBottom: '16px' }} />
            <Title level={3}>免费快速评估</Title>
            <Paragraph>
              通过回答7个简单问题，快速获取初步评估结果。
              适合想要快速了解自己签证申请情况的申请人。
            </Paragraph>
            <ul style={{ marginBottom: '24px' }}>
              <li>7个基础问题</li>
              <li>即时评估结果</li>
              <li>完全免费</li>
            </ul>
            <Button type="primary" size="large" block>
              开始免费评估
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card 
            hoverable 
            style={{ height: '100%', borderColor: '#1890ff' }}
            onClick={() => navigate('/evaluation/pay')}
          >
            <DollarOutlined style={{ fontSize: '48px', color: '#52c41a', display: 'block', marginBottom: '16px' }} />
            <Title level={3}>专业深度评估</Title>
            <Paragraph>
              由专业顾问团队提供深度评估和个性化建议。
              适合需要详细指导和支持的申请人。
            </Paragraph>
            <ul style={{ marginBottom: '24px' }}>
              <li>详细背景分析</li>
              <li>个性化申请策略</li>
              <li>一对一专家咨询</li>
              <li>材料准备指导</li>
            </ul>
            <Button type="primary" size="large" block style={{ background: '#52c41a', borderColor: '#52c41a' }}>
              查看评估套餐
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Evaluation;
