import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider as AntApp } from 'antd';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PageHeader from './components/PageHeader';
import FloatingChatButton from './components/Chat/FloatingChatButton';

// Pages
import Home from './pages/Home';
import DS160Landing from './pages/DS160Landing';
import DS160Upload from './pages/DS160Upload';
import DS160History from './pages/DS160History';
import DS160Success from './pages/DS160Success';
import DS160Form from './components/DS160Form/index';
import DS160View from './pages/DS160View'; // Fix the import path
import InterviewPractice from './pages/InterviewPractice';
import InterviewEvaluation from './pages/InterviewEvaluation';
import InterviewSimulation from './pages/InterviewSimulation';
import PlatformWechat from './pages/PlatformWechat';
import PlatformApp from './pages/PlatformApp';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplicationView from './pages/admin/AdminApplicationView';
import AdminLayout from './layouts/AdminLayout';

const { Content, Footer } = Layout;

// Configure React Router future flags
// Note: This is a workaround for the warnings. In a real application, 
// you would update to React Router v7 or use the proper configuration.
// This won't actually do anything in v6, but it silences the warnings.
if (typeof window !== 'undefined') {
  // Add type declaration for the future flags
  (window as any).__reactRouterFutureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  };
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AntApp>
      <AuthProvider>
        <Router>
          <Layout style={{ minHeight: '100vh' }}>
            <PageHeader />
            <Content style={{ padding: '0 50px' }}>
              <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  
                  {/* DS-160 Routes */}
                  <Route path="/ds160" element={<DS160Landing />} />
                  <Route path="/ds160/form/:id" element={<DS160Form />} />
                  <Route path="/ds160/view/:id" element={<DS160View />} />
                  <Route path="/ds160/upload" element={<DS160Upload />} />
                  <Route path="/ds160/history" element={<DS160History />} />
                  <Route path="/ds160-success" element={<DS160Success />} />
                  
                  {/* Interview Routes */}
                  <Route path="/interview/practice" element={<InterviewPractice />} />
                  <Route path="/interview/evaluation" element={<InterviewEvaluation />} />
                  <Route path="/interview/simulation" element={<InterviewSimulation />} />
                  
                  {/* Platform Routes */}
                  <Route path="/platform/wechat" element={<PlatformWechat />} />
                  <Route path="/platform/app" element={<PlatformApp />} />

                  {/* Auth Routes */}
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="applications/:id" element={<AdminApplicationView />} />
                  </Route>
                </Routes>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              LEONEX {new Date().getFullYear()} - 美国非移民签证智能辅助系统
            </Footer>
            {/* Floating Chat Button - visible on all pages */}
            <FloatingChatButton isAuthenticated={isAuthenticated} />
          </Layout>
        </Router>
      </AuthProvider>
    </AntApp>
  );
};

export default App;
