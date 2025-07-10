import axios from "axios";
import {authenticationInterceptor} from "@/domains/IAM/services/authentication.interceptor.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000
});

http.defaults.headers.common['Content-type'] = 'application/json';
http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// Use the function directly with error handling
http.interceptors.request.use(
    authenticationInterceptor,
    error => Promise.reject(error)
);

export default http;