import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarContext } from '../../../contexts/SidebarContext';

function Sidebar() {
	const location = useLocation();
	const { isOpen, toggleSidebar } = useContext(SidebarContext);

	const menuItems = [
		{ path: '/admin', icon: 'dashboard', label: 'Dashboard' },
		{ path: '/admin/pedidos', icon: 'shopping_bag', label: 'Pedidos' },
		{ path: '/admin/produtos', icon: 'restaurant_menu', label: 'Produtos' },
		{ path: '/admin/categorias', icon: 'category', label: 'Categorias' },
		{ path: '/admin/configuracoes', icon: 'settings', label: 'Configurações' },
	];

	return (
		<>
			<div className={`sidebar ${isOpen ? 'open' : ''}`}>
				<div className="sidebar__header">
					<div className="sidebar__header-logo">Cardápio Digital</div>
				</div>

				<nav className="sidebar__nav">
					<ul>
						{menuItems.map((item) => (
							<li key={item.path}>
								<Link
									to={item.path}
									className={location.pathname === item.path ? 'active' : ''}
									onClick={() => {
										// Fechar a sidebar em telas pequenas ao clicar em um item
										if (window.innerWidth < 768) {
											toggleSidebar();
										}
									}}
								>
									<span className="material-icons">{item.icon}</span>
									<span>{item.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div className="sidebar__footer">
					<p>© {new Date().getFullYear()} Cardápio Digital</p>
				</div>
			</div>

			{/* Overlay para fechar a sidebar em dispositivos móveis */}
			<div
				className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
				onClick={toggleSidebar}
			></div>
		</>
	);
}

export default Sidebar;