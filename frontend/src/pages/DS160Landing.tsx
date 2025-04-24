import React from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FormOutlined, HistoryOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const DS160Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleNewApplication = () => {
    // Generate a new application ID and navigate to the form
    const newApplicationId = 'DS160-' + Date.now();
    navigate(`/ds160/form/${newApplicationId}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>DS-160 非移民签证申请表</Title>
      <Paragraph>
        请选择以下操作：
      </Paragraph>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={handleNewApplication}
            style={{ height: '100%' }}
          >
            <div style={{ textAlign: 'center' }}>
              <FormOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={3}>开始新申请</Title>
              <Paragraph>
                填写新的DS-160非移民签证申请表
              </Paragraph>
              <Button type="primary" size="large">
                立即开始
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={() => navigate('/ds160/history')}
            style={{ height: '100%' }}
          >
            <div style={{ textAlign: 'center' }}>
              <HistoryOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={3}>我的申请</Title>
              <Paragraph>
                查看或继续填写已保存的申请表
              </Paragraph>
              <Button type="primary" size="large" style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                查看申请
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card>
            <Title level={4}>温馨提示</Title>
            <Paragraph>
              • 请确保准备好所需的个人信息和文件再开始填写
            </Paragraph>
            <Paragraph>
              • 您可以随时保存进度，稍后继续填写
            </Paragraph>
            <Paragraph>
              • 系统会自动保存您的填写进度
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DS160Landing;