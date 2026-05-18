import axios from "axios";

const API = "https://localhost:7089/api";

// Global interceptor to transparently unpack PagedResult backend listings for frontend array compatibility
axios.interceptors.response.use(
  (response) => {
    const rawData = response.data;
    if (rawData) {
      // Case 1: ApiResponse<PagedResult<T>>
      if (
        rawData.success === true &&
        rawData.data &&
        typeof rawData.data === "object" &&
        Array.isArray(rawData.data.items)
      ) {
        response.data = {
          ...rawData,
          data: rawData.data.items,
          meta: {
            totalCount: rawData.data.totalCount,
            pageNumber: rawData.data.pageNumber,
            pageSize: rawData.data.pageSize,
            totalPages: rawData.data.totalPages,
          }
        };
      }
      // Case 2: PagedResult<T> directly
      else if (typeof rawData === "object" && Array.isArray(rawData.items)) {
        const items = rawData.items;
        Object.defineProperties(items, {
          totalCount: { value: rawData.totalCount, enumerable: false },
          pageNumber: { value: rawData.pageNumber, enumerable: false },
          pageSize: { value: rawData.pageSize, enumerable: false },
          totalPages: { value: rawData.totalPages, enumerable: false },
        });
        response.data = items;
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper - gets token from localStorage and builds auth header
function authHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// STAFF SERVICE
export const staffService = {
  getAll: (page = 1, pageSize = 7) =>
    axios.get(`${API}/staff?page=${page}&pageSize=${pageSize}`, { headers: authHeader() }).then((r) => r.data),

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
  getAll: (page = 1, pageSize = 7) =>
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
  getAll: (page = 1, pageSize = 7) =>
    axios.get(`${API}/vendors?page=${page}&pageSize=${pageSize}`, { headers: authHeader() }).then((r) => r.data),
};

export const vehicleService = {
  getMine: () =>
    axios.get(`${API}/vehicles`, { headers: authHeader() }).then((r) => r.data),

  getAll: (page = 1, pageSize = 7) =>
    axios
      .get(`${API}/vehicles/all?page=${page}&pageSize=${pageSize}`, { headers: authHeader() })
      .then((r) => r.data),

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

// CUSTOMER SERVICE
export const customerService = {
  getAll: (page = 1, pageSize = 7) =>
    axios
      .get(`${API}/customers?page=${page}&pageSize=${pageSize}`, { headers: authHeader() })
      .then((r) => r.data),
};

// APPOINTMENT SERVICE
export const appointmentService = {
  getMine: () =>
    axios
      .get(`${API}/appointments/mine`, { headers: authHeader() })
      .then((r) => r.data),

  getAll: (page = 1, pageSize = 7) =>
    axios
      .get(`${API}/appointments?page=${page}&pageSize=${pageSize}`, { headers: authHeader() })
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

export const partRequestService = {
  getMine: () =>
    axios
      .get(`${API}/partrequests/mine`, { headers: authHeader() })
      .then((r) => r.data),

  getAll: (page = 1, pageSize = 7) =>
    axios
      .get(`${API}/partrequests?page=${page}&pageSize=${pageSize}`, { headers: authHeader() })
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

  pay: (id) =>
    axios
      .post(`${API}/partrequests/${id}/pay`, {}, { headers: authHeader() })
      .then((r) => r.data),
};

// REVIEW SERVICE
export const reviewService = {
  getAll: (page = 1, pageSize = 7) =>
    axios.get(`${API}/reviews?page=${page}&pageSize=${pageSize}`, { headers: authHeader() }).then((r) => r.data),

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
  getAll: (page = 1, pageSize = 7, paymentMethod = "") =>
    axios.get(`${API}/invoices?page=${page}&pageSize=${pageSize}${paymentMethod ? `&paymentMethod=${paymentMethod}` : ""}`, { headers: authHeader() }).then((r) => r.data),

  create: (data) =>
    axios
      .post(`${API}/invoices`, data, { headers: authHeader() })
      .then((r) => r.data),

  getById: (id) =>
    axios
      .get(`${API}/invoices/${id}`, { headers: authHeader() })
      .then((r) => r.data),

  sendEmail: (id, email) =>
    axios
      .post(
        `${API}/invoices/${id}/send-email`,
        { email },
        { headers: authHeader() },
      )
      .then((r) => r.data),

  settle: (id, data) =>
    axios
      .post(`${API}/invoices/${id}/settle`, data, { headers: authHeader() })
      .then((r) => r.data),

  delete: (id) =>
    axios
      .delete(`${API}/invoices/${id}`, { headers: authHeader() })
      .then((r) => r.data),

  update: (id, data) =>
    axios
      .put(`${API}/invoices/${id}`, data, { headers: authHeader() })
      .then((r) => r.data),

  sendCreditReminder: (id) =>
    axios
      .post(
        `${API}/invoices/${id}/send-credit-reminder`,
        {},
        { headers: authHeader() },
      )
      .then((r) => r.data),
};

// REPORTS SERVICE
export const reportsService = {
  getMonthly: (year, month) =>
    axios
      .get(`${API}/reports/financial/monthly?year=${year}&month=${month}`, {
        headers: authHeader(),
      })
      .then((r) => r.data),
};
