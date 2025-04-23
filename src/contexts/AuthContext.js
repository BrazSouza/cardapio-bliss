import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate(); // Hook para navegação

	useEffect(() => {
		const checkUserStatus = async () => {
			try {
				const savedUser = localStorage.getItem('user');
				if (savedUser) {
					setUser(JSON.parse(savedUser));
				}
			} catch (error) {
				console.error('Erro ao recuperar dados do usuário:', error);
			} finally {
				setLoading(false);
			}
		};

		checkUserStatus();
	}, []);

	// Modifique a função register no AuthContext.js
	const register = async (userData) => {
		try {
			localStorage.setItem('user', JSON.stringify(userData));
			setUser(userData); // Atualize o estado user primeiro

			// Aguarde a próxima execução do ciclo de evento para garantir que o estado foi atualizado
			setTimeout(() => {
				navigate('/cardapio');
			}, 0);

			return { success: true };
		} catch (error) {
			console.error('Erro ao registrar usuário:', error);
			return { success: false, error };
		}
	};

	const login = async (identifier) => {
		try {
			const normalizedIdentifier = identifier.trim().toLowerCase();
			const savedUser = localStorage.getItem('user');
			if (savedUser) {
				const userData = JSON.parse(savedUser);
				const nome = userData.nome?.toLowerCase();
				const telefone = userData.telefone?.toLowerCase();
				if (nome === normalizedIdentifier || telefone === normalizedIdentifier) {
					setUser(userData);
					return { success: true };
				}
			}
			return { success: false, error: 'Usuário não encontrado' };
		} catch (error) {
			console.error('Erro ao fazer login:', error);
			return { success: false, error };
		}
	};


	const logout = () => {
		localStorage.clear();
		setUser(null);
		navigate('/'); // volta pra tela de login
	};


	return (
		<AuthContext.Provider value={{
			user,
			loading,
			register,
			login,
			logout,
			isAuthenticated: !!user
		}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de um AuthProvider');
	}
	return context;
};
