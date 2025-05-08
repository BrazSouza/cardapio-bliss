// Localização: /src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';


// Criar contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('authToken') || null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Configurar o token de autenticação nas requisições axios
	useEffect(() => {
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		} else {
			delete axios.defaults.headers.common['Authorization'];
		}
	}, [token]);

	// Verificar o token armazenado ao carregar a aplicação
	useEffect(() => {
		const verificarToken = async () => {
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				setError(null);
				const response = await axios.get('/api/auth/verificar');
				setCurrentUser(response.data.usuario);
			} catch (err) {
				console.error('Erro ao verificar token:', err);

				// Token inválido ou expirado, fazer logout
				if (err.response && (err.response.status === 401 || err.response.status === 403)) {
					logout();
				}

				setError('Falha na autenticação, faça login novamente.');
			} finally {
				setLoading(false);
			}
		};

		verificarToken();
	}, [token]);

	// Função de login
	const login = (newToken, usuario) => {
		localStorage.setItem('authToken', newToken);
		setToken(newToken);
		setCurrentUser(usuario);
		setError(null);
	};

	// Função de logout
	const logout = () => {
		localStorage.removeItem('authToken');
		setToken(null);
		setCurrentUser(null);
		delete axios.defaults.headers.common['Authorization'];
	};

	// Verificar se o usuário é administrador
	const isAdmin = () => {
		return currentUser && currentUser.role === 'ADMIN';
	};

	const contextValue = {
		currentUser,
		token,
		login,
		logout,
		isAdmin,
		loading,
		error
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useAuth = () => {
	return useContext(AuthContext);
};