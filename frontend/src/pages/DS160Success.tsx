import React from 'react';
import { Result, Button, Card, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Paragraph, Text } = Typography;

const DS160Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const applicationId = location.state?.applicationId;

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Result
        status="success"
        title="DS-160表格提交成功！"
        subTitle="您的非移民签证申请表已成功提交。我们将尽快处理您的申请。"
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            返回首页
          </Button>,
          <Button key="forms" onClick={() => navigate('admin/ds160/history')}>
            查看我的申请
          </Button>,
        ]}
      />
      
      {applicationId && (
        <Card title="DS-160申请ID" style={{ marginTop: 24 }}>
          <Paragraph>
            您的DS-160申请ID已自动生成并保存。请妥善保管此ID，以便于后续查询和使用。
          </Paragraph>
          <Paragraph>
            <Text strong>申请ID: </Text>
            <Text copyable code>{applicationId}</Text>
          </Paragraph>
        </Card>
      )}
    </Card>
  );
};

export default DS160Success;
