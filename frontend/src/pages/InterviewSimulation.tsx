import React from 'react';
import { Typography, Card, Row, Col, Alert, Button, Tag, Divider } from 'antd';
import { TeamOutlined, ClockCircleOutlined, SoundOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const InterviewSimulation: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>模拟面签</Title>
      
      <Alert
        message="功能开发中"
        description="模拟面签功能正在积极开发中，即将推出。敬请期待！"
        type="info"
        showIcon
        icon={<ClockCircleOutlined />}
        style={{ marginBottom: '24px' }}
      />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <TeamOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
            </div>
            <Title level={3} style={{ textAlign: 'center' }}>AI模拟面试官</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              通过AI技术模拟真实的签证官面试场景，提前体验面签流程，提高通过率。
            </Paragraph>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button type="primary" disabled style={{ background: '#722ed1', borderColor: '#722ed1' }}>
                即将推出
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card>
            <Title level={4}>支持的签证类型</Title>
            <div style={{ marginBottom: '16px' }}>
              <Tag color="blue">B1/B2 商务/旅游签证</Tag>
              <Tag color="green">F1 学生签证</Tag>
              <Tag color="purple">J1 交流访问学者签证</Tag>
              <Tag color="orange">H1B 工作签证</Tag>
            </div>
            <Divider />
            <Title level={4}>模拟面试特点</Title>
            <ul>
              <li>基于真实面签案例训练的AI模型</li>
              <li>根据不同签证类型提供针对性问题</li>
              <li>支持语音交互，更接近真实面签体验</li>
              <li>提供即时反馈和改进建议</li>
              <li>多次练习，熟悉面签流程</li>
            </ul>
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card style={{ textAlign: 'center', background: '#f0f5ff', borderColor: '#d6e4ff' }}>
              <SoundOutlined style={{ fontSize: '36px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={4}>语音交互</Title>
              <Paragraph>
                支持语音输入和输出，模拟真实面签场景，提升口语表达能力。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card style={{ textAlign: 'center', background: '#f6ffed', borderColor: '#d9f7be' }}>
              <QuestionCircleOutlined style={{ fontSize: '36px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={4}>常见问题库</Title>
              <Paragraph>
                包含数百个真实面签问题，覆盖各类签证类型和申请场景。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card style={{ textAlign: 'center', background: '#fff2e8', borderColor: '#ffd8bf' }}>
              <TeamOutlined style={{ fontSize: '36px', color: '#fa8c16', marginBottom: '16px' }} />
              <Title level={4}>面签技巧</Title>
              <Paragraph>
                提供专业面签技巧和建议，帮助您从容应对各类问题。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default InterviewSimulation;

// Original Version

// import React, { useState } from 'react';
// import { Card, Button, Typography, Space, Select } from 'antd';

// const { Title, Paragraph } = Typography;
// const { Option } = Select;

// interface Question {
//   id: number;
//   question: string;
//   answer?: string;
// }



// const InterviewSimulation: React.FC = () => {
//   const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
//   const [visaType, setVisaType] = useState<string>('');
//   const [isStarted, setIsStarted] = useState(false);

//   // Mock questions for different visa types
//   const mockQuestions: Record<string, Question[]> = {
//     'B1/B2': [
//       { id: 1, question: "What is the purpose of your visit to the United States?" },
//       { id: 2, question: "How long do you plan to stay?" },
//       { id: 3, question: "Who will you be visiting in the United States?" },
//     ],
//     'F1': [
//       { id: 1, question: "Which university have you been accepted to?" },
//       { id: 2, question: "What is your field of study?" },
//       { id: 3, question: "How will you finance your studies?" },
//     ],
//   };

//   const startInterview = () => {
//     if (!visaType) return;
//     setIsStarted(true);
//     setCurrentQuestion(mockQuestions[visaType][0]);
//   };

//   const nextQuestion = () => {
//     if (!visaType || !currentQuestion) return;
//     const currentIndex = mockQuestions[visaType].findIndex(q => q.id === currentQuestion.id);
//     if (currentIndex < mockQuestions[visaType].length - 1) {
//       setCurrentQuestion(mockQuestions[visaType][currentIndex + 1]);
//     } else {
//       setCurrentQuestion(null);
//       setIsStarted(false);
//     }
//   };

//   return (
//     <Card title="面签模拟">
//       {!isStarted ? (
//         <Space direction="vertical" style={{ width: '100%' }}>
//           <Title level={4}>准备开始面签模拟</Title>
//           <Paragraph>
//             选择您的签证类型，我们将为您模拟真实的面签场景。
//           </Paragraph>
//           <Select
//             style={{ width: 200 }}
//             placeholder="选择签证类型"
//             onChange={(value) => setVisaType(value)}
//           >
//             <Option value="B1/B2">B1/B2 访问签证</Option>
//             <Option value="F1">F1 学生签证</Option>
//           </Select>
//           <Button 
//             type="primary" 
//             onClick={startInterview}
//             disabled={!visaType}
//           >
//             开始模拟面试
//           </Button>
//         </Space>
//       ) : (
//         <Space direction="vertical" style={{ width: '100%' }}>
//           {currentQuestion ? (
//             <>
//               <Title level={4}>面试官提问：</Title>
//               <Paragraph style={{ fontSize: '18px' }}>
//                 {currentQuestion.question}
//               </Paragraph>
//               <Button type="primary" onClick={nextQuestion}>
//                 下一个问题
//               </Button>
//             </>
//           ) : (
//             <Paragraph>面试结束</Paragraph>
//           )}
//         </Space>
//       )}
//     </Card>
//   );
// };

// export default InterviewSimulation;