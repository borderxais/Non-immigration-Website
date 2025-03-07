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

  const handleSendMessage = async (message: string) => {
    try {
      // Use the enhanced process message with authentication status
      const response = await chatService.enhancedProcessMessage(message, isAuthenticated);
      
      // Save to chat history if user is authenticated
      if (isAuthenticated) {
        try {
          await chatService.saveChatHistory(message, response.answer, response.response_source || 'unknown');
        } catch (error) {
          console.error('Error saving chat history:', error);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        answer: "I'm sorry, I encountered an error processing your request. Please try again later.",
        response_source: 'fallback'
      };
    }
  };

  // Calculate modal width based on screen size
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 576) {
        setModalWidth(screenWidth - 32); // Full width minus some padding on mobile
      } else if (screenWidth <= 768) {
        setModalWidth(450);
      } else {
        setModalWidth(500);
      }
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
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
              contentBg: 'transparent',
              headerBg: '#001529',
              titleColor: 'white',
            },
          },
        }}
      >
        <Modal
          title="Visa Assistant"
          open={isOpen}
          onCancel={handleCloseChat}
          footer={null}
          width={modalWidth}
          className="chat-modal"
          closeIcon={<CloseOutlined style={{ color: 'white' }} />}
          maskClosable={true}
          centered
          styles={{
            body: {
              padding: 0,
              height: '60vh', // Adjusted back to a more moderate height
              overflow: 'hidden',
            }
          }}
        >
          <div className="drawer-chat-container">
            <ChatInterface onSendMessage={handleSendMessage} />
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default FloatingChatButton;
