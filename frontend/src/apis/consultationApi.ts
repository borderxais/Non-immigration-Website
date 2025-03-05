import axiosInstance from './axios';

/**
 * POST /consultation/ask
 */
export async function askQuestion(question: string) {
  // The request body: { question: "..." }
  const response = await axiosInstance.post('/consultation/ask', { question });
  return response.data; // This is what Flask returns
}

/**
 * POST /consultation/evaluate
 */
export async function evaluateApplication(data: any) {
  // The request body can be any shape your backend expects
  const response = await axiosInstance.post('/consultation/evaluate', data);
  return response.data;
}

/**
 * POST /consultation/interview/simulate
 */
export async function simulateInterview(visaType: string) {
  // The request body: { visa_type: "..." }
  const response = await axiosInstance.post('/consultation/interview/simulate', {
    visa_type: visaType,
  });
  return response.data;
}
