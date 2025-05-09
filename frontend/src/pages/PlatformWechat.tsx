import React from 'react';
import { Typography, Card, Row, Col, Alert, Button, QRCode } from 'antd';
import { MobileOutlined, WechatOutlined, ClockCircleOutlined, QrcodeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const PlatformWechat: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>微信小程序</Title>
      
      <Alert
        message="功能开发中"
        description="微信小程序功能正在积极开发中，即将推出。敬请期待！"
        type="info"
        showIcon
        icon={<ClockCircleOutlined />}
        style={{ marginBottom: '24px' }}
      />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <WechatOutlined style={{ fontSize: '48px', color: '#07C160' }} />
            </div>
            <Title level={3} style={{ textAlign: 'center' }}>微信小程序</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              通过微信小程序随时随地管理您的签证申请，获取实时更新和提醒。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button type="primary" disabled style={{ background: '#07C160', borderColor: '#07C160' }}>
                即将推出
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>功能亮点</Title>
            <ul>
              <li>随时随地查看和管理DS-160表格</li>
              <li>接收申请状态更新和提醒</li>
              <li>通过微信获取签证咨询服务</li>
              <li>扫描和上传文件</li>
              <li>与网页版账户数据同步</li>
            </ul>
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={16}>
            <Title level={4}>敬请期待</Title>
            <Paragraph>
              我们正在开发微信小程序，让您可以更便捷地管理签证申请流程。小程序将提供与网页版相同的核心功能，并针对移动场景进行了优化。
            </Paragraph>
            <Paragraph>
              小程序发布后，您可以扫描右侧二维码或在微信中搜索"BorderX签证助手"进行访问。
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '20px', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
              <QrcodeOutlined style={{ fontSize: '100px', color: '#d9d9d9' }} />
              <div style={{ marginTop: '10px', color: '#999' }}>小程序二维码即将推出</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PlatformWechat;
