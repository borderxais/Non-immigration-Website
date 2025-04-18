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
const updateForm = async (applicationId: string, formData: Partial<DS160Form>): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/ds160/form/${applicationId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Get a DS-160 form by application ID
 */
const getFormByApplicationId = async (applicationId: string): Promise<DS160Form> => {
  const token = localStorage.getItem('token');
  
  // Get all forms for the user
  const response = await axios.get(`${API_URL}/ds160/user/forms`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  // Find the form with the matching application_id
  const forms = response.data;
  const form = forms.find((f: DS160Form) => f.application_id === applicationId);
  
  if (!form) {
    throw new Error('Form not found with the given application ID');
  }
  
  return form;
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
const deleteForm = async (applicationId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/ds160/form/${applicationId}`, {
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
    const response = await axios.put(`${API_URL}/ds160/form/${id}`, payload, {
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
  getFormByApplicationId,
  getUserForms,
  deleteForm,
  validateForm,
  generatePDF,
  saveFormDraft
};

export default ds160Service;
