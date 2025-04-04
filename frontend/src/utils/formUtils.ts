/**
 * Generates a random DS-160 Application ID in the format similar to "AA00EGS9G1"
 * Format: 2 letters + 2 digits + 3 letters + 2 digits
 * @returns {string} Random Application ID
 */
export const generateApplicationId = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  
  // Generate 2 random letters
  let id = '';
  for (let i = 0; i < 2; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Add 2 random digits
  for (let i = 0; i < 2; i++) {
    id += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  // Add 3 random letters
  for (let i = 0; i < 3; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Add 2 random digits
  for (let i = 0; i < 2; i++) {
    id += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  return id;
};

/**
 * Validates if a string is a valid DS-160 Application ID
 * @param {string} id - The ID to validate
 * @returns {boolean} Whether the ID is valid
 */
export const isValidApplicationId = (id: string): boolean => {
  // Check if the ID matches the pattern: 2 letters + 2 digits + 3 letters + 2 digits
  const pattern = /^[A-Z]{2}[0-9]{2}[A-Z]{3}[0-9]{2}$/;
  return pattern.test(id);
};
