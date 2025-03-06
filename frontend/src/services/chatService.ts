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

class ChatService {
  /**
   * Process a user message and get a response from the AI assistant
   * This implementation uses the chat API endpoint which leverages OpenAI
   * to generate natural responses based on search results
   */
  async processMessage(message: string): Promise<string> {
    try {
      // Use the chat API endpoint
      const response = await api.post('/chat', { message });
      
      if (response.data && response.data.answer) {
        return response.data.answer;
      } else {
        // Fallback to using the vector search if chat API fails
        return this.fallbackToSearchAPI(message);
      }
    } catch (error) {
      console.error('Error processing message with chat API:', error);
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
        return "I don't have specific information about that. Could you please ask something about visa applications or the DS-160 form?";
      }
    } catch (error) {
      console.error('Error in fallback search:', error);
      return "I'm sorry, I encountered an error while processing your request. Please try again later.";
    }
  }

  /**
   * Format a response based on search results
   */
  private formatResponse(query: string, results: any[]): string {
    // For now, we'll use a simple approach of returning the content of the top result
    
    if (results.length === 0) {
      return "I don't have specific information about that. Could you please ask something about visa applications or the DS-160 form?";
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
    try {
      // Get user ID from local storage if authenticated
      const userId = isAuthenticated ? this.getUserIdFromToken() : null;
      
      // Use the chat API endpoint with user ID if authenticated
      const response = await api.post('/chat', { 
        message,
        user_id: userId
      });
      
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
      return {
        answer: "I'm sorry, I encountered an error while processing your request. Please try again later."
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
      return false;
    }
  }

  /**
   * Get chat history for the current user
   */
  async getChatHistory(): Promise<Array<{message: string, response: string, created_at: string}>> {
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) return [];
      
      const response = await api.get(`/chat/history?user_id=${userId}`);
      return response.data.history || [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }
}

export default new ChatService();
