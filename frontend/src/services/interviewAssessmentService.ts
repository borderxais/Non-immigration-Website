import axios from 'axios';

// Define the API URL
const API_ENDPOINT = process.env.REACT_SERVER_API_URL || 'http://localhost:5000';
const API_URL = `${API_ENDPOINT}/api`;

export interface InterviewAssessment {
  assessment: string;
  form_data: {
    surname: string;
    givenName: string;
    purposeOfTrip: string;
    specificPurpose: string;
    primaryOccupation: string;
    employer: string;
    monthlyIncome: string;
    previousUsVisa: boolean;
    intendedLengthOfStay: string;
    pointOfContact: string;
    relationshipToContact: string;
    [key: string]: any;
  };
  created_at?: string;
}

/**
 * Get interview assessment based on user's latest DS-160 form
 * @param forceRefresh Force a new assessment even if one exists
 */
const getAssessment = async (forceRefresh: boolean = false): Promise<InterviewAssessment> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }
  
  const response = await axios.get(`${API_URL}/ds160/interview-assessment`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      refresh: forceRefresh
    }
  });
  return response.data;
};

/**
 * Get assessment history for the user
 */
const getAssessmentHistory = async (): Promise<InterviewAssessment[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await axios.get(`${API_URL}/ds160/interview-assessment/history`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete an assessment from history
 */
const deleteAssessmentHistory = async (assessmentId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  await axios.delete(`${API_URL}/ds160/interview-assessment/history/${assessmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const interviewAssessmentService = {
  getAssessment,
  getAssessmentHistory,
  deleteAssessmentHistory
};

export default interviewAssessmentService; 