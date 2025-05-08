import React, { createContext, useState, useContext } from 'react';
import Toast from '../components/ui/Toast';

// Criando o contexto
const ToastContext = createContext();

// Hook personalizado para usar o Toast
export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast deve ser usado dentro de um ToastProvider');
	}
	return context;
};

// Provider do Toast
export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	// Função para adicionar um novo toast
	const addToast = (message, type = 'info', duration = 3000) => {
		const id = Date.now();
		setToasts(prev => [...prev, { id, message, type, duration }]);
		return id;
	};

	// Função para remover um toast pelo ID
	const removeToast = (id) => {
		setToasts(prev => prev.filter(toast => toast.id !== id));
	};

	// Atalhos para tipos comuns de toast
	const showSuccess = (message, duration) => addToast(message, 'success', duration);
	const showError = (message, duration) => addToast(message, 'error', duration);
	const showWarning = (message, duration) => addToast(message, 'warning', duration);
	const showInfo = (message, duration) => addToast(message, 'info', duration);

	// Valor do contexto
	const contextValue = {
		addToast,
		removeToast,
		showSuccess,
		showError,
		showWarning,
		showInfo
	};

	return (
		<ToastContext.Provider value={contextValue}>
			{children}

			{/* Renderiza todos os toasts ativos */}
			<div className="toast-container" style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}>
				{toasts.map((toast) => (
					<div key={toast.id} className="mb-2">
						<Toast
							message={toast.message}
							type={toast.type}
							duration={toast.duration}
							onClose={() => removeToast(toast.id)}
						/>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
};

export default ToastContext;