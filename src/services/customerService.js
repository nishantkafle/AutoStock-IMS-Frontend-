import axios from "axios";

const API = "http://localhost:5121/api";

//  Register new customer with vehicle details
export async function registerCustomer(data) {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API}/customers/register`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

//  Get all customers
export async function getAllCustomers() {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/customers`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

//  Get customer by ID
export async function getCustomerById(id) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

//  Search customers by name, phone, ID or vehicle number
export async function searchCustomers(keyword) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/customers/search?keyword=${keyword}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}