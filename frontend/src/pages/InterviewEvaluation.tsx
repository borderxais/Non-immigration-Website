import React, { useEffect, useState } from 'react';
import { Typography, Card, Spin, Alert, Button, Descriptions, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ReloadOutlined } from '@ant-design/icons';
import interviewAssessmentService, { InterviewAssessment } from '../services/interviewAssessmentService';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

interface AssessmentResponse extends InterviewAssessment {
  created_at?: string;
}

const InterviewEvaluation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAssessment = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await interviewAssessmentService.getAssessment(forceRefresh);
      setAssessment(response);
    } catch (err: any) {
      console.error('Error fetching assessment:', err);
      setError(err.message || '获取面签评估失败，请稍后再试');
      message.error('获取面签评估失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, []);

  const handleRefresh = () => {
    fetchAssessment(true);
  };

  const formatPurposeOfTrip = (purpose: string) => {
    const purposeMap: { [key: string]: string } = {
      'B1': '商务访问 (B1)',
      'B2': '旅游/访友 (B2)',
      'F1': '学习 (F1)',
      'J1': '交流访问 (J1)'
    };
    return purposeMap[purpose] || purpose;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <Paragraph style={{ marginTop: '20px' }}>
          {assessment ? '正在重新生成面签评估报告...' : '正在生成面签评估报告...'}
        </Paragraph>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
        <Alert
          message="评估生成失败"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => fetchAssessment()}>
              重试
            </Button>
          }
        />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
        <Alert
          message="未找到DS-160申请记录"
          description="请先提交DS-160申请表，然后再进行面签评估。"
          type="info"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => navigate('/ds160/fill')}>
              填写DS-160
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>面签评估报告</Title>
        <Space>
          {assessment.created_at && (
            <Text type="secondary">
              评估生成时间: {dayjs(assessment.created_at).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          )}
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            重新评估
          </Button>
        </Space>
      </div>
      
      <Card title="申请人基本信息" style={{ marginBottom: 24 }}>
        <Descriptions column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="姓名">
            {assessment.form_data.surname} {assessment.form_data.givenName}
          </Descriptions.Item>
          <Descriptions.Item label="签证类型">
            {formatPurposeOfTrip(assessment.form_data.purposeOfTrip)}
          </Descriptions.Item>
          <Descriptions.Item label="职业">
            {assessment.form_data.primaryOccupation || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="工作单位/学校">
            {assessment.form_data.employer || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="计划停留时间">
            {assessment.form_data.intendedLengthOfStay || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="月收入">
            {assessment.form_data.monthlyIncome ? `¥${assessment.form_data.monthlyIncome}` : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="AI面签评估" style={{ marginBottom: 24 }}>
        <div style={{ whiteSpace: 'pre-line' }}>
          {assessment.assessment}
        </div>
      </Card>

      <Card title="温馨提示">
        <Alert
          message="评估说明"
          description={
            <div>
              <Paragraph>
                本评估报告基于您提供的DS-160申请表信息，通过AI分析生成。请注意：
              </Paragraph>
              <ul>
                <li>评估结果仅供参考，不代表实际面签结果</li>
                <li>签证官的决定将基于面签时的综合表现</li>
                <li>建议根据评估建议认真准备面签材料和问题</li>
                <li>如有信息变更，请及时更新DS-160表格以获取更准确的评估</li>
              </ul>
            </div>
          }
          type="info"
          showIcon
        />
      </Card>
    </div>
  );
};

export default InterviewEvaluation;
