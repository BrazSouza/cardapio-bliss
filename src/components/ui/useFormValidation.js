import React, { useEffect, useState } from 'react';

/**
 * Componente Toast para exibir notificações
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de toast: 'success', 'error', 'warning', 'info'
 * @param {function} onClose - Função chamada quando o toast é fechado
 */
function Toast({ message, type = 'success', onClose }) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Aparecer com animação
		setTimeout(() => setIsVisible(true), 10);

		return () => setIsVisible(false);
	}, []);

	// Configurações baseadas no tipo
	const getToastConfig = () => {
		switch (type) {
			case 'success':
				return {
					bgColor: 'bg-green-500',
					icon: 'check_circle',
					iconColor: 'text-white'
				};
			case 'error':
				return {
					bgColor: 'bg-red-500',
					icon: 'error',
					iconColor: 'text-white'
				};
			case 'warning':
				return {
					bgColor: 'bg-yellow-500',
					icon: 'warning',
					iconColor: 'text-white'
				};
			case 'info':
				return {
					bgColor: 'bg-blue-500',
					icon: 'info',
					iconColor: 'text-white'
				};
			default:
				return {
					bgColor: 'bg-gray-700',
					icon: 'notifications',
					iconColor: 'text-white'
				};
		}
	};

	const { bgColor, icon, iconColor } = getToastConfig();

	const handleClose = () => {
		setIsVisible(false);
		// Pequeno delay antes de chamar onClose para permitir a animação
		setTimeout(() => {
			if (onClose) onClose();
		}, 300);
	};

	return (
		<div
			className={`
        ${bgColor} text-white p-3 rounded-md shadow-lg flex items-center
        transition-all duration-300 max-w-md min-w-[300px]
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-20px]'}
      `}
			role="alert"
		>
			<span className={`material-icons ${iconColor} mr-2`}>{icon}</span>
			<div className="flex-1 mr-2">{message}</div>
			<button
				onClick={handleClose}
				className="text-white hover:text-gray-200 focus:outline-none"
				aria-label="Fechar"
			>
				<span className="material-icons text-sm">close</span>
			</button>
		</div>
	);
}

export default Toast;