import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../../contexts/NotificationContext';

function NotificationDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
	const dropdownRef = useRef(null);

	// Fechar dropdown ao clicar fora dele
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Formatar tempo relativo
	const formatRelativeTime = (date) => {
		if (!date) return '';

		const now = new Date();
		const notificationDate = new Date(date);
		const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

		if (diffInMinutes < 1) return 'Agora';
		if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) return `${diffInHours} h atrás`;

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays === 1) return 'Ontem';
		if (diffInDays < 7) return `${diffInDays} dias atrás`;

		return notificationDate.toLocaleDateString('pt-BR');
	};

	// Handler para clique em uma notificação
	const handleNotificationClick = (id) => {
		markAsRead(id);
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="material-icons text-gray-700">notifications</span>
				{unreadCount > 0 && (
					<span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
						{unreadCount > 9 ? '9+' : unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 overflow-hidden">
					<div className="border-b px-4 py-2 flex justify-between items-center">
						<h3 className="text-sm font-medium">Notificações</h3>
						{unreadCount > 0 && (
							<button
								onClick={markAllAsRead}
								className="text-xs text-blue-600 hover:text-blue-800"
							>
								Marcar todas como lidas
							</button>
						)}
					</div>

					<div className="max-h-96 overflow-y-auto">
						{notifications.length === 0 ? (
							<div className="px-4 py-6 text-center text-gray-500">
								<span className="material-icons mb-2 text-3xl">notifications_off</span>
								<p>Nenhuma notificação</p>
							</div>
						) : (
							<ul>
								{notifications.map((notification) => (
									<li
										key={notification.id}
										className={`border-b last:border-0 ${!notification.read ? 'bg-blue-50' : ''}`}
									>
										<Link
											to={notification.link || '#'}
											className="block px-4 py-3 hover:bg-gray-50"
											onClick={() => handleNotificationClick(notification.id)}
										>
											<div className="flex justify-between items-start">
												<span className={`material-icons text-${notification.type === 'success' ? 'green' : 'blue'}-500 mr-3`}>
													{notification.type === 'success' ? 'shopping_bag' : 'info'}
												</span>
												<div className="flex-1">
													<p className="text-sm font-medium">{notification.title}</p>
													<p className="text-xs text-gray-600">{notification.message}</p>
												</div>
												<span className="text-xs text-gray-400">
													{formatRelativeTime(notification.time)}
												</span>
											</div>
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="border-t px-4 py-2 text-center">
						<Link
							to="/admin/notificacoes"
							className="text-xs text-blue-600 hover:text-blue-800"
							onClick={() => setIsOpen(false)}
						>
							Ver todas
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

export default NotificationDropdown;