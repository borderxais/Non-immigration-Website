import React from 'react';
import { Typography, Card, Row, Col, Alert, Button } from 'antd';
import { TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const InterviewPractice: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>面签练习</Title>
      
      <Alert
        message="功能开发中"
        description="模拟面签功能正在积极开发中，即将推出。敬请期待！"
        type="info"
        showIcon
        icon={<ClockCircleOutlined />}
        style={{ marginBottom: '24px' }}
      />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <TeamOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
            </div>
            <Title level={3} style={{ textAlign: 'center' }}>AI模拟面试官</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              通过AI技术模拟真实的签证官面试场景，提前体验面签流程，提高通过率。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button type="primary" disabled>即将推出</Button>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>功能亮点</Title>
            <ul>
              <li>基于真实面签案例训练的AI模型</li>
              <li>模拟不同类型的签证面试问题</li>
              <li>提供即时反馈和改进建议</li>
              <li>多种难度级别可选</li>
              <li>支持语音交互，更接近真实面签体验</li>
            </ul>
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>敬请期待</Title>
        <Paragraph>
          我们正在努力完善模拟面签功能，预计将在近期推出。该功能将帮助您更好地准备美国签证面试，提高签证通过率。
        </Paragraph>
        <Paragraph>
          如需了解更多信息或获取面签建议，请使用我们的在线咨询服务。
        </Paragraph>
      </Card>
    </div>
  );
};

export default InterviewPractice;
