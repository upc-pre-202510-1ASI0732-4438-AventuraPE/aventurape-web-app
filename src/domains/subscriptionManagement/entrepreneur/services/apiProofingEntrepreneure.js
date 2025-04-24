import axios from 'axios';

// Crear una instancia de axios con la configuración base
const apiProofingEntrepreneure = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor para añadir token de autenticación a todas las solicitudes
apiProofingEntrepreneure.interceptors.request.use(config => {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Agregar método para actualizar el comprobante
    apiProofingEntrepreneure.updateProofingEntrepreneure = function(userId, proofingBase64) {
    return this.put(`/users/${userId}/update-proofing`, {
        proofingEntrepreneure: proofingBase64
    });
};

export default apiProofingEntrepreneure;