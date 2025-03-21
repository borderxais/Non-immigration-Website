import React from 'react';
import { Card, Steps, Form, Input, Select, DatePicker, Radio, Space, Button, Typography, Divider, message, Row, Col, Checkbox } from 'antd';
import ds160Service from '../services/ds160Service';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const DS160Form: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
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
    textStyle?: React.CSSProperties;
  }> = ({ number, question, name, required = true, children, explanation, hasNaCheckbox = false, naCheckboxName, textStyle = {} }) => {
    const [isNaChecked, setIsNaChecked] = React.useState(false);
    
    const onNaCheckboxChange = (e: any) => {
      setIsNaChecked(e.target.checked);
    };
    
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
            <Text strong style={textStyle}>
              {number ? `${number}. ` : ''}{question}{required && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>}</Text>
            <Form.Item 
              name={name} 
              required={required && !isNaChecked} 
              rules={required ? [{ required: !isNaChecked, message: '此字段为必填项' }] : []}
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
                <Checkbox onChange={onNaCheckboxChange}>不适用/技术无法提供</Checkbox>
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

  const textStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#333',
    marginBottom: '4px',
  };

  const steps = [
    {
      title: '开始',
      description: '基本信息',
      content: (
        <>
        <Title level={4}>安全问题</Title>
      
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
          <Title level={4}>个人信息 I</Title>
          
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
        
          <div className="field-group callout" style={{ padding: '16px' }}>
  
            <QuestionItem
              question="日期"
              name="dateOfBirth"
              explanation="若不知道具体日期或月份，请按护照所示填写。"
              textStyle={textStyle}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Form.Item 
                  name="dobDay" 
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
                  name="dobMonth" 
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
              textStyle={textStyle}
            >
              <Input placeholder="例如：北京" />
            </QuestionItem>

            <QuestionItem
              question="州/省"
              name="birthState"
              hasNaCheckbox={true}
              naCheckboxName="birthState_na"
              textStyle={textStyle}
            >
              <Input placeholder="例如：北京市" />
            </QuestionItem>

            <QuestionItem
              question="国家/地区"
              name="birthCountry"
              explanation="请选择您出生地的现用国家/地区名称。"
              textStyle={textStyle}
            >
              <Select placeholder="- 选择一个 -">
                  <Select.Option value="">- 选择一个 -</Select.Option>
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
          <Title level={4}>个人信息 II</Title>
        
          <QuestionItem
            question="所属国家/地区（国籍）"
            name="nationality"
            explanation="请选择您目前的国籍。"
          >
            <Select placeholder="- 选择一个 -" style={{ width: '100%' }}>
              <Select.Option value="">- 选择一个 -</Select.Option>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Input style={{ width: '60px' }} maxLength={3} placeholder="XXX" />
              <span>-</span>
              <Input style={{ width: '50px' }} maxLength={2} placeholder="XX" />
              <span>-</span>
              <Input style={{ width: '70px' }} maxLength={4} placeholder="XXXX" />
            </div>
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
          <Title level={4}>E. 旅行信息</Title>
          
          <Title level={5}>旅行目的</Title>

          <QuestionItem
            number="1"
            question="旅行目的"
            name="purposeOfTrip"
          >
            <Select placeholder="选择旅行目的">
              <Select.Option value="B1">商务(B1)</Select.Option>
              <Select.Option value="B2">旅游/访友(B2)</Select.Option>
              <Select.Option value="F1">学习(F1)</Select.Option>
              <Select.Option value="J1">交流访问(J1)</Select.Option>
            </Select>
          </QuestionItem>

          <QuestionItem
            number="2"
            question="具体说明"
            name="specificPurpose"
          >
            <TextArea rows={4} placeholder="详细说明您此行的具体目的" />
          </QuestionItem>

          <Divider />
          
          <Title level={5}>行程信息</Title>
          <QuestionItem
            number="3"
            question="计划入境日期"
            name="intendedDateOfArrival"
          >
            <DatePicker style={{ width: '100%' }} />
          </QuestionItem>

          <QuestionItem
            number="4"
            question="计划停留时间"
            name="intendedLengthOfStay"
          >
            <Input placeholder="例如：2周、1个月" />
          </QuestionItem>

          <QuestionItem
            number="6"
            question="在美住址"
            name="addressWhereYouWillStay"
            explanation="请提供您在美国期间的详细住址，如酒店名称和地址、朋友或亲戚的住址等。"
          >
            <TextArea rows={3} placeholder="在美期间的详细住址" />
          </QuestionItem>

          <div style={{ 
            background: '#f9f9f9', 
            padding: '10px', 
            marginBottom: '20px', 
            borderRadius: '4px', 
            border: '1px solid #eee' 
          }}>
            <Paragraph style={{ fontSize: '13px', color: '#666', marginBottom: 0 }}>
              <Text strong style={{ color: '#891300' }}>帮助：</Text> 如果您还无法确定您的旅行计划，请提供一个预计的旅行计划。美国签证官员理解您的计划可能会有所变动。
            </Paragraph>
          </div>

          <Divider />
          
          <Title level={5}>费用信息</Title>

          <QuestionItem
            number="7"
            question="支付您旅行费用的个人或组织名称"
            name="whoIsPaying"
            explanation="请选择谁将负责支付您此次赴美旅行的费用。"
          >
            <Select placeholder="请选择" style={{ width: '100%' }}>
              <Select.Option value="S">自己</Select.Option>
              <Select.Option value="O">其他人</Select.Option>
              <Select.Option value="P">现雇主</Select.Option>
              <Select.Option value="U">美国雇主</Select.Option>
              <Select.Option value="C">其他公司/组织</Select.Option>
            </Select>
          </QuestionItem>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.whoIsPaying !== currentValues.whoIsPaying}
          >
            {({ getFieldValue }) => {
              const payerType = getFieldValue('whoIsPaying');
              
              if (payerType === 'O') {
                return (
                  <QuestionItem
                    number="8"
                    question="其他人姓名"
                    name="otherPayerName"
                    explanation="请提供支付您旅行费用的个人姓名。"
                  >
                    <Input placeholder="请输入付款人姓名" />
                  </QuestionItem>
                );
              } else if (['P', 'U', 'C'].includes(payerType)) {
                return (
                  <QuestionItem
                    number="8"
                    question="组织/公司名称"
                    name="organizationName"
                    explanation="请提供支付您旅行费用的组织或公司的名称。"
                  >
                    <Input placeholder="请输入组织/公司名称" />
                  </QuestionItem>
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
          <Title level={4}>F. 同行人</Title>
          
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
          <Title level={4}>G. 美国信息</Title>
          
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
          <Title level={4}>H. 家庭信息</Title>
          
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
          <Title level={4}>I. 工作教育</Title>
          
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
          <Title level={4}>J. 安全背景</Title>
          
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
          <Title level={4}>K. 确认提交</Title>
          
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
    const values = await form.validateFields();
    setFormData({ ...formData, ...values });
    setCurrentStep(currentStep + 1);
    form.resetFields(); // Optionally reset fields for the next step
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
            <Card>
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
