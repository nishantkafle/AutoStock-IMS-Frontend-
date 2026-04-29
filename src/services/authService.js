import axios from "axios";

const API = "https://localhost:7089/api";

function handleError(err) {
  if (err.response?.data) {
    return err.response.data;
  }

  throw err;
}

export async function registerCustomer(data) {
  try {
    const res = await axios.post(`${API}/auth/register`, data);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}

export async function loginUser(data) {
  try {
    const res = await axios.post(`${API}/auth/login`, data);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}

export async function registerStaff(data, token) {
  try {
    const res = await axios.post(`${API}/auth/register-staff`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}

export async function changePassword(data, token) {
  try {
    const res = await axios.post(`${API}/auth/change-password`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}
