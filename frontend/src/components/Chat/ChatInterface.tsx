import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Typography, Avatar, Spin } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import './ChatInterface.css';

const { Text } = Typography;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => Promise<string>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your visa assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // If onSendMessage prop is provided, use it to get AI response
      if (onSendMessage) {
        const response = await onSendMessage(inputValue);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'ai',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Default mock response if no handler is provided
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `I received your message: "${inputValue}". This is a placeholder response. Connect this component to your backend API to get real responses.`,
            sender: 'ai',
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, aiMessage]);
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Typography.Title level={4} style={{ margin: 0 }}>Visa Assistant</Typography.Title>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-avatar">
              {message.sender === 'user' ? (
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              ) : (
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
              )}
            </div>
            <div className="message-bubble">
              <div className="message-content">{message.text}</div>
              <div className="message-timestamp">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai-message">
            <div className="message-avatar">
              <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
            </div>
            <div className="message-bubble">
              <div className="message-content">
                <Spin size="small" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={isLoading}
          size="large"
        />
        <Button 
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage} 
          disabled={isLoading || inputValue.trim() === ''}
          size="large"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
