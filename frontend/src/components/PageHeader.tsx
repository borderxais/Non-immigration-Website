import React from 'react';
import { Layout } from 'antd';
import Navigation from './Navigation';

const { Header } = Layout;

const PageHeader: React.FC = () => {
  return (
    <div>
      {/* Background Image Banner */}
      <div style={{
        height: '200px',
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
          bottom: '60px',
          left: '50px',
          color: 'white',
          zIndex: 1,
        }}>
          <h1 style={{ 
            color: 'white', 
            margin: 0,
            fontSize: '28px',
            fontWeight: 'bold',
          }}>
            BorderX
          </h1>
          <p style={{ 
            margin: '8px 0 0 0',
            fontSize: '16px',
          }}>
            智能签证申请助手
          </p>
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
