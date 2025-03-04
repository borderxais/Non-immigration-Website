import React, { useState } from 'react';
import { Card, Input, Button, List, Typography } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

interface Message {
  content: string;
  type: 'user' | 'ai';
}

const AIConsultation: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { content: input, type: 'user' };
    setMessages([...messages, userMessage]);

    // TODO: Send to backend API
    // For now, just mock the AI response
    const aiMessage: Message = {
      content: "我是您的签证顾问AI助手。我会尽力回答您的问题，并提供专业的建议。",
      type: 'ai'
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setInput('');
  };

  return (
    <div>
      <Card title="AI 签证咨询">
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item style={{ 
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start' 
            }}>
              <Card 
                style={{ 
                  maxWidth: '70%',
                  backgroundColor: message.type === 'user' ? '#e6f7ff' : '#f5f5f5'
                }}
              >
                {message.content}
              </Card>
            </List.Item>
          )}
          style={{ 
            height: '400px', 
            overflowY: 'auto',
            marginBottom: '20px'
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入您的问题..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ flex: 1 }}
          />
          <Button 
            type="primary" 
            onClick={handleSend}
            style={{ height: 'auto' }}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AIConsultation;
