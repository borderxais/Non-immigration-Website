import weights from '../config/weights.json';
import coefficients from '../config/optionCoefficients.json';
import api from './api';

// Type definitions for the JSON data
type CoefficientValue = number | { value: number; override: boolean };

type CoefficientRecord = Record<string, CoefficientValue>;
type WeightRecord = Record<string, number>;

// Cast imported JSON to the correct types
const typedCoefficients = coefficients as Record<string, CoefficientRecord>;
const typedWeights = weights as WeightRecord;

export interface EvaluationFormData {
  Q1: string;     // 全职角色稳定性
  Q2: string;     // 旅行费用比例
  Q3: string[];   // 核心资产（多选）
  Q4: string[];   // 出境记录（多选）
  Q5: string;     // 同行组合
  Q6: string;     // 在美亲属
  Q7: string;     // 拒签史
  [key: string]: string | string[];
}

export interface EvaluationResult {
  score: number;              // Risk score (0-100)
  riskLevel: string;          // Risk level description
  categoryScores: {           // Individual scores for each category
    [key: string]: number
  };
  contactEmail?: string;      // Optional user email for follow-up
}

export interface SaveEvaluationRequest {
  email: string;              // User email
  name?: string;              // Optional user name
  phone?: string;             // Optional user phone
  score: number;              // Risk score
  riskLevel: string;          // Risk level
  formData: any;              // Original form data
}

/**
 * Get coefficient value for an option
 */
const getCoef = (q: string, opt: string): number => {
  // Handle missing data safely
  const qCoeffs = typedCoefficients[q];
  if (!qCoeffs) return 0;
  
  const coef = qCoeffs[opt];
  if (!coef) return 0;
  
  return typeof coef === 'object' ? coef.value : coef;
};

/**
 * Calculate coefficient for multi-select questions (Q3/Q4)
 * First check for override, then take minimum coefficient
 */
const multiCoef = (q: string, selected: string[]): number => {
  // If no options selected, return maximum risk
  if (!selected || selected.length === 0) return 1.0;
  
  const qCoeffs = typedCoefficients[q];
  if (!qCoeffs) return 1.0;
  
  // Check if any selected option has override property
  for (const opt of selected) {
    const coef = qCoeffs[opt];
    if (!coef) continue;
    
    if (typeof coef === 'object' && coef.override) {
      return typeof coef === 'object' ? coef.value : coef;
    }
  }
  
  // Otherwise return minimum coefficient
  return Math.min(...selected.map(opt => getCoef(q, opt)));
};

/**
 * Calculate evaluation score based on form data and predefined weights
 */
const calculateEvaluation = (formData: EvaluationFormData): EvaluationResult => {
  const categoryScores: { [key: string]: number } = {};
  let totalRiskScore = 0;

  // Calculate risk score for each question
  let contactEmail: string | undefined;
  
  for (const [q, ans] of Object.entries(formData)) {
    // Skip email field in score calculation but store it
    if (q === 'email') {
      contactEmail = ans as string;
      continue;
    }
    
    if (q in typedWeights) {
      const coef = Array.isArray(ans) ? multiCoef(q, ans) : getCoef(q, ans);
      const questionScore = typedWeights[q] * coef;
      
      categoryScores[q] = questionScore;
      totalRiskScore += questionScore;
    }
  }

  // Determine risk level
  let riskLevel = "低风险";
  if (totalRiskScore > 60) {
    riskLevel = "高风险";
  } else if (totalRiskScore > 30) {
    riskLevel = "中等风险";
  }

  return {
    score: Math.round(totalRiskScore),
    riskLevel,
    categoryScores,
    contactEmail
  };
};

/**
 * Save evaluation result to the backend
 */
const saveEvaluationResult = async (data: SaveEvaluationRequest): Promise<any> => {
  try {
    const response = await api.post('/evaluation/result', data);
    return response.data;
  } catch (error) {
    console.error('Error saving evaluation result:', error);
    throw error;
  }
};

/**
 * Get all evaluation results (admin only)
 */
const getAllEvaluationResults = async (): Promise<any> => {
  try {
    const response = await api.get('/evaluation/results');
    return response.data;
  } catch (error) {
    console.error('Error fetching evaluation results:', error);
    throw error;
  }
};

/**
 * Get user's evaluation results
 */
const getUserEvaluationResults = async (): Promise<any> => {
  try {
    const response = await api.get('/evaluation/results/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user evaluation results:', error);
    throw error;
  }
};

/**
 * Create a new user account from evaluation email (admin only)
 */
const createUserFromEvaluation = async (email: string): Promise<any> => {
  try {
    const response = await api.post('/evaluation/create-user', { email });
    return response.data;
  } catch (error) {
    console.error('Error creating user from evaluation:', error);
    throw error;
  }
};

/**
 * Check if a user exists with the given email
 */
const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const response = await api.get(`/evaluation/check-user?email=${encodeURIComponent(email)}`);
    return response.data.exists;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
};

/**
 * Get all temporary user credentials (admin only)
 */
const getTempCredentials = async (): Promise<any> => {
  try {
    const response = await api.get('/evaluation/temp-credentials');
    return response.data;
  } catch (error) {
    console.error('Error fetching temporary credentials:', error);
    throw error;
  }
};

/**
 * Mark temporary credentials as used (admin only)
 */
const markCredentialAsUsed = async (credentialId: number): Promise<any> => {
  try {
    const response = await api.post('/evaluation/temp-credentials', { credential_id: credentialId });
    return response.data;
  } catch (error) {
    console.error('Error marking credential as used:', error);
    throw error;
  }
};

const evaluationService = {
  calculateEvaluation,
  saveEvaluationResult,
  getAllEvaluationResults,
  getUserEvaluationResults,
  createUserFromEvaluation,
  getTempCredentials,
  markCredentialAsUsed,
  checkUserExists
};

export default evaluationService;