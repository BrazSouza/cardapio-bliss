import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebarContext } from '../../../contexts/SidebarContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


function AdminLayout() {
	const { isExpanded, toggleSidebar } = useSidebarContext();
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	// Verificar autenticação
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate('/login');
		}
	}, [isAuthenticated, isLoading, navigate]);

	// Fechar sidebar no clique em dispositivos móveis
	const handleOverlayClick = () => {
		if (window.innerWidth < 768 && isExpanded) {
			toggleSidebar();
		}
	};

	if (isLoading) {
		return (
			<div className="centered-loader">
				<div className="centered-loader__spinner"></div>
			</div>
		);
	}

	return (
		<div className={`admin-layout ${isExpanded ? 'admin-layout--expanded' : 'admin-layout--collapsed'}`}>
			<Sidebar />

			{/* Overlay para dispositivos móveis */}
			<CSSTransition
				in={isExpanded && window.innerWidth < 768}
				timeout={300}
				classNames="fade"
				unmountOnExit
			>
				<div
					className="admin-layout__overlay admin-layout__overlay--visible"
					onClick={handleOverlayClick}
				></div>
			</CSSTransition>

			<div className="admin-layout__content">
				<Header />
				<main className="admin-layout__main">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export default AdminLayout;