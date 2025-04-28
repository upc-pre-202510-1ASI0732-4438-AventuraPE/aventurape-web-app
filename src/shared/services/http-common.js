import axios from "axios";
import {authenticationInterceptor} from "@/domains/IAM/services/authentication.interceptor.js";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

http.defaults.headers.common['Content-type'] = 'application/json';
http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// Use the function directly with error handling
http.interceptors.request.use(
    authenticationInterceptor,
    error => Promise.reject(error)
);

export default http;