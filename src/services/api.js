import axios from "axios";

const API = "http://localhost:5121/api";

// Helper - gets token from localStorage and builds auth header
function authHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// STAFF SERVICE
export const staffService = {
  getAll: () =>
    axios.get(`${API}/staff`, { headers: authHeader() }).then((r) => r.data),

  getById: (id) =>
    axios
      .get(`${API}/staff/${id}`, { headers: authHeader() })
      .then((r) => r.data),

  create: (data) =>
    axios
      .post(`${API}/staff`, data, { headers: authHeader() })
      .then((r) => r.data),

  update: (id, data) =>
    axios
      .put(`${API}/staff/${id}`, data, { headers: authHeader() })
      .then((r) => r.data),

  deactivate: (id) =>
    axios
      .delete(`${API}/staff/${id}`, { headers: authHeader() })
      .then((r) => r.data),
};

// PARTS SERVICE
export const partsService = {
  getAll: (page = 1, pageSize = 20) =>
    axios
      .get(`${API}/parts?page=${page}&pageSize=${pageSize}`, {
        headers: authHeader(),
      })
      .then((r) => r.data),

  getById: (id) =>
    axios
      .get(`${API}/parts/${id}`, { headers: authHeader() })
      .then((r) => r.data),

  getLowStock: () =>
    axios
      .get(`${API}/parts/low-stock`, { headers: authHeader() })
      .then((r) => r.data),

  create: (data) =>
    axios
      .post(`${API}/parts`, data, { headers: authHeader() })
      .then((r) => r.data),

  update: (id, data) =>
    axios
      .put(`${API}/parts/${id}`, data, { headers: authHeader() })
      .then((r) => r.data),

  delete: (id) =>
    axios
      .delete(`${API}/parts/${id}`, { headers: authHeader() })
      .then((r) => r.data),
};

// VENDOR SERVICE (needed for parts form dropdown)
export const vendorService = {
  getAll: () =>
    axios.get(`${API}/vendors`, { headers: authHeader() }).then((r) => r.data),
};

// VEHICLE SERVICE
export const vehicleService = {
  getMine: () =>
    axios.get(`${API}/vehicles`, { headers: authHeader() }).then((r) => r.data),

  add: (data) =>
    axios
      .post(`${API}/vehicles`, data, { headers: authHeader() })
      .then((r) => r.data),

  update: (id, data) =>
    axios
      .put(`${API}/vehicles/${id}`, data, { headers: authHeader() })
      .then((r) => r.data),

  delete: (id) =>
    axios
      .delete(`${API}/vehicles/${id}`, { headers: authHeader() })
      .then((r) => r.data),
};

// APPOINTMENT SERVICE
export const appointmentService = {
  getMine: () =>
    axios
      .get(`${API}/appointments/mine`, { headers: authHeader() })
      .then((r) => r.data),

  getAll: () =>
    axios
      .get(`${API}/appointments`, { headers: authHeader() })
      .then((r) => r.data),

  book: (data) =>
    axios
      .post(`${API}/appointments`, data, { headers: authHeader() })
      .then((r) => r.data),

  cancel: (id) =>
    axios
      .delete(`${API}/appointments/${id}/cancel`, { headers: authHeader() })
      .then((r) => r.data),

  updateStatus: (id, status) =>
    axios
      .put(
        `${API}/appointments/${id}/status`,
        { status },
        { headers: authHeader() },
      )
      .then((r) => r.data),
};

// PART REQUEST SERVICE
export const partRequestService = {
  getMine: () =>
    axios
      .get(`${API}/partrequests/mine`, { headers: authHeader() })
      .then((r) => r.data),

  getAll: () =>
    axios
      .get(`${API}/partrequests`, { headers: authHeader() })
      .then((r) => r.data),

  create: (data) =>
    axios
      .post(`${API}/partrequests`, data, { headers: authHeader() })
      .then((r) => r.data),

  delete: (id) =>
    axios
      .delete(`${API}/partrequests/${id}`, { headers: authHeader() })
      .then((r) => r.data),

  updateStatus: (id, status) =>
    axios
      .put(
        `${API}/partrequests/${id}/status?status=${status}`,
        {},
        { headers: authHeader() },
      )
      .then((r) => r.data),
};

// REVIEW SERVICE
export const reviewService = {
  getAll: () =>
    axios.get(`${API}/reviews`, { headers: authHeader() }).then((r) => r.data),

  getMine: () =>
    axios
      .get(`${API}/reviews/mine`, { headers: authHeader() })
      .then((r) => r.data),

  create: (data) =>
    axios
      .post(`${API}/reviews`, data, { headers: authHeader() })
      .then((r) => r.data),

  delete: (id) =>
    axios
      .delete(`${API}/reviews/${id}`, { headers: authHeader() })
      .then((r) => r.data),
};

// PROFILE SERVICE
export const profileService = {
  get: () =>
    axios.get(`${API}/profile`, { headers: authHeader() }).then((r) => r.data),

  update: (data) =>
    axios
      .put(`${API}/profile`, data, { headers: authHeader() })
      .then((r) => r.data),

  changePassword: (data) =>
    axios
      .post(`${API}/profile/change-password`, data, { headers: authHeader() })
      .then((r) => r.data),
};

// INVOICES SERVICE
export const invoicesService = {
  getAll: () =>
    axios.get(`${API}/invoices`, { headers: authHeader() }).then((r) => r.data),

  create: (data) =>
    axios
      .post(`${API}/invoices`, data, { headers: authHeader() })
      .then((r) => r.data),
      
  getById: (id) =>
    axios
      .get(`${API}/invoices/${id}`, { headers: authHeader() })
      .then((r) => r.data),
};
