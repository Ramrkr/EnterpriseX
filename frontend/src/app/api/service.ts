import axios from 'axios';

export const api_baseURL = "http://localhost:5000/api";

export const API = axios.create({
    baseURL:api_baseURL
});
