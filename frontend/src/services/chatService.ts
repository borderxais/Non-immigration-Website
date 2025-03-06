import { searchAPI } from './api';
import api from './api';

interface ChatResponse {
  answer: string;
  sources?: Array<{
    content: string;
    metadata: any;
    score: number;
    source: string;
  }>;
}

// Sample fallback responses for when the backend is unavailable
const fallbackResponses = [
  "I can help you with various visa-related questions. For example, you can ask about DS-160 forms, visa interview preparation, or document requirements.",
  "The DS-160 form is required for all nonimmigrant visa applicants. It collects biographical information and details about your trip to the United States.",
  "For a tourist visa (B2), you'll need a valid passport, DS-160 confirmation page, application fee payment receipt, and evidence of ties to your home country.",
  "Visa interview tips include: dress professionally, arrive early, bring all required documents, answer questions truthfully and concisely, and demonstrate ties to your home country.",
  "The visa processing time varies by location and season. Typically, it takes 3-5 business days after the interview, but it can take longer during peak seasons.",
];

class ChatService {
  private isBackendAvailable: boolean = true;
  private connectionErrorCount: number = 0;
  private readonly MAX_ERROR_COUNT = 3;

  /**
   * Process a user message and get a response from the AI assistant
   * This implementation uses the chat API endpoint which leverages OpenAI
   * to generate natural responses based on search results
   */
  async processMessage(message: string): Promise<string> {
    if (!this.isBackendAvailable) {
      return this.getLocalFallbackResponse(message);
    }

    try {
      // Use the chat API endpoint
      const response = await api.post('/chat', { message });
      
      // Reset error count on successful connection
      this.connectionErrorCount = 0;
      this.isBackendAvailable = true;
      
      if (response.data && response.data.answer) {
        return response.data.answer;
      } else {
        // Fallback to using the vector search if chat API fails
        return this.fallbackToSearchAPI(message);
      }
    } catch (error) {
      console.error('Error processing message with chat API:', error);
      
      // Increment error count
      this.connectionErrorCount++;
      
      // If we've had multiple connection errors, assume backend is unavailable
      if (this.connectionErrorCount >= this.MAX_ERROR_COUNT) {
        console.warn('Multiple connection errors, switching to local fallback mode');
        this.isBackendAvailable = false;
        return this.getLocalFallbackResponse(message);
      }
      
      // Fallback to using the vector search
      return this.fallbackToSearchAPI(message);
    }
  }

  /**
   * Fallback method that uses the search API if the chat API fails
   */
  private async fallbackToSearchAPI(message: string): Promise<string> {
    try {
      // Search for relevant information using the vector search endpoint
      const searchResults = await searchAPI.vectorSearch(message, 3);
      
      // Format the search results into a response
      if (searchResults.results && searchResults.results.length > 0) {
        // Format a response using the search results
        return this.formatResponse(message, searchResults.results);
      } else {
        // Fallback response if no results found
        return this.getLocalFallbackResponse(message);
      }
    } catch (error) {
      console.error('Error in fallback search:', error);
      return this.getLocalFallbackResponse(message);
    }
  }

  /**
   * Get a local fallback response when backend is unavailable
   */
  private getLocalFallbackResponse(message: string): string {
    // Simple keyword matching for demo purposes
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('ds-160') || lowerMessage.includes('form')) {
      return "The DS-160 is an online U.S. nonimmigrant visa application. All applicants for nonimmigrant visas must complete this form online and print the confirmation page to bring to their interview.";
    }
    
    if (lowerMessage.includes('interview') || lowerMessage.includes('面试')) {
      return "For your visa interview, be prepared to explain the purpose of your trip, your ties to your home country, and how you will finance your stay. Dress professionally and bring all required documents.";
    }
    
    if (lowerMessage.includes('document') || lowerMessage.includes('材料')) {
      return "Common documents required for a visa application include: valid passport, DS-160 confirmation page, application fee payment receipt, photo, and evidence of ties to your home country.";
    }
    
    if (lowerMessage.includes('wait') || lowerMessage.includes('time') || lowerMessage.includes('long')) {
      return "Visa processing times vary by location and season. Typically, it takes 3-5 business days after the interview, but it can take longer during peak seasons.";
    }
    
    // If no keywords match, return a random general response
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  /**
   * Format a response based on search results
   */
  private formatResponse(query: string, results: any[]): string {
    // For now, we'll use a simple approach of returning the content of the top result
    
    if (results.length === 0) {
      return this.getLocalFallbackResponse(query);
    }

    const topResult = results[0];
    
    // Basic response formatting
    let response = topResult.content;
    
    // If we have multiple results, add additional information
    if (results.length > 1) {
      response += "\n\nI also found these related pieces of information:";
      
      // Add up to 2 additional results
      for (let i = 1; i < Math.min(results.length, 3); i++) {
        response += `\n- ${results[i].content}`;
      }
    }
    
    return response;
  }

  /**
   * Enhanced message processing that uses the chat API with user authentication
   */
  async enhancedProcessMessage(message: string, isAuthenticated: boolean = false): Promise<ChatResponse> {
    if (!this.isBackendAvailable) {
      return {
        answer: this.getLocalFallbackResponse(message)
      };
    }

    try {
      // Get user ID from local storage if authenticated
      const userId = isAuthenticated ? this.getUserIdFromToken() : null;
      
      // Use the chat API endpoint with user ID if authenticated
      const response = await api.post('/chat', { 
        message,
        user_id: userId
      });
      
      // Reset error count on successful connection
      this.connectionErrorCount = 0;
      this.isBackendAvailable = true;
      
      if (response.data && response.data.answer) {
        return {
          answer: response.data.answer,
          sources: response.data.sources
        };
      } else {
        // Fallback to using the search API
        const searchResults = isAuthenticated 
          ? await searchAPI.search(message, 5)  // Combined search for authenticated users
          : await searchAPI.vectorSearch(message, 3);  // Vector-only search for anonymous users
        
        return {
          answer: this.formatResponse(message, searchResults.results),
          sources: searchResults.results
        };
      }
    } catch (error) {
      console.error('Error in enhanced message processing:', error);
      
      // Increment error count
      this.connectionErrorCount++;
      
      // If we've had multiple connection errors, assume backend is unavailable
      if (this.connectionErrorCount >= this.MAX_ERROR_COUNT) {
        console.warn('Multiple connection errors, switching to local fallback mode');
        this.isBackendAvailable = false;
        return {
          answer: this.getLocalFallbackResponse(message)
        };
      }
      
      return {
        answer: this.getLocalFallbackResponse(message)
      };
    }
  }

  /**
   * Get user ID from the JWT token
   */
  private getUserIdFromToken(): string | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Decode the JWT token (simple decode, not verification)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      return payload.sub || payload.user_id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Save chat message to history (for authenticated users)
   */
  async saveChatHistory(message: string, response: string): Promise<boolean> {
    if (!this.isBackendAvailable) {
      console.warn('Backend unavailable, skipping chat history save');
      return false;
    }
    
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) return false;
      
      await api.post('/chat/history', {
        user_id: userId,
        message,
        response
      });
      
      return true;
    } catch (error) {
      console.error('Error saving chat history:', error);
      
      // Increment error count
      this.connectionErrorCount++;
      
      // If we've had multiple connection errors, assume backend is unavailable
      if (this.connectionErrorCount >= this.MAX_ERROR_COUNT) {
        console.warn('Multiple connection errors, switching to local fallback mode');
        this.isBackendAvailable = false;
      }
      
      return false;
    }
  }

  /**
   * Get chat history for the current user
   */
  async getChatHistory(): Promise<Array<{message: string, response: string, created_at: string}>> {
    if (!this.isBackendAvailable) {
      console.warn('Backend unavailable, returning empty chat history');
      return [];
    }
    
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) return [];
      
      const response = await api.get(`/chat/history?user_id=${userId}`);
      return response.data.history || [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      
      // Increment error count
      this.connectionErrorCount++;
      
      // If we've had multiple connection errors, assume backend is unavailable
      if (this.connectionErrorCount >= this.MAX_ERROR_COUNT) {
        console.warn('Multiple connection errors, switching to local fallback mode');
        this.isBackendAvailable = false;
      }
      
      return [];
    }
  }
}

export default new ChatService();
