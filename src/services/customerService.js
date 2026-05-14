import axios from "axios";

const API = "https://localhost:7089/api";

// Feature 6: Register new customer with vehicle details
export async function registerCustomer(data) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API}/customers/register`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Feature 8: Get all customers
export async function getAllCustomers() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API}/customers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Feature 8: Get customer by ID
export async function getCustomerById(id) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API}/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Feature 10: Search customers by name, phone, ID or vehicle number
export async function searchCustomers(keyword) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API}/customers/search?keyword=${keyword}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
}

// Feature 9: Get regular customers report
export async function getRegularCustomers() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API}/customers/reports/regulars`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Feature 9: Get high spenders report
export async function getHighSpenders() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API}/customers/reports/high-spenders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// Feature 9: Get pending credits report
export async function getPendingCredits() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API}/customers/reports/pending-credits`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
