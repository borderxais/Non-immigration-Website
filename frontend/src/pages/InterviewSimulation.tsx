import React, { useState } from 'react';
import { Card, Button, Typography, Space, Select } from 'antd';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface Question {
  id: number;
  question: string;
  answer?: string;
}

const InterviewSimulation: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [visaType, setVisaType] = useState<string>('');
  const [isStarted, setIsStarted] = useState(false);

  // Mock questions for different visa types
  const mockQuestions: Record<string, Question[]> = {
    'B1/B2': [
      { id: 1, question: "What is the purpose of your visit to the United States?" },
      { id: 2, question: "How long do you plan to stay?" },
      { id: 3, question: "Who will you be visiting in the United States?" },
    ],
    'F1': [
      { id: 1, question: "Which university have you been accepted to?" },
      { id: 2, question: "What is your field of study?" },
      { id: 3, question: "How will you finance your studies?" },
    ],
  };

  const startInterview = () => {
    if (!visaType) return;
    setIsStarted(true);
    setCurrentQuestion(mockQuestions[visaType][0]);
  };

  const nextQuestion = () => {
    if (!visaType || !currentQuestion) return;
    const currentIndex = mockQuestions[visaType].findIndex(q => q.id === currentQuestion.id);
    if (currentIndex < mockQuestions[visaType].length - 1) {
      setCurrentQuestion(mockQuestions[visaType][currentIndex + 1]);
    } else {
      setCurrentQuestion(null);
      setIsStarted(false);
    }
  };

  return (
    <Card title="面签模拟">
      {!isStarted ? (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>准备开始面签模拟</Title>
          <Paragraph>
            选择您的签证类型，我们将为您模拟真实的面签场景。
          </Paragraph>
          <Select
            style={{ width: 200 }}
            placeholder="选择签证类型"
            onChange={(value) => setVisaType(value)}
          >
            <Option value="B1/B2">B1/B2 访问签证</Option>
            <Option value="F1">F1 学生签证</Option>
          </Select>
          <Button 
            type="primary" 
            onClick={startInterview}
            disabled={!visaType}
          >
            开始模拟面试
          </Button>
        </Space>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {currentQuestion ? (
            <>
              <Title level={4}>面试官提问：</Title>
              <Paragraph style={{ fontSize: '18px' }}>
                {currentQuestion.question}
              </Paragraph>
              <Button type="primary" onClick={nextQuestion}>
                下一个问题
              </Button>
            </>
          ) : (
            <Paragraph>面试结束</Paragraph>
          )}
        </Space>
      )}
    </Card>
  );
};

export default InterviewSimulation;
