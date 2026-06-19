const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://demotrust.onrender.com';

export interface RiskResult {
  riskScore: number;
  trustScore: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  decision: 'ALLOW' | 'CHALLENGE' | 'REVIEW' | 'BLOCK';
  reasons: string[];
  explanation: string;
  recommendations: string[];
  timestamp: Date;
  incidentId?: string;
}

export interface EventData {
  id: string;
  userId: string;
  timestamp: string;
  eventType: string;
  riskScore: number;
  severity: string;
  decision: string;
  reasons: string[];
  explanation: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  mediumEvents: number;
  lowEvents: number;
  blockedEvents: number;
  flaggedEvents: number;
  allowedEvents: number;
}

export interface ChatResponse {
  message: string;
  confidence: number;
  sources: string[];
}

export const api = (endpoint: string, options?: RequestInit) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
};

export const sendCustomerChat = async (message: string, token: string) => {
  const response = await api('/api/chatbot/customer', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  return response.json();
};

export const getUserProfile = async (userId: string, token: string) => {
  const response = await api(`/api/verify/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const updateUserProfile = async (userId: string, data: any, token: string) => {
  const response = await api(`/api/verify/${userId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getUserLogs = async (userId: string, token: string, filters?: {
  severity?: string;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  if (filters?.severity) params.append('severity', filters.severity);
  if (filters?.limit) params.append('limit', String(filters.limit));

  const url = params.toString() 
    ? `/api/logs/${userId}?${params.toString()}`
    : `/api/logs/${userId}`;

  const response = await api(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const evaluateEvent = async (data: any, token: string) => {
  const response = await api('/api/trust/evaluate', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getDashboardStats = async (token: string) => {
  const response = await api('/api/dashboard/stats', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const getLogStats = async (token: string) => {
  const response = await api('/api/logs/stats', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const sendAnalystChat = async (question: string, token: string, userId?: string) => {
  const response = await api('/api/chatbot/analyst', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ question, userId }),
  });
  return response.json();
};

export const getIncidents = async (token: string, severity?: string, limit?: number) => {
  const params = new URLSearchParams();
  if (severity) params.append('severity', severity);
  if (limit) params.append('limit', String(limit));

  const url = params.toString() 
    ? `/api/dashboard/incidents?${params.toString()}`
    : '/api/dashboard/incidents';

  const response = await api(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const getUsers = async (token: string, filters?: {
  limit?: number;
  page?: number;
  isBlocked?: boolean;
  kycVerified?: boolean;
}) => {
  const params = new URLSearchParams();
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.isBlocked !== undefined) params.append('isBlocked', String(filters.isBlocked));
  if (filters?.kycVerified !== undefined) params.append('kycVerified', String(filters.kycVerified));

  const url = params.toString() 
    ? `/api/dashboard/users?${params.toString()}`
    : '/api/dashboard/users';

  const response = await api(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const getAIStatus = async (token: string) => {
  const response = await api('/api/ai/status', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const getAIMemory = async (token: string) => {
  const response = await api('/api/ai/memory', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const initializeAI = async (token: string, apiKey: string, model?: string) => {
  const response = await api('/api/ai/initialize', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ apiKey, model }),
  });
  return response.json();
};