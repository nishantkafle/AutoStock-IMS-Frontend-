import axios from "axios";

const API = "https://localhost:7089/api/vendors";

// Helper to get headers
const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export async function getAllVendors() {
    const response = await axios.get(API, getHeaders());
    return response.data;
}

export async function getVendorById(id) {
    const response = await axios.get(`${API}/${id}`, getHeaders());
    return response.data;
}

export async function createVendor(data) {
    const response = await axios.post(API, data, getHeaders());
    return response.data;
}

export async function updateVendor(id, data) {
    const response = await axios.put(`${API}/${id}`, data, getHeaders());
    return response.data;
}

export async function deleteVendor(id) {
    const response = await axios.delete(`${API}/${id}`, getHeaders());
    return response.data;
}
