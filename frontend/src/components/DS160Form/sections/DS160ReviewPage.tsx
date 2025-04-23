import React from 'react';
import { Button, Card, Descriptions, Typography, Space, Row, Col } from 'antd';
import { FormInstance } from 'antd/lib/form';

const { Title, Paragraph } = Typography;

interface DS160ReviewPageProps {
  form: FormInstance;
  onSubmit: () => void;
  onEdit: (step: number) => void;
}

const DS160ReviewPage: React.FC<DS160ReviewPageProps> = ({ form, onSubmit, onEdit }) => {
  // Get form data
  const formData = form.getFieldsValue(true);
  
  // Helper function to format date values from form data
  const formatDate = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return 'N/A';
    return `${day}-${month}-${year}`;
  };

  // Extract sections from formData
  const sections = [
    {
      title: '个人信息 I',
      key: 'personalInfo1',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="姓">{formData.surname || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="名">{formData.givenName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="出生日期">
            {formatDate(formData.birthDay, formData.birthMonth, formData.birthYear)}
          </Descriptions.Item>
          <Descriptions.Item label="性别">{formData.gender || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="出生地">{formData.birthPlace || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="国籍">{formData.nationality || 'N/A'}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '个人信息 II',
      key: 'personalInfo2',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="婚姻状况">{formData.maritalStatus || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="护照号码">{formData.passportNumber || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="护照签发日期">
            {formatDate(formData.passportIssuanceDay, formData.passportIssuanceMonth, formData.passportIssuanceYear)}
          </Descriptions.Item>
          <Descriptions.Item label="护照有效期">
            {formatDate(formData.passportExpirationDay, formData.passportExpirationMonth, formData.passportExpirationYear)}
          </Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '旅行信息',
      key: 'travelInfo',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="到达日期">
            {formatDate(formData.arrivalDay, formData.arrivalMonth, formData.arrivalYear)}
          </Descriptions.Item>
          <Descriptions.Item label="停留时间">{formData.losLength} {formData.losUnit}</Descriptions.Item>
          <Descriptions.Item label="美国地址">{formData.usAddressLine1} {formData.usAddressLine2} {formData.usCity} {formData.usState} {formData.usZipCode}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '同行人',
      key: 'travelCompanions',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="是否与他人同行">{formData.travelingWithOthers ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="同行人数量">{formData.companions?.length || 0}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '以前的旅行',
      key: 'previousTravel',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="是否去过美国">{formData.hasVisitedUS ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="之前旅行次数">{formData.previousVisits?.length || 0}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '工作经历',
      key: 'workHistory',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="当前职业">{formData.currentOccupation || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="工作单位">{formData.employer || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="工作年限">{formData.yearsOfWork || 'N/A'}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '安全背景',
      key: 'securityBackground',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="是否有犯罪记录">{formData.hasCriminalRecord ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="是否有签证被拒记录">{formData.hasVisaRefusal ? '是' : '否'}</Descriptions.Item>
        </Descriptions>
      )
    }
  ];

  return (
    <div className="review-page">
      <Title level={2}>审核信息</Title>
      <Paragraph>
        请仔细检查以下信息。如需修改，点击相应部分的"编辑"按钮。确认无误后，点击"提交"按钮完成申请。
      </Paragraph>

      {sections.map((section, index) => (
        <Card 
          key={section.key}
          title={section.title}
          extra={
            <Button type="link" onClick={() => onEdit(index)}>
              编辑
            </Button>
          }
          style={{ marginBottom: 16 }}
        >
          {section.content}
        </Card>
      ))}

      <Row justify="center" style={{ marginTop: 24 }}>
        <Col>
          <Button type="primary" onClick={onSubmit} size="large">
            提交申请
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DS160ReviewPage;