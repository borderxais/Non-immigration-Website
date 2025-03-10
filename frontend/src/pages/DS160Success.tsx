import React from 'react';
import { Result, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const DS160Success: React.FC = () => {
  const navigate = useNavigate();

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
          <Button key="forms" onClick={() => navigate('/ds160-history')}>
            查看我的申请
          </Button>,
        ]}
      />
    </Card>
  );
};

export default DS160Success;
