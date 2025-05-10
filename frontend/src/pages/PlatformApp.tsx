import React from 'react';
import { Typography, Card, Row, Col, Alert, Button, List } from 'antd';
import { MobileOutlined, ClockCircleOutlined, AppleOutlined, AndroidOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const PlatformApp: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>APP下载</Title>
      
      <Alert
        message="功能开发中"
        description="APP下载功能正在积极开发中，即将推出。敬请期待！"
        type="info"
        showIcon
        icon={<ClockCircleOutlined />}
        style={{ marginBottom: '24px' }}
      />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <MobileOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
            </div>
            <Title level={3} style={{ textAlign: 'center' }}>移动应用</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              LEONEX签证助手移动应用，让您随时随地管理签证申请，获取实时更新和提醒。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button type="primary" disabled style={{ background: '#fa8c16', borderColor: '#fa8c16' }}>
                即将推出
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>支持平台</Title>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: 'iOS 应用',
                  description: '适用于 iPhone 和 iPad 设备',
                  icon: <AppleOutlined style={{ fontSize: '24px', color: '#000' }} />
                },
                {
                  title: 'Android 应用',
                  description: '适用于各类 Android 手机和平板',
                  icon: <AndroidOutlined style={{ fontSize: '24px', color: '#3DDC84' }} />
                }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                  <Button disabled icon={<DownloadOutlined />}>即将推出</Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Title level={4}>应用功能</Title>
            <ul>
              <li>DS-160表格在线填写和提交</li>
              <li>申请状态实时追踪</li>
              <li>面签预约和提醒</li>
              <li>签证咨询和AI辅助</li>
              <li>文件扫描和上传</li>
              <li>离线访问已保存的申请</li>
              <li>多语言支持</li>
            </ul>
            <Paragraph>
              我们的移动应用正在开发中，将提供与网页版相同的核心功能，并针对移动场景进行了优化，让您随时随地管理签证申请流程。
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
              <MobileOutlined style={{ fontSize: '100px', color: '#fa8c16', opacity: 0.5 }} />
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>扫描二维码下载</Title>
                <Paragraph type="secondary">应用即将上线，敬请期待</Paragraph>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PlatformApp;
