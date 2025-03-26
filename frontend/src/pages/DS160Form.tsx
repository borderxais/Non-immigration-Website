import React from 'react';
import { Card, Steps, Form, Input, Select, DatePicker, Radio, Space, Button, Typography, Divider, message, Row, Col, Checkbox } from 'antd';
import ds160Service from '../services/ds160Service';
import { useNavigate } from 'react-router-dom';
import FormItemButtons from '../components/FormItemButtons';

//  Application ID AA00EGS9G1

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const DS160Form: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  // Define highlighted block style here, so it's available throughout the component
  const highlightedBlockStyle = {
    background: '#f0f8ff', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  const blockInsideHighlightStyle = {
    background: 'white', 
    border: '1px solid #d6e8fa', 
    borderRadius: '8px', 
    padding: '16px',
    marginBottom: '24px'
  };

  // Helper function to determine if a specific purpose code indicates a dependent relationship
  const isDependentSelection = (value: string): boolean => {
    // List of codes that indicate a dependent relationship (child, spouse, etc.)
    const dependentCodes = [
      'A1-CH', 'A1-SP', 'A2-CH', 'A2-SP', 'A3-CH', 'A3-SP',
      'CW2-CH', 'CW2-SP', 
      'E1-CH', 'E1-SP', 'E2-CH', 'E2-SP', 'E3D-CH', 'E3D-SP',
      'F2-CH', 'F2-SP',
      'G1-CH', 'G1-SP', 'G2-CH', 'G2-SP', 'G3-CH', 'G3-SP', 'G4-CH', 'G4-SP', 'G5-CH', 'G5-SP',
      'H4-CH', 'H4-SP',
      'I-CH', 'I-SP',
      'J2-CH', 'J2-SP',
      'K2-K2', 'K4-K4',
      'L2-CH', 'L2-SP',
      'M2-CH', 'M2-SP',
      'N8-CH',
      'NATO1-SP', 'NATO1-CH', 'NATO2-SP', 'NATO2-CH', 'NATO3-SP', 'NATO3-CH', 
      'NATO4-SP', 'NATO4-CH', 'NATO5-SP', 'NATO5-CH', 'NATO6-SP', 'NATO6-CH',
      'NATO7-SP', 'NATO7-CH',
      'O3-SP', 'O3-CH',
      'P4-SP', 'P4-CH',
      'R2-R2', 'R3-R3',
      'S7-S7',
      'T2-SP', 'T3-CH', 'T4-PR', 'T5-SB', 'T6-CB',
      'TD-SP', 'TD-CH',
      'U2-SP', 'U3-CH', 'U4-PR', 'U5-SB'
    ];
    
    return dependentCodes.includes(value);
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Submitting form:', values);
      const response = await ds160Service.createForm(values);
      console.log('Form submitted successfully:', response);
      message.success('表格提交成功！');
      // Redirect to a success page
      navigate('/ds160-success');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('提交表格时出错，请稍后再试。');
    }
  };

  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  // Helper component for form items with explanations
  const QuestionItem: React.FC<{
    number?: string;
    question: string;
    name: string;
    required?: boolean;
    children: React.ReactNode;
    explanation?: string;
    hasNaCheckbox?: boolean;
    naCheckboxName?: string;
  }> = ({ number, question, name, required = true, children, explanation, hasNaCheckbox = false, naCheckboxName }) => {
    // Use the form instance to get the current value of the NA checkbox
    const isNaChecked = Form.useWatch(naCheckboxName || `${name}_na`, form);
    
    // Modify the rules to respect the NA checkbox state
    const fieldRules = required ? [{ 
      required: !isNaChecked, 
      message: '此字段为必填项' 
    }] : [];
    
    // Create a custom input with disabled state based on NA checkbox
    const renderDisableableInput = () => {
      // Rather than trying to clone the element, we'll wrap it with our own logic
      if (!React.isValidElement(children)) {
        return children;
      }
      
      // For Input components
      if (children.type === Input || children.type === TextArea) {
        return (
          <Input
            {...(children.props as any)}
            disabled={isNaChecked}
            style={{ 
              ...((children.props as any).style || {}),
              backgroundColor: isNaChecked ? '#f5f5f5' : 'white'
            }}
          />
        );
      }
      
      // For Select components
      if (children.type === Select) {
        return (
          <Select
            {...(children.props as any)}
            disabled={isNaChecked}
            style={{ 
              ...((children.props as any).style || {}),
              backgroundColor: isNaChecked ? '#f5f5f5' : 'white'
            }}
          />
        );
      }
      
      // For DatePicker components
      if (children.type === DatePicker) {
        return (
          <DatePicker
            {...(children.props as any)}
            disabled={isNaChecked}
            style={{ 
              ...((children.props as any).style || {}),
              backgroundColor: isNaChecked ? '#f5f5f5' : 'white'
            }}
          />
        );
      }
      
      // For Radio.Group components
      if (children.type === Radio.Group) {
        return (
          <Radio.Group
            {...(children.props as any)}
            disabled={isNaChecked}
          />
        );
      }
      
      // Default case - return the original element
      return children;
    };
    
    return (
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            <Text strong>
              {number ? `${number}. ` : ''}{question}{required && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>}</Text>
            <Form.Item 
              name={name} 
              rules={fieldRules}
              style={{ marginBottom: 0 }}
            >
              {renderDisableableInput()}
            </Form.Item>
            
            {hasNaCheckbox && (
              <Form.Item 
                name={naCheckboxName || `${name}_na`} 
                valuePropName="checked"
                style={{ marginBottom: 0, marginTop: 8, textAlign: 'right' }}
              >
                <Checkbox>不适用/技术无法提供</Checkbox>
              </Form.Item>
            )}
          </Space>
        </Col>
        {explanation && (
          <Col span={8}>
            <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', height: '100%' }}>
              <Paragraph style={{ fontSize: '13px', color: '#666' }}>{explanation}</Paragraph>
            </div>
          </Col>
        )}
      </Row>
    );
  };

  const steps = [
    {
      title: '开始',
      description: '基本信息',
      content: (
        <>
          <QuestionItem
            question="请选择一个安全问题"
            name="securityQuestion"
          >
            <Select placeholder="选择安全问题" style={{ width: '100%' }}>
              <Select.Option value="1">您母亲的母亲的名字是什么？</Select.Option>
              <Select.Option value="2">您父亲的父亲的名字是什么？</Select.Option>
              <Select.Option value="3">您外祖母的娘家姓是什么？</Select.Option>
              <Select.Option value="4">您小时候家人怎么称呼您？</Select.Option>
              <Select.Option value="5">您在哪个城市遇到您的配偶/伴侣？</Select.Option>
              <Select.Option value="6">您最好的童年朋友叫什么名字？</Select.Option>
              <Select.Option value="7">您8岁时住在哪条街？</Select.Option>
              <Select.Option value="8">您最年长的兄弟姐妹的生日月份和年份？（例如：1900年1月）</Select.Option>
              <Select.Option value="9">您最小的孩子的中间名是什么？</Select.Option>
              <Select.Option value="10">您最年长的兄弟姐妹的中间名是什么？</Select.Option>
              <Select.Option value="11">您11岁时就读的学校是什么？</Select.Option>
              <Select.Option value="12">您小时候的家庭电话号码是什么？</Select.Option>
              <Select.Option value="13">您最年长的表亲/堂亲的名字和姓氏是什么？</Select.Option>
              <Select.Option value="14">您最喜欢的毛绒动物或玩具的名字是什么？</Select.Option>
              <Select.Option value="15">您的父母在哪个城市或镇相遇？</Select.Option>
              <Select.Option value="16">您最喜欢的老师的姓氏是什么？</Select.Option>
              <Select.Option value="17">您最近的兄弟姐妹住在哪个城市？</Select.Option>
              <Select.Option value="18">您最年幼的兄弟姐妹的生日月份和年份？（例如：1900年1月）</Select.Option>
              <Select.Option value="19">您的第一份工作在哪个城市或镇？</Select.Option>
              <Select.Option value="20">您的第一个男朋友或女朋友叫什么名字？</Select.Option>
            </Select>
          </QuestionItem>
          
          <QuestionItem
            question="您的回答(英文)"
            name="securityAnswer"
          >
            <Input placeholder="请输入您的安全问题答案" />
          </QuestionItem>
          
          <Title level={5}>提示</Title>
          <p>为了保护您的个人信息安全，请记住您的安全问题和答案。如果您需要恢复您的申请，将需要提供此信息。</p>

          <Divider />

          <Title level={4}>申请地点</Title>
            <QuestionItem
              question="您计划在哪个使领馆申请签证？"
              name="location"
            >
              <Select placeholder="选择申请地点">
                <Select.Option value="beijing">美国驻北京大使馆</Select.Option>
                <Select.Option value="shanghai">美国驻上海领事馆</Select.Option>
                <Select.Option value="guangzhou">美国驻广州领事馆</Select.Option>
                <Select.Option value="shenyang">美国驻沈阳领事馆</Select.Option>
                <Select.Option value="wuhan">美国驻武汉领事馆</Select.Option>
              </Select>
            </QuestionItem>
        </>
      ),
    },
    {
      title: '个人信息 I',
      content: (
        <>
          <QuestionItem
            question="姓（拼音，与护照一致）"
            name="surname"
            explanation="输入您护照上列出的所有姓氏。如果只有一个，请输入这一个。"
          >
            <Input placeholder="例如：ZHANG" />
          </QuestionItem>

          <QuestionItem
            question="名（拼音，与护照一致）"
            name="givenName"
            explanation="如果您的护照上不包括名字信息，请在名字栏内输入'FNU'。"
          >
            <Input placeholder="例如：SAN" />
          </QuestionItem>

          <QuestionItem
            question="全名（本地语言书写）"
            name="fullNameNative"
            explanation="请用中文填写您的全名。如不适用/技术不可用，请勾选下方的复选框。"
            hasNaCheckbox={true}
            naCheckboxName="fullNameNative_na"
          >
            <Input placeholder="请用中文填写您的全名" />
          </QuestionItem>
          
          <QuestionItem
            question="您是否曾使用其他姓名？（包括曾用名、英文名、别名等）"
            name="hasOtherNames"
            explanation="其它姓名包括您的婚前用名, 宗教用名、职业用名; 或任何为人所知的其它名字；或在过去为别人所知的其它名字。"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>

          <QuestionItem
            question="您是否有代表您姓名的电码？"
            name="hasTelecode"
            explanation="电码由4位数字组成，代表着一些非罗马字母拼写而成的名字的字体。"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>
          
          <Divider />
          
          <QuestionItem
            question="性别"
            name="gender"
            explanation="请选择您的性别，必须与护照上的信息一致。"
          >
            <Select placeholder="选择一个">
              <Select.Option value="M">男</Select.Option>
              <Select.Option value="F">女</Select.Option>
            </Select>
          </QuestionItem>

          <QuestionItem
            question="婚姻状况"
            name="maritalStatus"
            explanation="请选择您目前的婚姻状况。"
          >
            <Select placeholder="选择一个">
            <Select.Option value="M">已婚</Select.Option>
              <Select.Option value="C">普通法婚姻</Select.Option>
              <Select.Option value="P">民事结合/同居伴侣关系</Select.Option>
              <Select.Option value="S">未婚</Select.Option>
              <Select.Option value="W">丧偶</Select.Option>
              <Select.Option value="D">离异</Select.Option>
              <Select.Option value="L">合法分居</Select.Option>
              <Select.Option value="O">其他</Select.Option>
            </Select>
          </QuestionItem>
          <Divider />

          <h4 style={{ marginBottom: '10px', marginTop: '20px' }}>
            <span>出生日期与出生地</span>
          </h4>
        
          <div className="field-group callout" style={highlightedBlockStyle}>
  
            <QuestionItem
              question="日期"
              name="dateOfBirth"
              explanation="若不知道具体日期或月份，请按护照所示填写。"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Form.Item 
                  name="dobDay" 
                  noStyle
                  rules={[{ required: true, message: '请选择日期' }]}
                >
                  <Select style={{ width: '60px' }} placeholder="">
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = (i + 1).toString().padStart(2, '0');
                      return <Select.Option key={day} value={day}>{day}</Select.Option>;
                    })}
                  </Select>
                </Form.Item>

                <Form.Item 
                  name="dobMonth" 
                  noStyle
                  rules={[{ required: true, message: '请选择月份' }]}
                >
                  <Select style={{ width: '70px' }} placeholder="">
                    <Select.Option value="JAN">一月</Select.Option>
                    <Select.Option value="FEB">二月</Select.Option>
                    <Select.Option value="MAR">三月</Select.Option>
                    <Select.Option value="APR">四月</Select.Option>
                    <Select.Option value="MAY">五月</Select.Option>
                    <Select.Option value="JUN">六月</Select.Option>
                    <Select.Option value="JUL">七月</Select.Option>
                    <Select.Option value="AUG">八月</Select.Option>
                    <Select.Option value="SEP">九月</Select.Option>
                    <Select.Option value="OCT">十月</Select.Option>
                    <Select.Option value="NOV">十一月</Select.Option>
                    <Select.Option value="DEC">十二月</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item 
                  name="dobYear" 
                  noStyle
                  rules={[
                    { required: true, message: '请输入年份' },
                    { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                  ]}
                >
                  <Input placeholder="" style={{ width: '60px' }} maxLength={4} />
                </Form.Item>

                <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                  (格式: DD-MMM-YYYY)
                </div>
              </div>
            </QuestionItem>

            <QuestionItem
              question="城市"
              name="birthPlace"
            >
              <Input placeholder="例如：北京" />
            </QuestionItem>

            <QuestionItem
              question="州/省"
              name="birthState"
              hasNaCheckbox={true}
              naCheckboxName="birthState_na"
            >
              <Input placeholder="例如：北京市" />
            </QuestionItem>

            <QuestionItem
              question="国家/地区"
              name="birthCountry"
              explanation="请选择您出生地的现用国家/地区名称。"
            >
              <Select placeholder="- 选择一个 -">
                  <Select.Option value="AFGH">阿富汗</Select.Option>
                  <Select.Option value="ALB">阿尔巴尼亚</Select.Option>
                  <Select.Option value="ALGR">阿尔及利亚</Select.Option>
                  <Select.Option value="ASMO">美属萨摩亚</Select.Option>
                  <Select.Option value="ANDO">安道尔</Select.Option>
                  <Select.Option value="ANGL">安哥拉</Select.Option>
                  <Select.Option value="ANGU">安圭拉</Select.Option>
                  <Select.Option value="ANTI">安提瓜和巴布达</Select.Option>
                  <Select.Option value="ARG">阿根廷</Select.Option>
                  <Select.Option value="ARM">亚美尼亚</Select.Option>
                  <Select.Option value="ARB">阿鲁巴</Select.Option>
                  <Select.Option value="XAS">海上</Select.Option>
                  <Select.Option value="ASTL">澳大利亚</Select.Option>
                  <Select.Option value="AUST">奥地利</Select.Option>
                  <Select.Option value="AZR">阿塞拜疆</Select.Option>
                  <Select.Option value="BAMA">巴哈马</Select.Option>
                  <Select.Option value="BAHR">巴林</Select.Option>
                  <Select.Option value="BANG">孟加拉国</Select.Option>
                  <Select.Option value="BRDO">巴巴多斯</Select.Option>
                  <Select.Option value="BYS">白俄罗斯</Select.Option>
                  <Select.Option value="BELG">比利时</Select.Option>
                  <Select.Option value="BLZ">伯利兹</Select.Option>
                  <Select.Option value="BENN">贝宁</Select.Option>
                  <Select.Option value="BERM">百慕大</Select.Option>
                  <Select.Option value="BHU">不丹</Select.Option>
                  <Select.Option value="BOL">玻利维亚</Select.Option>
                  <Select.Option value="BIH">波斯尼亚和黑塞哥维那</Select.Option>
                  <Select.Option value="BOT">博茨瓦纳</Select.Option>
                  <Select.Option value="BRZL">巴西</Select.Option>
                  <Select.Option value="BRNI">文莱</Select.Option>
                  <Select.Option value="BULG">保加利亚</Select.Option>
                  <Select.Option value="BURK">布基纳法索</Select.Option>
                  <Select.Option value="BURM">缅甸</Select.Option>
                  <Select.Option value="BRND">布隆迪</Select.Option>
                  <Select.Option value="CBDA">柬埔寨</Select.Option>
                  <Select.Option value="CMRN">喀麦隆</Select.Option>
                  <Select.Option value="CAN">加拿大</Select.Option>
                  <Select.Option value="CAVI">佛得角</Select.Option>
                  <Select.Option value="CAYI">开曼群岛</Select.Option>
                  <Select.Option value="CAFR">中非共和国</Select.Option>
                  <Select.Option value="CHAD">乍得</Select.Option>
                  <Select.Option value="CHIL">智利</Select.Option>
                  <Select.Option value="CHIN">中国</Select.Option>
                  <Select.Option value="HNK">中国香港特别行政区</Select.Option>
                  <Select.Option value="MAC">中国澳门特别行政区</Select.Option>
                  <Select.Option value="TWAN">中国台湾</Select.Option>
                  <Select.Option value="COL">哥伦比亚</Select.Option>
                  <Select.Option value="COMO">科摩罗</Select.Option>
                  <Select.Option value="COD">刚果民主共和国</Select.Option>
                  <Select.Option value="CONB">刚果共和国</Select.Option>
                  <Select.Option value="CSTR">哥斯达黎加</Select.Option>
                  <Select.Option value="IVCO">科特迪瓦</Select.Option>
                  <Select.Option value="HRV">克罗地亚</Select.Option>
                  <Select.Option value="CUBA">古巴</Select.Option>
                  <Select.Option value="CUR">库拉索</Select.Option>
                  <Select.Option value="CYPR">塞浦路斯</Select.Option>
                  <Select.Option value="CZEC">捷克共和国</Select.Option>
                  <Select.Option value="DEN">丹麦</Select.Option>
                  <Select.Option value="DJI">吉布提</Select.Option>
                  <Select.Option value="DOMN">多米尼克</Select.Option>
                  <Select.Option value="DOMR">多米尼加共和国</Select.Option>
                  <Select.Option value="ECUA">厄瓜多尔</Select.Option>
                  <Select.Option value="EGYP">埃及</Select.Option>
                  <Select.Option value="ELSL">萨尔瓦多</Select.Option>
                  <Select.Option value="EGN">赤道几内亚</Select.Option>
                  <Select.Option value="ERI">厄立特里亚</Select.Option>
                  <Select.Option value="EST">爱沙尼亚</Select.Option>
                  <Select.Option value="SZLD">斯威士兰</Select.Option>
                  <Select.Option value="ETH">埃塞俄比亚</Select.Option>
                  <Select.Option value="FIJI">斐济</Select.Option>
                  <Select.Option value="FIN">芬兰</Select.Option>
                  <Select.Option value="FRAN">法国</Select.Option>
                  <Select.Option value="GABN">加蓬</Select.Option>
                  <Select.Option value="GAM">冈比亚</Select.Option>
                  <Select.Option value="GEO">格鲁吉亚</Select.Option>
                  <Select.Option value="GER">德国</Select.Option>
                  <Select.Option value="GHAN">加纳</Select.Option>
                  <Select.Option value="GRC">希腊</Select.Option>
                  <Select.Option value="GREN">格林纳达</Select.Option>
                  <Select.Option value="GUAT">危地马拉</Select.Option>
                  <Select.Option value="GNEA">几内亚</Select.Option>
                  <Select.Option value="GUIB">几内亚比绍</Select.Option>
                  <Select.Option value="GUY">圭亚那</Select.Option>
                  <Select.Option value="HAT">海地</Select.Option>
                  <Select.Option value="VAT">梵蒂冈</Select.Option>
                  <Select.Option value="HOND">洪都拉斯</Select.Option>
                  <Select.Option value="HUNG">匈牙利</Select.Option>
                  <Select.Option value="ICLD">冰岛</Select.Option>
                  <Select.Option value="IND">印度</Select.Option>
                  <Select.Option value="IDSA">印度尼西亚</Select.Option>
                  <Select.Option value="IRAN">伊朗</Select.Option>
                  <Select.Option value="IRAQ">伊拉克</Select.Option>
                  <Select.Option value="IRE">爱尔兰</Select.Option>
                  <Select.Option value="ISRL">以色列</Select.Option>
                  <Select.Option value="ITLY">意大利</Select.Option>
                  <Select.Option value="JAM">牙买加</Select.Option>
                  <Select.Option value="JPN">日本</Select.Option>
                  <Select.Option value="JORD">约旦</Select.Option>
                  <Select.Option value="KAZ">哈萨克斯坦</Select.Option>
                  <Select.Option value="KENY">肯尼亚</Select.Option>
                  <Select.Option value="KIRI">基里巴斯</Select.Option>
                  <Select.Option value="PRK">朝鲜</Select.Option>
                  <Select.Option value="KOR">韩国</Select.Option>
                  <Select.Option value="KSV">科索沃</Select.Option>
                  <Select.Option value="KUWT">科威特</Select.Option>
                  <Select.Option value="KGZ">吉尔吉斯斯坦</Select.Option>
                  <Select.Option value="LAOS">老挝</Select.Option>
                  <Select.Option value="LATV">拉脱维亚</Select.Option>
                  <Select.Option value="LEBN">黎巴嫩</Select.Option>
                  <Select.Option value="LES">莱索托</Select.Option>
                  <Select.Option value="LIBR">利比里亚</Select.Option>
                  <Select.Option value="LBYA">利比亚</Select.Option>
                  <Select.Option value="LCHT">列支敦士登</Select.Option>
                  <Select.Option value="LITH">立陶宛</Select.Option>
                  <Select.Option value="LXM">卢森堡</Select.Option>
                  <Select.Option value="MKD">北马其顿</Select.Option>
                  <Select.Option value="MADG">马达加斯加</Select.Option>
                  <Select.Option value="MALW">马拉维</Select.Option>
                  <Select.Option value="MLAS">马来西亚</Select.Option>
                  <Select.Option value="MLDV">马尔代夫</Select.Option>
                  <Select.Option value="MALI">马里</Select.Option>
                  <Select.Option value="MLTA">马耳他</Select.Option>
                  <Select.Option value="RMI">马绍尔群岛</Select.Option>
                  <Select.Option value="MAUR">毛里塔尼亚</Select.Option>
                  <Select.Option value="MRTS">毛里求斯</Select.Option>
                  <Select.Option value="MLD">摩尔多瓦</Select.Option>
                  <Select.Option value="MON">摩纳哥</Select.Option>
                  <Select.Option value="MONG">蒙古</Select.Option>
                  <Select.Option value="MTG">黑山</Select.Option>
                  <Select.Option value="MORO">摩洛哥</Select.Option>
                  <Select.Option value="MOZ">莫桑比克</Select.Option>
                  <Select.Option value="NAMB">纳米比亚</Select.Option>
                  <Select.Option value="NAU">瑙鲁</Select.Option>
                  <Select.Option value="NEP">尼泊尔</Select.Option>
                  <Select.Option value="NETH">荷兰</Select.Option>
                  <Select.Option value="NZLD">新西兰</Select.Option>
                  <Select.Option value="NIC">尼加拉瓜</Select.Option>
                  <Select.Option value="NIR">尼日尔</Select.Option>
                  <Select.Option value="NRA">尼日利亚</Select.Option>
                  <Select.Option value="NORW">挪威</Select.Option>
                  <Select.Option value="OMAN">阿曼</Select.Option>
                  <Select.Option value="PKST">巴基斯坦</Select.Option>
                  <Select.Option value="PALA">帕劳</Select.Option>
                  <Select.Option value="PAN">巴拿马</Select.Option>
                  <Select.Option value="PNG">巴布亚新几内亚</Select.Option>
                  <Select.Option value="PARA">巴拉圭</Select.Option>
                  <Select.Option value="PERU">秘鲁</Select.Option>
                  <Select.Option value="PHIL">菲律宾</Select.Option>
                  <Select.Option value="POL">波兰</Select.Option>
                  <Select.Option value="PORT">葡萄牙</Select.Option>
                  <Select.Option value="QTAR">卡塔尔</Select.Option>
                  <Select.Option value="ROM">罗马尼亚</Select.Option>
                  <Select.Option value="RUS">俄罗斯</Select.Option>
                  <Select.Option value="RWND">卢旺达</Select.Option>
                  <Select.Option value="SMAR">圣马力诺</Select.Option>
                  <Select.Option value="SARB">沙特阿拉伯</Select.Option>
                  <Select.Option value="SENG">塞内加尔</Select.Option>
                  <Select.Option value="SBA">塞尔维亚</Select.Option>
                  <Select.Option value="SEYC">塞舌尔</Select.Option>
                  <Select.Option value="SLEO">塞拉利昂</Select.Option>
                  <Select.Option value="SING">新加坡</Select.Option>
                  <Select.Option value="SVK">斯洛伐克</Select.Option>
                  <Select.Option value="SVN">斯洛文尼亚</Select.Option>
                  <Select.Option value="SLMN">所罗门群岛</Select.Option>
                  <Select.Option value="SOMA">索马里</Select.Option>
                  <Select.Option value="SAFR">南非</Select.Option>
                  <Select.Option value="SSDN">南苏丹</Select.Option>
                  <Select.Option value="SPN">西班牙</Select.Option>
                  <Select.Option value="SRL">斯里兰卡</Select.Option>
                  <Select.Option value="SLCA">圣卢西亚</Select.Option>
                  <Select.Option value="STVN">圣文森特和格林纳丁斯</Select.Option>
                  <Select.Option value="SUDA">苏丹</Select.Option>
                  <Select.Option value="SURM">苏里南</Select.Option>
                  <Select.Option value="SWDN">瑞典</Select.Option>
                  <Select.Option value="SWTZ">瑞士</Select.Option>
                  <Select.Option value="SYR">叙利亚</Select.Option>
                  <Select.Option value="TJK">塔吉克斯坦</Select.Option>
                  <Select.Option value="TAZN">坦桑尼亚</Select.Option>
                  <Select.Option value="THAI">泰国</Select.Option>
                  <Select.Option value="TMOR">东帝汶</Select.Option>
                  <Select.Option value="TOGO">多哥</Select.Option>
                  <Select.Option value="TONG">汤加</Select.Option>
                  <Select.Option value="TRIN">特立尼达和多巴哥</Select.Option>
                  <Select.Option value="TNSA">突尼斯</Select.Option>
                  <Select.Option value="TRKY">土耳其</Select.Option>
                  <Select.Option value="TKM">土库曼斯坦</Select.Option>
                  <Select.Option value="UGAN">乌干达</Select.Option>
                  <Select.Option value="UKR">乌克兰</Select.Option>
                  <Select.Option value="UAE">阿拉伯联合酋长国</Select.Option>
                  <Select.Option value="GRBR">英国</Select.Option>
                  <Select.Option value="USA">美国</Select.Option>
                  <Select.Option value="URU">乌拉圭</Select.Option>
                  <Select.Option value="UZB">乌兹别克斯坦</Select.Option>
                  <Select.Option value="VANU">瓦努阿图</Select.Option>
                  <Select.Option value="VENZ">委内瑞拉</Select.Option>
                  <Select.Option value="VTNM">越南</Select.Option>
                  <Select.Option value="YEM">也门</Select.Option>
                  <Select.Option value="ZAMB">赞比亚</Select.Option>
                  <Select.Option value="ZIMB">津巴布韦</Select.Option>
              </Select> 
            </QuestionItem>

          </div>
        </>
      ),
    },
    {
      title: '个人信息 II',
      content: (
        <>
          <QuestionItem
            question="所属国家/地区（国籍）"
            name="nationality"
            explanation="请选择您目前的国籍。"
          >
            <Select placeholder="- 选择一个 -" style={{ width: '100%' }}>
              <Select.Option value="AFGH">阿富汗</Select.Option>
              <Select.Option value="ALB">阿尔巴尼亚</Select.Option>
              <Select.Option value="ALGR">阿尔及利亚</Select.Option>
              <Select.Option value="ANDO">安道尔</Select.Option>
              <Select.Option value="ANGL">安哥拉</Select.Option>
              <Select.Option value="ANGU">安圭拉</Select.Option>
              <Select.Option value="ANTI">安提瓜和巴布达</Select.Option>
              <Select.Option value="ARG">阿根廷</Select.Option>
              <Select.Option value="ARM">亚美尼亚</Select.Option>
              <Select.Option value="ASTL">澳大利亚</Select.Option>
              <Select.Option value="AUST">奥地利</Select.Option>
              <Select.Option value="AZR">阿塞拜疆</Select.Option>
              <Select.Option value="BAMA">巴哈马</Select.Option>
              <Select.Option value="BAHR">巴林</Select.Option>
              <Select.Option value="BANG">孟加拉国</Select.Option>
              <Select.Option value="BRDO">巴巴多斯</Select.Option>
              <Select.Option value="BYS">白俄罗斯</Select.Option>
              <Select.Option value="BELG">比利时</Select.Option>
              <Select.Option value="BLZ">伯利兹</Select.Option>
              <Select.Option value="BENN">贝宁</Select.Option>
              <Select.Option value="BERM">百慕大</Select.Option>
              <Select.Option value="BHU">不丹</Select.Option>
              <Select.Option value="BOL">玻利维亚</Select.Option>
              <Select.Option value="BIH">波斯尼亚和黑塞哥维那</Select.Option>
              <Select.Option value="BOT">博茨瓦纳</Select.Option>
              <Select.Option value="BRZL">巴西</Select.Option>
              <Select.Option value="BRNI">文莱</Select.Option>
              <Select.Option value="BULG">保加利亚</Select.Option>
              <Select.Option value="BURK">布基纳法索</Select.Option>
              <Select.Option value="BURM">缅甸</Select.Option>
              <Select.Option value="BRND">布隆迪</Select.Option>
              <Select.Option value="CBDA">柬埔寨</Select.Option>
              <Select.Option value="CMRN">喀麦隆</Select.Option>
              <Select.Option value="CAN">加拿大</Select.Option>
              <Select.Option value="CHIN">中国</Select.Option>
              <Select.Option value="HNK">中国香港特别行政区</Select.Option>
              <Select.Option value="MAC">中国澳门特别行政区</Select.Option>
              <Select.Option value="TWAN">中国台湾</Select.Option>
              {/* Add more country options as needed */}
            </Select>
          </QuestionItem>
          
          <QuestionItem
            question="您是否持有或曾经持有上述国籍以外的其他国籍？"
            name="hasOtherNationality"
            explanation="如果您持有或曾经持有多重国籍，请选择'是'。"
          >
            <Radio.Group>
              <Radio value="Y">是</Radio>
              <Radio value="N">否</Radio>
            </Radio.Group>
          </QuestionItem>
          
          <QuestionItem
            question="您是否是所示原籍国/地区（国籍）以外的其他国家/地区的永久居民？"
            name="isPermResOtherCountry"
            explanation="永久居民是指已被一个国家/地区合法授予在该国家/地区无限期生活和工作许可的任何个人。"
          >
            <Radio.Group>
              <Radio value="Y">是</Radio>
              <Radio value="N">否</Radio>
            </Radio.Group>
          </QuestionItem>
          
          <Divider />
          
          <QuestionItem
            question="身份证件号码"
            name="nationalIdNumber"
            hasNaCheckbox={true}
            naCheckboxName="nationalIdNumber_na"
            explanation="您的身份证号码是您的政府给予的一个独一无二的号码。美国政府为其就业的或者付税的都提供一个号码，就业的为'社会安全号'，付税的为'税号'，这些号码都是独一无二的。"
          >
            <Input placeholder="请输入您的身份证号码" />
          </QuestionItem>
          
          <QuestionItem
            question="美国社会安全号"
            name="usSSN"
            hasNaCheckbox={true}
            naCheckboxName="usSSN_na"
          >
            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
              prevValues.usSSN_na !== currentValues.usSSN_na
            }>
              {({ getFieldValue }) => {
                const isDisabled = getFieldValue('usSSN_na') === true;
                
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Form.Item name={['usSSN', 'part1']} noStyle>
                      <Input 
                        style={{ width: '60px' }} 
                        maxLength={3} 
                        placeholder="XXX" 
                        disabled={isDisabled}
                      />
                    </Form.Item>
                    <span>-</span>
                    <Form.Item name={['usSSN', 'part2']} noStyle>
                      <Input 
                        style={{ width: '50px' }} 
                        maxLength={2} 
                        placeholder="XX" 
                        disabled={isDisabled}
                      />
                    </Form.Item>
                    <span>-</span>
                    <Form.Item name={['usSSN', 'part3']} noStyle>
                      <Input 
                        style={{ width: '70px' }} 
                        maxLength={4} 
                        placeholder="XXXX" 
                        disabled={isDisabled}
                      />
                    </Form.Item>
                  </div>
                );
              }}
            </Form.Item>
          </QuestionItem>
          
          <QuestionItem
            question="美国纳税人身份号码"
            name="usTaxId"
            hasNaCheckbox={true}
            naCheckboxName="usTaxId_na"
          >
            <Input placeholder="请输入您的美国纳税人身份号码" />
          </QuestionItem>
          
        </>
      ),
    },
    {
      title: '旅行信息',
      description: '行程安排',
      content: (
        <>
          <h4>
            <span>提供以下信息：</span>
          </h4>

          <div className="field-group callout" style={highlightedBlockStyle}>
            <div className="field full" style={{ paddingBottom: '0%' }}>
              <QuestionItem
                question="赴美访问目的"
                name="visaClass"
                explanation="请选择与您赴美目的最相符的签证类别。"
              >
                <Select 
                  placeholder="请选择签证类别" 
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    form.setFieldsValue({ specificPurpose: undefined, principalApplicantSurname: undefined, principalApplicantGivenName: undefined });
                    // 触发表单依赖字段的更新
                    setTimeout(() => form.validateFields(['specificPurpose']), 100);
                  }}
                >
                  <Select.Option value="A">外国政府官员 (A)</Select.Option>
                  <Select.Option value="B">临时商务或旅游访客 (B)</Select.Option>
                  <Select.Option value="C">过境外国人 (C)</Select.Option>
                  <Select.Option value="CNMI">CNMI 工作者或投资者 (CW/E2C)</Select.Option>
                  <Select.Option value="D">机组人员 (D)</Select.Option>
                  <Select.Option value="E">条约贸易商或投资者 (E)</Select.Option>
                  <Select.Option value="F">学术或语言学生 (F)</Select.Option>
                  <Select.Option value="G">国际组织代表/雇员 (G)</Select.Option>
                  <Select.Option value="H">临时工作者 (H)</Select.Option>
                  <Select.Option value="I">外国媒体代表 (I)</Select.Option>
                  <Select.Option value="J">交流访问学者 (J)</Select.Option>
                  <Select.Option value="K">美国公民的未婚夫(妻)或配偶 (K)</Select.Option>
                  <Select.Option value="L">公司内部调动人员 (L)</Select.Option>
                  <Select.Option value="M">职业/非学术学生 (M)</Select.Option>
                  <Select.Option value="N">其他 (N)</Select.Option>
                  <Select.Option value="NATO">北约工作人员 (NATO)</Select.Option>
                  <Select.Option value="O">具有特殊能力的外国人 (O)</Select.Option>
                  <Select.Option value="P">国际知名外国人 (P)</Select.Option>
                  <Select.Option value="Q">文化交流访问者 (Q)</Select.Option>
                  <Select.Option value="R">宗教工作者 (R)</Select.Option>
                  <Select.Option value="S">信息提供者或证人 (S)</Select.Option>
                  <Select.Option value="T">人口贩运受害者 (T)</Select.Option>
                  <Select.Option value="TD/TN">北美自由贸易协定专业人士 (TD/TN)</Select.Option>
                  <Select.Option value="U">犯罪活动受害者 (U)</Select.Option>
                  <Select.Option value="PAROLE-BEN">假释受益人 (PARCIS)</Select.Option>
                </Select>
              </QuestionItem>
            </div>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.visaClass !== currentValues.visaClass}
            >
              {({ getFieldValue }) => {
                const visaClass = getFieldValue('visaClass');
                
                if (!visaClass) {
                  return null;
                }

                // 根据签证类别获取相应的具体说明选项
                const getSpecificOptions = () => {
                  switch(visaClass) {
                    case 'A':
                      return [
                        { value: 'A1-AM', label: '大使或公使 (A1)' },
                        { value: 'A1-CH', label: 'A1持有者的子女 (A1)' },
                        { value: 'A1-DP', label: '职业外交官/领事官员 (A1)' },
                        { value: 'A1-SP', label: 'A1持有者的配偶 (A1)' },
                        { value: 'A2-CH', label: 'A2持有者的子女 (A2)' },
                        { value: 'A2-EM', label: '外国官员/雇员 (A2)' },
                        { value: 'A2-SP', label: 'A2持有者的配偶 (A2)' },
                        { value: 'A3-CH', label: 'A3持有者的子女 (A3)' },
                        { value: 'A3-EM', label: 'A1或A2持有者的个人雇员 (A3)' },
                        { value: 'A3-SP', label: 'A3持有者的配偶 (A3)' }
                      ];
                    case 'B':
                      return [
                        { value: 'B1-B2', label: '商务或旅游（临时访客）(B1/B2)' },
                        { value: 'B1-CF', label: '商务/会议 (B1)' },
                        { value: 'B2-TM', label: '旅游/医疗治疗 (B2)' }
                      ];
                    case 'C':
                      return [
                        { value: 'C1-D', label: '过境机组人员 (C1/D)' },
                        { value: 'C1-TR', label: '过境 (C1)' },
                        { value: 'C2-UN', label: '过境前往联合国总部 (C2)' },
                        { value: 'C3-CH', label: 'C3持有者的子女 (C3)' },
                        { value: 'C3-EM', label: 'C3持有者的个人雇员 (C3)' },
                        { value: 'C3-FR', label: '过境外国官员 (C3)' },
                        { value: 'C3-SP', label: 'C3持有者的配偶 (C3)' },
                        { value: 'C4-NO', label: '非公民过境驳船操作 (C4)' },
                        { value: 'C4-D3', label: '过境驳船机组人员 (C4/D3)' }
                      ];
                    case 'CNMI':
                      return [
                        { value: 'CW1-CW1', label: 'CNMI临时工作者 (CW1)' },
                        { value: 'CW2-CH', label: 'CW1持有者的子女 (CW2)' },
                        { value: 'CW2-SP', label: 'CW1持有者的配偶 (CW2)' },
                        { value: 'E2C-E2C', label: 'CNMI长期投资者 (E2C)' }
                      ];
                    case 'D':
                      return [
                        { value: 'D-D', label: '机组人员 (D)' },
                        { value: 'D3-LI', label: '驳船机组人员 (D3)' }
                      ];
                    case 'E':
                      return [
                        { value: 'E1-CH', label: 'E1持有者的子女 (E1)' },
                        { value: 'E1-EX', label: '高管/经理/重要雇员 (E1)' },
                        { value: 'E1-SP', label: 'E1持有者的配偶 (E1)' },
                        { value: 'E1-TR', label: '条约贸易商 (E1)' },
                        { value: 'E2-CH', label: 'E2持有者的子女 (E2)' },
                        { value: 'E2-EX', label: '高管/经理/重要雇员 (E2)' },
                        { value: 'E2-SP', label: 'E2持有者的配偶 (E2)' },
                        { value: 'E2-TR', label: '条约投资者 (E2)' },
                        { value: 'E3D-CH', label: 'E3持有者的子女 (E3D)' },
                        { value: 'E3D-SP', label: 'E3持有者的配偶 (E3D)' }
                      ];
                    case 'F':
                      return [
                        { value: 'F1-F1', label: '学生 (F1)' },
                        { value: 'F2-CH', label: 'F1持有者的子女 (F2)' },
                        { value: 'F2-SP', label: 'F1持有者的配偶 (F2)' }
                      ];
                    case 'G':
                      return [
                        { value: 'G1-CH', label: 'G1持有者的子女 (G1)' },
                        { value: 'G1-G1', label: '首席代表 (G1)' },
                        { value: 'G1-SP', label: 'G1持有者的配偶 (G1)' },
                        { value: 'G1-ST', label: '首席代表的工作人员 (G1)' },
                        { value: 'G2-CH', label: 'G2持有者的子女 (G2)' },
                        { value: 'G2-RP', label: '代表 (G2)' },
                        { value: 'G2-SP', label: 'G2持有者的配偶 (G2)' },
                        { value: 'G3-CH', label: 'G3持有者的子女 (G3)' },
                        { value: 'G3-RP', label: '非认可/非成员国家代表 (G3)' },
                        { value: 'G3-SP', label: 'G3持有者的配偶 (G3)' },
                        { value: 'G4-CH', label: 'G4持有者的子女 (G4)' },
                        { value: 'G4-G4', label: '国际组织雇员 (G4)' },
                        { value: 'G4-SP', label: 'G4持有者的配偶 (G4)' },
                        { value: 'G5-CH', label: 'G5持有者的子女 (G5)' },
                        { value: 'G5-EM', label: 'G1、G2、G3或G4持有者的个人雇员 (G5)' },
                        { value: 'G5-SP', label: 'G5持有者的配偶 (G5)' }
                      ];
                    case 'H':
                      return [
                        { value: 'H1B-H1B', label: '特殊职业 (H1B)' },
                        { value: 'H1B1-CHL', label: '智利特殊职业 (H1B1)' },
                        { value: 'H1B1-SGP', label: '新加坡特殊职业 (H1B1)' },
                        { value: 'H1C-NR', label: '短缺地区护士 (H1C)' },
                        { value: 'H2A-AG', label: '农业工人 (H2A)' },
                        { value: 'H2B-NA', label: '非农业工人 (H2B)' },
                        { value: 'H3-TR', label: '实习生 (H3)' },
                        { value: 'H4-CH', label: 'H签证持有者的子女 (H4)' },
                        { value: 'H4-SP', label: 'H签证持有者的配偶 (H4)' }
                      ];
                    case 'I':
                      return [
                        { value: 'I-CH', label: 'I签证持有者的子女 (I)' },
                        { value: 'I-FR', label: '外国媒体代表 (I)' },
                        { value: 'I-SP', label: 'I签证持有者的配偶 (I)' }
                      ];
                    case 'J':
                      return [
                        { value: 'J1-J1', label: '交流访问者 (J1)' },
                        { value: 'J2-CH', label: 'J1持有者的子女 (J2)' },
                        { value: 'J2-SP', label: 'J1持有者的配偶 (J2)' }
                      ];
                    case 'K':
                      return [
                        { value: 'K1-K1', label: '美国公民的未婚夫(妻) (K1)' },
                        { value: 'K2-K2', label: 'K1持有者的子女 (K2)' },
                        { value: 'K3-K3', label: '美国公民的配偶 (K3)' },
                        { value: 'K4-K4', label: 'K3持有者的子女 (K4)' }
                      ];
                    case 'L':
                      return [
                        { value: 'L1-L1', label: '公司内部调动人员 (L1)' },
                        { value: 'L2-CH', label: 'L1持有者的子女 (L2)' },
                        { value: 'L2-SP', label: 'L1持有者的配偶 (L2)' }
                      ];
                    case 'M':
                      return [
                        { value: 'M1-M1', label: '学生 (M1)' },
                        { value: 'M2-CH', label: 'M1持有者的子女 (M2)' },
                        { value: 'M2-SP', label: 'M1持有者的配偶 (M2)' },
                        { value: 'M3-M3', label: '通勤学生 (M3)' }
                      ];
                    case 'N':
                      return [
                        { value: 'N8-N8', label: '特殊移民的父母 (N8)' },
                        { value: 'N8-CH', label: 'N8持有者的子女 (N9)' }
                      ];
                    case 'NATO':
                      return [
                        { value: 'NATO1-PR', label: '首席代表 (NATO1)' },
                        { value: 'NATO1-SP', label: 'NATO1持有者的配偶 (NATO1)' },
                        { value: 'NATO1-CH', label: 'NATO1持有者的子女 (NATO1)' },
                        { value: 'NATO2-RP', label: '代表 (NATO2)' },
                        { value: 'NATO2-SP', label: 'NATO2持有者的配偶 (NATO2)' },
                        { value: 'NATO2-CH', label: 'NATO2持有者的子女 (NATO2)' },
                        { value: 'NATO3-ST', label: '文职人员 (NATO3)' },
                        { value: 'NATO3-SP', label: 'NATO3持有者的配偶 (NATO3)' },
                        { value: 'NATO3-CH', label: 'NATO3持有者的子女 (NATO3)' },
                        { value: 'NATO4-OF', label: '官员 (NATO4)' },
                        { value: 'NATO4-SP', label: 'NATO4持有者的配偶 (NATO4)' },
                        { value: 'NATO4-CH', label: 'NATO4持有者的子女 (NATO4)' },
                        { value: 'NATO5-EX', label: '专家 (NATO5)' },
                        { value: 'NATO5-SP', label: 'NATO5持有者的配偶 (NATO5)' },
                        { value: 'NATO5-CH', label: 'NATO5持有者的子女 (NATO5)' },
                        { value: 'NATO6-ST', label: '平民工作人员 (NATO6)' },
                        { value: 'NATO6-SP', label: 'NATO6持有者的配偶 (NATO6)' },
                        { value: 'NATO6-CH', label: 'NATO6持有者的子女 (NATO6)' },
                        { value: 'NATO7-EM', label: 'NATO1-NATO6雇佣的个人员工 (NATO7)' },
                        { value: 'NATO7-SP', label: 'NATO7持有者的配偶 (NATO7)' },
                        { value: 'NATO7-CH', label: 'NATO7持有者的子女 (NATO7)' }
                      ];
                    case 'O': 
                      return [
                        { value: 'O1-EX', label: '杰出能力者 (O1)' },
                        { value: 'O2-AL', label: '随行/协助人员 (O2)' },
                        { value: 'O3-SP', label: 'O1或O2持有者的配偶 (O3)' },
                        { value: 'O3-CH', label: 'O1或O2持有者的子女 (O3)' }
                      ];
                    case 'P':
                      return [
                        { value: 'P1-P1', label: '国际公认人员 (P1)' },
                        { value: 'P2-P2', label: '艺术家/艺人交流项目 (P2)' },
                        { value: 'P3-P3', label: '文化项目中的艺术家/艺人 (P3)' },
                        { value: 'P4-SP', label: 'P1、P2或P3持有者的配偶 (P4)' },
                        { value: 'P4-CH', label: 'P1、P2或P3持有者的子女 (P4)' }
                      ];
                    case 'Q':
                      return [
                        { value: 'Q1-Q1', label: '文化交流访问者 (Q1)' }
                      ];
                    case 'R':
                      return [
                        { value: 'R1-R1', label: '宗教工作者 (R1)' },
                        { value: 'R2-R2', label: '宗教工作者的配偶 (R2)' },
                        { value: 'R3-R3', label: '宗教工作者的子女 (R3)' }
                      ];
                    case 'S':
                      return [
                        { value: 'S7-S7', label: '线人的家庭成员 (S7)' }
                      ];
                    case 'T':
                      return [
                        { value: 'T1-T1', label: '人口贩卖受害者 (T1)' },
                        { value: 'T2-SP', label: 'T1持有者的配偶 (T2)' },
                        { value: 'T3-CH', label: 'T1持有者的子女 (T3)' },
                        { value: 'T4-PR', label: 'T1持有者的父母 (T4)' },
                        { value: 'T5-SB', label: 'T1持有者的兄弟姐妹 (T5)' },
                        { value: 'T6-CB', label: 'T1派生受益人的成年/未成年子女 (T6)' }
                      ];
                    case 'TD/TN':
                      return [
                        { value: 'TD-SP', label: 'TN持有者的配偶 (TD)' },
                        { value: 'TD-CH', label: 'TN持有者的子女 (TD)' }
                      ];
                    case 'U':
                      return [
                        { value: 'U1-U1', label: '犯罪受害者 (U1)' },
                        { value: 'U2-SP', label: 'U1持有者的配偶 (U2)' },
                        { value: 'U3-CH', label: 'U1持有者的子女 (U3)' },
                        { value: 'U4-PR', label: 'U1持有者的父母 (U4)' },
                        { value: 'U5-SB', label: 'U1持有者的兄弟姐妹 (U5)' }
                      ];
                    case 'PAROLE-BEN':
                      return [
                        { value: 'PRL-PARCIS', label: 'PARCIS (USCIS批准的临时入境许可)' }
                      ];
                    default:
                      return [{ value: 'OTHER', label: '其他' }];
                  }
                };

                return (
                  <div className="field full" style={{ paddingBottom: '0%' }}>
                    <QuestionItem
                      question="具体说明"
                      name="specificPurpose"
                    >
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%' }}
                        onChange={(value) => {

                          form.setFieldsValue({ selectedPurpose: value });

                          if (!isDependentSelection(value)) {
                            form.setFieldsValue({
                              principalApplicantSurname: undefined,
                              principalApplicantGivenName: undefined
                            });
                          }
                          form.validateFields(['principalApplicantSurname', 'principalApplicantGivenName']);
                        }}
                      >
                        {getSpecificOptions().map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </QuestionItem>
                  </div>
                );
              }}
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.specificPurpose !== currentValues.specificPurpose
              }
            >
              {({ getFieldValue }) => {
                const specificPurpose = getFieldValue('specificPurpose');
                
                // If no specific purpose is selected, don't show any conditional sections
                if (!specificPurpose) {
                  return null;
                }
                
                // For all A visa types EXCEPT 'A1-AM', 'A1-DP', 'A2-EM', and 'A3-EM', show principal section
                if (specificPurpose && (
                  specificPurpose === 'A1-CH' || 
                  specificPurpose === 'A1-SP' || 
                  specificPurpose === 'A2-CH' || 
                  specificPurpose === 'A2-SP' || 
                  specificPurpose === 'A3-CH' || 
                  specificPurpose === 'A3-SP' || 
                  specificPurpose === 'C3-CH' || 
                  specificPurpose === 'C3-SP')) {
                return (
                  <div>
                    <h4>
                      <span>主申请人信息</span>
                    </h4>
                    <div className="principal-applicant-section" style={blockInsideHighlightStyle}>
                      <QuestionItem
                        question="主申请人姓氏"
                        name="principalApplicantSurname"
                        explanation="请输入持有签证的主申请人的姓氏（与护照一致）"
                      >
                        <Input style={{ width: '98%' }} placeholder="请输入主申请人姓氏" />
                      </QuestionItem>
                      
                      <QuestionItem
                        question="主申请人名字"
                        name="principalApplicantGivenName"
                        explanation="请输入持有签证的主申请人的名字（与护照一致）"
                      >
                        <Input style={{ width: '98%' }} placeholder="请输入主申请人名字" />
                      </QuestionItem>
                    </div>
                  </div>
                );
                }

                return null;
              }}
            </Form.Item>

            <Row>
              <Col span={24}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <Button type="link" style={{ marginRight: '8px' }}>增加另一个</Button>
                  <Button type="link" danger>移除</Button>
                </div>
              </Col>
            </Row>
          </div>

          <br/>
          <Divider />
            
          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="您是否已经制定了具体的旅行计划？"
                name="hasSpecificPlans"
                explanation="如果您已确定行程，请选择'是'；如果尚未确定，请选择'否'并提供预计的信息。"
              >
                <Radio.Group onChange={(e) => {
                  // 当选项改变时，通过表单实例更新字段值
                  form.setFieldsValue({ hasSpecificPlans: e.target.value });
                }}>
                  <Radio value="Y">是</Radio>
                  <Radio value="N">否</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.hasSpecificPlans !== currentValues.hasSpecificPlans
            }
          >
            {({ getFieldValue }) => {
            const hasSpecificPlans = getFieldValue('hasSpecificPlans');
              
              // 如果没有选择是否有具体旅行计划，不显示任何后续问题
              if (!hasSpecificPlans) {
                return null;
              }
              
              if (hasSpecificPlans === 'Y') {
                return (
                  <div className="field-groups" style={{ marginBottom: '15px' }}>
                    <h4>
                      <span>请提供您来美国的旅行的详细行程</span>
                    </h4>

                    <div className="field-group callout" style={highlightedBlockStyle}>
                      <div style={blockInsideHighlightStyle}>
                        <QuestionItem
                          question="入境美国日期"
                          name="arrivalUSDate"
                          explanation="请输入您计划入境美国的日期"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Form.Item 
                              name="arrivalDay" 
                              noStyle
                              rules={[{ required: true, message: '请选择日期' }]}
                            >
                              <Select style={{ width: '60px' }} placeholder="">
                                <Select.Option value="">  </Select.Option>
                                {Array.from({ length: 31 }, (_, i) => {
                                  const day = (i + 1).toString().padStart(2, '0');
                                  return <Select.Option key={day} value={day}>{day}</Select.Option>;
                                })}
                              </Select>
                            </Form.Item>

                            <Form.Item 
                              name="arrivalMonth" 
                              noStyle
                              rules={[{ required: true, message: '请选择月份' }]}
                            >
                              <Select style={{ width: '70px' }} placeholder="">
                                <Select.Option value="">  </Select.Option>
                                <Select.Option value="JAN">一月</Select.Option>
                                <Select.Option value="FEB">二月</Select.Option>
                                <Select.Option value="MAR">三月</Select.Option>
                                <Select.Option value="APR">四月</Select.Option>
                                <Select.Option value="MAY">五月</Select.Option>
                                <Select.Option value="JUN">六月</Select.Option>
                                <Select.Option value="JUL">七月</Select.Option>
                                <Select.Option value="AUG">八月</Select.Option>
                                <Select.Option value="SEP">九月</Select.Option>
                                <Select.Option value="OCT">十月</Select.Option>
                                <Select.Option value="NOV">十一月</Select.Option>
                                <Select.Option value="DEC">十二月</Select.Option>
                              </Select>
                            </Form.Item>

                            <Form.Item 
                              name="arrivalYear" 
                              noStyle
                              rules={[
                                { required: true, message: '请输入年份' },
                                { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                              ]}
                            >
                              <Input placeholder="" style={{ width: '60px' }} maxLength={4} />
                            </Form.Item>

                            <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                              (格式: DD-MMM-YYYY)
                            </div>
                          </div>
                        </QuestionItem>

                        <QuestionItem
                          question="抵达航班"
                          name="arrivalFlight"
                          explanation="请输入您的抵达航班号（如果知道）"
                          required={false}
                        >
                          <Input style={{ width: '98%' }} maxLength={20} />
                        </QuestionItem>

                        <QuestionItem
                          question="抵达城市"
                          name="arrivalCity"
                          explanation="请输入您入境的美国城市"
                        >
                          <Input style={{ width: '98%' }} maxLength={20} />
                        </QuestionItem>

                        <div style={{ margin: '15px 0', borderTop: '1px solid #e8e8e8' }}></div>

                        <QuestionItem
                          question="离开美国日期"
                          name="departureUSDate"
                          explanation="请输入您计划离开美国的日期"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Form.Item 
                              name="departureDay" 
                              noStyle
                              rules={[{ required: true, message: '请选择日期' }]}
                            >
                              <Select style={{ width: '60px' }} placeholder="">
                                <Select.Option value="">  </Select.Option>
                                {Array.from({ length: 31 }, (_, i) => {
                                  const day = (i + 1).toString().padStart(2, '0');
                                  return <Select.Option key={day} value={day}>{day}</Select.Option>;
                                })}
                              </Select>
                            </Form.Item>

                            <Form.Item 
                              name="departureMonth" 
                              noStyle
                              rules={[{ required: true, message: '请选择月份' }]}
                            >
                              <Select style={{ width: '70px' }} placeholder="">
                                <Select.Option value="">  </Select.Option>
                                <Select.Option value="JAN">一月</Select.Option>
                                <Select.Option value="FEB">二月</Select.Option>
                                <Select.Option value="MAR">三月</Select.Option>
                                <Select.Option value="APR">四月</Select.Option>
                                <Select.Option value="MAY">五月</Select.Option>
                                <Select.Option value="JUN">六月</Select.Option>
                                <Select.Option value="JUL">七月</Select.Option>
                                <Select.Option value="AUG">八月</Select.Option>
                                <Select.Option value="SEP">九月</Select.Option>
                                <Select.Option value="OCT">十月</Select.Option>
                                <Select.Option value="NOV">十一月</Select.Option>
                                <Select.Option value="DEC">十二月</Select.Option>
                              </Select>
                            </Form.Item>

                            <Form.Item 
                              name="departureYear" 
                              noStyle
                              rules={[
                                { required: true, message: '请输入年份' },
                                { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                              ]}
                            >
                              <Input placeholder="" style={{ width: '60px' }} maxLength={4} />
                            </Form.Item>

                            <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                              (格式: DD-MMM-YYYY)
                            </div>
                          </div>
                        </QuestionItem>

                        <QuestionItem
                          question="离开航班"
                          name="departureFlight"
                          explanation="请输入您的离开航班号（如果知道）"
                          required={false}
                        >
                          <Input style={{ width: '98%' }} maxLength={20} />
                        </QuestionItem>

                        <QuestionItem
                          question="离开城市"
                          name="departureCity"
                          explanation="请输入您离开美国的城市"
                        >
                          <Input style={{ width: '98%' }} maxLength={20} />
                        </QuestionItem>

                      </div>
                      <div style={blockInsideHighlightStyle}>
                        {/* Use Form.List to manage multiple location question groups */}
                        <Form.List name="locationQuestionGroups" initialValue={[0]}>
                          {(questionGroups, { add: addQuestionGroup, remove: removeQuestionGroup }) => (
                            <>
                              {questionGroups.map((questionGroup, questionGroupIndex) => (
                                <div 
                                  key={questionGroup.key} 
                                  style={{ 
                                    marginBottom: 24, 
                                    padding: questionGroupIndex > 0 ? 16 : 0, 
                                    border: questionGroupIndex > 0 ? '1px dashed #d6e8fa' : 'none',
                                    borderRadius: questionGroupIndex > 0 ? '8px' : 0
                                  }}
                                >
                                  <QuestionItem
                                    question="您计划在美国访问的地点"
                                    name={`locationsToVisit_${questionGroupIndex}`}
                                    explanation="请提供您计划在美国访问的地点"
                                  >
                                    <Form.List name={['locationGroups', questionGroupIndex, 'visitLocations']} initialValue={[{}]}>
                                      {(fields, { add, remove }) => (
                                        <>
                                          {fields.map(({ key, name }) => (
                                            <div key={key} style={{ marginBottom: 16 }}>
                                              <Form.Item
                                                name={[name, 'location']}
                                                rules={[{ required: true, message: '请输入访问地点' }]}
                                                style={{ marginBottom: 0 }}
                                              >
                                                <Input placeholder="请输入访问地点" maxLength={40} style={{ width: '98%' }} />
                                              </Form.Item>

                                              <Row>
                                                <Col span={24}>
                                                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                                    <Button type="link" onClick={() => add()} style={{ marginRight: '8px' }}>增加地点</Button>
                                                    <Button 
                                                      type="link" 
                                                      danger 
                                                      onClick={() => {
                                                        // Only remove if there's more than one location
                                                        if (fields.length > 1) {
                                                          remove(name);
                                                        }
                                                      }}
                                                    >
                                                      移除地点
                                                    </Button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </div>
                                          ))}
                                        </>
                                      )}
                                    </Form.List>
                                  </QuestionItem>
                                  
                                  {/* Main "增加另一个" button with remove button always visible */}
                                  <Row>
                                    <Col span={24}>
                                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                        <Button type="link" onClick={() => addQuestionGroup()} style={{ marginRight: '8px' }}>增加另一个</Button>
                                        <Button 
                                          type="link" 
                                          danger 
                                          onClick={() => {
                                            // Only remove if there's more than one question group
                                            if (questionGroups.length > 1) {
                                              removeQuestionGroup(questionGroupIndex);
                                            }
                                          }}
                                        >
                                          移除
                                        </Button>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                            </>
                          )}
                        </Form.List>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <>
                    <QuestionItem
                      question="计划到达日期"
                      name="intendedDateOfArrival"
                      explanation="请提供您计划入境美国的日期。如果您还不确定，请提供一个预计日期。"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Form.Item 
                        name="arrivalDay" 
                        noStyle
                        rules={[{ required: true, message: '请选择日期' }]}
                      >
                        <Select style={{ width: '60px' }} placeholder="">
                          <Select.Option value="">  </Select.Option>
                          {Array.from({ length: 31 }, (_, i) => {
                            const day = (i + 1).toString().padStart(2, '0');
                            return <Select.Option key={day} value={day}>{day}</Select.Option>;
                          })}
                        </Select>
                      </Form.Item>

                      <Form.Item 
                        name="arrivalMonth" 
                        noStyle
                        rules={[{ required: true, message: '请选择月份' }]}
                      >
                        <Select style={{ width: '70px' }} placeholder="">
                          <Select.Option value="">  </Select.Option>
                          <Select.Option value="JAN">一月</Select.Option>
                          <Select.Option value="FEB">二月</Select.Option>
                          <Select.Option value="MAR">三月</Select.Option>
                          <Select.Option value="APR">四月</Select.Option>
                          <Select.Option value="MAY">五月</Select.Option>
                          <Select.Option value="JUN">六月</Select.Option>
                          <Select.Option value="JUL">七月</Select.Option>
                          <Select.Option value="AUG">八月</Select.Option>
                          <Select.Option value="SEP">九月</Select.Option>
                          <Select.Option value="OCT">十月</Select.Option>
                          <Select.Option value="NOV">十一月</Select.Option>
                          <Select.Option value="DEC">十二月</Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item 
                        name="arrivalYear" 
                        noStyle
                        rules={[
                          { required: true, message: '请输入年份' },
                          { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                        ]}
                      >
                        <Input placeholder="" style={{ width: '60px' }} maxLength={4} />
                      </Form.Item>

                      <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                        (格式: DD-MMM-YYYY)
                      </div>
                    </div>
                    </QuestionItem> 

                    <QuestionItem
                      question="计划在美停留时间"
                      name="intendedLengthOfStay"
                      explanation="请输入您计划在美国停留的时间长度和单位。"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Form.Item 
                          name="stayDuration" 
                          noStyle
                          rules={[{ required: true, message: '请输入停留时间' }]}
                        >
                          <Input style={{ width: '80px' }} maxLength={3} placeholder="数量" />
                        </Form.Item>
                        
                        <Form.Item 
                          name="stayDurationType" 
                          noStyle
                          rules={[{ required: true, message: '请选择单位' }]}
                        >
                          <Select style={{ width: '120px' }} placeholder="单位">
                            <Select.Option value="Y">年</Select.Option>
                            <Select.Option value="M">月</Select.Option>
                            <Select.Option value="W">周</Select.Option>
                            <Select.Option value="D">天</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </QuestionItem>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => 
                          prevValues.stayDurationType !== currentValues.stayDurationType
                        }
                      >
                        {({ getFieldValue }) => {
                          const durationType = getFieldValue('stayDurationType');
                          
                          if (!durationType) {
                            return null;
                          }
                          
                          return (
                            <QuestionItem
                              question="在美住址"
                              name="addressWhereYouWillStay"
                              explanation="请提供您在美国期间的详细住址，如酒店名称和地址、朋友或亲戚的住址等。"
                            >
                              <div className="field-group" style={highlightedBlockStyle}>
                                <div className="field full">
                                  <label>街道地址 (第1行)</label>
                                  <Form.Item 
                                    name="streetAddress1" 
                                    noStyle
                                    rules={[{ required: true, message: '请输入街道地址' }]}
                                  >
                                    <Input style={{ width: '98%' }} maxLength={40} />
                                  </Form.Item>
                                </div>
                                
                                <div className="field full">
                                  <label>街道地址 (第2行)</label>
                                  <span style={{ color: '#891300', fontStyle: 'italic', marginLeft: '8px' }}>*可选</span>
                                  <Form.Item 
                                    name="streetAddress2" 
                                    noStyle
                                  >
                                    <Input style={{ width: '98%' }} maxLength={40} />
                                  </Form.Item>
                                </div>
                                
                                <div className="field full">
                                  <label>城市</label>
                                  <Form.Item 
                                    name="city" 
                                    noStyle
                                    rules={[{ required: true, message: '请输入城市' }]}
                                  >
                                    <Input style={{ width: '98%' }} maxLength={20} />
                                  </Form.Item>
                                </div>
                                
                                <div className="field full">
                                  <label>州</label>
                                  <Form.Item 
                                    name="state" 
                                    noStyle
                                    rules={[{ required: true, message: '请选择州' }]}
                                  >
                                    <Select style={{ width: '98%' }} placeholder="- 请选择 -">
                                      <Select.Option value="AL">ALABAMA</Select.Option>
                                      <Select.Option value="AK">ALASKA</Select.Option>
                                      <Select.Option value="AS">AMERICAN SAMOA</Select.Option>
                                      <Select.Option value="AZ">ARIZONA</Select.Option>
                                      <Select.Option value="AR">ARKANSAS</Select.Option>
                                      <Select.Option value="CA">CALIFORNIA</Select.Option>
                                      <Select.Option value="CO">COLORADO</Select.Option>
                                      <Select.Option value="CT">CONNECTICUT</Select.Option>
                                      <Select.Option value="DE">DELAWARE</Select.Option>
                                      <Select.Option value="DC">DISTRICT OF COLUMBIA</Select.Option>
                                      <Select.Option value="FL">FLORIDA</Select.Option>
                                      <Select.Option value="GA">GEORGIA</Select.Option>
                                      <Select.Option value="GU">GUAM</Select.Option>
                                      <Select.Option value="HI">HAWAII</Select.Option>
                                      <Select.Option value="ID">IDAHO</Select.Option>
                                      <Select.Option value="IL">ILLINOIS</Select.Option>
                                      <Select.Option value="IN">INDIANA</Select.Option>
                                      <Select.Option value="IA">IOWA</Select.Option>
                                      <Select.Option value="KS">KANSAS</Select.Option>
                                      <Select.Option value="KY">KENTUCKY</Select.Option>
                                      <Select.Option value="LA">LOUISIANA</Select.Option>
                                      <Select.Option value="ME">MAINE</Select.Option>
                                      <Select.Option value="MD">MARYLAND</Select.Option>
                                      <Select.Option value="MA">MASSACHUSETTS</Select.Option>
                                      <Select.Option value="MI">MICHIGAN</Select.Option>
                                      <Select.Option value="MN">MINNESOTA</Select.Option>
                                      <Select.Option value="MS">MISSISSIPPI</Select.Option>
                                      <Select.Option value="MO">MISSOURI</Select.Option>
                                      <Select.Option value="MT">MONTANA</Select.Option>
                                      <Select.Option value="NE">NEBRASKA</Select.Option>
                                      <Select.Option value="NV">NEVADA</Select.Option>
                                      <Select.Option value="NH">NEW HAMPSHIRE</Select.Option>
                                      <Select.Option value="NJ">NEW JERSEY</Select.Option>
                                      <Select.Option value="NM">NEW MEXICO</Select.Option>
                                      <Select.Option value="NY">NEW YORK</Select.Option>
                                      <Select.Option value="NC">NORTH CAROLINA</Select.Option>
                                      <Select.Option value="ND">NORTH DAKOTA</Select.Option>
                                      <Select.Option value="MP">NORTHERN MARIANA ISLANDS</Select.Option>
                                      <Select.Option value="OH">OHIO</Select.Option>
                                      <Select.Option value="OK">OKLAHOMA</Select.Option>
                                      <Select.Option value="OR">OREGON</Select.Option>
                                      <Select.Option value="PA">PENNSYLVANIA</Select.Option>
                                      <Select.Option value="PR">PUERTO RICO</Select.Option>
                                      <Select.Option value="RI">RHODE ISLAND</Select.Option>
                                      <Select.Option value="SC">SOUTH CAROLINA</Select.Option>
                                      <Select.Option value="SD">SOUTH DAKOTA</Select.Option>
                                      <Select.Option value="TN">TENNESSEE</Select.Option>
                                      <Select.Option value="TX">TEXAS</Select.Option>
                                      <Select.Option value="UT">UTAH</Select.Option>
                                      <Select.Option value="VT">VERMONT</Select.Option>
                                      <Select.Option value="VI">VIRGIN ISLANDS</Select.Option>
                                      <Select.Option value="VA">VIRGINIA</Select.Option>
                                      <Select.Option value="WA">WASHINGTON</Select.Option>
                                      <Select.Option value="WV">WEST VIRGINIA</Select.Option>
                                      <Select.Option value="WI">WISCONSIN</Select.Option>
                                      <Select.Option value="WY">WYOMING</Select.Option>
                                    </Select>
                                  </Form.Item>
                                </div>
                                
                                <div className="field full">
                                  <label>邮政编码</label>
                                  <span style={{ marginLeft: '4px' }}>(如果知道)</span>
                                  <Form.Item 
                                    name="zipCode" 
                                    noStyle
                                  >
                                    <Input style={{ width: '70%' }} maxLength={10} />
                                  </Form.Item>
                                  <div className="hint">
                                    <span>(例如: 12345 或 12345-1234)</span>
                                  </div>
                                </div>
                              </div>
                            </QuestionItem>
                          );
                        }}
                    </Form.Item>
                  </>
                );
              }
            }
          }
          </Form.Item>
                
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.specificPurpose !== currentValues.specificPurpose
            }
          >
            {({ getFieldValue }) => {
              const specificPurpose = getFieldValue('specificPurpose');
              
              // Only show diplomatic section for the specific four A-type visas
              if (specificPurpose && 
                  (specificPurpose === 'A1-AM' || 
                  specificPurpose === 'A1-DP' || 
                  specificPurpose === 'A2-EM' || 
                  specificPurpose === 'A3-EM')) {
                
                return (
                  <div className="field-groups" style={{ marginBottom: '15px' }}>
                    <h4>
                      <span>使团/组织信息</span>
                    </h4>

                    <div className="field-group callout" style={highlightedBlockStyle}>     
                      <QuestionItem
                        question="赞助使团/组织"
                        name="sponsoringMission"
                      >
                        <Input placeholder="请输入赞助使团/组织名称" maxLength={40} />
                      </QuestionItem>

                      <QuestionItem
                        question="联络人姓氏"
                        name="contactSurname"
                      >
                        <Input placeholder="请输入联络人姓氏" maxLength={33} />
                      </QuestionItem>

                      <QuestionItem
                        question="联络人名字"
                        name="contactGivenName"
                      >
                        <Input placeholder="请输入联络人名字" maxLength={33} />
                      </QuestionItem>

                      <QuestionItem
                        question="美国地址（第一行）"
                        name="missionAddressLine1"
                      >
                        <Input placeholder="请输入地址第一行" maxLength={40} />
                      </QuestionItem>

                      <QuestionItem
                        question="美国地址（第二行）"
                        name="missionAddressLine2"
                        required={false}
                      >
                        <Input placeholder="请输入地址第二行（可选）" maxLength={40} />
                      </QuestionItem>

                      <QuestionItem
                        question="城市"
                        name="missionCity"
                      >
                        <Input placeholder="请输入城市名称" maxLength={20} />
                      </QuestionItem>

                      <QuestionItem
                        question="州"
                        name="missionState"
                      >
                        <Select placeholder="- 请选择一个 -">
                          <Select.Option value="AL">阿拉巴马</Select.Option>
                          <Select.Option value="AK">阿拉斯加</Select.Option>
                          <Select.Option value="AS">美属萨摩亚</Select.Option>
                          <Select.Option value="AZ">亚利桑那</Select.Option>
                          <Select.Option value="AR">阿肯色</Select.Option>
                          <Select.Option value="CA">加利福尼亚</Select.Option>
                          <Select.Option value="CO">科罗拉多</Select.Option>
                          <Select.Option value="CT">康涅狄格</Select.Option>
                          <Select.Option value="DE">特拉华</Select.Option>
                          <Select.Option value="DC">哥伦比亚特区</Select.Option>
                          <Select.Option value="FL">佛罗里达</Select.Option>
                          <Select.Option value="GA">乔治亚</Select.Option>
                          <Select.Option value="GU">关岛</Select.Option>
                          <Select.Option value="HI">夏威夷</Select.Option>
                          <Select.Option value="ID">爱达荷</Select.Option>
                          <Select.Option value="IL">伊利诺伊</Select.Option>
                          <Select.Option value="IN">印第安纳</Select.Option>
                          <Select.Option value="IA">爱荷华</Select.Option>
                          <Select.Option value="KS">堪萨斯</Select.Option>
                          <Select.Option value="KY">肯塔基</Select.Option>
                          <Select.Option value="LA">路易斯安那</Select.Option>
                          <Select.Option value="ME">缅因</Select.Option>
                          <Select.Option value="MD">马里兰</Select.Option>
                          <Select.Option value="MA">马萨诸塞</Select.Option>
                          <Select.Option value="MI">密歇根</Select.Option>
                          <Select.Option value="MN">明尼苏达</Select.Option>
                          <Select.Option value="MS">密西西比</Select.Option>
                          <Select.Option value="MO">密苏里</Select.Option>
                          <Select.Option value="MT">蒙大拿</Select.Option>
                          <Select.Option value="NE">内布拉斯加</Select.Option>
                          <Select.Option value="NV">内华达</Select.Option>
                          <Select.Option value="NH">新罕布什尔</Select.Option>
                          <Select.Option value="NJ">新泽西</Select.Option>
                          <Select.Option value="NM">新墨西哥</Select.Option>
                          <Select.Option value="NY">纽约</Select.Option>
                          <Select.Option value="NC">北卡罗来纳</Select.Option>
                          <Select.Option value="ND">北达科他</Select.Option>
                          <Select.Option value="MP">北马里亚纳群岛</Select.Option>
                          <Select.Option value="OH">俄亥俄</Select.Option>
                          <Select.Option value="OK">俄克拉荷马</Select.Option>
                          <Select.Option value="OR">俄勒冈</Select.Option>
                          <Select.Option value="PA">宾夕法尼亚</Select.Option>
                          <Select.Option value="PR">波多黎各</Select.Option>
                          <Select.Option value="RI">罗德岛</Select.Option>
                          <Select.Option value="SC">南卡罗来纳</Select.Option>
                          <Select.Option value="SD">南达科他</Select.Option>
                          <Select.Option value="TN">田纳西</Select.Option>
                          <Select.Option value="TX">德克萨斯</Select.Option>
                          <Select.Option value="UT">犹他</Select.Option>
                          <Select.Option value="VT">佛蒙特</Select.Option>
                          <Select.Option value="VI">美属维尔京群岛</Select.Option>
                          <Select.Option value="VA">弗吉尼亚</Select.Option>
                          <Select.Option value="WA">华盛顿</Select.Option>
                          <Select.Option value="WV">西弗吉尼亚</Select.Option>
                          <Select.Option value="WI">威斯康星</Select.Option>
                          <Select.Option value="WY">怀俄明</Select.Option>
                        </Select>
                      </QuestionItem>

                      <QuestionItem
                        question="邮政编码"
                        name="missionZipCode"
                      >
                        <Input placeholder="例如：12345 或 12345-1234" maxLength={10} />
                      </QuestionItem>

                      <QuestionItem
                        question="电话号码"
                        name="missionPhoneNumber"
                      >
                        <Input placeholder="例如：5555555555" maxLength={15} />
                      </QuestionItem>
                    </div>
                  </div>
                );
              }
              
              return null;
            }}
          </Form.Item>

          <Divider />

          <QuestionItem
            question="支付您旅行费用的个人或组织"
            name="whoIsPaying"
            explanation="请选择谁将支付您此次旅行的费用"
          >
            <Select placeholder="- 请选择一个 -">
              <Select.Option value="S">本人</Select.Option>
              <Select.Option value="H">美国申请人</Select.Option>
              <Select.Option value="O">其他个人</Select.Option>
              <Select.Option value="P">当前雇主</Select.Option>
              <Select.Option value="U">美国雇主</Select.Option>
              <Select.Option value="C">其他公司/组织</Select.Option>
            </Select>
          </QuestionItem>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.whoIsPaying !== currentValues.whoIsPaying
            }
          >
            {({ getFieldValue }) => {
              const whoIsPaying = getFieldValue('whoIsPaying');
              
              // 如果选择了"其他个人" (O)
              if (whoIsPaying === 'O') {
                return (
                  <div className="field-groups">
                    <h4>
                      <span>提供以下信息：</span>
                    </h4>
                    <div className="field-group callout" style={highlightedBlockStyle}>
                      <QuestionItem
                        question="付款人姓氏"
                        name="payerSurname"
                      >
                        <Input placeholder="例如：FERNANDEZ GARCIA" maxLength={33} />
                      </QuestionItem>

                      <QuestionItem
                        question="付款人名字"
                        name="payerGivenName"
                      >
                        <Input placeholder="例如：JUAN MIGUEL" maxLength={33} />
                      </QuestionItem>

                      <QuestionItem
                        question="电话号码"
                        name="payerPhone"
                      >
                        <Input placeholder="例如：5555555555" maxLength={15} minLength={5} />
                      </QuestionItem>

                      <QuestionItem
                        question="电子邮件地址"
                        name="payerEmail"
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Form.Item name="payerEmail" noStyle>
                            <Input 
                              placeholder="例如：emailaddress@example.com" 
                              maxLength={50} 
                              style={{ width: '60%' }} 
                            />
                          </Form.Item>
                          <Form.Item name="payerEmailNotApply" noStyle valuePropName="checked">
                            <Checkbox style={{ marginLeft: '10px' }}>不适用</Checkbox>
                          </Form.Item>
                        </div>
                      </QuestionItem>

                      <QuestionItem
                        question="与您的关系"
                        name="payerRelationship"
                      >
                        <Select placeholder="- 请选择一个 -">
                          <Select.Option value="C">子女</Select.Option>
                          <Select.Option value="P">父母</Select.Option>
                          <Select.Option value="S">配偶</Select.Option>
                          <Select.Option value="R">其他亲属</Select.Option>
                          <Select.Option value="F">朋友</Select.Option>
                          <Select.Option value="O">其他</Select.Option>
                        </Select>
                      </QuestionItem>

                      <QuestionItem
                        question="付款人的地址是否与您的家庭或邮寄地址相同？"
                        name="payerAddrSameAsInd"
                      >
                        <Radio.Group>
                          <Radio value="Y">是</Radio>
                          <Radio value="N">否</Radio>
                        </Radio.Group>
                      </QuestionItem>

                      {/* 嵌套Form.Item来处理地址是否相同的条件渲染 */}
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => 
                          prevValues.payerAddrSameAsInd !== currentValues.payerAddrSameAsInd
                        }
                      >
                        {({ getFieldValue }) => {
                          const sameAsHomeAddress = getFieldValue('payerAddrSameAsInd');
                          
                          if (sameAsHomeAddress === 'N') {
                            return (
                              <div id="payerAddress">
                                <h4>付款人地址</h4>
                                <div className="field-group callout" style={blockInsideHighlightStyle}>
                                  <QuestionItem
                                    question="街道地址 (第1行)"
                                    name="payerStreetAddress1"
                                  >
                                    <Input maxLength={40} />
                                  </QuestionItem>
                                
                                  <QuestionItem
                                    question="街道地址 (第2行)"
                                    name="payerStreetAddress2"
                                    required={false}
                                  >
                                    <Input maxLength={40} />
                                    <span style={{ color: '#891300', fontStyle: 'italic', marginLeft: '8px' }}>*可选</span>
                                  </QuestionItem>

                                  <QuestionItem
                                    question="城市"
                                    name="payerCity"
                                  >
                                    <Input maxLength={20} />
                                  </QuestionItem>

                                  <QuestionItem
                                    question="州/省"
                                    name="payerStateProvince"
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <Form.Item name="payerStateProvince" noStyle>
                                        <Input maxLength={20} style={{ width: '55%' }} />
                                      </Form.Item>
                                      <Form.Item name="payerStateProvinceNotApply" noStyle valuePropName="checked">
                                        <Checkbox style={{ marginLeft: '10px' }}>不适用</Checkbox>
                                      </Form.Item>
                                    </div>
                                  </QuestionItem>

                                  <QuestionItem
                                    question="邮政编码"
                                    name="payerPostalZIPCode"
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <Form.Item name="payerPostalZIPCode" noStyle>
                                        <Input maxLength={10} style={{ width: '45%' }} />
                                      </Form.Item>
                                      <Form.Item name="payerPostalZIPCodeNotApply" noStyle valuePropName="checked">
                                        <Checkbox style={{ marginLeft: '10px' }}>不适用</Checkbox>
                                      </Form.Item>
                                    </div>
                                  </QuestionItem>

                                  <QuestionItem
                                    question="国家/地区"
                                    name="payerCountry"
                                  >
                                    <Select placeholder="- 请选择一个 -" style={{ width: '100%' }}>
                                      <Select.Option value="CHIN">中国</Select.Option>
                                      <Select.Option value="USA">美国</Select.Option>
                                      {/* 这里可以添加更多国家选项 */}
                                    </Select>
                                  </QuestionItem>
                                </div>
                              </div>
                            );
                          }
                          
                          return null;
                        }}
                      </Form.Item>
                    </div>
                  </div>
                );
              }
              
              // 如果选择了"其他公司/组织" (C)
              if (whoIsPaying === 'C') {
                return (
                  <div className="field-groups">
                    <h4>
                      <span>提供以下信息：</span>
                    </h4>
                    <div className="field-group callout" style={highlightedBlockStyle}>
                      <QuestionItem
                        question="支付旅行费用的公司/组织名称"
                        name="payingCompany"
                      >
                        <Input maxLength={33} />
                      </QuestionItem>
                      <QuestionItem
                        question="电话号码"
                        name="payerPhone"
                      >
                        <Input placeholder="例如：5555555555" maxLength={15} minLength={5} />
                      </QuestionItem>
                      <QuestionItem
                        question="与您的关系"
                        name="companyRelation"
                      >
                        <Input />
                      </QuestionItem>

                      <div id="payerCompanyAddress">
                        <h4>支付费用的公司/组织地址</h4>
                        <div className="field-group callout" style={blockInsideHighlightStyle}>
                          <QuestionItem
                            question="街道地址 (第1行)"
                            name="payerStreetAddress1"
                          >
                            <Input maxLength={40} />
                          </QuestionItem>

                          <QuestionItem
                            question="街道地址 (第2行)"
                            name="payerStreetAddress2"
                            required={false}
                          >
                            <Input maxLength={40} />
                            <span style={{ color: '#891300', fontStyle: 'italic', marginLeft: '8px' }}>*可选</span>
                          </QuestionItem>

                          <QuestionItem
                            question="城市"
                            name="payerCity"
                          >
                            <Input maxLength={20} />
                          </QuestionItem>

                          <QuestionItem
                            question="州/省"
                            name="payerStateProvince"
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Form.Item name="payerStateProvince" noStyle>
                                <Input maxLength={20} style={{ width: '55%' }} />
                              </Form.Item>
                              <Form.Item name="payerStateProvinceNotApply" noStyle valuePropName="checked">
                                <Checkbox style={{ marginLeft: '10px' }}>不适用</Checkbox>
                              </Form.Item>
                            </div>
                          </QuestionItem>

                          <QuestionItem
                            question="邮政编码"
                            name="payerPostalZIPCode"
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Form.Item name="payerPostalZIPCode" noStyle>
                                <Input maxLength={10} style={{ width: '45%' }} />
                              </Form.Item>
                              <Form.Item name="payerPostalZIPCodeNotApply" noStyle valuePropName="checked">
                                <Checkbox style={{ marginLeft: '10px' }}>不适用</Checkbox>
                              </Form.Item>
                            </div>
                          </QuestionItem>

                          <QuestionItem
                            question="国家/地区"
                            name="payerCountry"
                          >
                            <Select placeholder="- 选择一个 -">
                              <Select.Option value="AFGH">阿富汗</Select.Option>
                              <Select.Option value="ALB">阿尔巴尼亚</Select.Option>
                              <Select.Option value="ALGR">阿尔及利亚</Select.Option>
                              <Select.Option value="ASMO">美属萨摩亚</Select.Option>
                              <Select.Option value="ANDO">安道尔</Select.Option>
                              <Select.Option value="ANGL">安哥拉</Select.Option>
                              <Select.Option value="ANGU">安圭拉</Select.Option>
                              <Select.Option value="ANTI">安提瓜和巴布达</Select.Option>
                              <Select.Option value="ARG">阿根廷</Select.Option>
                              <Select.Option value="ARM">亚美尼亚</Select.Option>
                              <Select.Option value="ARB">阿鲁巴</Select.Option>
                              <Select.Option value="XAS">海上</Select.Option>
                              <Select.Option value="ASTL">澳大利亚</Select.Option>
                              <Select.Option value="AUST">奥地利</Select.Option>
                              <Select.Option value="AZR">阿塞拜疆</Select.Option>
                              <Select.Option value="BAMA">巴哈马</Select.Option>
                              <Select.Option value="BAHR">巴林</Select.Option>
                              <Select.Option value="BANG">孟加拉国</Select.Option>
                              <Select.Option value="BRDO">巴巴多斯</Select.Option>
                              <Select.Option value="BYS">白俄罗斯</Select.Option>
                              <Select.Option value="BELG">比利时</Select.Option>
                              <Select.Option value="BLZ">伯利兹</Select.Option>
                              <Select.Option value="BENN">贝宁</Select.Option>
                              <Select.Option value="BERM">百慕大</Select.Option>
                              <Select.Option value="BHU">不丹</Select.Option>
                              <Select.Option value="BOL">玻利维亚</Select.Option>
                              <Select.Option value="BIH">波斯尼亚和黑塞哥维那</Select.Option>
                              <Select.Option value="BOT">博茨瓦纳</Select.Option>
                              <Select.Option value="BRZL">巴西</Select.Option>
                              <Select.Option value="BRNI">文莱</Select.Option>
                              <Select.Option value="BULG">保加利亚</Select.Option>
                              <Select.Option value="BURK">布基纳法索</Select.Option>
                              <Select.Option value="BURM">缅甸</Select.Option>
                              <Select.Option value="BRND">布隆迪</Select.Option>
                              <Select.Option value="CBDA">柬埔寨</Select.Option>
                              <Select.Option value="CMRN">喀麦隆</Select.Option>
                              <Select.Option value="CAN">加拿大</Select.Option>
                              <Select.Option value="CAVI">佛得角</Select.Option>
                              <Select.Option value="CAYI">开曼群岛</Select.Option>
                              <Select.Option value="CAFR">中非共和国</Select.Option>
                              <Select.Option value="CHAD">乍得</Select.Option>
                              <Select.Option value="CHIL">智利</Select.Option>
                              <Select.Option value="CHIN">中国</Select.Option>
                              <Select.Option value="HNK">中国香港特别行政区</Select.Option>
                              <Select.Option value="MAC">中国澳门特别行政区</Select.Option>
                              <Select.Option value="TWAN">中国台湾</Select.Option>
                              <Select.Option value="COL">哥伦比亚</Select.Option>
                              <Select.Option value="COMO">科摩罗</Select.Option>
                              <Select.Option value="COD">刚果民主共和国</Select.Option>
                              <Select.Option value="CONB">刚果共和国</Select.Option>
                              <Select.Option value="CSTR">哥斯达黎加</Select.Option>
                              <Select.Option value="IVCO">科特迪瓦</Select.Option>
                              <Select.Option value="HRV">克罗地亚</Select.Option>
                              <Select.Option value="CUBA">古巴</Select.Option>
                              <Select.Option value="CUR">库拉索</Select.Option>
                              <Select.Option value="CYPR">塞浦路斯</Select.Option>
                              <Select.Option value="CZEC">捷克共和国</Select.Option>
                              <Select.Option value="DEN">丹麦</Select.Option>
                              <Select.Option value="DJI">吉布提</Select.Option>
                              <Select.Option value="DOMN">多米尼克</Select.Option>
                              <Select.Option value="DOMR">多米尼加共和国</Select.Option>
                              <Select.Option value="ECUA">厄瓜多尔</Select.Option>
                              <Select.Option value="EGYP">埃及</Select.Option>
                              <Select.Option value="ELSL">萨尔瓦多</Select.Option>
                              <Select.Option value="EGN">赤道几内亚</Select.Option>
                              <Select.Option value="ERI">厄立特里亚</Select.Option>
                              <Select.Option value="EST">爱沙尼亚</Select.Option>
                              <Select.Option value="SZLD">斯威士兰</Select.Option>
                              <Select.Option value="ETH">埃塞俄比亚</Select.Option>
                              <Select.Option value="FIJI">斐济</Select.Option>
                              <Select.Option value="FIN">芬兰</Select.Option>
                              <Select.Option value="FRAN">法国</Select.Option>
                              <Select.Option value="GABN">加蓬</Select.Option>
                              <Select.Option value="GAM">冈比亚</Select.Option>
                              <Select.Option value="GEO">格鲁吉亚</Select.Option>
                              <Select.Option value="GER">德国</Select.Option>
                              <Select.Option value="GHAN">加纳</Select.Option>
                              <Select.Option value="GRC">希腊</Select.Option>
                              <Select.Option value="GREN">格林纳达</Select.Option>
                              <Select.Option value="GUAT">危地马拉</Select.Option>
                              <Select.Option value="GNEA">几内亚</Select.Option>
                              <Select.Option value="GUIB">几内亚比绍</Select.Option>
                              <Select.Option value="GUY">圭亚那</Select.Option>
                              <Select.Option value="HAT">海地</Select.Option>
                              <Select.Option value="VAT">梵蒂冈</Select.Option>
                              <Select.Option value="HOND">洪都拉斯</Select.Option>
                              <Select.Option value="HUNG">匈牙利</Select.Option>
                              <Select.Option value="ICLD">冰岛</Select.Option>
                              <Select.Option value="IND">印度</Select.Option>
                              <Select.Option value="IDSA">印度尼西亚</Select.Option>
                              <Select.Option value="IRAN">伊朗</Select.Option>
                              <Select.Option value="IRAQ">伊拉克</Select.Option>
                              <Select.Option value="IRE">爱尔兰</Select.Option>
                              <Select.Option value="ISRL">以色列</Select.Option>
                              <Select.Option value="ITLY">意大利</Select.Option>
                              <Select.Option value="JAM">牙买加</Select.Option>
                              <Select.Option value="JPN">日本</Select.Option>
                              <Select.Option value="JORD">约旦</Select.Option>
                              <Select.Option value="KAZ">哈萨克斯坦</Select.Option>
                              <Select.Option value="KENY">肯尼亚</Select.Option>
                              <Select.Option value="KIRI">基里巴斯</Select.Option>
                              <Select.Option value="PRK">朝鲜</Select.Option>
                              <Select.Option value="KOR">韩国</Select.Option>
                              <Select.Option value="KSV">科索沃</Select.Option>
                              <Select.Option value="KUWT">科威特</Select.Option>
                              <Select.Option value="KGZ">吉尔吉斯斯坦</Select.Option>
                              <Select.Option value="LAOS">老挝</Select.Option>
                              <Select.Option value="LATV">拉脱维亚</Select.Option>
                              <Select.Option value="LEBN">黎巴嫩</Select.Option>
                              <Select.Option value="LES">莱索托</Select.Option>
                              <Select.Option value="LIBR">利比里亚</Select.Option>
                              <Select.Option value="LBYA">利比亚</Select.Option>
                              <Select.Option value="LCHT">列支敦士登</Select.Option>
                              <Select.Option value="LITH">立陶宛</Select.Option>
                              <Select.Option value="LXM">卢森堡</Select.Option>
                              <Select.Option value="MKD">北马其顿</Select.Option>
                              <Select.Option value="MADG">马达加斯加</Select.Option>
                              <Select.Option value="MALW">马拉维</Select.Option>
                              <Select.Option value="MLAS">马来西亚</Select.Option>
                              <Select.Option value="MLDV">马尔代夫</Select.Option>
                              <Select.Option value="MALI">马里</Select.Option>
                              <Select.Option value="MLTA">马耳他</Select.Option>
                              <Select.Option value="RMI">马绍尔群岛</Select.Option>
                              <Select.Option value="MAUR">毛里塔尼亚</Select.Option>
                              <Select.Option value="MRTS">毛里求斯</Select.Option>
                              <Select.Option value="MLD">摩尔多瓦</Select.Option>
                              <Select.Option value="MON">摩纳哥</Select.Option>
                              <Select.Option value="MONG">蒙古</Select.Option>
                              <Select.Option value="MTG">黑山</Select.Option>
                              <Select.Option value="MORO">摩洛哥</Select.Option>
                              <Select.Option value="MOZ">莫桑比克</Select.Option>
                              <Select.Option value="NAMB">纳米比亚</Select.Option>
                              <Select.Option value="NAU">瑙鲁</Select.Option>
                              <Select.Option value="NEP">尼泊尔</Select.Option>
                              <Select.Option value="NETH">荷兰</Select.Option>
                              <Select.Option value="NZLD">新西兰</Select.Option>
                              <Select.Option value="NIC">尼加拉瓜</Select.Option>
                              <Select.Option value="NIR">尼日尔</Select.Option>
                              <Select.Option value="NRA">尼日利亚</Select.Option>
                              <Select.Option value="NORW">挪威</Select.Option>
                              <Select.Option value="OMAN">阿曼</Select.Option>
                              <Select.Option value="PKST">巴基斯坦</Select.Option>
                              <Select.Option value="PALA">帕劳</Select.Option>
                              <Select.Option value="PAN">巴拿马</Select.Option>
                              <Select.Option value="PNG">巴布亚新几内亚</Select.Option>
                              <Select.Option value="PARA">巴拉圭</Select.Option>
                              <Select.Option value="PERU">秘鲁</Select.Option>
                              <Select.Option value="PHIL">菲律宾</Select.Option>
                              <Select.Option value="POL">波兰</Select.Option>
                              <Select.Option value="PORT">葡萄牙</Select.Option>
                              <Select.Option value="QTAR">卡塔尔</Select.Option>
                              <Select.Option value="ROM">罗马尼亚</Select.Option>
                              <Select.Option value="RUS">俄罗斯</Select.Option>
                              <Select.Option value="RWND">卢旺达</Select.Option>
                              <Select.Option value="SMAR">圣马力诺</Select.Option>
                              <Select.Option value="SARB">沙特阿拉伯</Select.Option>
                              <Select.Option value="SENG">塞内加尔</Select.Option>
                              <Select.Option value="SBA">塞尔维亚</Select.Option>
                              <Select.Option value="SEYC">塞舌尔</Select.Option>
                              <Select.Option value="SLEO">塞拉利昂</Select.Option>
                              <Select.Option value="SING">新加坡</Select.Option>
                              <Select.Option value="SVK">斯洛伐克</Select.Option>
                              <Select.Option value="SVN">斯洛文尼亚</Select.Option>
                              <Select.Option value="SLMN">所罗门群岛</Select.Option>
                              <Select.Option value="SOMA">索马里</Select.Option>
                              <Select.Option value="SAFR">南非</Select.Option>
                              <Select.Option value="SSDN">南苏丹</Select.Option>
                              <Select.Option value="SPN">西班牙</Select.Option>
                              <Select.Option value="SRL">斯里兰卡</Select.Option>
                              <Select.Option value="SLCA">圣卢西亚</Select.Option>
                              <Select.Option value="STVN">圣文森特和格林纳丁斯</Select.Option>
                              <Select.Option value="SUDA">苏丹</Select.Option>
                              <Select.Option value="SURM">苏里南</Select.Option>
                              <Select.Option value="SWDN">瑞典</Select.Option>
                              <Select.Option value="SWTZ">瑞士</Select.Option>
                              <Select.Option value="SYR">叙利亚</Select.Option>
                              <Select.Option value="TJK">塔吉克斯坦</Select.Option>
                              <Select.Option value="TAZN">坦桑尼亚</Select.Option>
                              <Select.Option value="THAI">泰国</Select.Option>
                              <Select.Option value="TMOR">东帝汶</Select.Option>
                              <Select.Option value="TOGO">多哥</Select.Option>
                              <Select.Option value="TONG">汤加</Select.Option>
                              <Select.Option value="TRIN">特立尼达和多巴哥</Select.Option>
                              <Select.Option value="TNSA">突尼斯</Select.Option>
                              <Select.Option value="TRKY">土耳其</Select.Option>
                              <Select.Option value="TKM">土库曼斯坦</Select.Option>
                              <Select.Option value="UGAN">乌干达</Select.Option>
                              <Select.Option value="UKR">乌克兰</Select.Option>
                              <Select.Option value="UAE">阿拉伯联合酋长国</Select.Option>
                              <Select.Option value="GRBR">英国</Select.Option>
                              <Select.Option value="USA">美国</Select.Option>
                              <Select.Option value="URU">乌拉圭</Select.Option>
                              <Select.Option value="UZB">乌兹别克斯坦</Select.Option>
                              <Select.Option value="VANU">瓦努阿图</Select.Option>
                              <Select.Option value="VENZ">委内瑞拉</Select.Option>
                              <Select.Option value="VTNM">越南</Select.Option>
                              <Select.Option value="YEM">也门</Select.Option>
                              <Select.Option value="ZAMB">赞比亚</Select.Option>
                              <Select.Option value="ZIMB">津巴布韦</Select.Option>
                            </Select> 
                          </QuestionItem>

                        </div>
                      </div>
                      
                    </div>
                  </div>
                );
              }
              
              return null;
            }}
          </Form.Item>
        </>
      ),
    },
    {
      title: '同行人',
      description: '同行人信息',
      content: (
        <>
          <QuestionItem
            number="1"
            question="您是否有同行人？"
            name="hasCompanions"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '美国信息',
      description: '过往美国旅行',
      content: (
        <>
          <Title level={5}>过往美国签证</Title>
          <QuestionItem
            number="1"
            question="您是否曾获得美国签证？"
            name="previousUsVisa"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>

          <Divider />
          
          <Title level={5}>美国联系人</Title>
          <QuestionItem
            number="2"
            question="在美联系人/组织名称"
            name="pointOfContact"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="3"
            question="与联系人关系"
            name="relationshipToContact"
          >
            <Input placeholder="例如：朋友、亲戚、学校" />
          </QuestionItem>

          <QuestionItem
            number="4"
            question="联系人地址"
            name="contactAddress"
          >
            <TextArea rows={3} />
          </QuestionItem>

          <QuestionItem
            number="5"
            question="联系人电话"
            name="contactPhone"
          >
            <Input />
          </QuestionItem>
        </>
      ),
    },
    {
      title: '家庭信息',
      description: '家庭成员信息',
      content: (
        <>
          <Title level={5}>父母信息</Title>
          <QuestionItem
            number="1"
            question="父亲姓名"
            name="fatherName"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="2"
            question="父亲出生日期"
            name="fatherBirthDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="3"
            question="父亲是否在美国"
            name="fatherInUs"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>

          <Divider />
          
          <Title level={5}>母亲信息</Title>
          <QuestionItem
            number="4"
            question="母亲姓名"
            name="motherName"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="5"
            question="母亲出生日期"
            name="motherBirthDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="6"
            question="母亲是否在美国"
            name="motherInUs"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '工作教育',
      description: '工作和教育经历',
      content: (
        <>
          <Title level={5}>当前职业信息</Title>
          <QuestionItem
            number="1"
            question="主要职业"
            name="primaryOccupation"
          >
            <Select placeholder="选择职业类型">
              <Select.Option value="employed">就业</Select.Option>
              <Select.Option value="self-employed">自雇</Select.Option>
              <Select.Option value="student">学生</Select.Option>
              <Select.Option value="retired">退休</Select.Option>
              <Select.Option value="unemployed">待业</Select.Option>
            </Select>
          </QuestionItem>

          <QuestionItem
            number="2"
            question="雇主/学校名称"
            name="employer"
          >
            <Input />
          </QuestionItem>

          <QuestionItem
            number="3"
            question="工作/学习开始日期"
            name="employmentDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="4"
            question="月收入"
            name="monthlyIncome"
          >
            <Input placeholder="如适用" />
          </QuestionItem>

          <QuestionItem
            number="5"
            question="工作职责描述"
            name="jobDescription"
          >
            <TextArea rows={4} />
          </QuestionItem>

          <Divider />
          
          <Title level={5}>教育信息</Title>
          <QuestionItem
            number="6"
            question="最高学历"
            name="education"
          >
            <Select placeholder="选择最高学历">
              <Select.Option value="highSchool">高中</Select.Option>
              <Select.Option value="bachelor">本科</Select.Option>
              <Select.Option value="master">硕士</Select.Option>
              <Select.Option value="doctorate">博士</Select.Option>
            </Select>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '安全背景',
      description: '安全和背景信息',
      content: (
        <>
          <Title level={5}>安全问题</Title>
          <QuestionItem
            number="1"
            question="您是否曾被拒签或被拒绝入境美国？"
            name="previouslyDenied"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>

          <QuestionItem
            number="2"
            question="您是否曾在美国逾期停留？"
            name="previouslyOverstayed"
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </QuestionItem>
        </>
      ),
    },
    {
      title: '确认提交',
      description: '审核并提交',
      content: (
        <>
          <Title level={5}>声明</Title>
          <p>我确认以上信息真实准确。我理解提供虚假信息可能导致签证申请被拒绝或被禁止入境美国。</p>
          <QuestionItem
            number="1"
            question="您是否同意以上声明？"
            name="agreement"
          >
            <Radio.Group>
              <Radio value={true}>我同意以上声明</Radio>
            </Radio.Group>
          </QuestionItem>
        </>
      ),
    },
  ];

  const [formData, setFormData] = React.useState({});
  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = (values: { [key: string]: any }) => {
    const finalData = { ...formData, ...values };
    handleSubmit(finalData);
    console.log('Success');
  };

  return (
    <Card title="DS-160 非移民签证申请表" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Form
        {...formItemLayout}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        preserve={true}
      >
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Left sidebar with steps */}
          <div style={{ width: '25%', minWidth: '200px' }}>
            <Steps
              current={currentStep}
              direction="vertical"
              items={steps.map(item => ({
                title: item.title,
                description: item.description,
              }))}
             />
          </div>
          
          {/* Right content area */}
          <div style={{ flex: 1 }}>
            {/* Page title outside the content card */}
            <div style={{ marginBottom: '16px' }}>
              <Title level={4}>{steps[currentStep].title}</Title>
            </div>
          
            {/* Content card without the title */}
            <Card style={{ backgroundColor: '#f5f5f5' }}>
              {steps[currentStep].content}
            </Card>

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              {currentStep > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={prev}>
                  上一步
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={next}>
                  下一步
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="primary" onClick={() => form.submit()}>
                  提交申请
                </Button>
              )}
            </div>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default DS160Form;
