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
  response_source?: string;
}

class ChatService {
  private connectionErrorCount: number = 0;
  private readonly MAX_ERROR_COUNT = 5;

  /**
   * Process a user message and get a response from the AI assistant
   */
  async processMessage(message: string): Promise<string> {
    try {
      const response = await api.post('/api/chat', { message });
      
      // Reset error count on successful connection
      this.connectionErrorCount = 0;
      
      if (response.data && response.data.answer) {
        return response.data.answer;
      } else {
        return this.fallbackToSearchAPI(message);
      }
    } catch (error) {
      console.error('Error processing message with chat API:', error);
      
      this.connectionErrorCount++;
      return this.fallbackToSearchAPI(message);
    }
  }

  /**
   * Centralized error handling for chat message errors
   */
  handleSendMessageError(error: any): ChatResponse {
    console.error('Error handling in ChatService:', error);
    
    this.connectionErrorCount++;
    
    if (this.connectionErrorCount >= this.MAX_ERROR_COUNT) {
      console.warn('Multiple connection errors, switching to error mode');
    }
    
    return {
      answer: "I'm having trouble connecting to my knowledge base right now. This could be due to network issues or server maintenance. Please try again in a moment.",
      response_source: 'error'
    };
  }

  /**
   * Fallback method that uses the search API if the chat API fails
   */
  private async fallbackToSearchAPI(message: string): Promise<string> {
    try {
      const searchResults = await searchAPI.vectorSearch(message, 3);
      
      if (searchResults.results && searchResults.results.length > 0) {
        return this.formatResponse(message, searchResults.results);
      } else {
        throw new Error("No search results found");
      }
    } catch (error) {
      console.error('Error in fallback search:', error);
      throw error;
    }
  }

  /**
   * Format a response based on search results
   */
  private formatResponse(query: string, results: any[]): string {
    if (results.length === 0) {
      throw new Error("No results to format");
    }

    const topResult = results[0];
    
    let response = topResult.content;
    
    if (results.length > 1) {
      response += "\n\nI also found these related pieces of information:";
      
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
      const userId = isAuthenticated ? this.getUserIdFromToken() : null;
      
      const response = await api.post('/api/chat', { 
        message,
        user_id: userId
      });
      
      // Reset error count on successful connection
      this.connectionErrorCount = 0;
      
      if (response.data && response.data.answer) {
        return {
          answer: response.data.answer,
          sources: response.data.sources,
          response_source: response.data.response_source || 'unknown'
        };
      } else {
        // Try combined search or vector-only search based on authentication status
        const searchResults = isAuthenticated 
          ? await searchAPI.search(message, 5)  
          : await searchAPI.vectorSearch(message, 3);  
        
        return {
          answer: this.formatResponse(message, searchResults.results),
          sources: searchResults.results,
          response_source: 'vector_db'  
        };
      }
    } catch (error) {
      console.error('Error in enhanced message processing:', error);
      
      try {
        // Try vector search as fallback
        const searchResults = isAuthenticated 
          ? await searchAPI.search(message, 5)  
          : await searchAPI.vectorSearch(message, 3);  
        
        return {
          answer: this.formatResponse(message, searchResults.results),
          sources: searchResults.results,
          response_source: 'vector_db'
        };
      } catch (vectorError) {
        console.error('Error in vector search fallback:', vectorError);
        return this.handleSendMessageError(vectorError);
      }
    }
  }

  /**
   * Get user ID from the JWT token
   */
  private getUserIdFromToken(): string | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
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
  async saveChatHistory(message: string, response: string, responseSource: string = 'unknown'): Promise<boolean> {
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) return false;
      
      await api.post('/api/chat/history', {
        user_id: userId,
        user_message: message,
        ai_response: response,
        response_source: responseSource
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
  async getChatHistory(): Promise<Array<{user_message: string, ai_response: string, response_source: string, created_at: string}>> {
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) return [];
      
      const response = await api.get(`/api/chat/history?user_id=${userId}`);
      return response.data.history || [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }
}

export default new ChatService();
