/**
 * Frontend Analytics & Event Tracking System
 * Handles tracking of user behaviors (page views, clicks, checkout conversions)
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Get or initialize a unique session ID for tracking visitor sessions
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem('zcraft_session_id');
  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    sessionStorage.setItem('zcraft_session_id', sessionId);
  }
  return sessionId;
};

export const trackEvent = async (
  eventType: 'PAGE_VIEW' | 'CLICK' | 'CONVERSION' | 'SESSION_START',
  page: string,
  metadata?: any
) => {
  if (typeof window === 'undefined') return;

  try {
    // Attempt to extract userId from localStorage or custom auth structures if present
    const authStorage = localStorage.getItem('zcraft-cart-storage'); // or check user state
    let userId: string | null = null;
    
    // We send payload to backend analytics collector
    await fetch(`${API_BASE_URL}/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        page,
        sessionId: getSessionId(),
        userId: userId || undefined,
        metadata: metadata || null
      }),
    });
  } catch (error) {
    console.warn('Analytics event tracking failed: ', error);
  }
};
