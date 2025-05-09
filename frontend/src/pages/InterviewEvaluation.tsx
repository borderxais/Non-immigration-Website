import React from 'react';
import { Typography, Card, Row, Col, Alert, Button, Statistic } from 'antd';
import { FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const InterviewEvaluation: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>面签评估</Title>
      
      <Alert
        message="功能开发中"
        description="面签评估功能正在积极开发中，即将推出。敬请期待！"
        type="info"
        showIcon
        icon={<ClockCircleOutlined />}
        style={{ marginBottom: '24px' }}
      />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Title level={3} style={{ textAlign: 'center' }}>AI面签评估</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              基于您的个人情况和申请材料，AI系统将评估您的签证申请成功率，并提供针对性建议。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button type="primary" disabled>即将推出</Button>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>评估内容</Title>
            <ul>
              <li>签证申请材料完整性评估</li>
              <li>申请人背景与签证类型匹配度分析</li>
              <li>潜在风险因素识别</li>
              <li>面签问题预测与回答建议</li>
              <li>提高签证通过率的个性化建议</li>
            </ul>
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Title level={4}>评估流程预览</Title>
            <Paragraph>
              面签评估功能将通过分析您的个人信息、旅行历史、工作背景等多维度数据，结合历史签证案例，生成全面的评估报告。
            </Paragraph>
            <Paragraph>
              评估结果将包括通过率预测、风险因素分析、以及针对性的改进建议，帮助您更好地准备签证面试。
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Title level={4}>评估指标</Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic 
                      title="材料完整性" 
                      value="--" 
                      suffix="%" 
                      valueStyle={{ color: '#1890ff' }}
                      prefix={<CheckCircleOutlined />} 
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="风险评估" 
                      value="--" 
                      suffix="%" 
                      valueStyle={{ color: '#ff4d4f' }}
                      prefix={<CloseCircleOutlined />} 
                    />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default InterviewEvaluation;


// Original Version

// import React, { useEffect, useState } from 'react';
// import { Typography, Card, Spin, Alert, Button, Descriptions, Space, message } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { ReloadOutlined } from '@ant-design/icons';
// import interviewAssessmentService, { InterviewAssessment } from '../services/interviewAssessmentService';
// import dayjs from 'dayjs';

// const { Title, Paragraph, Text } = Typography;

// interface AssessmentResponse extends InterviewAssessment {
//   created_at?: string;
// }

// const InterviewEvaluation: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const fetchAssessment = async (forceRefresh: boolean = false) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await interviewAssessmentService.getAssessment(forceRefresh);
//       setAssessment(response);
//     } catch (err: any) {
//       console.error('Error fetching assessment:', err);
//       setError(err.message || '获取面签评估失败，请稍后再试');
//       message.error('获取面签评估失败，请稍后再试');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAssessment();
//   }, []);

//   const handleRefresh = () => {
//     fetchAssessment(true);
//   };

//   const formatPurposeOfTrip = (purpose: string) => {
//     const purposeMap: { [key: string]: string } = {
//       'B1': '商务访问 (B1)',
//       'B2': '旅游/访友 (B2)',
//       'F1': '学习 (F1)',
//       'J1': '交流访问 (J1)'
//     };
//     return purposeMap[purpose] || purpose;
//   };

//   if (loading) {
//     return (
//       <div style={{ textAlign: 'center', padding: '50px' }}>
//         <Spin size="large" />
//         <Paragraph style={{ marginTop: '20px' }}>
//           {assessment ? '正在重新生成面签评估报告...' : '正在生成面签评估报告...'}
//         </Paragraph>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
//         <Alert
//           message="评估生成失败"
//           description={error}
//           type="error"
//           showIcon
//           action={
//             <Button size="small" type="primary" onClick={() => fetchAssessment()}>
//               重试
//             </Button>
//           }
//         />
//       </div>
//     );
//   }

//   if (!assessment) {
//     return (
//       <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
//         <Alert
//           message="未找到DS-160申请记录"
//           description="请先提交DS-160申请表，然后再进行面签评估。"
//           type="info"
//           showIcon
//           action={
//             <Button size="small" type="primary" onClick={() => navigate('/ds160/form')}>
//               开始填写DS-160表格
//             </Button>
//           }
//         />
//       </div>
//     );
//   }

//   return (
//     <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
//         <Title level={2}>面签评估报告</Title>
//         <Space>
//           {assessment.created_at && (
//             <Text type="secondary">
//               评估生成时间: {dayjs(assessment.created_at).format('YYYY-MM-DD HH:mm:ss')}
//             </Text>
//           )}
//           <Button 
//             type="primary" 
//             icon={<ReloadOutlined />} 
//             onClick={handleRefresh}
//             loading={loading}
//           >
//             重新评估
//           </Button>
//         </Space>
//       </div>
      
//       <Card title="申请人基本信息" style={{ marginBottom: 24 }}>
//         <Descriptions column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
//           <Descriptions.Item label="姓名">
//             {assessment.form_data.surname} {assessment.form_data.givenName}
//           </Descriptions.Item>
//           <Descriptions.Item label="签证类型">
//             {formatPurposeOfTrip(assessment.form_data.purposeOfTrip)}
//           </Descriptions.Item>
//           <Descriptions.Item label="职业">
//             {assessment.form_data.primaryOccupation || '-'}
//           </Descriptions.Item>
//           <Descriptions.Item label="工作单位/学校">
//             {assessment.form_data.employer || '-'}
//           </Descriptions.Item>
//           <Descriptions.Item label="计划停留时间">
//             {assessment.form_data.intendedLengthOfStay || '-'}
//           </Descriptions.Item>
//           <Descriptions.Item label="月收入">
//             {assessment.form_data.monthlyIncome ? `¥${assessment.form_data.monthlyIncome}` : '-'}
//           </Descriptions.Item>
//         </Descriptions>
//       </Card>

//       <Card title="AI面签评估" style={{ marginBottom: 24 }}>
//         <div style={{ whiteSpace: 'pre-line' }}>
//           {assessment.assessment}
//         </div>
//       </Card>

//       <Card title="温馨提示">
//         <Alert
//           message="评估说明"
//           description={
//             <div>
//               <Paragraph>
//                 本评估报告基于您提供的DS-160申请表信息，通过AI分析生成。请注意：
//               </Paragraph>
//               <ul>
//                 <li>评估结果仅供参考，不代表实际面签结果</li>
//                 <li>签证官的决定将基于面签时的综合表现</li>
//                 <li>建议根据评估建议认真准备面签材料和问题</li>
//                 <li>如有信息变更，请及时更新DS-160表格以获取更准确的评估</li>
//               </ul>
//             </div>
//           }
//           type="info"
//           showIcon
//         />
//       </Card>
//     </div>
//   );
// };

// export default InterviewEvaluation;