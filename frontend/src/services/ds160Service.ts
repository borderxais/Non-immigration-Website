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
  console.log('Creating new DS-160 form with payload:', formData);
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
  
  console.log('Creating new DS-160 form with payload:', payload);
  const response = await api.post('/ds160/form', payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log('Response:', response.data);
  return response.data;
};

/**
 * Update an existing DS-160 form
 */
const updateForm = async (applicationId: string, formData: Partial<DS160Form>): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  const response = await api.put(`/ds160/forms/${applicationId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Get a DS-160 form by ID
 */
const getFormById = async (applicationId: string): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/ds160/forms/${applicationId}`, {
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
  const response = await api.get('/ds160/user', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete a DS-160 form
 */
const deleteForm = async (applicationId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  await api.delete(`/ds160/${applicationId}`, {
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
  const response = await api.post('/ds160/validate', { form_data: formData }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Generate PDF for a DS-160 form
 */
const generatePDF = async (applicationId: string): Promise<Blob> => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/ds160/${applicationId}/pdf`, {
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
    const response = await api.put(`/ds160/form/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } else {
    const response = await api.post('/ds160/form', payload, {
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
