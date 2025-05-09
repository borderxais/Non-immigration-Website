import React from 'react';
import { Typography, Card, Row, Col, Alert, Button } from 'antd';
import { UploadOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const DS160Upload: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>DS-160 表格上传</Title>
      
      <Alert
        message="功能开发中"
        description="DS-160表格上传功能正在积极开发中，即将推出。敬请期待！"
        type="info"
        showIcon
        icon={<ClockCircleOutlined />}
        style={{ marginBottom: '24px' }}
      />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Title level={3} style={{ textAlign: 'center' }}>DS-160表格上传</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              上传已填写完成的DS-160表格，我们将帮助您分析表格内容，提供专业建议。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button type="primary" disabled>
                即将推出
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>上传功能特点</Title>
            <ul>
              <li>支持PDF和图片格式上传</li>
              <li>自动识别DS-160表格内容</li>
              <li>智能分析表格填写完整性</li>
              <li>提供表格内容改进建议</li>
              <li>与在线填写系统无缝集成</li>
            </ul>
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Title level={4}>上传流程</Title>
            <Paragraph>
              上传DS-160表格后，我们的系统将自动识别表格内容，并与您的账户关联。您可以查看系统分析结果，获取专业建议，或直接进入在线编辑系统进行修改。
            </Paragraph>
            <Paragraph>
              此功能特别适合已经在美国大使馆网站填写部分或全部DS-160表格的申请人，无需重新填写，直接上传即可获得专业分析和建议。
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Card style={{ textAlign: 'center', background: '#f0f5ff', borderColor: '#d6e4ff' }}>
              <FileTextOutlined style={{ fontSize: '36px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={4}>文件要求</Title>
              <ul style={{ textAlign: 'left' }}>
                <li>支持PDF、JPG、PNG格式</li>
                <li>文件大小不超过10MB</li>
                <li>确保文件清晰可读</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DS160Upload;
