import React from 'react';
import { Typography, Card, Row, Col, Button, Space, Divider, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  FormOutlined,
  RobotOutlined,
  TeamOutlined,
  MobileOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'DS-160表格',
      icon: <FormOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      description: '智能表格填写系统，中英文自动翻译，实时保存进度，确保填写准确无误',
      link: '/ds160/fill',
      color: '#e6f7ff',
    },
    {
      title: '签证咨询',
      icon: <RobotOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      description: '智能问答系统，专业签证评估，基于大数据分析提供个性化建议',
      link: '#',
      color: '#f6ffed',
      onClick: () => {
        // Open the floating chat widget instead of navigating
        const chatButton = document.querySelector('.floating-chat-button .chat-button') as HTMLElement;
        if (chatButton) {
          chatButton.click();
        }
      }
    },
    {
      title: '模拟面签',
      icon: <TeamOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      description: 'AI模拟面试官，真实场景对话，提升面签通过率',
      link: '/interview/practice',
      color: '#f9f0ff',
    },
    {
      title: '多端支持',
      icon: <MobileOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      description: '支持网页、小程序多平台访问，随时随地处理签证事务',
      link: '/platform/wechat',
      color: '#fff7e6',
    },
  ];

  const statistics = [
    {
      title: '服务用户',
      value: '10000+',
      suffix: '人',
    },
    {
      title: '签证通过率',
      value: 98.2,
      suffix: '%',
    },
    {
      title: '用户好评',
      value: 99.5,
      suffix: '%',
    },
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
          基于AI技术，为您提供专业、高效、便捷的签证申请服务
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large" onClick={() => navigate('/ds160/fill')}>
            开始填写DS-160
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

      {/* Statistics Section */}
      <Row justify="center" style={{ marginBottom: 48 }}>
        {statistics.map((stat, index) => (
          <Col key={index} span={6}>
            <Card style={{ textAlign: 'center', margin: '0 12px' }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Features Section */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
        我们的服务
      </Title>
      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
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
              智能填表系统，多平台支持，随时随地处理签证事务
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
              从DS-160填写到面签准备，提供完整的签证申请解决方案
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Home;
