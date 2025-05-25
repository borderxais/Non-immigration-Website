import React, { useState } from 'react';
import { Card, Typography, List, Button, Tag, message, Table, Divider, Collapse, Space, Modal } from 'antd';
import { CheckCircleOutlined, DollarOutlined, QuestionCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const EvaluationPay: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);
  
  // LeoNexus Model table data
  const modelColumns = [
    {
      title: '代号',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
    },
    {
      title: '作用',
      dataIndex: 'purpose',
      key: 'purpose',
      width: '25%',
    },
    {
      title: '输入',
      dataIndex: 'input',
      key: 'input',
      width: '25%',
    },
    {
      title: '产出',
      dataIndex: 'output',
      key: 'output',
      width: '20%',
    },
    {
      title: '快速回报',
      dataIndex: 'benefit',
      key: 'benefit',
      width: '15%',
    },
  ];

  const modelData = [
    {
      key: '1',
      code: 'M-01 DS-160 Structural Map',
      purpose: '秒扫表格硬伤、0.3×预算、G-90 等 12 阀值',
      input: 'DS-160 PDF/CSV',
      output: '四象限得分 + "灯色坐标图"',
      benefit: '< 1 min 告诉你"表格本身是否会被秒拒"',
    },
    {
      key: '2',
      code: 'M-02 Off-Form Critical Info',
      purpose: '识别同行组合、拒签史、真实目的等 10 隐形雷区',
      input: '10 问 YAML 问卷',
      output: '风险标签黄/橙/红',
      benefit: '避开"看似正常却被误判"的陷阱',
    },
    {
      key: '3',
      code: 'M-03 Interview Bias Radar',
      purpose: '拍板口头/表情偏误，标注 IN / RP 触点',
      input: '模拟面谈音轨 / 视频',
      output: '面试剧本 + 追问脚本',
      benefit: '30 分钟实战彩排，缩短窗口 15 秒危机',
    },
    {
      key: '4',
      code: 'RSP Role–Stability–Purpose Trust Check',
      purpose: '把前 2 步整合成"可信旅行结构"',
      input: 'M-01+02 输出',
      output: '高/中/低可信 + 优化清单',
      benefit: '一键生成客户可读报告，立即改进',
    },
    {
      key: '5',
      code: '附加： 214(b) Refusal Codebook',
      purpose: '拒签后秒查"NT / FR / RP"等 17 内码',
      input: '',
      output: '',
      benefit: '定位真正"死因"',
    },
  ];

  // Process steps table data
  const processColumns = [
    {
      title: '步骤',
      dataIndex: 'step',
      key: 'step',
      width: '15%',
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: '40%',
    },
    {
      title: '结果示例',
      dataIndex: 'result',
      key: 'result',
      width: '45%',
    },
  ];

  const processData = [
    {
      key: '1',
      step: '数据清洗',
      method: 'OCR + 人工双校验 → 共 185 字段',
      result: '保证字段准确率 ≥ 99.7 %',
    },
    {
      key: '2',
      step: '特征工程',
      method: '0.3×salary、G-90、L-45… 12 枚阀值',
      result: '每条阀值都可追溯到领馆 FAQ / 统计显著性 (p < 0.05)',
    },
    {
      key: '3',
      step: '专家标注',
      method: '行业专家复核 500 份样本，给出"秒批 / 秒拒 / 拉黄灯"意见',
      result: '人机一致性 κ=0.84',
    },
    {
      key: '4',
      step: '验证',
      method: '留出 200 份实际结果做盲测',
      result: '过签/拒签方向准确率 91.2 %',
    },
    {
      key: '5',
      step: '解释层',
      method: '将复杂逻辑折叠成"四象限 + 灯色 + 文本建议"',
      result: '申请人 5 分钟就能看懂',
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: '你们模型是 AI 算的还是人算的？',
      answer: '80 % 规则阀值 + 20 % 人工校正；先跑脚本，再由顾问复核灯色边界，保证机器速度＋人类经验。',
    },
    {
      question: '如果我照着报告改了，还会被拒吗？',
      answer: '模型降低的是"系统黄/红灯"概率；面试表现仍需训练。我们提供 M-03 彩排正是为此。',
    },
    {
      question: '数据来源安全吗？',
      answer: '数据在本地解析；输出文件已脱敏护照号、姓名拼音，报告存储于加密云盘 30 天后自动销毁。',
    },
  ];

  const plans = [
    {
      title: '基础评估',
      price: '299',
      features: [
        '详细的DS-160表格分析',
        'M-01结构化评估',
        '签证申请成功率评估',
        '基础申请建议',
        '3个工作日内出具评估报告'
      ],
      recommended: false
    },
    {
      title: '专业评估',
      price: '599',
      features: [
        '所有基础评估内容',
        'M-02关键信息分析',
        '个性化申请策略制定',
        '材料准备清单及建议',
        '面签问题重点提示',
        '1对1在线咨询30分钟',
        '2个工作日内出具评估报告'
      ],
      recommended: true
    },
    {
      title: 'VIP评估',
      price: '999',
      features: [
        '所有专业评估内容',
        'M-03面试偏误雷达',
        'RSP信任度检查',
        '材料审核及优化建议',
        '模拟面签演练',
        '签证官提问重点分析',
        '1对1在线咨询60分钟',
        '1个工作日内出具评估报告',
        '额外30天咨询支持',
        '214(b)拒签代码解析（如需）'
      ],
      recommended: false
    }
  ];

  const handlePurchase = (plan: string, price: string) => {
    setLoading(true);
    // TODO: Implement payment integration
    message.info(`即将跳转到${plan}支付页面，价格${price}元`);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={2}>LeoNexus VISA screening Model</Title>
      <Title level={3}>为什么你的签证必须做一次预判与体检</Title>
      
      <Title level={4}>1、背景：从前任签证官"直觉"到可复制的"量化体系"</Title>
      <Paragraph>
        <strong>痛点1：</strong>过去所有签证培训尤其是不确定性最强的b类签证，基本都靠所谓前任签证官的口口相传与众多签证行业从业者的零散经验拼凑成的"江湖秘术"，无法验证，不能移交。
      </Paragraph>
      <Paragraph>
        <strong>痛点2：</strong>申请人填一份ds160表格然后去面谈，要堵上近200美元签证费，可能的差旅费，以及一两千甚至五六千乃至十几万几十万人民币的辅导费/包装费，却连自己的表格存在结构缺陷都完全不知道，赌博也不应该是这样玩的。
      </Paragraph>
      <Paragraph>
        <strong>我们做了什么？</strong>从2022年到今天，我们团队利用1210份真实的ds160表格（目前还有近万份在做脱敏），和五百多份面谈转录，以及所有公开数据，包括前任签证官的个人blog，视频和各种问答平台的回答内容，训练出一套既能解释，又可量化的五级模型（M-01 / M-02 / M-03 / RSP/214b内码定位）（powered by openai）
      </Paragraph>

      <Title level={4}>2、四大模型一览</Title>
      <Table 
        columns={modelColumns} 
        dataSource={modelData} 
        pagination={false} 
        bordered 
        style={{ marginBottom: '30px' }}
      />

      <Title level={4}>3、我们是如何把直觉变成阈值的？</Title>
      <Table 
        columns={processColumns} 
        dataSource={processData} 
        pagination={false} 
        bordered 
        style={{ marginBottom: '30px' }}
      />

      <Title level={4}>4. 为什么值得付费测试？</Title>
      <List
        bordered
        dataSource={[
          '省钱 —— 一次评测 < 签证费 30 %；修一次表格或改一次机票远贵于此。',
          '省时间 —— 准确告诉你"能过/需改/秒拒"，少走一次 90 天再签死循环。',
          '省机会成本 —— 一旦 214(b) 写进记录，未来 再签b签证/ F-1 /M1/J1 都要解释；预判=买保险。',
          '可解释 —— 每一条灯色都有引用阈值/法规来源，真正知其然亦知其所以然。',
          '可继承 —— 评测 PDF 可直接交给律师 / 顾问 / 公司 HR，减少重复沟通。'
        ]}
        renderItem={item => (
          <List.Item>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            {item}
          </List.Item>
        )}
        style={{ marginBottom: '30px' }}
      />

      <Title level={4}>5、谁适合来做？</Title>
      <Table 
        columns={[
          { title: '用户', dataIndex: 'user', key: 'user', width: '30%' },
          { title: '主要收获', dataIndex: 'benefit', key: 'benefit', width: '70%' }
        ]} 
        dataSource={[
          {
            key: '1',
            user: '第一次签旅游/探亲',
            benefit: '快速判定是否"白本 + 高风险灯"；给出改行程、改预算建议'
          },
          {
            key: '2',
            user: '多次拒签想翻盘',
            benefit: 'M-02 & Codebook 精准定位"PR / NT"；出具再签脚本'
          },
          {
            key: '3',
            user: '高净值 / 企业主',
            benefit: '借 RSP 模型检查"角色–稳定–目的"闭环，为后续 L-1 / EB-5 铺路'
          },
          {
            key: '4',
            user: '签证顾问 / 培训机构',
            benefit: '用作内部质检 + 客户可视化报告，提高成功率与溢价'
          }
        ]}
        pagination={false} 
        bordered 
        style={{ marginBottom: '30px' }}
      />

      <Title level={4}>6、购买与流程</Title>
      <Paragraph>
        上传ds160表格，见示例，加10个yes或no的问题。支付评测费用， 24小时内，你将收到：
      </Paragraph>
      <List
        bordered
        dataSource={[
          '灯色坐标报告 (PNG)',
          '4 象限文字点评 (PDF)',
          '214(b) 风险码命中表 (如适用)',
          '可选加购 30 min 面试剧本彩排（使用 M-03）'
        ]}
        renderItem={item => (
          <List.Item>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            {item}
          </List.Item>
        )}
        style={{ marginBottom: '30px' }}
      />

      <Title level={4}>7、常见疑问</Title>
      <Collapse accordion>
        {faqs.map((faq, index) => (
          <Panel 
            header={<Space><QuestionCircleOutlined />{faq.question}</Space>} 
            key={index.toString()}
          >
            <p>{faq.answer}</p>
          </Panel>
        ))}
      </Collapse>
      <Paragraph style={{ marginTop: '20px', fontStyle: 'italic', textAlign: 'center' }}>
        请注意：我们依然对b签证系统中的经验之神存有敬畏！
      </Paragraph>



      
      <Divider />
      
      <Title level={5} style={{ textAlign: 'center' }}>LeoNexus VISA screening Model使用条款与免责声明</Title>
      <Paragraph style={{ fontSize: '12px', color: '#666' }}>
        本模型仅用于提供签证风险评估、材料结构建议与面谈准备辅导，不构成任何政府认可的签证决定，也不等同于律师事务所提供的移民法律意见。
        本模型输出的是基于历史数据与规则阀值的概率判断，无法确保100%通过或拒签。签证决定由美国领事官全权裁量。
        <Button 
          type="link" 
          onClick={() => setDisclaimerVisible(true)} 
          style={{ padding: '0', height: 'auto', fontSize: '12px' }}
        >
          <FileTextOutlined /> 查看完整版使用条款、隐私政策与免责声明
        </Button>
      </Paragraph>
      
      {/* Disclaimer Modal */}
      <Modal
        title="LeoNexus VISA screening Model使用条款、隐私政策与免责声明（2025-01 版）"
        open={disclaimerVisible}
        onCancel={() => setDisclaimerVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDisclaimerVisible(false)}>
            我已阅读并理解
          </Button>,
        ]}
        width={800}
      >
        <div style={{ maxHeight: '60vh', overflow: 'auto', padding: '0 10px' }}>
          <Title level={4}>1. 服务性质</Title>
          <Paragraph>
            <strong>1.1　分析工具</strong><br />
            LeoNexus VISA screening Model（以下简称 "本模型"）仅用于提供签证风险评估、材料结构建议与面谈准备辅导，不构成任何政府认可的签证决定，也不等同于律师事务所提供的移民法律意见。
          </Paragraph>
          <Paragraph>
            <strong>1.2　概率性结论</strong><br />
            本模型输出的是基于历史数据与规则阀值的概率判断，无法确保 100 % 通过或拒签。签证决定由美国领事官全权裁量。客户据此做出的任何签证、行程或投资决定，风险自担。
          </Paragraph>
          
          <Title level={4}>2. 免责声明与责任限制</Title>
          <Paragraph>
            <strong>2.1</strong>　本模型及其报告在最大适用法律范围内 不提供任何明示或暗示的保证，包括但不限于适销性、特定用途适用性、准确性、及时性或完整性。
          </Paragraph>
          <Paragraph>
            <strong>2.2</strong>　若因使用本模型导致直接或间接财务损失，LeoNexus Advisory（以下简称 "本公司"）承担的总赔偿责任以客户实际支付的服务费为最高限额。
          </Paragraph>
          <Paragraph>
            <strong>2.3</strong>　本公司对以下情形不承担责任：
            <ul>
              <li>客户提供的数据不准确或遗漏；</li>
              <li>领事政策突发调整、突发公共事件（如疫情）导致的结果变化；</li>
              <li>第三方（支付、云存储、邮件系统等）服务故障。</li>
            </ul>
          </Paragraph>
          
          <Title level={4}>3. 非法律意见声明</Title>
          <Paragraph>
            本模型报告、视频模拟面谈或顾问对话 均非美国移民律师提供的法律服务。若您需要正式法律意见，应咨询具有相关执业资格的律师。LeoNexus 可根据需要转介或协助对接合作律所，但不对其法律意见承担责任。
          </Paragraph>
          
          <Title level={4}>4. 数据隐私与安全</Title>
          <Paragraph>
            <strong>4.1</strong>　最小化收集：仅收集完成评估所必需的 DS-160 字段、问卷答案与面谈视频。
          </Paragraph>
          <Paragraph>
            <strong>4.2</strong>　脱敏存储：所有原始文件在本地解析后即做脱敏，护照号、姓名拼音将以哈希或掩码保存。
          </Paragraph>
          <Paragraph>
            <strong>4.3</strong>　自动销毁：原件与脱敏数据将于报告交付后 30 天 内自动删除，除非客户另行书面授权延长存档。
          </Paragraph>
          <Paragraph>
            <strong>4.4</strong>　信息共享：数据仅在公司内部及签署保密协议的合作方（如模拟面谈咨询顾问）间共享，且仅限完成本模型服务之目的。
          </Paragraph>
          
          <Title level={4}>5. 知识产权</Title>
          <Paragraph>
            <strong>5.1</strong>　本模型之算法、阀值、灯色坐标图与所有衍生报告 受版权、商业秘密及其他知识产权保护。
          </Paragraph>
          <Paragraph>
            <strong>5.2</strong>　客户可为个人签证目的下载、打印、分享给指定律师或家人，但不得：
            <ul>
              <li>公开发布、出售、转让报告；</li>
              <li>拆解、反编译或另行开发衍生产品；</li>
              <li>用于培训第三方收费课程，除非获得书面授权。</li>
            </ul>
          </Paragraph>
          
          <Title level={4}>6. 退款政策</Title>
          <Paragraph>
            <strong>6.1</strong>　以下情形可申请全额退款：
            <ul>
              <li>支付后 24 小时内撤回且未上传任何材料；</li>
              <li>本公司未能在承诺时限内交付报告。</li>
            </ul>
          </Paragraph>
          <Paragraph>
            <strong>6.2</strong>　如已开始解析数据或提供模拟面谈辅导，一律不予退款，除非本公司书面同意。
          </Paragraph>
          <Paragraph>
            <strong>6.3</strong>　任何退款将扣除第三方支付手续费后，于 10 个工作日内原路退回。
          </Paragraph>
          
          <Title level={4}>7. 争议解决</Title>
          <Paragraph>
            若因本模型服务产生争议，双方应友好协商；协商不成，以美国加州法院为专属管辖。
            在任何情况下，客户不得以集体诉讼方式追责。
          </Paragraph>
          
          <Title level={4}>8. 条款更新</Title>
          <Paragraph>
            本公司保留随时更新本条款之权利，恕不另行通知。更新后的条款将在官网公示，继续使用即视为接受修订。
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default EvaluationPay;
