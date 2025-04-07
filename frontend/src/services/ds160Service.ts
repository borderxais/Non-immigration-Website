import axios from 'axios';

// Define the API URL directly in this file to avoid import issues
const API_ENDPOINT = process.env.REACT_APP_SERVER_API_URL || 'http://localhost:5000';
const API_URL = `${API_ENDPOINT}/api`;

export interface DS160Form {
  id?: string;
  form_data: any;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  application_id?: string;
}

export interface ValidationResult {
  valid: boolean;
  suggestions: string[];
}

/**
 * Create a new DS-160 form
 */
const createForm = async (formData: Omit<DS160Form, 'id'>): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }
  
  // Extract application_id if it exists
  const application_id = formData.application_id;
  
  // Prepare payload with application_id if available
  const payload = {
    ...formData,
    application_id: application_id
  };
  
  const response = await axios.post(`${API_URL}/ds160/form`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Update an existing DS-160 form
 */
const updateForm = async (formId: string, formData: Partial<DS160Form>): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/ds160/${formId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Get a DS-160 form by ID
 */
const getFormById = async (formId: string): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/ds160/forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Get all DS-160 forms for the current user
 */
const getUserForms = async (): Promise<DS160Form[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/ds160/user`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete a DS-160 form
 */
const deleteForm = async (formId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/ds160/${formId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

/**
 * Validate form data
 */
const validateForm = async (formData: any): Promise<ValidationResult> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/ds160/validate`, { form_data: formData }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Generate PDF for a DS-160 form
 */
const generatePDF = async (formId: string): Promise<Blob> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/ds160/${formId}/pdf`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Save a draft of a DS-160 form
 */
const saveFormDraft = async (formData: any): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }
  
  // Extract application_id if it exists
  const application_id = formData.application_id || formData.applicationId;
  
  const payload = {
    form_data: formData,
    status: 'draft',
    application_id: application_id // Include application_id in the payload
  };
  
  // If the form has an ID, update it, otherwise create a new draft
  if (formData.formId) {
    const response = await axios.put(`${API_URL}/ds160/${formData.formId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } else {
    const response = await axios.post(`${API_URL}/ds160/form`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

const ds160Service = {
  createForm,
  updateForm,
  getFormById,
  getUserForms,
  deleteForm,
  validateForm,
  generatePDF,
  saveFormDraft
};

export default ds160Service;
