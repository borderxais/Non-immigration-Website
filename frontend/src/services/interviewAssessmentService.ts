import axios from 'axios';

// Define the API URL based on environment
const API_ENDPOINT = process.env.REACT_APP_API_URL || 'https://visasupport-dot-overseabiz-453023.wl.r.appspot.com';
const API_URL = `${API_ENDPOINT}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
  
  const response = await api.get('/ds160/interview-assessment', {
    params: {
      refresh: forceRefresh
    },
    headers: {
      Authorization: `Bearer ${token}`
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

  const response = await api.get('/ds160/interview-assessment/history', {
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

  await api.delete(`/ds160/interview-assessment/history/${assessmentId}`, {
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