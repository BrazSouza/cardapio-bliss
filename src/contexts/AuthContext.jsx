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

	// Função para buscar dados completos do usuário
	const buscarDadosUsuario = async (usuarioId) => {
		try {
			const response = await axios.get(`/api/usuarios/${usuarioId}`);
			// Certificar que estamos acessando a estrutura correta da resposta
			if (response.data && response.data.usuario) {
				return response.data.usuario;
			} else {
				// Se a resposta vier diretamente com os dados do usuário
				return response.data;
			}
		} catch (error) {
			console.error('Erro ao buscar dados do usuário:', error);
			throw new Error('Não foi possível carregar os dados do usuário.');
		}
	};

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

				// Verificar se a resposta contém dados do usuário
				if (response.data && response.data.usuario) {
					// Se o endpoint de verificação já retorna dados completos
					setCurrentUser(response.data.usuario);
				} else if (response.data && response.data.id) {
					// Se retorna apenas ID, buscar dados completos
					const dadosCompletos = await buscarDadosUsuario(response.data.id);
					setCurrentUser(dadosCompletos);
				}
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
	const login = async (newToken, usuarioParcial) => {
		try {
			// Salvar token primeiro
			localStorage.setItem('authToken', newToken);
			setToken(newToken);
			setError(null);

			// Buscar dados completos do usuário
			const dadosCompletos = await buscarDadosUsuario(usuarioParcial.id);

			// Atualizar o usuário completo no estado
			setCurrentUser(dadosCompletos);
			console.log('Login realizado com sucesso. Dados do usuário:', dadosCompletos);

		} catch (err) {
			console.error('Erro ao fazer login:', err);
			setError('Erro ao carregar dados do usuário após login.');

			// Se houve erro, limpar o token
			localStorage.removeItem('authToken');
			setToken(null);
		}
	};

	// Função para atualizar dados do usuário atual (útil após edições de perfil)
	const atualizarUsuarioAtual = async () => {
		if (!currentUser || !currentUser.id) {
			console.warn('Não há usuário logado para atualizar');
			return;
		}

		try {
			const dadosAtualizados = await buscarDadosUsuario(currentUser.id);
			setCurrentUser(dadosAtualizados);
			console.log('Dados do usuário atualizados:', dadosAtualizados);
		} catch (error) {
			console.error('Erro ao atualizar dados do usuário:', error);
			setError('Não foi possível atualizar os dados do usuário.');
		}
	};

	// Função de logout
	const logout = () => {
		localStorage.removeItem('authToken');
		setToken(null);
		setCurrentUser(null);
		setError(null);
		delete axios.defaults.headers.common['Authorization'];
	};

	// Verificar se o usuário é administrador
	const isAdmin = () => {
		return currentUser && currentUser.role === 'ADMIN';
	};

	// Verificar se há usuário logado
	const isAuthenticated = () => {
		return !!currentUser && !!token;
	};

	const contextValue = {
		currentUser,
		token,
		login,
		logout,
		isAdmin,
		isAuthenticated,
		loading,
		error,
		atualizarUsuarioAtual
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de um AuthProvider');
	}
	return context;
};