import React from 'react';
import { Form, Select, Input } from 'antd';
import { NamePath } from 'antd/lib/form/interface';

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

interface DateInputProps {
  dayName: NamePath;
  monthName: NamePath;
  yearName: NamePath;
  required?: boolean;
  disabled?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  dayName,
  monthName,
  yearName,
  required = true,
  disabled = false,
}) => {
  const dateBlockStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  return (
    <div>
      <div style={dateBlockStyle}>
        <Form.Item 
          name={dayName} 
          noStyle
          rules={required ? [{ required: true, message: '请选择日期' }] : []}
        >
          <Select 
            options={dayOptions} 
            style={{ width: 70 }} 
            placeholder="日" 
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item 
          name={monthName} 
          noStyle
          rules={required ? [{ required: true, message: '请选择月份' }] : []}
        >
          <Select 
            options={monthOptions} 
            style={{ width: 80 }} 
            placeholder="月" 
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item 
          name={yearName} 
          noStyle
          rules={required ? [
            { required: true, message: '请输入年份' },
            { pattern: /^\d{4}$/, message: '请输入4位数年份' }
          ] : []}
        >
          <Input 
            placeholder="年" 
            style={{ width: '60px' }} 
            maxLength={4} 
            disabled={disabled}
          />
        </Form.Item>
      </div>
      
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        (格式: DD-MM-YYYY)
      </div>
    </div>
  );
};

export default DateInput;
