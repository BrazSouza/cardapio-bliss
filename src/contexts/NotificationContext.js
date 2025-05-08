import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const { user, isAuthenticated } = useAuth();

	// Inicializar conexão com socket
	useEffect(() => {
		// Conectar apenas se o usuário estiver autenticado
		if (isAuthenticated) {
			const socketInstance = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

			socketInstance.on('connect', () => {
				console.log('Conectado ao servidor de notificações');
			});

			socketInstance.on('disconnect', () => {
				console.log('Desconectado do servidor de notificações');
			});

			setSocket(socketInstance);

			// Limpar conexão ao desmontar
			return () => {
				if (socketInstance) {
					socketInstance.disconnect();
				}
			};
		}
	}, [isAuthenticated]);


	const addNotification = useCallback((notification) => {
		setNotifications(prev => [notification, ...prev.slice(0, 49)]);

		if (window.showToast) {
			window.showToast(notification.message, notification.type);
		}
	}, []);


	// Configurar escuta de eventos
	useEffect(() => {
		if (!socket) return;

		if (user?.role === 'ADMIN') {
			socket.on('novo_pedido', (data) => {
				addNotification({
					id: `pedido_${data.id}_${Date.now()}`,
					title: 'Novo Pedido',
					message: data.mensagem,
					type: 'success',
					time: new Date(),
					read: false,
					link: `/admin/pedidos/${data.id}`,
					data
				});
			});

			socket.on('pedido_atualizado', (data) => {
				addNotification({
					id: `status_${data.id}_${Date.now()}`,
					title: 'Pedido Atualizado',
					message: data.mensagem,
					type: 'info',
					time: new Date(),
					read: false,
					link: `/admin/pedidos/${data.id}`,
					data
				});
			});
		} else if (user?.id) {
			socket.on(`pedido_cliente_${user.id}`, (data) => {
				addNotification({
					id: `cliente_pedido_${data.id}_${Date.now()}`,
					title: 'Atualização do Pedido',
					message: data.mensagem,
					type: 'info',
					time: new Date(),
					read: false,
					link: `/acompanhar-pedido/${data.id}`,
					data
				});
			});
		}

		return () => {
			if (socket) {
				socket.off('novo_pedido');
				socket.off('pedido_atualizado');
				if (user?.id) {
					socket.off(`pedido_cliente_${user.id}`);
				}
			}
		};
	}, [socket, user, addNotification]); // <-- addNotification incluído aqui


	// Atualizar contador de não lidos
	useEffect(() => {
		const count = notifications.filter(n => !n.read).length;
		setUnreadCount(count);
	}, [notifications]);


	// Marcar notificação como lida
	const markAsRead = useCallback((id) => {
		setNotifications(prev =>
			prev.map(notification =>
				notification.id === id ? { ...notification, read: true } : notification
			)
		);
	}, []);

	// Marcar todas como lidas
	const markAllAsRead = useCallback(() => {
		setNotifications(prev =>
			prev.map(notification => ({ ...notification, read: true }))
		);
	}, []);

	// Limpar todas notificações
	const clearNotifications = useCallback(() => {
		setNotifications([]);
	}, []);

	const value = {
		notifications,
		unreadCount,
		markAsRead,
		markAllAsRead,
		clearNotifications
	};

	return (
		<NotificationContext.Provider value={value}>
			{children}
		</NotificationContext.Provider>
	);
};