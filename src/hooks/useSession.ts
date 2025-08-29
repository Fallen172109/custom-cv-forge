import { useState, useEffect } from 'react';
import { DatabaseService } from '@/services/database';

interface SessionData {
  sessionId: string | null;
  loading: boolean;
  error: string | null;
}

export const useSession = () => {
  const [sessionData, setSessionData] = useState<SessionData>({
    sessionId: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      // Check if we have a session ID in localStorage
      let sessionId = localStorage.getItem('cv_session_id');
      
      if (!sessionId) {
        // Create a new session
        const session = await DatabaseService.createSession();
        sessionId = session.id;
        localStorage.setItem('cv_session_id', sessionId);
      }

      setSessionData({
        sessionId,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error initializing session:', error);
      setSessionData({
        sessionId: null,
        loading: false,
        error: 'Failed to initialize session',
      });
    }
  };

  const createNewSession = async (email?: string) => {
    try {
      setSessionData(prev => ({ ...prev, loading: true }));
      
      const session = await DatabaseService.createSession(email);
      const sessionId = session.id;
      
      localStorage.setItem('cv_session_id', sessionId);
      
      setSessionData({
        sessionId,
        loading: false,
        error: null,
      });
      
      return sessionId;
    } catch (error) {
      console.error('Error creating new session:', error);
      setSessionData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to create session',
      }));
      return null;
    }
  };

  const clearSession = () => {
    localStorage.removeItem('cv_session_id');
    setSessionData({
      sessionId: null,
      loading: false,
      error: null,
    });
  };

  return {
    sessionId: sessionData.sessionId,
    loading: sessionData.loading,
    error: sessionData.error,
    createNewSession,
    clearSession,
  };
};
