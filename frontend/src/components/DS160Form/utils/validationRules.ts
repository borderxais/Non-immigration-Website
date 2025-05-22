// Validation rules for DS-160 form fields

/**
 * Regular expression patterns for field validation
 */

// Name field patterns (Uppercase English letters, Chinese characters, and single spaces between names)
export const namePattern = /^[A-Z\u4e00-\u9fa5]+(?: [A-Z\u4e00-\u9fa5]+)*$/;
export const namePatternMessage = '只能包含大写英文字母、中文字符和名字之间的单个空格';

// English-only name patterns
export const englishNamePattern = /^[A-Z]+(?: [A-Z]+)*$/;
export const englishNamePatternMessage = '只能包含大写英文字母和名字之间的单个空格';

// Address field patterns (allows more characters including numbers and punctuation)
export const addressPattern = /^[A-Z0-9\u4e00-\u9fa5#$*%&;!@^?><().,'\-\s]+$/;
export const addressPatternMessage = "只能包含大写英文字母、数字、中文字符、特殊字符(#、$、*、%、&、;、!、@、^、?、>、<)、括号、句点(.)、撇号(')、逗号(,)、连字符(-)和空格";

// English-only address patterns
export const englishAddressPattern = /^[A-Z0-9#$*%&;!@^?><().,'\-\s]+$/;
export const englishAddressPatternMessage = "只能包含大写英文字母、数字、特殊字符(#、$、*、%、&、;、!、@、^、?、>、<)、括号、句点(.)、撇号(')、逗号(,)、连字符(-)和空格";

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

// ID Document pattern (passport, national ID) - alphanumeric with spaces
export const idDocumentPattern = /^[A-Z0-9]+(?: [A-Z0-9]+)*$/;
export const idDocumentPatternMessage = '只能包含大写字母、数字和字符/数字之间的单个空格';

// U.S. Social Security Number pattern (exactly 9 digits)
export const usSsnPattern = /^\d{9}$/;
export const usSsnPatternMessage = '只能包含9位数字';

// Flight number pattern (alphanumeric with spaces between characters)
export const flightNumberPattern = /^[A-Z0-9]+(?: [A-Z0-9]+)*$/;
export const flightNumberPatternMessage = '只能包含大写字母、数字和字符/数字之间的单个空格';

// ZIP code pattern (format: 12345 or 12345-1234)
export const zipCodePattern = /^\d{5}(?:-\d{4})?$/;
export const zipCodePatternMessage = '邮政编码格式不正确 (例如: 12345 或 12345-1234)';

// Location pattern (for city and state/province fields)
// A-Z, 0-9, $, ?, period (.), apostrophe ('), comma (,), hyphen (-), space, and Chinese characters
export const locationPattern = /^[A-Z0-9$?.',-\s\u4e00-\u9fa5·]+$/;
export const locationPatternMessage = "只能包含大写字母、数字、中文字符、$、?、句点(.)、撇号(')、逗号(,)、连字符(-)和空格";

// Explanation field pattern (for security background explanations and other detailed text fields)
// A-Z, 0-9, #, $, *, %, &, (;), !, @, ^, ?, >, <, parens (), period (.), apostrophe ('), comma (,), hyphen (-), and space
export const explanationPattern = /^[A-Z0-9#$*%&;!@^?><().,'\-\s]+$/;
export const explanationPatternMessage = "只能包含大写字母、数字、特殊符号(#, $, *, %, &, ;, !, @, ^, ?, >, <)、括号()、句点(.)、撇号(')、逗号(,)、连字符(-)和空格";

// Receipt number pattern (only uppercase letters and numbers, no spaces)
export const receiptNumberPattern = /^[A-Z0-9]+$/;
export const receiptNumberPatternMessage = '只能包含大写字母和数字';

// ZIP code pattern (A-Z, 0-9, hyphen, and single spaces)
export const stateZipCodePattern = /^[A-Z0-9]+(?: [A-Z0-9]+)*(?:-[A-Z0-9]+)*$/;
export const stateZipCodePatternMessage = '只能包含大写字母、数字、连字符(-)和单个空格';

// Phone number pattern (5-15 digits, no spaces or hyphens)
export const numPhonePattern = /^\d{5,15}$/;
export const numPhonePatternMessage = '电话号码必须为5-15位数字，不含空格或连字符';

// Relationship pattern (A-Z, 0-9, Chinese characters, and spaces)
export const relationshipPattern = /^[A-Z0-9\u4e00-\u9fa5·]+(?: [A-Z0-9\u4e00-\u9fa5·]+)*$/;
export const relationshipPatternMessage = '只能包含大写字母、数字、中文字符和单个空格';

// Driver's License Number pattern (A-Z, 0-9, period, hyphen, and space)
export const driverLicensePattern = /^[A-Z0-9.\- ]+$/;
export const driverLicensePatternMessage = '只能包含大写字母、数字、句点(.)、连字符(-)和空格';

// Organization/employer name pattern (A-Z, 0-9, hyphen, apostrophe, ampersand, single spaces)
export const organizationNamePattern = /^[A-Z0-9&'-]+(?: [A-Z0-9&'-]+)*$/;
export const organizationNamePatternMessage = "只能包含大写字母、数字、连字符(-)、撇号(')、和号(&)和名称之间的单个空格";

/**
 * Date validation constants
 */
// Minimum date for historical dates (birthdays, issue dates, etc.)
export const MIN_HISTORICAL_DATE = new Date(1915, 4, 15); // May 15, 1915
export const MIN_HISTORICAL_DATE_MESSAGE = '日期不能早于1915年5月15日';
export const FUTURE_DATE_MESSAGE = '日期不能是未来日期';
export const AFTER_BIRTH_DATE_MESSAGE = '日期不能早于你的出生日期';
export const FUTURE_YEAR_MESSAGE = '年份不能晚于当前年份';
export const BEFORE_BIRTH_YEAR_MESSAGE = '年份不能早于出生年份';
export const EARLIER_THAN_TODAY_MESSAGE = '日期不能早于今天';
export const EARLIER_THAN_BIRTH_DATE_MESSAGE = '日期必须早于你的出生日期';
export const MUST_BE_EARLIER_THAN_TODAY_MESSAGE = '日期必须早于今天';
// Current date (for maximum date validation)
export const CURRENT_DATE = new Date();
export const EARLIER_THAN_START_DATE_MESSAGE = '结束日期不能早于开始日期';

/**
 * Common field validation functions
 */

// Validator for name fields (Uppercase English letters, Chinese characters, and single spaces between names)
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

export const englishAddressValidator = (value: any) => {
  if (!value) return true;
  return englishAddressPattern.test(value);
};

// Validator for numeric fields
export const numericValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
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

// Validator for ID documents (passport, national ID)
export const idDocumentValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return idDocumentPattern.test(value) && value.length <= maxLengths.idDocument;
};

// Validator for U.S. Social Security Number
export const usSsnValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return usSsnPattern.test(value);
};

// Validator for flight numbers
export const flightNumberValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return flightNumberPattern.test(value);
};

// Validator for ZIP codes
export const zipCodeValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return zipCodePattern.test(value);
};

// Validator for location fields (city and state/province)
export const locationValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return locationPattern.test(value);
};

// Validator for explanation fields
export const explanationValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return explanationPattern.test(value);
};

// Validator for receipt numbers
export const receiptNumberValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return receiptNumberPattern.test(value);
};

// Validator for mission ZIP codes
export const stateZipCodeValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return stateZipCodePattern.test(value);
};

// Validator for mission phone numbers
export const numPhoneValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return numPhonePattern.test(value);
};

// Validator for relationship fields
export const relationshipValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return relationshipPattern.test(value);
};

// Validator for driver's license numbers
export const driverLicenseValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return driverLicensePattern.test(value);
};

// Validator for organization/employer names
export const organizationNameValidator = (value: any) => {
  if (!value) return true; // Empty values are handled by required rule
  return organizationNamePattern.test(value);
};

// Validator to ensure a date is not earlier than May 15, 1915
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

// Validator to ensure a date is not earlier than today (today or in the future)
export const notEarlierThanTodayValidator = (day: string, month: string, year: string) => {
  if (!day || !month || !year) return true;
  
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11,
    '01': 0, '02': 1, '03': 2, '04': 3, '05': 4, '06': 5,
    '07': 6, '08': 7, '09': 8, '10': 9, '11': 10, '12': 11,
    '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5,
    '7': 6, '8': 7, '9': 8
  };
  
  const monthNum = monthMap[month];
  
  if (monthNum === undefined) {
    console.log('Invalid month format:', month);
    return false;
  }
  
  // Create date objects for the input date and today
  const inputDate = new Date(parseInt(year), monthNum, parseInt(day));
  const today = new Date();
  
  // Reset today's time to midnight for accurate date comparison
  today.setHours(0, 0, 0, 0);
  
  console.log('Comparing dates for notEarlierThanTodayValidator:', { 
    inputDate: inputDate.toISOString(), 
    today: today.toISOString(),
    result: inputDate >= today
  });
  
  // Check if the input date is today or in the future
  return inputDate >= today;
};

// Validator to ensure a date is not earlier than birth date
export const notEarlierThanBirthDateValidator = (day: string, month: string, year: string, birthDay: string, birthMonth: string, birthYear: string) => {
  console.log('notEarlierThanBirthDateValidator called with:', {
    inputDate: { day, month, year },
    birthDate: { birthDay, birthMonth, birthYear }
  });
  
  if (!day || !month || !year || !birthDay || !birthMonth || !birthYear) {
    console.log('Missing date components, skipping validation');
    return true;
  }
  
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11,
    '01': 0, '02': 1, '03': 2, '04': 3, '05': 4, '06': 5,
    '07': 6, '08': 7, '09': 8, '10': 9, '11': 10, '12': 11,
    '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5,
    '7': 6, '8': 7, '9': 8
  };
  
  const monthNum = monthMap[month];
  const birthMonthNum = monthMap[birthMonth];
  
  console.log('Month numbers:', { monthNum, birthMonthNum });
  
  if (monthNum === undefined || birthMonthNum === undefined) {
    console.log('Invalid month format:', { month, birthMonth });
    return false;
  }
  
  const inputDate = new Date(parseInt(year), monthNum, parseInt(day));
  const birthDate = new Date(parseInt(birthYear), birthMonthNum, parseInt(birthDay));
  
  console.log('Comparing dates:', { 
    inputDate: inputDate.toISOString(), 
    birthDate: birthDate.toISOString(),
    result: inputDate >= birthDate
  });
  
  // Check if the input date is not earlier than birth date
  return inputDate >= birthDate;
};

// Validator to ensure a date is earlier than birth date
export const earlierThanBirthDateValidator = (day: string, month: string, year: string, birthDay: string, birthMonth: string, birthYear: string) => {
  if (!day || !month || !year || !birthDay || !birthMonth || !birthYear) return true;
  
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };
  
  const monthNum = monthMap[month];
  const birthMonthNum = monthMap[birthMonth];
  
  if (monthNum === undefined || birthMonthNum === undefined) return false;
  
  const inputDate = new Date(parseInt(year), monthNum, parseInt(day));
  const birthDate = new Date(parseInt(birthYear), birthMonthNum, parseInt(birthDay));
  
  // Check if the input date is earlier than birth date
  return inputDate < birthDate;
};

// Validator to ensure a date is earlier than today (in the past)
export const earlierThanTodayValidator = (day: string, month: string, year: string) => {
  if (!day || !month || !year) return true;
  
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11,
    '01': 0, '02': 1, '03': 2, '04': 3, '05': 4, '06': 5,
    '07': 6, '08': 7, '09': 8, '10': 9, '11': 10, '12': 11,
    '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5,
    '7': 6, '8': 7, '9': 8
  };
  
  const monthNum = monthMap[month];
  
  if (monthNum === undefined) {
    console.log('Invalid month format:', month);
    return false;
  }
  
  // Create date objects for the input date and today
  const inputDate = new Date(parseInt(year), monthNum, parseInt(day));
  const today = new Date();
  
  // Reset today's time to midnight for accurate date comparison
  today.setHours(0, 0, 0, 0);
  
  // Check if the input date is strictly earlier than today
  return inputDate < today;
};

// Validator to ensure a date is not earlier than another date (e.g., end date not earlier than start date)
export const notEarlierThanStartDateValidator = (day: string, month: string, year: string, startDay: string, startMonth: string, startYear: string) => {
  if (!day || !month || !year || !startDay || !startMonth || !startYear) return true;
  
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11,
    '01': 0, '02': 1, '03': 2, '04': 3, '05': 4, '06': 5,
    '07': 6, '08': 7, '09': 8, '10': 9, '11': 10, '12': 11,
    '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5,
    '7': 6, '8': 7, '9': 8
  };
  
  const monthNum = monthMap[month];
  const startMonthNum = monthMap[startMonth];
  
  if (monthNum === undefined || startMonthNum === undefined) {
    console.log('Invalid month format:', month, startMonth);
    return false;
  }
  
  // Create date objects for the input date and start date
  const inputDate = new Date(parseInt(year), monthNum, parseInt(day));
  const startDate = new Date(parseInt(startYear), startMonthNum, parseInt(startDay));
  
  // Check if the input date is not earlier than the start date
  return inputDate >= startDate;
};

/**
 * Async version of yearValidator for use with Form.Item validation rules
 * @param year The year to validate
 * @param birthYear The user's birth year (optional)
 * @returns Promise that resolves if valid, rejects with error message if invalid
 */
export const yearValidatorAsync = async (year: string, birthYear?: string) => {
  if (!year) return Promise.resolve();
  
  // Validate year format (4 digits)
  if (!/^\d{4}$/.test(year)) {
    return Promise.reject('请输入有效的4位数年份');
  }
  
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  
  // Check if year is not later than current year
  if (yearNum > currentYear) {
    return Promise.reject(FUTURE_YEAR_MESSAGE);
  }
  
  // Check if year is not earlier than birth year (if provided)
  if (birthYear && yearNum < parseInt(birthYear)) {
    return Promise.reject(BEFORE_BIRTH_YEAR_MESSAGE);
  }
  
  return Promise.resolve();
};

/**
 * Common field length constraints
 */
export const maxLengths = {
  name: 33,           // Name fields (surname, given name, etc.)
  nativeName: 100,    // Native name fields
  address: 40,        // Address fields
  city: 20,           // City names
  state: 20,          // State/province names
  zipCode: 10,        // ZIP codes
  phone: 15,          // Phone numbers
  email: 50,          // Email addresses
  idDocument: 20,     // Common max length for passport, national ID, taxpayer ID
  receiptNumber: 13,  // Receipt number
  explanation: 4000,  // Explanation text areas
  socialMedia: 40,    // Social media identifiers
  telecode: 20,       // Telecode fields
  flightNumber: 20,   // Flight numbers
  
  driverLicenseNumber: 20, // Driver's license numbers
  visaNumber: 12,
  year: 4
};
