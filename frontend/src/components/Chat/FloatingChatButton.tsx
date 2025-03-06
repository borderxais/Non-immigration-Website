import React, { useState } from 'react';
import { Button, Badge, Drawer, ConfigProvider } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import ChatInterface from './ChatInterface';
import chatService from '../../services/chatService';
import './FloatingChatButton.css';

interface FloatingChatButtonProps {
  isAuthenticated?: boolean;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ isAuthenticated = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnreadMessages(false);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      // Use the enhanced process message with authentication status
      const response = await chatService.enhancedProcessMessage(message, isAuthenticated);
      
      // Save to chat history if user is authenticated
      if (isAuthenticated) {
        try {
          await chatService.saveChatHistory(message, response.answer);
        } catch (error) {
          console.error('Error saving chat history:', error);
        }
      }
      
      return response.answer;
    } catch (error) {
      console.error('Error sending message:', error);
      return "I'm sorry, I encountered an error processing your request. Please try again later.";
    }
  };

  return (
    <>
      <div className="floating-chat-button">
        <Badge dot={hasUnreadMessages}>
          <Button 
            type="primary" 
            shape="circle" 
            icon={<MessageOutlined />} 
            size="large"
            onClick={handleOpenChat}
            className="chat-button"
          />
        </Badge>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Drawer: {
              paddingLG: 0,
            },
          },
        }}
      >
        <Drawer
          title="签证助手 | Visa Assistant"
          placement="right"
          onClose={handleCloseChat}
          open={isOpen}
          width={380}
          height="70%"
          closeIcon={<CloseOutlined />}
          className="chat-drawer"
          style={{ position: 'fixed' }}
          mask={true}
          maskClosable={true}
          footer={null}
          bodyStyle={{ padding: 0, height: '100%', overflow: 'hidden' }}
        >
          <div className="drawer-chat-container">
            <ChatInterface onSendMessage={handleSendMessage} />
          </div>
        </Drawer>
      </ConfigProvider>
    </>
  );
};

export default FloatingChatButton;
