import React from 'react';
import { Button, Card, Descriptions, Typography, Row, Col } from 'antd';
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
            {formatDate(formData.dobDay, formData.dobMonth, formData.dobYear)}
          </Descriptions.Item>
          <Descriptions.Item label="性别">{formData.gender === 'M' ? '男' : '女'}</Descriptions.Item>
          <Descriptions.Item label="出生地">{formData.birthPlace || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="国籍">{formData.nationality || 'N/A'}</Descriptions.Item>
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
          <Descriptions.Item label="美国地址">{formData.usAddressLine1}, {formData.usAddressLine2 || ''}, {formData.usCity}, {formData.usState}, {formData.usZipCode}</Descriptions.Item>
          <Descriptions.Item label="旅行资金来源">{formData.travelFunder || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="是否与他人同行">{formData.travelingWithOthers ? '是' : '否'}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '地址历史',
      key: 'addressHistory',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="当前地址">{formData.currentAddress || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="当前城市">{formData.currentCity || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="当前州">{formData.currentState || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="当前邮编">{formData.currentPostalCode || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="当前国家">{formData.currentCountry || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="当前地址居住时间">{formData.currentAddressYears ? `${formData.currentAddressYears}年 ${formData.currentAddressMonths || 0}月` : ''}</Descriptions.Item>
          <Descriptions.Item label="之前地址数量">{formData.previousAddresses?.length || 0}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '教育历史',
      key: 'educationHistory',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="最高教育水平">{formData.highestEducationLevel || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="教育历史数量">{formData.educationHistory?.length || 0}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '工作历史',
      key: 'workHistory',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="主要职业">{formData.primaryOccupation || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="是否目前就业">{formData.currentlyEmployed ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="当前雇主名称">{formData.currentEmployerName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="当前工作职位">{formData.currentJobTitle || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="之前工作数量">{formData.previousEmployment?.length || 0}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '家庭信息',
      key: 'familyInfo',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="婚姻状况">{formData.maritalStatus || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="配偶姓名">{formData.spouseSurname && formData.spouseGivenName ? `${formData.spouseSurname} ${formData.spouseGivenName}` : ''}</Descriptions.Item>
          <Descriptions.Item label="父亲姓名">{formData.fatherSurname && formData.fatherGivenName ? `${formData.fatherSurname} ${formData.fatherGivenName}` : ''}</Descriptions.Item>
          <Descriptions.Item label="母亲姓名">{formData.motherSurname && formData.motherGivenName ? `${formData.motherSurname} ${formData.motherGivenName}` : ''}</Descriptions.Item>
          <Descriptions.Item label="美国亲属数量">{formData.otherRelatives?.length || 0}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '安全背景',
      key: 'securityInfo',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="是否有逮捕记录">{formData.hasArrestRecord ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="是否违反过毒品法">{formData.hasViolatedDrugLaw ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="是否有军事服务">{formData.hasMilitaryService ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="军事服务国家">{formData.militaryServiceCountry || 'N/A'}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: '护照信息',
      key: 'passportInfo',
      content: (
        <Descriptions column={2}>
          <Descriptions.Item label="护照类型">{formData.passportType || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="护照号码">{formData.passportNumber || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="护照签发国家">{formData.passportIssuingCountry || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="护照签发日期">{formatDate(formData.passportIssuanceDay, formData.passportIssuanceMonth, formData.passportIssuanceYear)}</Descriptions.Item>
          <Descriptions.Item label="护照有效期">{formatDate(formData.passportExpirationDay, formData.passportExpirationMonth, formData.passportExpirationYear)}</Descriptions.Item>
          <Descriptions.Item label="是否有之前签证">{formData.hasPreviousVisa ? '是' : '否'}</Descriptions.Item>
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
