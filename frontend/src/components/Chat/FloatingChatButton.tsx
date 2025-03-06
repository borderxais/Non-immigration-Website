import React, { useState, useEffect } from 'react';
import { Button, Badge, Modal, ConfigProvider } from 'antd';
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
  const [modalWidth, setModalWidth] = useState(500);

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

  // Calculate modal width based on screen size
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 576) {
        setModalWidth(Math.min(screenWidth - 16, 350)); // Mobile size with minimal padding
      } else if (screenWidth <= 992) {
        setModalWidth(500); // Tablet size
      } else {
        setModalWidth(600); // Desktop size
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
            Modal: {
              paddingMD: 0,
              paddingContentHorizontalLG: 0,
              paddingContentVerticalLG: 0,
              borderRadiusLG: 8,
            },
          },
        }}
      >
        <Modal
          title="签证助手 | Visa Assistant"
          open={isOpen}
          onCancel={handleCloseChat}
          footer={null}
          width={modalWidth}
          centered
          closeIcon={<CloseOutlined />}
          className="chat-modal"
          maskClosable={true}
          bodyStyle={{ 
            padding: 0, 
            height: '60vh', 
            overflow: 'hidden',
            borderRadius: '0 0 8px 8px'
          }}
          style={{ top: 20 }}
        >
          <div className="modal-chat-container">
            <ChatInterface 
              onSendMessage={handleSendMessage} 
              showHeader={false}
            />
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default FloatingChatButton;
