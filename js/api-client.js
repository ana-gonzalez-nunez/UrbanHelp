function resolveApiBase() {
  const protocol = window.location.protocol;
  const port = window.location.port;

  // Running from file:// or a dev server without reverse proxy.
  if (protocol === 'file:' || (port && port !== '80' && port !== '443')) {
    return 'http://localhost:8080/api';
  }

  // Default when served by nginx container with /api proxy.
  return '/api';
}

const API_BASE = resolveApiBase();

async function apiFetch(path, options) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers ? options.headers : {})
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE}${path}`, requestOptions);

    if (!response.ok) {
      let details = '';
      try {
        const body = await response.json();
        details = body && (body.detail || body.message) ? String(body.detail || body.message) : '';
      } catch {
        details = await response.text();
      }

      throw new Error(details || `Request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (API_BASE === '/api') {
      // Fallback for cases where frontend is not behind nginx proxy.
      const fallbackResponse = await fetch(`http://localhost:8080/api${path}`, requestOptions);
      if (!fallbackResponse.ok) {
        let fallbackDetails = '';
        try {
          const body = await fallbackResponse.json();
          fallbackDetails = body && (body.detail || body.message) ? String(body.detail || body.message) : '';
        } catch {
          fallbackDetails = await fallbackResponse.text();
        }
        throw new Error(fallbackDetails || `Request failed: ${fallbackResponse.status}`);
      }
      return fallbackResponse.json();
    }

    throw error;
  }
}

window.incidentApi = {
  async list() {
    return apiFetch('/incidents');
  },
  async getById(id) {
    return apiFetch(`/incidents/${encodeURIComponent(id)}`);
  },
  async create(payload) {
    return apiFetch('/incidents', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async updateStatus(id, status) {
    return apiFetch(`/incidents/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },
  async assignTechnician(id, technicianId) {
    return apiFetch(`/incidents/${encodeURIComponent(id)}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ technicianId })
    });
  }
};

window.userApi = {
  async register(payload) {
    return apiFetch('/users/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async login(payload) {
    return apiFetch('/users/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async getByEmail(email) {
    return apiFetch(`/users/by-email/${encodeURIComponent(email)}`);
  },
  async updateProfile(userId, payload) {
    return apiFetch(`/users/${encodeURIComponent(userId)}/profile`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }
};

window.adminApi = {
  async listUsers() {
    return apiFetch('/admin/users');
  },
  async updateUserRole(userId, rol) {
    return apiFetch(`/admin/users/${encodeURIComponent(userId)}/role`, {
      method: 'PUT',
      body: JSON.stringify({ rol })
    });
  },
  async listTechnicianRequests() {
    return apiFetch('/admin/technician-requests');
  },
  async approveTechnicianRequest(userId) {
    return apiFetch(`/admin/technician-requests/${encodeURIComponent(userId)}/approve`, {
      method: 'PUT'
    });
  },
  async rejectTechnicianRequest(userId) {
    return apiFetch(`/admin/technician-requests/${encodeURIComponent(userId)}/reject`, {
      method: 'PUT'
    });
  }
};