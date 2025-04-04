import React from 'react';
import { Card, Steps, Form, Input, Select, DatePicker, Radio, Space, Button, Typography, Divider, message, Row, Col, Checkbox } from 'antd';
import ds160Service from '../services/ds160Service';
import { useNavigate } from 'react-router-dom';
import FormItemButtons from '../components/FormItemButtons';
import ApplicationIdDisplay from '../components/ApplicationIdDisplay';
import { generateApplicationId } from '../utils/formUtils';

//  Application ID AA00EGS9G1

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const [formId, setFormId] = React.useState<string | null>(generateApplicationId());
React.useEffect(() => {
  // Check if there's a form ID in the URL (for resuming a draft)
  const params = new URLSearchParams(window.location.search);
  const draftId = params.get('id');
  
  if (draftId) {
    // If we have an ID in the URL, use that instead of the generated one
    setFormId(draftId);
    // Here you would also load the form data from your backend
  }
  
  // Save the form ID to localStorage for persistence
  const savedFormId = localStorage.getItem('currentFormId');
  if (!draftId && savedFormId) {
    setFormId(savedFormId);
  } else {
    // Save the current form ID (either from URL or randomly generated)
    localStorage.setItem('currentFormId', formId || '');
  }
}, [formId]);
const DS160Form: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([0]);
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

  const dateBlockStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  // Format for state dropdown options
  const usStateOptions = [
    { value: '', label: '- 请选择一个 -' },
    { value: 'AL', label: '阿拉巴马' },
    { value: 'AK', label: '阿拉斯加' },
    { value: 'AS', label: '美属萨摩亚' },
    { value: 'AZ', label: '亚利桑那' },
    { value: 'AR', label: '阿肯色' },
    { value: 'CA', label: '加利福尼亚' },
    { value: 'CO', label: '科罗拉多' },
    { value: 'CT', label: '康涅狄格' },
    { value: 'DE', label: '特拉华' },
    { value: 'DC', label: '哥伦比亚特区' },
    { value: 'FL', label: '佛罗里达' },
    { value: 'GA', label: '乔治亚' },
    { value: 'GU', label: '关岛' },
    { value: 'HI', label: '夏威夷' },
    { value: 'ID', label: '爱达荷' },
    { value: 'IL', label: '伊利诺伊' },
    { value: 'IN', label: '印第安纳' },
    { value: 'IA', label: '爱荷华' },
    { value: 'KS', label: '堪萨斯' },
    { value: 'KY', label: '肯塔基' },
    { value: 'LA', label: '路易斯安那' },
    { value: 'ME', label: '缅因' },
    { value: 'MD', label: '马里兰' },
    { value: 'MA', label: '马萨诸塞' },
    { value: 'MI', label: '密歇根' },
    { value: 'MN', label: '明尼苏达' },
    { value: 'MS', label: '密西西比' },
    { value: 'MO', label: '密苏里' },
    { value: 'MT', label: '蒙大拿' },
    { value: 'NE', label: '内布拉斯加' },
    { value: 'NV', label: '内华达' },
    { value: 'NH', label: '新罕布什尔' },
    { value: 'NJ', label: '新泽西' },
    { value: 'NM', label: '新墨西哥' },
    { value: 'NY', label: '纽约' },
    { value: 'NC', label: '北卡罗来纳' },
    { value: 'ND', label: '北达科他' },
    { value: 'MP', label: '北马里亚纳群岛' },
    { value: 'OH', label: '俄亥俄' },
    { value: 'OK', label: '俄克拉荷马' },
    { value: 'OR', label: '俄勒冈' },
    { value: 'PA', label: '宾夕法尼亚' },
    { value: 'PR', label: '波多黎各' },
    { value: 'RI', label: '罗德岛' },
    { value: 'SC', label: '南卡罗来纳' },
    { value: 'SD', label: '南达科他' },
    { value: 'TN', label: '田纳西' },
    { value: 'TX', label: '德克萨斯' },
    { value: 'UT', label: '犹他' },
    { value: 'VT', label: '佛蒙特' },
    { value: 'VI', label: '美属维尔京群岛' },
    { value: 'VA', label: '弗吉尼亚' },
    { value: 'WA', label: '华盛顿' },
    { value: 'WV', label: '西弗吉尼亚' },
    { value: 'WI', label: '威斯康星' },
    { value: 'WY', label: '怀俄明' },
  ];

  // Format for country dropdown options
  const countryOptions = [
    { value: '', label: '- 请选择一个 -' },
    { value: 'AFGH', label: '阿富汗' },
    { value: 'ALB', label: '阿尔巴尼亚' },
    { value: 'ALGR', label: '阿尔及利亚' },
    { value: 'ASMO', label: '美属萨摩亚' },
    { value: 'ANDO', label: '安道尔' },
    { value: 'ANGL', label: '安哥拉' },
    { value: 'ANGU', label: '安圭拉' },
    { value: 'ANTI', label: '安提瓜和巴布达' },
    { value: 'ARG', label: '阿根廷' },
    { value: 'ARM', label: '亚美尼亚' },
    { value: 'ARB', label: '阿鲁巴' },
    { value: 'XAS', label: '海上' },
    { value: 'ASTL', label: '澳大利亚' },
    { value: 'AUST', label: '奥地利' },
    { value: 'AZR', label: '阿塞拜疆' },
    { value: 'BAMA', label: '巴哈马' },
    { value: 'BAHR', label: '巴林' },
    { value: 'BANG', label: '孟加拉国' },
    { value: 'BRDO', label: '巴巴多斯' },
    { value: 'BYS', label: '白俄罗斯' },
    { value: 'BELG', label: '比利时' },
    { value: 'BLZ', label: '伯利兹' },
    { value: 'BENN', label: '贝宁' },
    { value: 'BERM', label: '百慕大' },
    { value: 'BHU', label: '不丹' },
    { value: 'BOL', label: '玻利维亚' },
    { value: 'BIH', label: '波斯尼亚和黑塞哥维那' },
    { value: 'BOT', label: '博茨瓦纳' },
    { value: 'BRZL', label: '巴西' },
    { value: 'BRNI', label: '文莱' },
    { value: 'BULG', label: '保加利亚' },
    { value: 'BURK', label: '布基纳法索' },
    { value: 'BURM', label: '缅甸' },
    { value: 'BRND', label: '布隆迪' },
    { value: 'CBDA', label: '柬埔寨' },
    { value: 'CMRN', label: '喀麦隆' },
    { value: 'CAN', label: '加拿大' },
    { value: 'CAVI', label: '佛得角' },
    { value: 'CAYI', label: '开曼群岛' },
    { value: 'CAFR', label: '中非共和国' },
    { value: 'CHAD', label: '乍得' },
    { value: 'CHIL', label: '智利' },
    { value: 'CHIN', label: '中国' },
    { value: 'HNK', label: '中国香港特别行政区' },
    { value: 'MAC', label: '中国澳门特别行政区' },
    { value: 'TWAN', label: '中国台湾' },
    { value: 'COL', label: '哥伦比亚' },
    { value: 'COMO', label: '科摩罗' },
    { value: 'COD', label: '刚果民主共和国' },
    { value: 'CONB', label: '刚果共和国' },
    { value: 'CSTR', label: '哥斯达黎加' },
    { value: 'IVCO', label: '科特迪瓦' },
    { value: 'HRV', label: '克罗地亚' },
    { value: 'CUBA', label: '古巴' },
    { value: 'CUR', label: '库拉索' },
    { value: 'CYPR', label: '塞浦路斯' },
    { value: 'CZEC', label: '捷克共和国' },
    { value: 'DEN', label: '丹麦' },
    { value: 'DJI', label: '吉布提' },
    { value: 'DOMN', label: '多米尼克' },
    { value: 'DOMR', label: '多米尼加共和国' },
    { value: 'ECUA', label: '厄瓜多尔' },
    { value: 'EGYP', label: '埃及' },
    { value: 'ELSL', label: '萨尔瓦多' },
    { value: 'EGN', label: '赤道几内亚' },
    { value: 'ERI', label: '厄立特里亚' },
    { value: 'EST', label: '爱沙尼亚' },
    { value: 'SZLD', label: '斯威士兰' },
    { value: 'ETH', label: '埃塞俄比亚' },
    { value: 'FIJI', label: '斐济' },
    { value: 'FIN', label: '芬兰' },
    { value: 'FRAN', label: '法国' },
    { value: 'GABN', label: '加蓬' },
    { value: 'GAM', label: '冈比亚' },
    { value: 'GEO', label: '格鲁吉亚' },
    { value: 'GER', label: '德国' },
    { value: 'GHAN', label: '加纳' },
    { value: 'GRC', label: '希腊' },
    { value: 'GREN', label: '格林纳达' },
    { value: 'GUAT', label: '危地马拉' },
    { value: 'GNEA', label: '几内亚' },
    { value: 'GUIB', label: '几内亚比绍' },
    { value: 'GUY', label: '圭亚那' },
    { value: 'HAT', label: '海地' },
    { value: 'VAT', label: '梵蒂冈' },
    { value: 'HOND', label: '洪都拉斯' },
    { value: 'HUNG', label: '匈牙利' },
    { value: 'ICLD', label: '冰岛' },
    { value: 'IND', label: '印度' },
    { value: 'IDSA', label: '印度尼西亚' },
    { value: 'IRAN', label: '伊朗' },
    { value: 'IRAQ', label: '伊拉克' },
    { value: 'IRE', label: '爱尔兰' },
    { value: 'ISRL', label: '以色列' },
    { value: 'ITLY', label: '意大利' },
    { value: 'JAM', label: '牙买加' },
    { value: 'JPN', label: '日本' },
    { value: 'JORD', label: '约旦' },
    { value: 'KAZ', label: '哈萨克斯坦' },
    { value: 'KENY', label: '肯尼亚' },
    { value: 'KIRI', label: '基里巴斯' },
    { value: 'PRK', label: '朝鲜' },
    { value: 'KOR', label: '韩国' },
    { value: 'KSV', label: '科索沃' },
    { value: 'KUWT', label: '科威特' },
    { value: 'KGZ', label: '吉尔吉斯斯坦' },
    { value: 'LAOS', label: '老挝' },
    { value: 'LATV', label: '拉脱维亚' },
    { value: 'LEBN', label: '黎巴嫩' },
    { value: 'LES', label: '莱索托' },
    { value: 'LIBR', label: '利比里亚' },
    { value: 'LBYA', label: '利比亚' },
    { value: 'LCHT', label: '列支敦士登' },
    { value: 'LITH', label: '立陶宛' },
    { value: 'LXM', label: '卢森堡' },
    { value: 'MKD', label: '北马其顿' },
    { value: 'MADG', label: '马达加斯加' },
    { value: 'MALW', label: '马拉维' },
    { value: 'MLAS', label: '马来西亚' },
    { value: 'MLDV', label: '马尔代夫' },
    { value: 'MALI', label: '马里' },
    { value: 'MLTA', label: '马耳他' },
    { value: 'RMI', label: '马绍尔群岛' },
    { value: 'MAUR', label: '毛里塔尼亚' },
    { value: 'MRTS', label: '毛里求斯' },
    { value: 'MLD', label: '摩尔多瓦' },
    { value: 'MON', label: '摩纳哥' },
    { value: 'MONG', label: '蒙古' },
    { value: 'MTG', label: '黑山' },
    { value: 'MORO', label: '摩洛哥' },
    { value: 'MOZ', label: '莫桑比克' },
    { value: 'NAMB', label: '纳米比亚' },
    { value: 'NAU', label: '瑙鲁' },
    { value: 'NEP', label: '尼泊尔' },
    { value: 'NETH', label: '荷兰' },
    { value: 'NZLD', label: '新西兰' },
    { value: 'NIC', label: '尼加拉瓜' },
    { value: 'NIR', label: '尼日尔' },
    { value: 'NRA', label: '尼日利亚' },
    { value: 'NORW', label: '挪威' },
    { value: 'OMAN', label: '阿曼' },
    { value: 'PKST', label: '巴基斯坦' },
    { value: 'PALA', label: '帕劳' },
    { value: 'PAN', label: '巴拿马' },
    { value: 'PNG', label: '巴布亚新几内亚' },
    { value: 'PARA', label: '巴拉圭' },
    { value: 'PERU', label: '秘鲁' },
    { value: 'PHIL', label: '菲律宾' },
    { value: 'POL', label: '波兰' },
    { value: 'PORT', label: '葡萄牙' },
    { value: 'QTAR', label: '卡塔尔' },
    { value: 'ROM', label: '罗马尼亚' },
    { value: 'RUS', label: '俄罗斯' },
    { value: 'RWND', label: '卢旺达' },
    { value: 'SMAR', label: '圣马力诺' },
    { value: 'SARB', label: '沙特阿拉伯' },
    { value: 'SENG', label: '塞内加尔' },
    { value: 'SBA', label: '塞尔维亚' },
    { value: 'SEYC', label: '塞舌尔' },
    { value: 'SLEO', label: '塞拉利昂' },
    { value: 'SING', label: '新加坡' },
    { value: 'SVK', label: '斯洛伐克' },
    { value: 'SVN', label: '斯洛文尼亚' },
    { value: 'SLMN', label: '所罗门群岛' },
    { value: 'SOMA', label: '索马里' },
    { value: 'SAFR', label: '南非' },
    { value: 'SSDN', label: '南苏丹' },
    { value: 'SPN', label: '西班牙' },
    { value: 'SRL', label: '斯里兰卡' },
    { value: 'SLCA', label: '圣卢西亚' },
    { value: 'STVN', label: '圣文森特和格林纳丁斯' },
    { value: 'SUDA', label: '苏丹' },
    { value: 'SURM', label: '苏里南' },
    { value: 'SWDN', label: '瑞典' },
    { value: 'SWTZ', label: '瑞士' },
    { value: 'SYR', label: '叙利亚' },
    { value: 'TJK', label: '塔吉克斯坦' },
    { value: 'TAZN', label: '坦桑尼亚' },
    { value: 'THAI', label: '泰国' },
    { value: 'TMOR', label: '东帝汶' },
    { value: 'TOGO', label: '多哥' },
    { value: 'TONG', label: '汤加' },
    { value: 'TRIN', label: '特立尼达和多巴哥' },
    { value: 'TNSA', label: '突尼斯' },
    { value: 'TRKY', label: '土耳其' },
    { value: 'TKM', label: '土库曼斯坦' },
    { value: 'UGAN', label: '乌干达' },
    { value: 'UKR', label: '乌克兰' },
    { value: 'UAE', label: '阿拉伯联合酋长国' },
    { value: 'GRBR', label: '英国' },
    { value: 'USA', label: '美国' },
    { value: 'URU', label: '乌拉圭' },
    { value: 'UZB', label: '乌兹别克斯坦' },
    { value: 'VANU', label: '瓦努阿图' },
    { value: 'VENZ', label: '委内瑞拉' },
    { value: 'VTNM', label: '越南' },
    { value: 'YEM', label: '也门' },
    { value: 'ZAMB', label: '赞比亚' },
    { value: 'ZIMB', label: '津巴布韦' }
  ];

  // Format for month dropdown options
  const monthOptions = [
    { value: '', label: '' },
    { value: 'JAN', label: '一月' },
    { value: 'FEB', label: '二月' },
    { value: 'MAR', label: '三月' },
    { value: 'APR', label: '四月' },
    { value: 'MAY', label: '五月' },
    { value: 'JUN', label: '六月' },
    { value: 'JUL', label: '七月' },
    { value: 'AUG', label: '八月' },
    { value: 'SEP', label: '九月' },
    { value: 'OCT', label: '十月' },
    { value: 'NOV', label: '十一月' },
    { value: 'DEC', label: '十二月' },
  ];

  // Format for day dropdown options
  const dayOptions = [
    { value: '', label: '' },
    { value: '1', label: '01' },
    { value: '2', label: '02' },
    { value: '3', label: '03' },
    { value: '4', label: '04' },
    { value: '5', label: '05' },
    { value: '6', label: '06' },
    { value: '7', label: '07' },
    { value: '8', label: '08' },
    { value: '9', label: '09' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '15', label: '15' },
    { value: '16', label: '16' },
    { value: '17', label: '17' },
    { value: '18', label: '18' },
    { value: '19', label: '19' },
    { value: '20', label: '20' },
    { value: '21', label: '21' },
    { value: '22', label: '22' },
    { value: '23', label: '23' },
    { value: '24', label: '24' },
    { value: '25', label: '25' },
    { value: '26', label: '26' },
    { value: '27', label: '27' },
    { value: '28', label: '28' },
    { value: '29', label: '29' },
    { value: '30', label: '30' },
    { value: '31', label: '31' },
  ];

  // Length of stay unit options
  const losUnitOptions = [
    { value: '', label: '-请选择一个-' },
    { value: 'Y', label: '年' },
    { value: 'M', label: '月' },
    { value: 'W', label: '周' },
    { value: 'D', label: '天' },
    { value: 'H', label: '少于24小时' },
  ];

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
    // Use the form instance from the parent component
    const form = Form.useFormInstance();
    
    // Use the form instance to get the current value of the NA checkbox
    const isNaChecked = Form.useWatch(naCheckboxName || `${name}_na`, form);
    
    // Handle NA checkbox change
    const handleNaCheckboxChange = (e: any) => {
      const checked = e.target.checked;
      
      // If the checkbox is checked, clear the related field value
      if (checked) {
        // Determine the field name to clear based on the component structure
        const fieldToClear: { [key: string]: undefined } = {};
        
        // If it's a simple field, just clear that field
        fieldToClear[name] = undefined;
        
        // Special handling for complex fields like date fields that might have day/month/year components
        if (name.includes('.')) {
          const baseName = name.split('.')[0];
          
          // Look for possible date components (common patterns in your form)
          if (name.endsWith('Date')) {
            fieldToClear[`${baseName}.expirationDay`] = undefined;
            fieldToClear[`${baseName}.expirationMonth`] = undefined;
            fieldToClear[`${baseName}.expirationYear`] = undefined;
          }
        }
        
        // Set the field values to undefined
        form.setFieldsValue(fieldToClear);
      }
    };
    
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
              {number ? `${number}. ` : ''}{question}{required && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>}
            </Text>
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
                <Checkbox onChange={handleNaCheckboxChange}>不适用/技术无法提供</Checkbox>
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
              <div style={dateBlockStyle}>
                <Form.Item 
                  name="dobDay" 
                  noStyle
                  rules={[{ required: true, message: '请选择日期' }]}
                >
                  <Select options={dayOptions} style={{ width: 70 }} placeholder="Day" />
                </Form.Item>

                <Form.Item 
                  name="dobMonth" 
                  noStyle
                  rules={[{ required: true, message: '请选择月份' }]}
                >
                  <Select options={monthOptions} style={{ width: 80 }} placeholder="Month" />
                </Form.Item>

                <Form.Item 
                  name="dobYear" 
                  noStyle
                  rules={[
                    { required: true, message: '请输入年份' },
                    { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                  ]}
                >
                  <Input placeholder="Year" style={{ width: '60px' }} maxLength={4} />
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
              <Select options={countryOptions} placeholder="- 选择一个 -" />
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
            <Select options={countryOptions} style={{ width: '100%' }} placeholder="- 选择一个 -" />
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
                        placeholder="请选择一个"
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
          </div>

          <br/>
          <Divider />
            
          <div>
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
                          <div style={dateBlockStyle}>
                            <Form.Item 
                              name="arrivalDay" 
                              noStyle
                              rules={[{ required: true, message: '请选择日期' }]}
                            >
                              <Select options={dayOptions} style={{ width: 70 }} placeholder="Day" />
                            </Form.Item>

                            <Form.Item 
                              name="arrivalMonth" 
                              noStyle
                              rules={[{ required: true, message: '请选择月份' }]}
                            >
                              <Select options={monthOptions} style={{ width: 80 }} placeholder="Month" />
                            </Form.Item>

                            <Form.Item 
                              name="arrivalYear" 
                              noStyle
                              rules={[
                                { required: true, message: '请输入年份' },
                                { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                              ]}
                            >
                              <Input placeholder="Year" style={{ width: '60px' }} maxLength={4} />
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
                          <div style={dateBlockStyle}>
                            <Form.Item 
                              name="departureDay" 
                              noStyle
                              rules={[{ required: true, message: '请选择日期' }]}
                            >
                              <Select options={dayOptions} style={{ width: 70 }} placeholder="Day" />
                            </Form.Item>

                            <Form.Item 
                              name="departureMonth" 
                              noStyle
                              rules={[{ required: true, message: '请选择月份' }]}
                            >
                              <Select options={monthOptions} style={{ width: 80 }} placeholder="Month" />
                            </Form.Item>

                            <Form.Item 
                              name="departureYear" 
                              noStyle
                              rules={[
                                { required: true, message: '请输入年份' },
                                { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                              ]}
                            >
                              <Input placeholder="Year" style={{ width: '60px' }} maxLength={4} />
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
                        <Form.List name="visitLocations" initialValue={[{}]}>
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((field, index) => (
                                <div 
                                  key={field.key} 
                                  style={{ 
                                    marginBottom: 24, 
                                    padding: index > 0 ? 16 : 0, 
                                    border: index > 0 ? '1px dashed #d6e8fa' : 'none',
                                    borderRadius: index > 0 ? '8px' : 0
                                  }}
                                >
                                  <QuestionItem
                                    question="您计划在美国访问的地点"
                                    name={`visitLocations[${index}].location`}
                                    explanation="请提供您计划在美国访问的地点"
                                  >
                                    <Input placeholder="请输入访问地点" maxLength={40} style={{ width: '98%' }} />
                                  </QuestionItem>
                                  
                                  {/* 使用FormItemButtons组件 */}
                                  <FormItemButtons 
                                    onAdd={() => add()}
                                    onRemove={() => {
                                      // 确保至少保留一个地点输入框
                                      if (fields.length > 1) {
                                        remove(field.name);
                                      }
                                    }}
                                    addText="增加另一个"
                                    removeText="移除"
                                  />
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
                    <div style={dateBlockStyle}>
                      <Form.Item 
                        name="arrivalDay" 
                        noStyle
                        rules={[{ required: true, message: '请选择日期' }]}
                      >
                        <Select options={dayOptions} style={{ width: 70 }} placeholder="Day" />
                      </Form.Item>

                      <Form.Item 
                        name="arrivalMonth" 
                        noStyle
                        rules={[{ required: true, message: '请选择月份' }]}
                      >
                        <Select options={monthOptions} style={{ width: 80 }} placeholder="Month" />
                      </Form.Item>

                      <Form.Item 
                        name="arrivalYear" 
                        noStyle
                        rules={[
                          { required: true, message: '请输入年份' },
                          { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                        ]}
                      >
                        <Input placeholder="Year" style={{ width: '60px' }} maxLength={4} />
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
                                    <Select 
                                      options={usStateOptions}
                                      style={{ width: '98%' }}
                                      placeholder="- 请选择一个 -"
                                    />
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
                        <Select 
                          options={usStateOptions} 
                          placeholder="- 请选择一个 -" 
                          style={{ width: '98%' }}
                        />
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
                            <Select options={countryOptions} placeholder="- 选择一个 -" />
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
      title: '旅游同行人',
      description: '旅游同行人信息',
      content: (
        <>
          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="您是否有同行人？"
                name="hasCompanions"
                explanation="请选择是否有人与您一同旅行"
              >
                <Radio.Group onChange={(e) => {
                  // 当选项改变时，通过表单实例更新字段值
                  form.setFieldsValue({ hasCompanions: e.target.value });
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
              prevValues.hasCompanions !== currentValues.hasCompanions
            }
          >
            {({ getFieldValue }) => {
              const hasCompanions = getFieldValue('hasCompanions');
              
              // 如果没有选择是否有同行人，不显示任何后续问题
              if (!hasCompanions) {
                return null;
              }
              
              if (hasCompanions === 'Y') {
                return (
                  <div className="field-groups" style={{ marginBottom: '15px' }}>
                    <div className="q">
                      <QuestionItem
                        question="您是否作为一个团队或者组织的成员去旅行？"
                        name="groupTravel"
                        explanation="如果您是作为一个组织、团队或旅行团的成员旅行，请选择'是'"
                      >
                        <Radio.Group onChange={(e) => {
                          form.setFieldsValue({ groupTravel: e.target.value });
                        }}>
                          <Radio value="Y">是</Radio>
                          <Radio value="N">否</Radio>
                        </Radio.Group>
                      </QuestionItem>
                    </div>
                    
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) => 
                        prevValues.groupTravel !== currentValues.groupTravel
                      }
                    >
                      {({ getFieldValue }) => {
                        const groupTravel = getFieldValue('groupTravel');
                        
                        if (groupTravel === 'Y') {
                          return (
                            <div className="field-group callout" style={highlightedBlockStyle}>
                              <QuestionItem
                                question="团队或组织名称"
                                name="groupName"
                                explanation="请输入您所属团队或组织的名称"
                              >
                                <Input style={{ width: '98%' }} maxLength={40} />
                              </QuestionItem>
                            </div>
                          );
                        } else if (groupTravel === 'N') {
                          return (
                            <div className="field-groups" style={{ marginBottom: '15px' }}>
                              <h4>
                                <span>同行人信息</span>
                              </h4>
                              <div className="field-group callout" style={highlightedBlockStyle}>
                                <div style={blockInsideHighlightStyle}>
                                  <Form.List name="companions" initialValue={[{}]}>
                                  {(fields, { add, remove }) => (
                                    <>
                                      {fields.map((field, index) => (
                                        <div 
                                          key={field.key} 
                                          style={{ 
                                            marginBottom: 24, 
                                            padding: index > 0 ? 16 : 0, 
                                            border: index > 0 ? '1px dashed #d6e8fa' : 'none',
                                            borderRadius: index > 0 ? '8px' : 0
                                          }}
                                        >
                                          <h4>同行人 #{index + 1}</h4>
                                          
                                          <QuestionItem
                                            question="姓氏"
                                            name={`companions[${index}].surname`}
                                            explanation="请输入同行人的姓氏（与护照一致）"
                                          >
                                            <Input style={{ width: '98%' }} maxLength={33} />
                                          </QuestionItem>
                                          
                                          <QuestionItem
                                            question="名字"
                                            name={`companions[${index}].givenName`}
                                            explanation="请输入同行人的名字（与护照一致）"
                                          >
                                            <Input style={{ width: '98%' }} maxLength={33} />
                                          </QuestionItem>
                                          
                                          <QuestionItem
                                            question="与您的关系"
                                            name={`companions[${index}].relationship`}
                                            explanation="请选择此同行人与您的关系"
                                          >
                                            <Select placeholder="- 请选择一个 -" style={{ width: '100%' }}>
                                              <Select.Option value="S">配偶</Select.Option>
                                              <Select.Option value="C">子女</Select.Option>
                                              <Select.Option value="P">父母</Select.Option>
                                              <Select.Option value="SB">兄弟姐妹</Select.Option>
                                              <Select.Option value="F">朋友</Select.Option>
                                              <Select.Option value="B">商业伙伴</Select.Option>
                                              <Select.Option value="O">其他</Select.Option>
                                            </Select>
                                          </QuestionItem>
                                          
                                          {/* FormItemButtons 组件，与旅行信息页面保持一致 */}
                                          <FormItemButtons 
                                            onAdd={() => add()}
                                            onRemove={() => {
                                              // 仅在有多于一个同行人时才允许删除
                                              if (fields.length > 1) {
                                                remove(field.name);
                                              }
                                            }}
                                            addText="添加另一位同行人"
                                            removeText="移除"
                                          />
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </Form.List>
                              </div>
                              </div>
                            </div>
                          );
                        }
                        
                        return null;
                      }}
                    </Form.Item>
                  </div>
                );
              } else if (hasCompanions === 'N') {
                // 如果没有同行人，不显示任何后续问题
                return null;
              }
              
              return null;
            }}
          </Form.Item>
        </>
      ),
    },
    {
      title: '过往美国旅行',
      description: '过往美国旅行信息',
      content: (
        <>
          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="您是否曾经在美国停留过？"
                name="everBeenInUS"
              >
                <Radio.Group onChange={(e) => {
                  form.setFieldsValue({ everBeenInUS: e.target.value });
                }}>
                  <Radio value="Y">是 (Yes)</Radio>
                  <Radio value="N">否 (No)</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>
          </div>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.everBeenInUS !== currentValues.everBeenInUS
            }
          >
            {({ getFieldValue }) => {
              const hasBeenInUS = getFieldValue('everBeenInUS');
              
              if (hasBeenInUS === 'Y') {
                return (
                  <div className="field-group callout" style={highlightedBlockStyle}>
                    <h4>
                      <span>请提供最近五次赴美信息：</span>
                    </h4>
                    
                    <Form.List name="previousVisits" initialValue={[{}]}>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => (
                            <div 
                              key={field.key} 
                              style={blockInsideHighlightStyle}
                            >
                              <div className="field-group">
                                  <QuestionItem
                                  question="抵达日期"
                                  name={`previousVisits[${index}].arrivalDate`}
                                  explanation="请输入抵达日期 (格式: DD-MMM-YYYY)"
                                >
                                  <div style={dateBlockStyle}>
                                    <Form.Item 
                                      name={`previousVisits[${index}].day`}
                                      noStyle
                                      rules={[{ required: true, message: '请选择日期' }]}
                                    >
                                      <Select options={dayOptions} style={{ width: 70 }} placeholder="Day" />
                                    </Form.Item>

                                    <Form.Item 
                                      name={`previousVisits[${index}].month`}
                                      noStyle
                                      rules={[{ required: true, message: '请选择月份' }]}
                                    >
                                      <Select options={monthOptions} style={{ width: 80 }} placeholder="Month" />
                                    </Form.Item>
                                    
                                    <Form.Item 
                                      name={`previousVisits[${index}].year`}
                                      noStyle
                                      rules={[
                                        { required: true, message: '请输入年份' },
                                        { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                                      ]}
                                    >
                                      <Input placeholder="Year" style={{ width: '60px' }} maxLength={4} />
                                    </Form.Item>
                                    <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                                      (格式: DD-MMM-YYYY)
                                    </div>
                                  </div>
                                </QuestionItem>
                              </div>
                              
                              <div className="field-group">
                                <QuestionItem
                                  question="停留时间"
                                  name={`previousVisits[${index}].duration`}
                                  explanation="Length of Stay"
                                >
                                  <Input 
                                    style={{ width: 70 }}
                                    maxLength={3}
                                  />
                                </QuestionItem>
                                <QuestionItem
                                  question="单位"
                                  name={`previousVisits[${index}].durationUnit`}
                                >
                                  <Select 
                                    options={losUnitOptions}
                                    style={{ width: 180 }}
                                  />
                                </QuestionItem>
                              </div>
                              
                              <FormItemButtons 
                                onAdd={() => add()}
                                onRemove={() => {
                                  if (fields.length > 1) {
                                    remove(index);
                                  }
                                }}
                                addText="Add Another"
                                removeText="Remove"
                              />
                            </div>
                          ))}
                        </>
                      )}
                    </Form.List>
                    
                    <div className="field-group" style={{ marginTop: 30 }}>
                      <QuestionItem
                        question="您是否持有或者曾经持有美国驾照？"
                        name="hasDriverLicense"
                      >
                        <Radio.Group onChange={(e) => {
                          form.setFieldsValue({ hasDriverLicense: e.target.value });
                        }}>
                          <Radio value="Y">是</Radio>
                          <Radio value="N">否</Radio>
                        </Radio.Group>
                      </QuestionItem>
                    </div>
                    
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) => 
                        prevValues.hasDriverLicense !== currentValues.hasDriverLicense
                      }
                    >
                      {({ getFieldValue }) => {
                        const hasLicense = getFieldValue('hasDriverLicense');
                        
                        if (hasLicense === 'Y') {
                          return (
                            <div className="field-group callout" style={highlightedBlockStyle}>
                              <h4>
                                <span>请提供以下信息：</span>
                              </h4>
                              
                              <Form.List name="driverLicenses" initialValue={[{}]}>
                                {(fields, { add, remove }) => (
                                  <>
                                    {fields.map((field, index) => (
                                      <div 
                                        key={field.key} 
                                        style={blockInsideHighlightStyle}
                                      >
                                        <div className="field-group">
                                          <QuestionItem
                                            question="驾驶执照的号码"
                                            name={`driverLicenses[${index}].licenseNumber`}
                                            hasNaCheckbox={true}
                                            naCheckboxName={`driverLicenses[${index}].licenseNumber_na`}
                                          >
                                            <Input 
                                              style={{ width: '60%' }}
                                              maxLength={20}
                                            />
                                          </QuestionItem>

                                          <QuestionItem
                                            question="驾驶执照所属的州"
                                            name={`driverLicenses[${index}].state`}
                                            >
                                            <Select 
                                              options={usStateOptions}
                                              style={{ width: '100%' }}
                                            />
                                          </QuestionItem>
                                        </div>
                                        
                                        <FormItemButtons 
                                          onAdd={() => add()}
                                          onRemove={() => {
                                            if (fields.length > 1) {
                                              remove(index);
                                            }
                                          }}
                                          addText="Add Another"
                                          removeText="Remove"
                                        />
                                      </div>
                                    ))}
                                  </>
                                )}
                              </Form.List>
                            </div>
                          );
                        }
                        
                        return null;
                      }}
                    </Form.Item>
                  </div>
                );
              }
              
              return null;
            }}
          </Form.Item>

          <Divider />

          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="您是否曾经获得过美国签证?"
                name="previousUsVisa"
                explanation="Have you ever been issued a U.S. Visa?"
              >
                <Radio.Group onChange={(e) => {
                  form.setFieldsValue({ previousUsVisa: e.target.value });
                }}>
                  <Radio value="Y">是 (Yes)</Radio>
                  <Radio value="N">否 (No)</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.previousUsVisa !== currentValues.previousUsVisa
            }
          >
            {({ getFieldValue }) => {
              const hasPreviousVisa = getFieldValue('previousUsVisa');
              
              if (hasPreviousVisa === 'Y') {
                return (
                  <div className="field-group callout" style={highlightedBlockStyle}>
                    <QuestionItem
                      question="上一次美国签证签发日期"
                      name="lastVisaIssueDate"
                      explanation="Date of last U.S. visa issuance"
                    >
                      <div style={dateBlockStyle}>
                        <Form.Item 
                          name="lastVisaDay" 
                          noStyle
                        >
                          <Select options={dayOptions} style={{ width: 70 }} placeholder="Day" />
                        </Form.Item>

                        <Form.Item 
                          name="lastVisaMonth" 
                          noStyle
                        >
                          <Select options={monthOptions} style={{ width: 80 }} placeholder="Month" />
                        </Form.Item>

                        <Form.Item 
                          name="lastVisaYear" 
                          noStyle
                        >
                          <Input placeholder="Year" style={{ width: '60px' }} maxLength={4} />
                        </Form.Item>
                        <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                          (格式: DD-MMM-YYYY)
                        </div>
                      </div>
                    </QuestionItem>
                    
                    <QuestionItem
                      question="上一次签证的签证号码"
                      name="lastVisaNumber"
                      hasNaCheckbox={true}
                      naCheckboxName="lastVisaNumber_na"
                    >
                      <Input style={{ width: '98%' }} />
                    </QuestionItem>
                  </div>
                );
              }
              
              return null;
            }}
          </Form.Item>

          <Divider />

          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="您是否曾经被拒绝美国签证，或在入境口岸被拒入境，或撤销入境申请？"
                name="visaRefused"
                explanation="Have you ever been refused a U.S. Visa, or been refused admission to the United States, or withdrawn your application for admission at the port of entry?"
              >
                <Radio.Group onChange={(e) => {
                  form.setFieldsValue({ visaRefused: e.target.value });
                }}>
                  <Radio value="Y">是 (Yes)</Radio>
                  <Radio value="N">否 (No)</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.visaRefused !== currentValues.visaRefused
            }
          >
            {({ getFieldValue }) => {
              const wasRefused = getFieldValue('visaRefused');
              
              if (wasRefused === 'Y') {
                return (
                  <div className="field-group callout" style={highlightedBlockStyle}>
                    <QuestionItem
                      question="请说明被拒绝签证或入境的原因及日期"
                      name="refusalDetails"
                      explanation="Please explain when and why you were refused"
                    >
                      <TextArea rows={4} style={{ width: '98%' }} />
                    </QuestionItem>
                  </div>
                );
              }
              
              return null;
            }}
          </Form.Item>

          <Divider />

          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="曾有人在公民及移民服务局为您申请过移民吗？"
                name="immigrantPetition"
                explanation="Has anyone ever filed an immigrant petition on your behalf with the United States Citizenship and Immigration Services?"
              >
                <Radio.Group onChange={(e) => {
                  form.setFieldsValue({ immigrantPetition: e.target.value });
                }}>
                  <Radio value="Y">是 (Yes)</Radio>
                  <Radio value="N">否 (No)</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.immigrantPetition !== currentValues.immigrantPetition
            }
          >
            {({ getFieldValue }) => {
              const hasPetition = getFieldValue('immigrantPetition');
              
              if (hasPetition === 'Y') {
                return (
                  <div className="field-group callout" style={highlightedBlockStyle}>
                    <QuestionItem
                      question="请提供申请人信息"
                      name="petitionerInfo"
                      explanation="Please provide information about the petitioner"
                    >
                      <TextArea rows={4} style={{ width: '98%' }} />
                    </QuestionItem>
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
      title: '地址和电话',
      description: '地址和电话信息',
      content: (
        <>
          <div className="field-groups">
            <h3>
              <span>家庭地址</span>
              <span> (Home Address)</span>
            </h3>
            
            <div className="field-group callout" style={highlightedBlockStyle}>
              <QuestionItem
                question="街道地址（第一行）"
                name="homeAddressLine1"
              >
                <Input style={{ width: '95%' }} maxLength={40} />
              </QuestionItem>

              <QuestionItem
                question="街道地址（第二行）"
                name="homeAddressLine2"
                required={false}
              >
                <Input style={{ width: '95%' }} maxLength={40} />
                <span style={{ color: '#891300', fontStyle: 'italic', marginLeft: '8px' }}>*Optional</span>
              </QuestionItem>

              <QuestionItem
                question="城市"
                name="homeCity"
              >
                <Input style={{ width: '95%' }} maxLength={20} />
              </QuestionItem>

              <QuestionItem
                question="州/省份"
                name="homeState"
                hasNaCheckbox={true}
                naCheckboxName="homeState_na"
              >
                <Input style={{ width: '55%' }} maxLength={20} />
              </QuestionItem>

              <QuestionItem
                question="邮政区域/邮政编码"
                name="homePostalCode"
                hasNaCheckbox={true}
                naCheckboxName="homePostalCode_na"
              >
                <Input style={{ width: '45%' }} maxLength={10} />
              </QuestionItem>

              <QuestionItem
                question="国家/地区"
                name="homeCountry"
              >
                <Select 
                  options={countryOptions}
                  style={{ width: '100%' }}
                  placeholder="- Select One -"
                />
              </QuestionItem>
            </div>
          </div>

          <Divider />

          <div className="field-groups">
            <h3>
              <span>邮寄地址</span>
              <span> (Mailing Address)</span>
            </h3>
            
            <div className="q">
              <QuestionItem
                question="您的邮寄地址同于您的家庭地址吗？"
                name="isMailingAddressSame"
              >
                <Radio.Group onChange={(e) => {
                  form.setFieldsValue({ isMailingAddressSame: e.target.value });
                }}>
                  <Radio value="Y">是 (Yes)</Radio>
                  <Radio value="N">否 (No)</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.isMailingAddressSame !== currentValues.isMailingAddressSame
              }
            >
              {({ getFieldValue }) => {
                const isSameAddress = getFieldValue('isMailingAddressSame');
                
                if (isSameAddress === 'N') {
                  return (
                    <div className="field-group callout" style={highlightedBlockStyle}>
                      <QuestionItem
                        question="街道地址（第一行）"
                        name="mailingAddressLine1"
                        explanation="Street Address (Line 1)"
                      >
                        <Input style={{ width: '95%' }} maxLength={40} />
                      </QuestionItem>

                      <QuestionItem
                        question="街道地址（第二行）"
                        name="mailingAddressLine2"
                        explanation="Street Address (Line 2)"
                        required={false}
                      >
                        <Input style={{ width: '95%' }} maxLength={40} />
                        <span style={{ color: '#891300', fontStyle: 'italic', marginLeft: '8px' }}>*Optional</span>
                      </QuestionItem>

                      <QuestionItem
                        question="城市"
                        name="mailingCity"
                        explanation="City"
                      >
                        <Input style={{ width: '95%' }} maxLength={20} />
                      </QuestionItem>

                      <QuestionItem
                        question="州/省份"
                        name="mailingState"
                        explanation="State/Province"
                        hasNaCheckbox={true}
                        naCheckboxName="mailingState_na"
                      >
                        <Input style={{ width: '55%' }} maxLength={20} />
                      </QuestionItem>

                      <QuestionItem
                        question="邮政区域/邮政编码"
                        name="mailingPostalCode"
                        explanation="Postal Zone/ZIP Code"
                        hasNaCheckbox={true}
                        naCheckboxName="mailingPostalCode_na"
                      >
                        <Input style={{ width: '45%' }} maxLength={10} />
                      </QuestionItem>

                      <QuestionItem
                        question="国家/地区"
                        name="mailingCountry"
                        explanation="Country/Region"
                      >
                        <Select 
                          options={countryOptions}
                          style={{ width: '100%' }}
                          placeholder="- Select One -"
                        />
                      </QuestionItem>
                    </div>
                  );
                }
                
                return null;
              }}
            </Form.Item>
          </div>

          <Divider />

          <div className="field-groups">
            <h3>
              <span>电话</span>
              <span> (Phone)</span>
            </h3>
            
            <div className="field-group callout" style={highlightedBlockStyle}>
              <QuestionItem
                question="主要电话号码"
                name="primaryPhone"
                explanation="您需要提供您的主要电话号码。此电话应该是最容易接通您的电话。这个电话可以是座机，也可以是手机/移动电话。如果您还有另外一个座机或手机/移动电话，您可以将它列为备用电话号码。"
              >
                <Input style={{ width: '60%' }} maxLength={15} minLength={5} />
              </QuestionItem>

              <QuestionItem
                question="备用电话号码"
                name="secondaryPhone"
                hasNaCheckbox={true}
                naCheckboxName="secondaryPhone_na"
              >
                <Input style={{ width: '60%' }} maxLength={15} minLength={5} />
              </QuestionItem>

              <QuestionItem
                question="工作电话号码"
                name="workPhone"
                hasNaCheckbox={true}
                naCheckboxName="workPhone_na"
              >
                <Input style={{ width: '60%' }} maxLength={15} minLength={5} />
              </QuestionItem>
            </div>
          </div>

          <Divider />

          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="您是否在过去5年中使用过其他的电话号码？"
                name="hasOtherPhones"
              >
                <Radio.Group onChange={(e) => {
                  form.setFieldsValue({ hasOtherPhones: e.target.value });
                }}>
                  <Radio value="Y">是 (Yes)</Radio>
                  <Radio value="N">否 (No)</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.hasOtherPhones !== currentValues.hasOtherPhones
              }
            >
              {({ getFieldValue }) => {
                const hasOtherPhones = getFieldValue('hasOtherPhones');
                
                if (hasOtherPhones === 'Y') {
                  return (
                    <div className="field-group callout" style={highlightedBlockStyle}>
                      <Form.List name="otherPhones" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field, index) => (
                              <div 
                                key={field.key} 
                                style={{ 
                                  marginBottom: 24, 
                                  padding: 16, 
                                  border: index > 0 ? '1px dashed #d6e8fa' : '1px solid #d6e8fa',
                                  borderRadius: '8px',
                                  backgroundColor: '#f0f8ff'
                                }}
                              >
                                <QuestionItem
                                  question="电话号码"
                                  name={`otherPhones[${index}].phoneNumber`}
                                >
                                  <Input style={{ width: '60%' }} maxLength={15} minLength={5} />
                                </QuestionItem>
                                
                                <FormItemButtons 
                                  onAdd={() => add()}
                                  onRemove={() => {
                                    if (fields.length > 1) {
                                      remove(index);
                                    }
                                  }}
                                  addText="增加另一个"
                                  removeText="移除"
                                />
                              </div>
                            ))}
                          </>
                        )}
                      </Form.List>
                    </div>
                  );
                }
                
                return null;
              }}
            </Form.Item>
          </div>

          <Divider />

          <div className="field-groups">
            <h3>
              <span>电子邮件地址</span>
              <span> (Email Address)</span>
            </h3>
            
            <div className="field-group callout" style={highlightedBlockStyle}>
              <QuestionItem
                question="电子邮件地址"
                name="emailAddress"
              >
                <Input style={{ width: '95%' }} maxLength={50} />
              </QuestionItem>
              <div className="hint">
                <span>(e.g., emailaddress@example.com)</span>
              </div>
            </div>

            <div className="help" style={{ marginTop: '-7px' }}>
              <h4 style={{ color: '#891300' }}>
                <span>帮助：</span>
                <span>电子邮件地址</span>
              </h4>
              <p>
                您必须提供一个电子邮件地址。您所提供的电子邮件地址将用于通信目的。请提供一个安全的且您可以正常进入的电子邮件地址。
              </p>
            </div>
          </div>

          <Divider />

          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="您是否在过去5年中使用过其他的电子邮件地址？"
                name="hasOtherEmails"
              >
                <Radio.Group onChange={(e) => {
                  form.setFieldsValue({ hasOtherEmails: e.target.value });
                }}>
                  <Radio value="Y">是 (Yes)</Radio>
                  <Radio value="N">否 (No)</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.hasOtherEmails !== currentValues.hasOtherEmails
              }
            >
              {({ getFieldValue }) => {
                const hasOtherEmails = getFieldValue('hasOtherEmails');
                
                if (hasOtherEmails === 'Y') {
                  return (
                    <div className="field-group callout" style={highlightedBlockStyle}>
                      <Form.List name="otherEmails" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field, index) => (
                              <div 
                                key={field.key} 
                                style={{ 
                                  marginBottom: 24, 
                                  padding: 16, 
                                  border: index > 0 ? '1px dashed #d6e8fa' : '1px solid #d6e8fa',
                                  borderRadius: '8px',
                                  backgroundColor: '#f0f8ff'
                                }}
                              >
                                <QuestionItem
                                  question="电子邮件地址"
                                  name={`otherEmails[${index}].emailAddress`}
                                  explanation="Email Address"
                                >
                                  <Input style={{ width: '95%' }} maxLength={50} />
                                </QuestionItem>
                                
                                <FormItemButtons 
                                  onAdd={() => add()}
                                  onRemove={() => {
                                    if (fields.length > 1) {
                                      remove(index);
                                    }
                                  }}
                                  addText="增加另一个"
                                  removeText="移除"
                                />
                              </div>
                            ))}
                          </>
                        )}
                      </Form.List>
                    </div>
                  );
                }
                
                return null;
              }}
            </Form.Item>
          </div>

          <Divider />

          <div className="field-groups">
            <h3>
              <span>社交媒体</span>
              <span> (Social Media)</span>
            </h3>
            
            <span>
              <span>您有一个社交媒体吗？</span>
              <span> (Do you have a social media presence?)</span>
            </span>
            
            <h4>
              <span>
                从下面的列表中选择您在过去五年中使用过的每个社交媒体平台。在平台名称旁边的空格中，输入您在该平台上使用的用户名或昵称。请不要提供您的密码。如果在使用了多个社交平台或在一个平台上使用了多个用户名或昵称，请点击"添加另一个"按钮分别列出每个平台。如果您在过去五年内没有使用任何列出的社交媒体平台，请选择"无"。
              </span>
            </h4>

            <div className="field-group callout" style={highlightedBlockStyle}>
              <Form.List name="socialMedia" initialValue={[{ platform: 'NONE' }]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div 
                        key={field.key} 
                        style={{ 
                          marginBottom: 24, 
                          padding: 16, 
                          border: index > 0 ? '1px dashed #d6e8fa' : '1px solid #d6e8fa',
                          borderRadius: '8px',
                          backgroundColor: '#f0f8ff'
                        }}
                      >
                        {/* 社交媒体平台选择 */}
                        <Form.Item
                          name={[field.name, 'platform']}
                          label={
                            <div>
                              <span>社交媒体的提供商/平台</span>
                              <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                输入与您在线状态相关的信息，包括您用于协作、共享信息和与他人在线互动的提供商/平台、应用程序和网站类型信息。列举出与您的社交媒体相关联的用户名、昵称、网名或其他标识符。（您无需列举那些在一个商业或其他组织中为多个用户设计的帐户名称。）
                              </div>
                            </div>
                          }
                          rules={[{ required: true, message: '请选择社交媒体平台' }]}
                        >
                          <Select 
                            style={{ width: '100%' }} 
                            placeholder="- 请选择一个 -"
                          >
                            <Select.Option value="ASKF">ASK.FM</Select.Option>
                            <Select.Option value="DUBN">DOUBAN</Select.Option>
                            <Select.Option value="FCBK">FACEBOOK</Select.Option>
                            <Select.Option value="FLKR">FLICKR</Select.Option>
                            <Select.Option value="GOGL">GOOGLE+</Select.Option>
                            <Select.Option value="INST">INSTAGRAM</Select.Option>
                            <Select.Option value="LINK">LINKEDIN</Select.Option>
                            <Select.Option value="MYSP">MYSPACE</Select.Option>
                            <Select.Option value="PTST">PINTEREST</Select.Option>
                            <Select.Option value="QZNE">QZONE (QQ)</Select.Option>
                            <Select.Option value="RDDT">REDDIT</Select.Option>
                            <Select.Option value="SWBO">SINA WEIBO</Select.Option>
                            <Select.Option value="TWBO">TENCENT WEIBO</Select.Option>
                            <Select.Option value="TUMB">TUMBLR</Select.Option>
                            <Select.Option value="TWIT">TWITTER</Select.Option>
                            <Select.Option value="TWOO">TWOO</Select.Option>
                            <Select.Option value="VINE">VINE</Select.Option>
                            <Select.Option value="VKON">VKONTAKTE (VK)</Select.Option>
                            <Select.Option value="YUKU">YOUKU</Select.Option>
                            <Select.Option value="YTUB">YOUTUBE</Select.Option>
                            <Select.Option value="NONE">NONE</Select.Option>
                          </Select>
                        </Form.Item>
                        
                        {/* 社交媒体标识符 - 使用Form.Item组件的dependencies属性 */}
                        <Form.Item
                          shouldUpdate={(prevValues, currentValues) => {
                            return prevValues?.socialMedia?.[index]?.platform !== 
                                  currentValues?.socialMedia?.[index]?.platform;
                          }}
                          noStyle
                        >
                          {({ getFieldValue }) => {
                            const platformValue = getFieldValue(['socialMedia', index, 'platform']);
                            const isDisabled = platformValue === 'NONE';
                            
                            return (
                              <Form.Item
                                name={[field.name, 'identifier']}
                                label={
                                  <div>
                                    <span>社交媒体标识符</span>
                                    {!isDisabled && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
                                  </div>
                                }
                                rules={[
                                  { required: !isDisabled, message: '请输入社交媒体标识符' }
                                ]}
                              >
                                <Input 
                                  style={{ 
                                    width: '95%',
                                    backgroundColor: isDisabled ? 'LightGrey' : 'white'
                                  }} 
                                  maxLength={50}
                                  disabled={isDisabled}
                                />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                        
                        {/* 添加/删除按钮 */}
                        <FormItemButtons 
                          onAdd={() => add()}
                          onRemove={() => {
                            if (fields.length > 1) {
                              remove(index);
                            }
                          }}
                          addText="增加另一个"
                          removeText="移除"
                        />
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </div>

          </div>

          <Divider />

          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="您是否希望提供有关您在过去五年内用于创建或共享内容（照片、视频、状态更新等）的任何其他网站或应用程序上的状态的信息？"
                name="hasOtherSocialMedia"
              >
                <Radio.Group onChange={(e) => {
                  form.setFieldsValue({ hasOtherSocialMedia: e.target.value });
                }}>
                  <Radio value="Y">是 (Yes)</Radio>
                  <Radio value="N">否 (No)</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.hasOtherSocialMedia !== currentValues.hasOtherSocialMedia
              }
            >
              {({ getFieldValue }) => {
                const hasOtherSocialMedia = getFieldValue('hasOtherSocialMedia');
                
                if (hasOtherSocialMedia === 'Y') {
                  return (
                    <div className="field-group callout" style={highlightedBlockStyle}>
                      <Form.List name="otherSocialMedia" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field, index) => (
                              <div 
                                key={field.key} 
                                style={{ 
                                  marginBottom: 24, 
                                  padding: 16, 
                                  border: index > 0 ? '1px dashed #d6e8fa' : '1px solid #d6e8fa',
                                  borderRadius: '8px',
                                  backgroundColor: '#f0f8ff'
                                }}
                              >
                                <QuestionItem
                                  question="网站/应用程序名称"
                                  name={`otherSocialMedia[${index}].platformName`}
                                  explanation="Website/Application Name"
                                >
                                  <Input style={{ width: '95%' }} maxLength={50} />
                                </QuestionItem>

                                <QuestionItem
                                  question="用户名/标识符"
                                  name={`otherSocialMedia[${index}].identifier`}
                                  explanation="Username/Identifier"
                                >
                                  <Input style={{ width: '95%' }} maxLength={50} />
                                </QuestionItem>
                                
                                <FormItemButtons 
                                  onAdd={() => add()}
                                  onRemove={() => {
                                    if (fields.length > 1) {
                                      remove(index);
                                    }
                                  }}
                                  addText="增加另一个"
                                  removeText="移除"
                                />
                              </div>
                            ))}
                          </>
                        )}
                      </Form.List>
                    </div>
                  );
                }
                
                return null;
              }}
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      title: '护照',
      description: '护照信息',
      content: (
        <>
          <div className="field-groups">
            <h3>
              <span>护照信息</span>
              <span> (Passport Information)</span>
            </h3>
            
            <div className="help">
              <h4 style={{ color: '#891300' }}>
                <span>帮助：</span>
                <span>护照/旅行证件号码</span>
              </h4>
              <p>
                请输入您去美国时将使用的旅行证件信息。您的旅行证件必须是有效的、未过期的护照或者其它有效文件，其足以证明您的身份和国籍。
              </p>
            </div>
            
            <div className="field-group callout" style={highlightedBlockStyle}>
              <QuestionItem
                question="护照/旅行证件种类"
                name="passportType"
                explanation="Passport/Travel Document Type"
              >
                <Select placeholder="- 请选择一个 -" style={{ width: '100%' }}>
                  <Select.Option value="R">普通护照 (REGULAR)</Select.Option>
                  <Select.Option value="O">公务护照 (OFFICIAL)</Select.Option>
                  <Select.Option value="D">外交护照 (DIPLOMATIC)</Select.Option>
                  <Select.Option value="L">通行证 (LAISSEZ-PASSER)</Select.Option>
                  <Select.Option value="T">其他 (OTHER)</Select.Option>
                </Select>
              </QuestionItem>
    
              <QuestionItem
                question="护照/旅行证件号码"
                name="passportNumber"
                explanation="Passport/Travel Document Number"
              >
                <Input style={{ width: '95%' }} maxLength={20} />
              </QuestionItem>
              
              <QuestionItem
                question="护照本编号"
                name="passportBookNumber"
                explanation="The Passport Book Number is commonly called the inventory control number. You may or may not have a Passport Book Number on your passport."
                hasNaCheckbox={true}
                naCheckboxName="passportBookNumber_na"
              >
                <Input style={{ width: '55%' }} maxLength={20} />
              </QuestionItem>
    
              <QuestionItem
                question="颁发护照/旅行证件的国家/机构"
                name="passportIssuedCountry"
                explanation="Country/Authority that Issued Passport/Travel Document"
              >
                <Select 
                  options={countryOptions}
                  style={{ width: '100%' }}
                  placeholder="- 选择一个 -"
                />
              </QuestionItem>
              
              <div className="field-groups">
                <h4>
                  <span>护照签发地</span>
                  <span> (Where was the Passport/Travel Document Issued?)</span>
                </h4>
                <div className="field-group callout" style={blockInsideHighlightStyle}>
                  <QuestionItem
                    question="城市"
                    name="passportIssuedCity"
                    explanation="City"
                  >
                    <Input style={{ width: '95%' }} maxLength={25} />
                  </QuestionItem>
    
                  <QuestionItem
                    question="州/省份"
                    name="passportIssuedState"
                    explanation="State/Province *If shown on passport"
                  >
                    <Input style={{ width: '95%' }} maxLength={25} />
                  </QuestionItem>
    
                  <QuestionItem
                    question="国家/地区"
                    name="passportIssuedInCountry"
                    explanation="Country/Region"
                  >
                    <Select 
                      options={countryOptions}
                      style={{ width: '100%' }}
                      placeholder="- 选择一个 -"
                    />
                  </QuestionItem>
                </div>
              </div>
              
              <div className="field-group">
                <QuestionItem
                  question="签发日期"
                  name="passportIssuedDate"
                  explanation="Issuance Date"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Form.Item 
                      name="passportIssuedDay" 
                      noStyle
                      rules={[{ required: true, message: '请选择日期' }]}
                    >
                      <Select options={dayOptions} style={{ width: '60px' }} placeholder="" />
                    </Form.Item>
    
                    <Form.Item 
                      name="passportIssuedMonth" 
                      noStyle
                      rules={[{ required: true, message: '请选择月份' }]}
                    >
                      <Select options={monthOptions} style={{ width: '70px' }} placeholder="" />
                    </Form.Item>
    
                    <Form.Item 
                      name="passportIssuedYear" 
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
              </div>
              
              <div className="help">
                <h4 style={{ color: '#891300' }}>
                  <span>帮助：</span>
                  <span>失效日期</span>
                </h4>
                <p>
                  通常情况下，您的护照/旅行证件有效期必须距您签证申请和/或抵达美国的日期至少要长出六个月。
                </p>
              </div>
              
              <div className="field-group">
                <QuestionItem
                  question="失效日期"
                  name="passportExpirationDate"
                  explanation="Expiration Date"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Form.Item 
                      name="passportExpirationDay" 
                      noStyle
                      rules={[{ required: true, message: '请选择日期' }]}
                    >
                      <Select options={dayOptions} style={{ width: '60px' }} placeholder="" />
                    </Form.Item>
    
                    <Form.Item 
                      name="passportExpirationMonth" 
                      noStyle
                      rules={[{ required: true, message: '请选择月份' }]}
                    >
                      <Select options={monthOptions} style={{ width: '70px' }} placeholder="" />
                    </Form.Item>
    
                    <Form.Item 
                      name="passportExpirationYear" 
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
                
                <Form.Item 
                  name="passportNoExpiration" 
                  valuePropName="checked"
                  style={{ marginTop: '8px', textAlign: 'right' }}
                >
                  <Checkbox>无失效日期 (No Expiration)</Checkbox>
                </Form.Item>
              </div>
            </div>
          </div>
    
          <Divider />
    
          <div className="field-groups">
            <div className="q">
              <QuestionItem
                question="您的护照是否曾遗失或者被盗？"
                name="hasLostPassport"
                explanation="Have you ever lost a passport or had one stolen?"
              >
                <Radio.Group>
                  <Radio value="Y">是 (Yes)</Radio>
                  <Radio value="N">否 (No)</Radio>
                </Radio.Group>
              </QuestionItem>
            </div>
          </div>
    
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.hasLostPassport !== currentValues.hasLostPassport
            }
          >
            {({ getFieldValue }) => {
              const hasLostPassport = getFieldValue('hasLostPassport');
              
              if (hasLostPassport === 'Y') {
                return (
                  <div className="field-group callout" style={highlightedBlockStyle}>
                    <Form.List name="lostPassports" initialValue={[{}]}>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => (
                            <div 
                              key={field.key} 
                              style={{ 
                                marginBottom: 24, 
                                padding: 16, 
                                border: index > 0 ? '1px dashed #d6e8fa' : '1px solid #d6e8fa',
                                borderRadius: '8px',
                                backgroundColor: '#f0f8ff'
                              }}
                            >
                              <h4>遗失/被盗护照 #{index + 1}</h4>
                              
                              <QuestionItem
                                question="护照号码"
                                name={`lostPassports[${index}].passportNumber`}
                                explanation="Lost/Stolen Passport Number"
                              >
                                <Input style={{ width: '95%' }} maxLength={20} />
                              </QuestionItem>
                              
                              <QuestionItem
                                question="颁发国家/机构"
                                name={`lostPassports[${index}].issuingCountry`}
                                explanation="Country/Authority that Issued Lost/Stolen Passport"
                              >
                                <Select 
                                  options={countryOptions}
                                  style={{ width: '100%' }}
                                  placeholder="- 选择一个 -"
                                />
                              </QuestionItem>
                              
                              <QuestionItem
                                question="护照遗失/被盗说明"
                                name={`lostPassports[${index}].explanation`}
                                explanation="Please explain how the passport was lost or stolen"
                              >
                                <TextArea rows={4} style={{ width: '95%' }} />
                              </QuestionItem>
                              
                              <FormItemButtons 
                                onAdd={() => add()}
                                onRemove={() => {
                                  if (fields.length > 1) {
                                    remove(field.name);
                                  }
                                }}
                                addText="添加另一个"
                                removeText="移除"
                              />
                            </div>
                          ))}
                        </>
                      )}
                    </Form.List>
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
      title: '美国联系人',
      description: '美国联系人信息',
      content: (
        <>
          <div className="field-groups">
            <div className="infoDiv">
              <span>在美国的联系人或组织</span>
            </div>
        
            <div className="field-group callout" style={highlightedBlockStyle}>
              <h4>
                <span>联系人</span>
          </h4>
          
          <div className="field-group callout" style={blockInsideHighlightStyle}>
            <QuestionItem
              question="姓氏"
              name="usPocSurname"
              explanation="您的美国联络人可以是任何在美国的个人。他/她认识您，如有需要，并可以证明您的身份。如果您在美国没有认识的人，您可以输入您此行将要访问的商店、公司或者组织的名"
            >
              <Input style={{ width: '99%' }} maxLength={33} />
            </QuestionItem>
            
            <QuestionItem
              question="名字"
              name="usPocGivenName"
            >
              <Input style={{ width: '99%' }} maxLength={33} />
            </QuestionItem>
            
            <Form.Item 
              name="usPocNameNotKnown" 
              valuePropName="checked"
              style={{ marginTop: '8px', textAlign: 'right', paddingRight: '10px' }}
            >
              <Checkbox>不知道 (Do Not Know)</Checkbox>
            </Form.Item>
          </div>
          
          <QuestionItem
            question="组织名称"
            name="usPocOrganization"
            hasNaCheckbox={true}
            naCheckboxName="usPocOrganizationNotKnown"
          >
            <Input style={{ width: '99%' }} maxLength={33} />
          </QuestionItem>
          
          <QuestionItem
            question="与您的关系"
            name="usPocRelationship"
          >
            <Select placeholder="- 选择一个 -" style={{ width: '100%' }}>
              <Select.Option value="R">亲属 (RELATIVE)</Select.Option>
              <Select.Option value="S">配偶 (SPOUSE)</Select.Option>
              <Select.Option value="C">朋友 (FRIEND)</Select.Option>
              <Select.Option value="B">商业伙伴 (BUSINESS ASSOCIATE)</Select.Option>
              <Select.Option value="P">雇主 (EMPLOYER)</Select.Option>
              <Select.Option value="H">学校官员 (SCHOOL OFFICIAL)</Select.Option>
              <Select.Option value="O">其他 (OTHER)</Select.Option>
            </Select>
          </QuestionItem>
        </div>
        
        <div className="field-groups">
          <h4>
            <span>联系人地址和电话号码</span>
            <span> (Address and Phone Number of Point of Contact)</span>
          </h4>
          
          <div className="field-group callout" style={highlightedBlockStyle}>
            <QuestionItem
              question="美国街道地址（第一行）"
              name="usPocAddressLine1"
            >
              <Input style={{ width: '99%' }} maxLength={40} />
            </QuestionItem>
            
            <QuestionItem
              question="美国街道地址（第二行）"
              name="usPocAddressLine2"
              required={false}
            >
              <Input style={{ width: '99%' }} maxLength={40} />
              <span style={{ color: '#891300', fontStyle: 'italic', marginLeft: '8px' }}>*Optional</span>
            </QuestionItem>
            
            <QuestionItem
              question="城市"
              name="usPocCity"
            >
              <Input style={{ width: '99%' }} maxLength={20} />
            </QuestionItem>
                     
            <QuestionItem
              question="州"
              name="usPocState"
            >
              <Select 
                options={usStateOptions} 
                style={{ width: '98%' }} 
                placeholder="- 请选择 -" />
            </QuestionItem>
            
            <QuestionItem
              question="邮政编码"
              name="usPocZipCode"
              required={false}
            >
              <Input style={{ width: '65%' }} maxLength={10} />
              <div className="hint">
                <span>(例如：55555 或 55555-5555)</span>
              </div>
            </QuestionItem>
            
            <QuestionItem
              question="电话号码"
              name="usPocPhone"
              required={false}
            >
              <Input style={{ width: '65%' }} maxLength={15} minLength={5} />
              <div className="hint">
                <span>(例如：5555555555)</span>
              </div>
            </QuestionItem>
            
            <QuestionItem
              question="电子邮件地址"
              name="usPocEmail"
              required={false}
              hasNaCheckbox={true}
              naCheckboxName="usPocEmail_na"
            >
              <Input 
                style={{ width: '95%' }} 
                maxLength={50} 
              />
              <div className="hint">
                <span>(例如：emailaddress@example.com)</span>
              </div>
            </QuestionItem>
          </div>
        </div>
      </div>
    </>
  ),
    },
    {
      title: '家庭信息',
      description: '亲属信息',
      content: (
        <>
          <div className="field-groups">
            <h2>
              <span>家庭信息：亲属</span>
            </h2>
            
            <div className="note">
              <span>注意：请提供以下有关您生身父母的信息。如果您是领养的，请提供下面有关您养父母的信息。</span>
            </div>
            
            <div className="fieldset-group">
              <fieldset>
                <div className="field-groups">
                  <h3>
                    <span>父亲的全名与出生日期</span>
                  </h3>
                  
                  <div className="field-group callout" style={highlightedBlockStyle}>
                    <QuestionItem
                      question="姓氏"
                      name="fatherSurname"
                      required={false}
                      hasNaCheckbox={true}
                      naCheckboxName="fatherSurname_na"
                    >
                      <Input style={{ width: '99%' }} maxLength={33} placeholder="请输入姓氏" />
                      <div className="hint">
                        <span>(例如：Hernandez Garcia)</span>
                      </div>
                    </QuestionItem>
                    
                    <QuestionItem
                      question="名字"
                      name="fatherGivenName"
                      required={false}
                      hasNaCheckbox={true}
                      naCheckboxName="fatherGivenName_na"
                    >
                      <Input style={{ width: '99%' }} maxLength={33} placeholder="请输入名字" />
                      <div className="hint">
                        <span>(例如：Juan Miguel)</span>
                      </div>
                    </QuestionItem>
                    
                    <QuestionItem
                      question="出生日期"
                      name="fatherDateOfBirth"
                      hasNaCheckbox={true}
                      naCheckboxName="fatherDob_na"
                    >
                      <div style={dateBlockStyle}>
                        <Form.Item 
                          name="fatherDobDay" 
                          noStyle
                          rules={[{ required: !form.getFieldValue('fatherDobUnknown'), message: '请选择日期' }]}
                        >
                          <Select 
                            options={dayOptions} 
                            style={{ width: 70 }} 
                            placeholder="Day" 
                            disabled={form.getFieldValue('fatherDobUnknown')}
                          />
                        </Form.Item>
      
                        <Form.Item 
                          name="fatherDobMonth" 
                          noStyle
                          rules={[{ required: !form.getFieldValue('fatherDobUnknown'), message: '请选择月份' }]}
                        >
                          <Select 
                            options={monthOptions} 
                            style={{ width: 80 }} 
                            placeholder="Month" 
                            disabled={form.getFieldValue('fatherDobUnknown')} 
                          />
                        </Form.Item>
      
                        <Form.Item 
                          name="fatherDobYear" 
                          noStyle
                          rules={[
                            { required: !form.getFieldValue('fatherDobUnknown'), message: '请输入年份' },
                            { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                          ]}
                        >
                          <Input 
                            placeholder="Year" 
                            style={{ width: '60px' }} 
                            maxLength={4} 
                            disabled={form.getFieldValue('fatherDobUnknown')}
                          />
                        </Form.Item>
                        <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                          (格式: DD-MMM-YYYY)
                        </div>
                      </div>
                    </QuestionItem>
                    
                    <div className="field full" style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <div className="q">
                        <QuestionItem
                          question="您父亲是否在美国？"
                          name="fatherInUs"
                          hasNaCheckbox={true}
                          naCheckboxName="fatherInUs_na"
                        >
                          <Radio.Group>
                            <Radio value="Y">是 (Yes)</Radio>
                            <Radio value="N">否 (No)</Radio>
                          </Radio.Group>
                        </QuestionItem>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              
              <div className="hr"></div>
              
              <fieldset>
                <div className="field-groups">
                  <h3>
                    <span>母亲的全名与出生日期</span>
                    <span> (Mother's Full Name and Date of Birth)</span>
                  </h3>
                  
                  <div className="field-group callout" style={highlightedBlockStyle}>
                    <QuestionItem
                      question="姓氏"
                      name="motherSurname"
                      required={false}
                      hasNaCheckbox={true}
                      naCheckboxName="motherSurname_na"
                    >
                      <Input style={{ width: '99%' }} maxLength={33} placeholder="请输入姓氏" />
                      <div className="hint">
                        <span>(例如：Hernandez Garcia)</span>
                      </div>
                    </QuestionItem>
                    
                    <QuestionItem
                      question="名字"
                      name="motherGivenName"
                      required={false}
                      hasNaCheckbox={true}
                      naCheckboxName="motherGivenName_na"
                    >
                      <Input style={{ width: '99%' }} maxLength={33} placeholder="请输入名字" />
                      <div className="hint">
                        <span>(例如：Juanita Miguel)</span>
                      </div>
                    </QuestionItem>
                    
                    <QuestionItem
                      question="出生日期"
                      name="motherDateOfBirth"
                      hasNaCheckbox={true}
                      naCheckboxName="motherDateOfBirth_na"
                    >
                      <div style={dateBlockStyle}>
                        <Form.Item 
                          name="motherDobDay" 
                          noStyle
                          rules={[{ required: !form.getFieldValue('motherDobUnknown'), message: '请选择日期' }]}
                        >
                          <Select 
                            options={dayOptions} 
                            style={{ width: 70 }} 
                            placeholder="Day" 
                            disabled={form.getFieldValue('motherDobUnknown')}
                          />
                        </Form.Item>
      
                        <Form.Item 
                          name="motherDobMonth" 
                          noStyle
                          rules={[{ required: !form.getFieldValue('motherDobUnknown'), message: '请选择月份' }]}
                        >
                          <Select 
                            options={monthOptions} 
                            style={{ width: 80 }} 
                            placeholder="Month" 
                            disabled={form.getFieldValue('motherDobUnknown')}
                          />
                        </Form.Item>
      
                        <Form.Item 
                          name="motherDobYear" 
                          noStyle
                          rules={[
                            { required: !form.getFieldValue('motherDobUnknown'), message: '请输入年份' },
                            { pattern: /^\d{4}$/, message: '请输入4位数年份' }
                          ]}
                        >
                          <Input 
                            placeholder="Year" 
                            style={{ width: '60px' }} 
                            maxLength={4} 
                            disabled={form.getFieldValue('motherDobUnknown')}
                          />
                        </Form.Item>
      
                        <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                          (格式: DD-MMM-YYYY)
                        </div>
                      </div>
                    </QuestionItem>
                    
                    <div className="field full" style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <div className="q">
                        <QuestionItem
                          question="您母亲是否在美国？"
                          name="motherInUs"
                        >
                          <Radio.Group>
                            <Radio value="Y">是 (Yes)</Radio>
                            <Radio value="N">否 (No)</Radio>
                          </Radio.Group>
                        </QuestionItem>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              
              <div className="hr"></div>
              
              <fieldset>
                <div className="field-groups">
                  <div className="q">
                    <QuestionItem
                      question="除父母以外，您在美国是否还有其他直系亲属?"
                      name="hasOtherRelativesInUs"
                    >
                      <Radio.Group>
                        <Radio value="Y">是 (Yes)</Radio>
                        <Radio value="N">否 (No)</Radio>
                      </Radio.Group>
                    </QuestionItem>
                  </div>
                </div>
                
                <div className="help">
                  <h4 style={{ color: '#891300' }}>
                    <span>帮助：</span>
                    <span>直系亲属</span>
                  </h4>
                  <p>
                    <span>指未婚夫/妻、配偶（丈夫/妻子）、子女（儿子/女儿）或者兄弟/姐妹。</span>
                    <span> (Means fiancé/fiancée, spouse (husband/wife), child (son/daughter), or sibling (brother/sister).)</span>
                  </p>
                </div>
                
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => 
                    prevValues.hasOtherRelativesInUs !== currentValues.hasOtherRelativesInUs
                  }
                >
                  {({ getFieldValue }) => {
                    const hasOtherRelatives = getFieldValue('hasOtherRelativesInUs');
                    
                    if (hasOtherRelatives === 'Y') {
                      return (
                        <div className="field-group callout" style={highlightedBlockStyle}>
                          <Form.List name="otherRelatives" initialValue={[{}]}>
                            {(fields, { add, remove }) => (
                              <>
                                {fields.map((field, index) => (
                                  <div 
                                    key={field.key} 
                                    style={{ 
                                      marginBottom: 24, 
                                      padding: 16, 
                                      border: index > 0 ? '1px dashed #d6e8fa' : '1px solid #d6e8fa',
                                      borderRadius: '8px',
                                      backgroundColor: '#f0f8ff'
                                    }}
                                  >
                                    <h4>亲属 #{index + 1}</h4>
                                    
                                    <QuestionItem
                                      question="姓氏"
                                      name={`otherRelatives[${index}].surname`}
                                    >
                                      <Input style={{ width: '99%' }} maxLength={33} placeholder="请输入姓氏" />
                                    </QuestionItem>
                                    
                                    <QuestionItem
                                      question="名字"
                                      name={`otherRelatives[${index}].givenName`}
                                    >
                                      <Input style={{ width: '99%' }} maxLength={33} placeholder="请输入名字" />
                                    </QuestionItem>
                                    
                                    <QuestionItem
                                      question="与您的关系"
                                      name={`otherRelatives[${index}].relationship`}
                                    >
                                      <Select placeholder="- 请选择一个 -" style={{ width: '100%' }}>
                                        <Select.Option value="F">未婚夫/妻 (FIANCE/FIANCEE)</Select.Option>
                                        <Select.Option value="S">配偶 (SPOUSE)</Select.Option>
                                        <Select.Option value="C">子女 (CHILD)</Select.Option>
                                        <Select.Option value="B">兄弟/姐妹 (SIBLING)</Select.Option>
                                      </Select>
                                    </QuestionItem>
                                    
                                    <QuestionItem
                                      question="移民身份"
                                      name={`otherRelatives[${index}].status`}
                                    >
                                      <Select placeholder="- 请选择一个 -" style={{ width: '100%' }}>
                                        <Select.Option value="U">美国公民 (U.S. CITIZEN)</Select.Option>
                                        <Select.Option value="L">合法永久居民 (LPR)</Select.Option>
                                        <Select.Option value="N">非移民 (NON-IMMIGRANT)</Select.Option>
                                        <Select.Option value="O">其他/我不知道 (OTHER/I DON'T KNOW)</Select.Option>
                                      </Select>
                                    </QuestionItem>
                                    
                                    <FormItemButtons 
                                      onAdd={() => add()}
                                      onRemove={() => {
                                        if (fields.length > 1) {
                                          remove(field.name);
                                        }
                                      }}
                                      addText="添加另一位亲属"
                                      removeText="移除"
                                    />
                                  </div>
                                ))}
                              </>
                            )}
                          </Form.List>
                        </div>
                      );
                    }
                    
                    return null;
                  }}
                </Form.Item>
              </fieldset>
            </div>
          </div>
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
      
      // Add current step to completed steps if not already included
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      // Add next step to completed steps list
      if (!completedSteps.includes(currentStep + 1)) {
        setCompletedSteps([...completedSteps, currentStep + 1]);
      }
      
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Add this new function here
  const handleStepChange = (current: number) => {
    // Only allow navigation to completed steps
    if (completedSteps.includes(current)) {
      setCurrentStep(current);
    } else {
      message.warning('请先完成当前步骤');
    }
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
        <ApplicationIdDisplay formId={formId} />
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Left sidebar with steps */}
          <div style={{ width: '25%', minWidth: '200px' }}>
          <Steps
            current={currentStep}
            direction="vertical"
            onChange={handleStepChange}
            items={steps.map((item, index) => ({
              title: item.title,
              description: item.description,
              style: completedSteps.includes(index) ? { cursor: 'pointer' } : {},
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
