import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

/**
 * Componente para proteger rotas que exigem autenticação
 * Redireciona para página de login se não autenticado
 */
function ProtectedRoute() {
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const location = useLocation();

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem('authToken');

			if (!token) {
				// Não tem token, não está autenticado
				setIsAuthenticated(false);
				setIsLoading(false);
				return;
			}

			try {
				// Configurar token no header
				axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

				// Verificar se o token é válido
				await axios.get('/api/auth/verify');

				// Token válido, está autenticado
				setIsAuthenticated(true);
			} catch (error) {
				// Token inválido, não está autenticado
				console.error('Erro ao verificar autenticação:', error);
				localStorage.removeItem('authToken');
				localStorage.removeItem('user');
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	// Mostra um loader enquanto verifica autenticação
	if (isLoading) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	// Se não estiver autenticado, redireciona para login
	if (!isAuthenticated) {
		return <Navigate to="/dashboard" state={{ from: location }} replace />;
	}

	// Se estiver autenticado, renderiza as rotas filhas
	return <Outlet />;
}

export default ProtectedRoute;