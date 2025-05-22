// import React, { createContext, useContext, useState, useCallback } from 'react';

// const NotificationContext = createContext();

// export const useNotification = () => {
// 	const context = useContext(NotificationContext);
// 	if (!context) {
// 		throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
// 	}
// 	return context;
// };

// export const NotificationProvider = ({ children }) => {
// 	const [notifications, setNotifications] = useState([]);

// 	// Gerar ID único para cada notificação
// 	const generateId = () => {
// 		return Date.now() + Math.floor(Math.random() * 1000);
// 	};

// 	// Adicionar uma nova notificação
// 	const addNotification = useCallback((message, type = 'info', duration = 5000) => {
// 		const id = generateId();

// 		setNotifications(prev => [
// 			...prev,
// 			{
// 				id,
// 				message,
// 				type,
// 				duration
// 			}
// 		]);

// 		// Remover a notificação após a duração especificada
// 		if (duration !== 0) {
// 			setTimeout(() => {
// 				removeNotification(id);
// 			}, duration);
// 		}

// 		return id;
// 	}, []);

// 	// Remover notificação por ID
// 	const removeNotification = useCallback(id => {
// 		setNotifications(prev => prev.filter(notification => notification.id !== id));
// 	}, []);

// 	// Funções de conveniência por tipo
// 	const showSuccess = useCallback((message, duration) => {
// 		return addNotification(message, 'success', duration);
// 	}, [addNotification]);

// 	const showError = useCallback((message, duration) => {
// 		return addNotification(message, 'error', duration);
// 	}, [addNotification]);

// 	const showWarning = useCallback((message, duration) => {
// 		return addNotification(message, 'warning', duration);
// 	}, [addNotification]);

// 	const showInfo = useCallback((message, duration) => {
// 		return addNotification(message, 'info', duration);
// 	}, [addNotification]);

// 	const value = {
// 		notifications,
// 		addNotification,
// 		removeNotification,
// 		showSuccess,
// 		showError,
// 		showWarning,
// 		showInfo
// 	};

// 	return (
// 		<NotificationContext.Provider value={value}>
// 			{children}
// 		</NotificationContext.Provider>
// 	);
// };

// export default NotificationContext;