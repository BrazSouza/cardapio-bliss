// src/utils/api.js
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:5000/api', // Altere conforme o seu backend
});

// Intercepta e adiciona o token se existir
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

export default api;
