import axios from 'axios';

// Define the API URL directly in this file to avoid import issues
// This is for production
const API_ENDPOINT = process.env.REACT_APP_SERVER_API_URL || 'http://localhost:5000';
const API_URL = `${API_ENDPOINT}/api`;

// Use relative URLs with proxy instead of absolute URLs
// const API_ENDPOINT = 'http://localhost:5000';
// const API_URL = `${API_ENDPOINT}/api`;
// const API_URL = '/api';  // This will be proxied to http://localhost:5000/api

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
  
  const response = await axios.post(`${API_URL}/ds160/form`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

/**
 * Update an existing DS-160 form by application ID
 */
const updateForm = async (application_id: string, formData: Partial<DS160Form>): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  // Use POST instead of PUT since the server doesn't support PUT
  const response = await axios.post(`${API_URL}/ds160/form/${application_id}`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

/**
 * Get a DS-160 form by ID
 */
const getFormById = async (application_id: string): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/ds160/fill/${application_id}`, {
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
  
  // Extract form data and metadata with consistent naming
  const { id, form_data, status, application_id } = formData;
  
  // Prepare the payload correctly
  const payload: any = {};
  
  // If form_data exists, use it, otherwise use the entire formData object as form_data
  if (form_data) {
    payload.form_data = form_data;
  } else if (!id && !status && !application_id) {
    // If only raw form data was passed (no metadata)
    payload.form_data = formData;
  }
  
  // Add other fields if they exist
  if (status) payload.status = status;
  
  // Ensure application_id is always included if available
  if (application_id) {
    payload.application_id = application_id;
    console.log('Including application_id in payload:', application_id);
  }
  
  console.log('Saving form with payload:', payload);
  
  // If the form has an ID, update it, otherwise create a new draft
  if (id) {
    const response = await axios.post(`${API_URL}/ds160/form/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } else {
    const response = await axios.post(`${API_URL}/ds160/form`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
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
