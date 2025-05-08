import React from 'react';

/**
 * Componente para exibir o status do pedido com cores diferentes
 * @param {string} status - Status do pedido: 'pendente', 'preparo', 'pronto', 'entregue', 'cancelado'
 * @param {string} className - Classes adicionais para estilização
 */
function StatusBadge({ status, className = '' }) {
	// Define as cores conforme o status
	const getStatusConfig = () => {
		switch (status?.toLowerCase()) {
			case 'pendente':
				return {
					bgColor: 'bg-yellow-100',
					textColor: 'text-yellow-800',
					icon: 'hourglass_empty'
				};
			case 'preparo':
				return {
					bgColor: 'bg-blue-100',
					textColor: 'text-blue-800',
					icon: 'restaurant'
				};
			case 'pronto':
				return {
					bgColor: 'bg-green-100',
					textColor: 'text-green-800',
					icon: 'check_circle'
				};
			case 'entregue':
				return {
					bgColor: 'bg-indigo-100',
					textColor: 'text-indigo-800',
					icon: 'local_shipping'
				};
			case 'cancelado':
				return {
					bgColor: 'bg-red-100',
					textColor: 'text-red-800',
					icon: 'cancel'
				};
			default:
				return {
					bgColor: 'bg-gray-100',
					textColor: 'text-gray-800',
					icon: 'help'
				};
		}
	};

	const { bgColor, textColor, icon } = getStatusConfig();

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} ${className}`}
		>
			<span className="material-icons text-xs mr-1">{icon}</span>
			{status || 'Desconhecido'}
		</span>
	);
}

export default StatusBadge;