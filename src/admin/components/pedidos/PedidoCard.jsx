import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

/**
 * Componente para exibir um card de pedido
 * @param {Object} pedido - Dados do pedido
 */
function PedidoCard({ pedido }) {
	if (!pedido) return null;

	// Formata a data em formato legível
	const formatarData = (dataString) => {
		const data = new Date(dataString);
		return new Intl.DateTimeFormat('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(data);
	};

	// Calcula o valor total dos itens
	const calcularTotal = () => {
		if (!pedido.itens || !Array.isArray(pedido.itens)) return 0;

		return pedido.itens.reduce((total, item) => {
			return total + (item.quantidade * item.precoUnitario);
		}, 0);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-4 transition-all hover:shadow-lg">
			<div className="flex justify-between items-start mb-3">
				<div>
					<h3 className="font-medium">
						Pedido #{pedido.numero || pedido.id}
					</h3>
					<p className="text-sm text-gray-500">
						{formatarData(pedido.dataCriacao)}
					</p>
				</div>
				<StatusBadge status={pedido.status} />
			</div>

			<div className="space-y-2 mb-3">
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Cliente:</span>
					<span>{pedido.cliente?.nome || 'Cliente não identificado'}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Itens:</span>
					<span>{pedido.itens?.length || 0}</span>
				</div>
				<div className="flex justify-between text-sm font-medium">
					<span>Total:</span>
					<span>R$ {calcularTotal().toFixed(2)}</span>
				</div>
			</div>

			<div className="border-t pt-3 mt-3 flex justify-between">
				<Link
					to={`/admin/pedidos/${pedido.id}`}
					className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
				>
					<span className="material-icons text-sm mr-1">visibility</span>
					Ver detalhes
				</Link>

				{/* Botão de ação rápida baseado no status atual */}
				{pedido.status === 'pendente' && (
					<button
						className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm flex items-center"
						title="Marcar como em preparo"
					>
						<span className="material-icons text-sm mr-1">restaurant</span>
						Preparar
					</button>
				)}

				{pedido.status === 'preparo' && (
					<button
						className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm flex items-center"
						title="Marcar como pronto"
					>
						<span className="material-icons text-sm mr-1">check_circle</span>
						Pronto
					</button>
				)}
			</div>
		</div>
	);
}

export default PedidoCard;