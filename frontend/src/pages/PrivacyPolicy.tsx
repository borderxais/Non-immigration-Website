import React from 'react';
import { Layout, Typography, Divider } from 'antd';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <Content style={{ padding: '50px', maxWidth: '1000px', margin: '0 auto' }}>
        <Typography>
          <Title level={1}>Privacy Policy for DS-160 Autofill Helper</Title>
          <Text type="secondary">Last updated: May 8, 2025</Text>
          
          <Divider />
          
          <Title level={2}>Introduction</Title>
          <Paragraph>
            LEONEX ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our DS-160 Autofill Helper Chrome extension ("Extension").
          </Paragraph>
          
          <Title level={2}>Information We Collect</Title>
          <Paragraph>
            Our Extension collects the following types of information:
          </Paragraph>
          <ul>
            <li>
              <Text strong>Authentication Information:</Text> Email address and password for account login.
            </li>
            <li>
              <Text strong>DS-160 Form Data:</Text> Personal information you provide to fill out your DS-160 application, including but not limited to name, address, travel information, and other information required by the DS-160 form.
            </li>
          </ul>
          
          <Title level={2}>How We Use Your Information</Title>
          <Paragraph>
            We use the information we collect solely for the purpose of:
          </Paragraph>
          <ul>
            <li>Authenticating your access to our service</li>
            <li>Storing your DS-160 form data to allow you to autofill the official DS-160 form on the CEAC website</li>
            <li>Improving our Extension's functionality and user experience</li>
          </ul>
          
          <Title level={2}>Data Storage and Security</Title>
          <Paragraph>
            Your data is stored securely in our database. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Paragraph>
          
          <Title level={2}>Data Sharing</Title>
          <Paragraph>
            We do not sell, trade, or otherwise transfer your information to third parties. Your data is only used for the specific purpose of facilitating the completion of your DS-160 form.
          </Paragraph>
          
          <Title level={2}>Your Rights</Title>
          <Paragraph>
            You have the right to:
          </Paragraph>
          <ul>
            <li>Access the personal information we have about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Withdraw consent at any time</li>
          </ul>
          
          <Title level={2}>Changes to This Privacy Policy</Title>
          <Paragraph>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </Paragraph>
          
          <Title level={2}>Contact Us</Title>
          <Paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Paragraph>
          <Paragraph>
            <a href="mailto:support@leonexus.com">support@leonexus.com</a>
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
};

export default PrivacyPolicy;
