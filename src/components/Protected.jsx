// Localização: /src/components/Protected.jsx

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../src/contexts/AuthContext';

/**
 * Componente para proteger rotas que requerem autenticação
 * @param {Object} props - Propriedades do componente
 * @param {JSX.Element} props.children - Elemento filho a ser renderizado se autenticado
 * @param {boolean} props.adminRequired - Se verdadeiro, apenas admins podem acessar
 */
function Protected({ children, adminRequired = false }) {
	const { currentUser, loading, isAdmin } = useContext(AuthContext);
	const location = useLocation();

	// Se ainda está carregando, exibir um indicador de carregamento
	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	// Se não está autenticado, redirecionar para login
	if (!currentUser) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Se requer admin e o usuário não é admin, redirecionar para página inicial
	if (adminRequired && !isAdmin()) {
		return <Navigate to="/" replace />;
	}

	// Se autenticado (e admin, se necessário), renderizar o conteúdo
	return children;
}

export default Protected;