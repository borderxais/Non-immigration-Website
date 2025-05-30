// import axios from 'axios';
import api from './api';

export interface DS160Form {
  _id?: string;              // Internal database ID
  application_id: string;    // User-facing form identifier
  form_data: any;           // The actual form content
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  target_user_id?: number;   // ID of the user for whom the form is created
}

export interface ValidationResult {
  valid: boolean;
  suggestions: string[];
}

/**
 * Create a new DS-160 form
 */
const createForm = async (formData: Omit<DS160Form, '_id'>): Promise<DS160Form> => {
  try {
    const response = await api.post('/ds160/form', formData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating form:', error);
    throw error;
  }
};

/**
 * Update an existing DS-160 form by application ID
 */
const updateForm = async (application_id: string, formData: Partial<DS160Form>): Promise<DS160Form> => {
  try {
    const response = await api.put(`/ds160/form/${application_id}`, formData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating form:', error);
    throw error;
  }
};

/**
 * Get a DS-160 form by ID
 */
const getFormById = async (application_id: string): Promise<DS160Form> => {
  try {
    console.log(`Fetching form with application_id: ${application_id}`);
    const response = await api.get(`/ds160/form/by-application-id/${application_id}`);
    console.log('API response:', response);
    return response.data;
  } catch (error: any) {
    console.error('Error getting form:', error);
    throw error;
  }
};

/**
 * Get all DS-160 forms for the current user
 */
const getUserForms = async (): Promise<DS160Form[]> => {
  try {
    const response = await api.get('/ds160/user/forms');
    return response.data;
  } catch (error: any) {
    console.error('Error getting user forms:', error);
    throw error;
  }
};

/**
 * Delete a DS-160 form
 */
const deleteForm = async (application_id: string): Promise<void> => {
  try {
    await api.delete(`/ds160/form/${application_id}`);
  } catch (error: any) {
    console.error('Error deleting form:', error);
    throw error;
  }
};

/**
 * Generate PDF for a DS-160 form
 */
const generatePDF = async (application_id: string): Promise<Blob> => {
  try {
    const response = await api.get(`/ds160/form/${application_id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Validate form data
 */
const validateForm = async (formData: any): Promise<ValidationResult> => {
  try {
    const response = await api.post('/ds160/validate', { form_data: formData });
    return response.data;
  } catch (error: any) {
    console.error('Error validating form:', error);
    throw error;
  }
};

/**
 * Save a draft of a DS-160 form
 */
const saveFormDraft = async (formData: any): Promise<DS160Form> => {
  try {
    // Extract form data and metadata with consistent naming
    const { _id, form_data, status, application_id } = formData;
    
    // Prepare the payload correctly
    const payload: any = {};
    
    // If form_data exists, use it, otherwise use the entire formData object as form_data
    if (form_data) {
      payload.form_data = form_data;
    } else if (!_id && !status && !application_id) {
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
    if (_id) {
      const response = await api.post(`/ds160/form/${_id}`, payload);
      return response.data;
    } else {
      const response = await api.post('/ds160/form', payload);
      return response.data;
    }
  } catch (error: any) {
    console.error('Error saving form draft:', error);
    throw error;
  }
};

/**
 * Get all DS-160 forms (admin only)
 */
const getAllForms = async (): Promise<DS160Form[]> => {
  try {
    const response = await api.get('/ds160/admin/forms');
    return response.data;
  } catch (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }
};

/**
 * Get all users for DS160 form selection (admin only)
 */
const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      throw new Error('Authentication required');
    }
    
    console.log('DS160: Fetching all users');
    const response = await api.get(`/ds160/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('DS160: All users:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const ds160Service = {
  createForm,
  updateForm,
  getFormById,
  getUserForms,
  getAllForms,
  deleteForm,
  validateForm,
  generatePDF,
  saveFormDraft,
  getAllUsers
};

export default ds160Service;
