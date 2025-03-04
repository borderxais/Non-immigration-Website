import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PageHeader from './components/PageHeader';

// Pages
import Home from './pages/Home';
import DS160Form from './pages/DS160Form';
import DS160Upload from './pages/DS160Upload';
import DS160History from './pages/DS160History';
import AIConsultation from './pages/AIConsultation';
import VisaEvaluation from './pages/VisaEvaluation';
import InterviewPractice from './pages/InterviewPractice';
import InterviewEvaluation from './pages/InterviewEvaluation';
import PlatformWechat from './pages/PlatformWechat';
import PlatformApp from './pages/PlatformApp';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

const { Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <PageHeader />
          <Content style={{ padding: '0 50px' }}>
            <div style={{ padding: 24, minHeight: 380, background: '#fff', marginTop: 24 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* DS-160 Routes */}
                <Route path="/ds160/fill" element={<DS160Form />} />
                <Route path="/ds160/upload" element={<DS160Upload />} />
                <Route path="/ds160/history" element={<DS160History />} />
                
                {/* AI Consultation Routes */}
                <Route path="/consultation/chat" element={<AIConsultation />} />
                <Route path="/consultation/evaluation" element={<VisaEvaluation />} />
                
                {/* Interview Routes */}
                <Route path="/interview/practice" element={<InterviewPractice />} />
                <Route path="/interview/evaluation" element={<InterviewEvaluation />} />
                
                {/* Platform Routes */}
                <Route path="/platform/wechat" element={<PlatformWechat />} />
                <Route path="/platform/app" element={<PlatformApp />} />

                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            BorderX {new Date().getFullYear()} - 美国非移民签证智能辅助系统
          </Footer>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
