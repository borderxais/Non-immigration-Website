// Validation rules for DS-160 form fields

/**
 * Regular expression patterns for field validation
 */

// Name field patterns (English and Chinese characters with spaces)
export const namePattern = /^[A-Za-z\u4e00-\u9fa5\s]+$/;
export const namePatternMessage = '只能包含英文或中文字符和空格';

// English-only name patterns (for passport fields)
export const englishNamePattern = /^[A-Za-z\s]+$/;
export const englishNamePatternMessage = '只能包含英文字母和空格';

// Address field patterns (allows more characters including numbers and punctuation)
export const addressPattern = /^[A-Za-z0-9\u4e00-\u9fa5\s,.#\-/']+$/;
export const addressPatternMessage = '只能包含英文、中文字符、数字和常见标点符号';

// Numeric patterns
export const numericPattern = /^\d+$/;
export const numericPatternMessage = '只能包含数字';

// Telecode patterns (sets of four numbers separated by spaces)
export const telecodePattern = /^(\d{4}\s)*\d{4}$/;
export const telecodePatternMessage = '只能包含由空格分隔的四位数字组';

// Phone number pattern (allows digits, spaces, and + for country code)
export const phonePattern = /^[0-9\s+\-()]+$/;
export const phonePatternMessage = '只能包含数字、空格和电话符号(+、-、()等)';

// Email pattern
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const emailPatternMessage = '请输入有效的电子邮件地址';

// Passport number pattern (alphanumeric with spaces between characters)
export const passportPattern = /^[A-Z0-9]+(?: [A-Z0-9]+)*$/;
export const passportPatternMessage = '只能包含大写字母、数字和字符/数字之间的单个空格';
export const passportMaxLength = 20;

// U.S. Social Security Number pattern (exactly 9 digits)
export const usSsnPattern = /^\d{9}$/;
export const usSsnPatternMessage = '只能包含9位数字';

// U.S. Taxpayer ID Number pattern (only numbers)
export const usTaxpayerIdPattern = /^\d+$/;
export const usTaxpayerIdPatternMessage = '只能包含数字';

// Social media identifier pattern (alphanumeric with some special characters)
export const socialMediaPattern = /^[A-Za-z0-9_.\-@]+$/;
export const socialMediaPatternMessage = '只能包含字母、数字和特殊字符(_、.、-、@)';

/**
 * Date validation constants
 */
// Minimum date for historical dates (birthdays, issue dates, etc.)
export const MIN_HISTORICAL_DATE = new Date(1915, 4, 15); // May 15, 1915
export const MIN_HISTORICAL_DATE_MESSAGE = '日期不能早于1915年5月15日';

// Current date (for maximum date validation)
export const CURRENT_DATE = new Date();

/**
 * Common field validation functions
 */

// Validator for name fields (English and Chinese characters with spaces)
export const nameValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return namePattern.test(value);
};

// Validator for English-only name fields
export const englishNameValidator = (value: any) => {
  if (!value) return true;
  return englishNamePattern.test(value);
};

// Validator for address fields
export const addressValidator = (value: any) => {
  if (!value) return true;
  return addressPattern.test(value);
};

// Validator for numeric fields
export const numericValidator = (value: any) => {
  if (!value) return true;
  return numericPattern.test(value);
};

// Validator for telecode fields
export const telecodeValidator = (value: any) => {
  if (!value) return true;
  return telecodePattern.test(value);
};

// Validator for phone number fields
export const phoneValidator = (value: any) => {
  if (!value) return true;
  return phonePattern.test(value);
};

// Validator for email fields
export const emailValidator = (value: any) => {
  if (!value) return true;
  return emailPattern.test(value);
};

// Validator for passport number fields
export const passportValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return passportPattern.test(value) && value.length <= passportMaxLength;
};

// Validator for U.S. Social Security Number
export const usSsnValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return usSsnPattern.test(value);
};

// Validator for U.S. Taxpayer ID Number
export const usTaxpayerIdValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return usTaxpayerIdPattern.test(value);
};

// Validator for date fields to ensure they are not earlier than May 15, 1915
export const historicalDateValidator = (day: string, month: string, year: string) => {
  if (!day || !month || !year) return true; // Empty values are handled by required rule
  
  // Convert month string to month number (0-11)
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };
  
  const monthNum = monthMap[month];
  if (monthNum === undefined) return false;
  
  const inputDate = new Date(parseInt(year), monthNum, parseInt(day));
  return inputDate >= MIN_HISTORICAL_DATE;
};

// Validator to ensure a date is not in the future
export const notFutureDateValidator = (day: string, month: string, year: string) => {
  if (!day || !month || !year) return true;
  
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };
  
  const monthNum = monthMap[month];
  if (monthNum === undefined) return false;
  
  const inputDate = new Date(parseInt(year), monthNum, parseInt(day));
  return inputDate <= CURRENT_DATE;
};

// Validator to ensure a date is strictly after today (for future dates like arrival dates)
export const futureDateValidator = (day: string, month: string, year: string) => {
  if (!day || !month || !year) return true;
  
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };
  
  const monthNum = monthMap[month];
  if (monthNum === undefined) return false;
  
  // Create a date object for the input date
  const inputDate = new Date(parseInt(year), monthNum, parseInt(day));
  
  // Create a date object for today, but reset the time to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if the input date is strictly after today
  return inputDate > today;
};

/**
 * Common field length constraints
 */
export const maxLengths = {
  name: 33,           // Name fields (surname, given name, etc.)
  nativeName: 100,    // Native name fields
  address: 50,        // Address fields
  city: 30,           // City names
  state: 30,          // State/province names
  postalCode: 10,     // Postal/ZIP codes
  phone: 20,          // Phone numbers
  email: 50,          // Email addresses
  passport: 20,       // Passport numbers
  explanation: 4000,  // Explanation text areas
  socialMedia: 30,    // Social media identifiers
  telecode: 20        // Telecode fields
};
