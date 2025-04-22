import React from 'react';
import { Card, Typography, Space, Tooltip } from 'antd';
import { InfoCircleOutlined, CopyOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ApplicationIdDisplayProps {
  applicationId: string | null;
}

const ApplicationIdDisplay: React.FC<ApplicationIdDisplayProps> = ({ applicationId }) => {
  const copyToClipboard = () => {
    if (applicationId) {
      navigator.clipboard.writeText(applicationId);
    }
  };

  if (!applicationId) return null;

  return (
    <Card 
      size="small" 
      style={{ 
        marginBottom: '16px', 
        backgroundColor: '#f0f8ff', 
        borderColor: '#d6e8fa' 
      }}
    >
      <Space>
        <Text type="secondary">申请识别码 (Application ID):</Text>
        <Text strong>{applicationId}</Text>
        <Tooltip title="复制识别码">
          <CopyOutlined 
            onClick={copyToClipboard} 
            style={{ cursor: 'pointer', color: '#1890ff' }}
          />
        </Tooltip>
        <Tooltip title="请保存此识别码，您需要它来访问您的申请">
          <InfoCircleOutlined style={{ color: '#1890ff' }} />
        </Tooltip>
        <Text type="secondary">
          请保存此识别码，您将需要它来访问您的申请
        </Text>
      </Space>
    </Card>
  );
};

export default ApplicationIdDisplay;
