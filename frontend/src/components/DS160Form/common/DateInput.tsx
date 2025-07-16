import React from 'react';
import { Form, Select, Input } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import {
  historicalDateValidator,
  notFutureDateValidator,
  futureDateValidator,
  notEarlierThanBirthDateValidator,
  earlierThanBirthDateValidator,
  notEarlierThanTodayValidator,
  earlierThanTodayValidator,
  notEarlierThanStartDateValidator,

  MIN_HISTORICAL_DATE_MESSAGE,
  FUTURE_DATE_MESSAGE,
  AFTER_BIRTH_DATE_MESSAGE,
  EARLIER_THAN_TODAY_MESSAGE,
  EARLIER_THAN_BIRTH_DATE_MESSAGE,
  MUST_BE_EARLIER_THAN_TODAY_MESSAGE,
  EARLIER_THAN_START_DATE_MESSAGE
} from '../utils/validationRules';

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
  birthDate?: {
    day: string;
    month: string;
    year: string;
  };
  startDate?: {
    day: string;
    month: string;
    year: string;
  };
  listName?: NamePath;
  required?: boolean;
  disabled?: boolean;
  validateHistoricalDate?: boolean; // Validate date is not earlier than May 15, 1915
  validateNotFutureDate?: boolean; // Validate date is not in the future
  validateFutureDate?: boolean; // Validate date is strictly after today
  validateNotEarlierThanBirthDate?: boolean; // Validate date is not earlier than birth date
  validateNotEarlierThanToday?: boolean; // Validate date is today or in the future
  validateEarlierThanBirthDate?: boolean; // Validate date is earlier than birth date
  validateEarlierThanToday?: boolean; // Validate date is earlier than today (in the past)
  validateNotEarlierThanStartDate?: boolean; // Validate date is not earlier than start date
  naCheckboxName?: string | (string | number)[]; // Name of the N/A checkbox to check
}

const DateInput: React.FC<DateInputProps> = ({
  dayName,
  monthName,
  yearName,
  birthDate,
  startDate,
  listName,
  required = true,
  disabled = false,
  validateHistoricalDate = false,
  validateNotFutureDate = false,
  validateFutureDate = false,
  validateNotEarlierThanBirthDate = false,
  validateNotEarlierThanToday = false,
  validateEarlierThanBirthDate = false,
  validateEarlierThanToday = false,
  validateNotEarlierThanStartDate = false,
  naCheckboxName,
}) => {
  const dateBlockStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const form = Form.useFormInstance();

  // Check if the N/A checkbox is checked
  const isNaChecked = naCheckboxName ? form.getFieldValue(naCheckboxName) : false;

  // Custom validator that combines all validation rules
  const validateDate = () => ({
    validator: (_: any, __: any) => {
      // Skip validation if N/A checkbox is checked
      if (isNaChecked) {
        return Promise.resolve();
      }

      const day = form.getFieldValue(listName ? [listName, ...dayName] : dayName);
      const month = form.getFieldValue(listName ? [listName, ...monthName] : monthName);
      const year = form.getFieldValue(listName ? [listName, ...yearName] : yearName);
      console.log(day, month, year);
      console.log(listName ? [listName, ...dayName] : dayName);
      console.log(listName ? [listName, ...monthName] : monthName);
      console.log(listName ? [listName, ...yearName] : yearName);
      // Skip validation if any field is empty
      if (!day || !month || !year) {
        return Promise.resolve();
      }

      // Validate historical date if required
      if (validateHistoricalDate && !historicalDateValidator(day, month, year)) {
        return Promise.reject(MIN_HISTORICAL_DATE_MESSAGE);
      }

      // Validate not future date if required
      if (validateNotFutureDate && !notFutureDateValidator(day, month, year)) {
        return Promise.reject(FUTURE_DATE_MESSAGE);
      }

      // Validate date is today or future if required
      if (validateNotEarlierThanToday && !notEarlierThanTodayValidator(day, month, year)) {
        return Promise.reject(EARLIER_THAN_TODAY_MESSAGE);
      }
      
      // Validate future date if required
      if (validateFutureDate && !futureDateValidator(day, month, year)) {
        return Promise.reject(FUTURE_DATE_MESSAGE);
      }

      // Validate date is not earlier than birth date if required
      if (validateNotEarlierThanBirthDate && birthDate && !notEarlierThanBirthDateValidator(day, month, year, birthDate.day, birthDate.month, birthDate.year)) {
        return Promise.reject(AFTER_BIRTH_DATE_MESSAGE);
      }

      // Validate date is earlier than birth date if required
      if (validateEarlierThanBirthDate && birthDate && !earlierThanBirthDateValidator(day, month, year, birthDate.day, birthDate.month, birthDate.year)) {
        return Promise.reject(EARLIER_THAN_BIRTH_DATE_MESSAGE);
      }

      // Validate date is earlier than today if required
      if (validateEarlierThanToday && !earlierThanTodayValidator(day, month, year)) {
        return Promise.reject(MUST_BE_EARLIER_THAN_TODAY_MESSAGE);
      }

      // Validate date is not earlier than start date if required
      if (validateNotEarlierThanStartDate && startDate && !notEarlierThanStartDateValidator(day, month, year, startDate.day, startDate.month, startDate.year)) {
        return Promise.reject(EARLIER_THAN_START_DATE_MESSAGE);
      }

      return Promise.resolve();
    }
  });

  return (
    <div>
      <div style={dateBlockStyle}>

        <Form.Item
          name={dayName}
          noStyle
          rules={required && !isNaChecked ? [
            { required: true, message: '请选择日期' },
            ...(validateHistoricalDate || validateNotFutureDate || validateFutureDate || validateNotEarlierThanBirthDate || validateNotEarlierThanToday || validateEarlierThanBirthDate || validateEarlierThanToday || validateNotEarlierThanStartDate ? [validateDate()] : [])
          ] : [
            ...(validateHistoricalDate || validateNotFutureDate || validateFutureDate || validateNotEarlierThanBirthDate || validateNotEarlierThanToday || validateEarlierThanBirthDate || validateEarlierThanToday || validateNotEarlierThanStartDate ? [validateDate()] : [])
          ]}
          dependencies={[monthName, yearName]}
        >
          <Select
            options={dayOptions}
            style={{ width: 70 }}
            placeholder="日"
            disabled={disabled || isNaChecked}
            showSearch
            filterOption={(input, option) => 
              option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || false
            }
          />
        </Form.Item>

        <Form.Item
          name={monthName}
          noStyle
          rules={required && !isNaChecked ? [
            { required: true, message: '请选择月份' },
            ...(validateHistoricalDate || validateNotFutureDate || validateFutureDate || validateNotEarlierThanBirthDate || validateNotEarlierThanToday || validateEarlierThanBirthDate || validateEarlierThanToday || validateNotEarlierThanStartDate ? [validateDate()] : [])
          ] : [
            ...(validateHistoricalDate || validateNotFutureDate || validateFutureDate || validateNotEarlierThanBirthDate || validateNotEarlierThanToday || validateEarlierThanBirthDate || validateEarlierThanToday || validateNotEarlierThanStartDate ? [validateDate()] : [])
          ]}
          dependencies={[dayName, yearName]}
        >
          <Select
            options={monthOptions}
            style={{ width: 80 }}
            placeholder="月"
            disabled={disabled || isNaChecked}
          />
        </Form.Item>

        <Form.Item
          name={yearName}
          noStyle
          rules={required && !isNaChecked ? [
            { required: true, message: '请输入年份' },
            { pattern: /^\d{4}$/, message: '请输入4位数年份' },
            ...(validateHistoricalDate || validateNotFutureDate || validateFutureDate || validateNotEarlierThanBirthDate || validateNotEarlierThanToday || validateEarlierThanBirthDate || validateEarlierThanToday || validateNotEarlierThanStartDate ? [validateDate()] : [])
          ] : [
            { pattern: /^\d{4}$/, message: '请输入4位数年份' },
            ...(validateHistoricalDate || validateNotFutureDate || validateFutureDate || validateNotEarlierThanBirthDate || validateNotEarlierThanToday || validateEarlierThanBirthDate || validateEarlierThanToday || validateNotEarlierThanStartDate ? [validateDate()] : [])
          ]}
          dependencies={[dayName, monthName]}
        >
          <Input
            placeholder="年"
            style={{ width: '60px' }}
            maxLength={4}
            disabled={disabled || isNaChecked}
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
