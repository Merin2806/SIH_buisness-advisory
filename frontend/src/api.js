const API_BASE = '/api/v1';

export function getAuthToken() {
  return localStorage.getItem('ruralbiz_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('ruralbiz_token', token);
  } else {
    localStorage.removeItem('ruralbiz_token');
  }
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('ruralbiz_user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('ruralbiz_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('ruralbiz_user');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || `Request failed: ${response.status}`);
  }
  return data;
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setAuthToken(res.access_token);
    setCurrentUser({ id: res.user_id, email: res.email, full_name: res.full_name, role: res.role });
    return res;
  },

  async register(formData) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    setAuthToken(res.access_token);
    setCurrentUser({ id: res.user_id, email: res.email, full_name: res.full_name, role: res.role });
    return res;
  },

  logout() {
    setAuthToken('');
    setCurrentUser(null);
  },

  async getMe() {
    return request('/auth/me');
  },

  async updateLanguage(language) {
    return request('/auth/language', {
      method: 'PATCH',
      body: JSON.stringify({ language })
    });
  },

  // Categories
  async getCategories() {
    return request('/categories');
  },

  // Financial Engine & Loan Advisor
  async calculateFinance(params) {
    return request('/finance/calculate', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async getSchemes() {
    return request('/finance/schemes');
  },

  async getBanks() {
    return request('/finance/banks');
  },

  async getLoanAdvice(assessmentId) {
    return request(`/finance/loan-advice/${assessmentId}`);
  },

  async getRepaymentSchedule(schemeCode, amount) {
    return request(`/finance/repayment/${schemeCode}?amount=${amount}`);
  },

  async saveBankingDetails(payload) {
    return request('/finance/banking-details', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getBankingDetails(assessmentId) {
    return request(`/finance/banking-details/${assessmentId}`);
  },

  // Geospatial
  async analyzeGeo(params) {
    return request('/geo/analyze', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async resolveLocation(payload) {
    return request('/geo/resolve-location', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async reverseGeocode(payload) {
    return request('/geo/reverse-geocode', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getGeoAdminSummary() {
    return request('/geo/admin/features-summary');
  },

  // Budgeter
  async calculateBudget(params) {
    return request('/budget/calculate', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async saveBudgetScenario(payload) {
    return request('/budget/scenarios', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getBudgetScenarios() {
    return request('/budget/scenarios');
  },

  // Assessments & Advisory
  async createAssessment(payload) {
    return request('/assessments', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAssessments() {
    return request('/assessments');
  },

  async getAssessmentDetail(id) {
    return request(`/assessments/${id}`);
  },

  // Voice & Languages
  async getLanguages() {
    return request('/voice/languages');
  },

  async transcribeVoice(audioBase64, sourceLanguage) {
    return request('/voice/transcribe', {
      method: 'POST',
      body: JSON.stringify({ audio_base64: audioBase64, source_language: sourceLanguage })
    });
  },

  async translateVoice(text, sourceLanguage, targetLanguage) {
    return request('/voice/translate', {
      method: 'POST',
      body: JSON.stringify({ text, source_language: sourceLanguage, target_language: targetLanguage })
    });
  },

  async voiceQuery(queryText, language = 'en', context = 'general') {
    return request('/voice/query', {
      method: 'POST',
      body: JSON.stringify({ query_text: queryText, language, context })
    });
  },

  // Admin
  async getAdminOverview() {
    return request('/admin/overview');
  },

  async getAdminSchemes() {
    return request('/admin/schemes');
  },

  async updateSchemeStatus(schemeId, verificationStatus) {
    return request(`/admin/schemes/${schemeId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ verification_status: verificationStatus })
    });
  },

  async editAdminScheme(schemeId, payload) {
    return request(`/admin/schemes/${schemeId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async createAdminScheme(payload) {
    return request('/admin/schemes', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAdminCategories() {
    return request('/admin/categories');
  },

  async createAdminCategory(payload) {
    return request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAdminDocuments() {
    return request('/admin/documents');
  },

  async uploadAdminDocument(payload) {
    return request('/admin/documents', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAdminUsers() {
    return request('/admin/users');
  },

  async getAdminSyntheticRecords() {
    return request('/admin/synthetic-records');
  },

  async getAdminAuditLogs() {
    return request('/admin/audit-logs');
  },

  async getAdminHealth() {
    return request('/admin/health');
  }
};
