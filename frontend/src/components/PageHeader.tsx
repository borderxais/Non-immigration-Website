import React from 'react';
import { Layout } from 'antd';
import Navigation from './Navigation';

const { Header } = Layout;

const PageHeader: React.FC = () => {
  return (
    <div>
      {/* Background Image Banner */}
      <div style={{
        height: '150px',
        background: 'url("/images/header-bg.jpg") center/cover no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Overlay for better text visibility */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }} />
        
        {/* Header Content */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50px',
          transform: 'translateY(-50%)',
          color: 'white',
          zIndex: 1,
        }}>
          {/* Logo and text container with flex layout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <img 
              src="/images/leonexus-logo.png" 
              alt="LeoNexUS Advisory" 
              style={{
                height: '110px',  // Adjust based on your logo's dimensions
              }}
            />
            <p style={{ 
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold',
            }}>
              智能签证申请助手
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <Header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 100,
          padding: '0 50px',
          background: '#001529',
        }}
      >
        <Navigation />
      </Header>
    </div>
  );
};

export default PageHeader;
