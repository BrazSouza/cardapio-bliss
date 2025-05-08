import React, { useContext } from 'react';
import { SidebarContext } from '../../../contexts/SidebarContext';
import NotificationDropdown from './NotificationDropdown';

function Header({ title }) {
	const { toggleSidebar } = useContext(SidebarContext);

	return (
		<header className="header">
			<div className="header__left">
				<button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
					<span className="material-icons">menu</span>
				</button>
				<h1 className="header__title">{title}</h1>
			</div>

			<div className="header__right">
				<NotificationDropdown />

				<div className="header__user">
					<span className="material-icons">account_circle</span>
					<span className="header__username">Admin</span>
					<button className="header__logout">
						Sair
					</button>
				</div>
			</div>
		</header>
	);
}

export default Header;