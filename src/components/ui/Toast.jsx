import React, { useState, useEffect } from 'react';

/**
 * Componente Toast para exibir notificações temporárias
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de notificação: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duração em ms que o toast fica visível
 * @param {function} onClose - Função de callback quando o toast é fechado
 */
function Toast({ message, type = 'info', duration = 3000, onClose }) {
	const [isVisible, setIsVisible] = useState(true);
	const [progress, setProgress] = useState(100);

	// Configurações de estilo baseadas no tipo
	const toastConfig = {
		success: {
			icon: 'check_circle',
			bgColor: 'bg-green-500',
			textColor: 'text-white',
			progressColor: 'bg-green-300'
		},
		error: {
			icon: 'error',
			bgColor: 'bg-red-500',
			textColor: 'text-white',
			progressColor: 'bg-red-300'
		},
		warning: {
			icon: 'warning',
			bgColor: 'bg-yellow-500',
			textColor: 'text-white',
			progressColor: 'bg-yellow-300'
		},
		info: {
			icon: 'info',
			bgColor: 'bg-blue-500',
			textColor: 'text-white',
			progressColor: 'bg-blue-300'
		}
	};

	const config = toastConfig[type] || toastConfig.info;

	// Efeito para controlar a duração e o progresso
	useEffect(() => {
		// Controla a barra de progresso
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev <= 0) {
					clearInterval(progressInterval);
					return 0;
				}
				return prev - (100 / (duration / 100));
			});
		}, 100);

		// Timer para fechar o toast
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => {
				if (onClose) onClose();
			}, 300); // Tempo para a animação de saída completar
		}, duration);

		return () => {
			clearTimeout(timer);
			clearInterval(progressInterval);
		};
	}, [duration, onClose]);

	// Handler para fechar manualmente
	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => {
			if (onClose) onClose();
		}, 300);
	};

	return (
		<div
			className={`fixed top-4 right-4 max-w-md z-50 flex flex-col shadow-lg rounded-md overflow-hidden transform transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
				}`}
		>
			<div className={`flex items-center p-4 ${config.bgColor} ${config.textColor}`}>
				<span className="material-icons mr-2">{config.icon}</span>
				<p className="font-medium">{message}</p>
				<button
					onClick={handleClose}
					className="ml-auto focus:outline-none"
					aria-label="Fechar"
				>
					<span className="material-icons">close</span>
				</button>
			</div>

			{/* Barra de progresso */}
			<div className="h-1 w-full bg-gray-200">
				<div
					className={`h-full ${config.progressColor}`}
					style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
				></div>
			</div>
		</div>
	);
}

export default Toast;