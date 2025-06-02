import React from 'react';
import { Typography, Card, Row, Col, Button, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  RobotOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const PublicHome: React.FC = () => {
  const navigate = useNavigate();

  const handleStartEvaluation = () => {
    navigate('/evaluation');
  };

  const features = [
    {
      title: '签证评估',
      icon: <RobotOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      description: '智能评估系统，基于大数据分析提供个性化签证申请建议',
      link: '/evaluation',
      color: '#f6ffed',
      onClick: () => navigate('/evaluation'),
    }
  ];

  const handleFeatureClick = (feature: any) => {
    if (feature.onClick) {
      feature.onClick();
    } else if (feature.link) {
      navigate(feature.link);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title style={{ fontSize: '48px', marginBottom: 24 }}>
          美国非移民签证智能辅助系统
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          基于AI技术，为您提供专业、高效、便捷的签证评估服务
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large" onClick={handleStartEvaluation}>
            开始签证评估
          </Button>
          <Button 
            size="large" 
            onClick={() => {
              const chatButton = document.querySelector('.floating-chat-button .chat-button') as HTMLElement;
              if (chatButton) {
                chatButton.click();
              }
            }}
          >
            咨询签证问题
          </Button>
        </Space>
      </div>

      {/* Features Section */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
        我们的服务
      </Title>
      <Row gutter={[24, 24]} justify="center">
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              style={{ 
                height: '100%',
                backgroundColor: feature.color,
                borderRadius: '8px',
              }}
              onClick={() => handleFeatureClick(feature)}
            >
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                {feature.icon}
              </div>
              <Title level={4} style={{ textAlign: 'center', marginBottom: 16 }}>
                {feature.title}
              </Title>
              <Paragraph style={{ textAlign: 'center' }}>
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Advantages Section */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
        为什么选择我们
      </Title>
      <Row gutter={[48, 48]}>
        <Col xs={24} md={8}>
          <Card variant="borderless">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Title level={4} style={{ textAlign: 'center' }}>专业可靠</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              采用先进AI技术，基于大量真实案例训练，确保建议的准确性
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant="borderless">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            </div>
            <Title level={4} style={{ textAlign: 'center' }}>便捷高效</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              智能评估系统，快速获取专业签证申请建议
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant="borderless">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <GlobalOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
            </div>
            <Title level={4} style={{ textAlign: 'center' }}>全程服务</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              提供签证评估和咨询服务，助您顺利完成签证申请
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PublicHome;
