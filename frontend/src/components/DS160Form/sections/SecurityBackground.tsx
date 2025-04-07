import React from 'react';
import { Input, Radio, Divider, Typography, Form } from 'antd';
import QuestionItem from '../common/QuestionItem';

const { Paragraph } = Typography;

interface SecurityBackgroundProps {
  form: any;
}

const SecurityBackground: React.FC<SecurityBackgroundProps> = ({ form }) => {
  // Define highlighted block style
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  // Helper function to render conditional explanation field
  const renderExplanationField = (fieldName: string) => (
    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
      prevValues[fieldName] !== currentValues[fieldName]
    }>
      {({ getFieldValue }) => 
        getFieldValue(fieldName) === true ? (
          <Form.Item
            name={`${fieldName}Explanation`}
            rules={[{ required: true, message: '请提供详细说明' }]}
          >
            <Input.TextArea rows={4} placeholder="请提供详细说明..." />
          </Form.Item>
        ) : null
      }
    </Form.Item>
  );

  return (
    <div className="security-background-section">
      <h3>安全和背景信息</h3>
      <Paragraph type="secondary">
        以下问题涉及安全和背景信息，请如实回答。如果您对任何问题回答"是"，请在提供的空间中详细说明情况。
      </Paragraph>
      
      <div style={highlightedBlockStyle}>
        <h4>犯罪和安全信息</h4>
        
        <QuestionItem
          question="您是否曾经被逮捕或因犯罪而被定罪，即使后来被赦免、特赦或其他类似行为？"
          name="hasArrestRecord"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasArrestRecord')}

        <QuestionItem
          question="您是否曾经违反或阴谋违反有关管制物质的法律？"
          name="hasViolatedDrugLaw"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasViolatedDrugLaw')}

        <QuestionItem
          question="您是否从事或打算从事卖淫或商业性行为？"
          name="hasProstitutionIntent"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasProstitutionIntent')}

        <QuestionItem
          question="您是否曾经参与或意图参与洗钱活动？"
          name="hasMoneyLaunderingIntent"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasMoneyLaunderingIntent')}
      </div>

      <Divider />

      <div style={highlightedBlockStyle}>
        <h4>移民历史</h4>
        
        <QuestionItem
          question="您是否曾经被拒绝进入美国，或在入境口岸被拒绝入境？"
          name="hasPreviousDenial"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasPreviousDenial')}

        <QuestionItem
          question="您是否曾经在美国逾期停留或以其他方式违反美国移民法？"
          name="hasOverstayedVisa"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasOverstayedVisa')}

        <QuestionItem
          question="您是否曾经被驱逐出境或被要求离开美国？"
          name="hasBeenDeported"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasBeenDeported')}
      </div>

      <Divider />

      <div style={highlightedBlockStyle}>
        <h4>政治和组织背景</h4>
        
        <QuestionItem
          question="您是否曾经寻求通过暴力或其他非法手段推翻任何政府？"
          name="hasOverthrowIntent"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasOverthrowIntent')}

        <QuestionItem
          question="您是否曾经是恐怖组织的成员或代表？"
          name="hasTerroristAffiliation"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasTerroristAffiliation')}

        <QuestionItem
          question="您是否曾经参与、命令、煽动、协助或以其他方式参与种族灭绝行为？"
          name="hasGenocideInvolvement"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasGenocideInvolvement')}

        <QuestionItem
          question="您是否曾经参与酷刑或法外处决？"
          name="hasTortureInvolvement"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasTortureInvolvement')}
      </div>

      <Divider />

      <div style={highlightedBlockStyle}>
        <h4>公共卫生</h4>
        
        <QuestionItem
          question="您是否患有传染性疾病，对公共健康构成威胁？"
          name="hasInfectiousDisease"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasInfectiousDisease')}

        <QuestionItem
          question="您是否有可能严重危害您或他人安全或福利的身体或精神障碍？"
          name="hasMentalDisorder"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasMentalDisorder')}

        <QuestionItem
          question="您是否曾经滥用或成瘾于任何受管制物质？"
          name="hasDrugAbuse"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>
        {renderExplanationField('hasDrugAbuse')}
      </div>

      <Divider />

      <div style={highlightedBlockStyle}>
        <h4>军事服役</h4>
        
        <QuestionItem
          question="您是否曾在任何国家的武装部队服役？"
          name="hasMilitaryService"
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </QuestionItem>

        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
          prevValues.hasMilitaryService !== currentValues.hasMilitaryService
        }>
          {({ getFieldValue }) => 
            getFieldValue('hasMilitaryService') === true ? (
              <>
                <QuestionItem
                  question="您服役的国家"
                  name="militaryServiceCountry"
                >
                  <Input placeholder="例如：中国" />
                </QuestionItem>

                <QuestionItem
                  question="军种"
                  name="militaryBranch"
                >
                  <Input placeholder="例如：陆军" />
                </QuestionItem>

                <QuestionItem
                  question="军衔/职位"
                  name="militaryRank"
                >
                  <Input placeholder="例如：少尉" />
                </QuestionItem>

                <QuestionItem
                  question="军事专业"
                  name="militarySpecialty"
                >
                  <Input placeholder="例如：通信" />
                </QuestionItem>

                <QuestionItem
                  question="服役开始日期"
                  name="militaryServiceFrom"
                >
                  <Input placeholder="例如：2010-01-01" />
                </QuestionItem>

                <QuestionItem
                  question="服役结束日期"
                  name="militaryServiceTo"
                >
                  <Input placeholder="例如：2015-01-01" />
                </QuestionItem>
              </>
            ) : null
          }
        </Form.Item>
      </div>
    </div>
  );
};

export default SecurityBackground;
