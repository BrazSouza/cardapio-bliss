import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import StatusBadge from '../components/pedidos/StatusBadge';

function PedidoDetalhes() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [pedido, setPedido] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isUpdating, setIsUpdating] = useState(false);

	// Buscar detalhes do pedido
	const fetchPedidoDetalhes = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await axios.get(`/api/admin/pedidos/${id}`);
			setPedido(response.data);
		} catch (err) {
			console.error('Erro ao buscar detalhes do pedido:', err);
			setError('Não foi possível carregar os detalhes do pedido.');
		} finally {
			setIsLoading(false);
		}
	};

	// Efeito inicial para carregar o pedido
	useEffect(() => {
		if (id) {
			fetchPedidoDetalhes();
		}
	}, [id]);

	// Atualizar status do pedido
	const handleStatusUpdate = async (novoStatus) => {
		try {
			setIsUpdating(true);

			await axios.patch(`/api/admin/pedidos/${id}/status`, {
				status: novoStatus
			});

			// Atualizar o estado local
			setPedido(prev => ({ ...prev, status: novoStatus }));
		} catch (err) {
			console.error('Erro ao atualizar status do pedido:', err);
			alert('Não foi possível atualizar o status do pedido.');
		} finally {
			setIsUpdating(false);
		}
	};

	// Cancelar pedido
	const handleCancelarPedido = async () => {
		if (window.confirm('Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.')) {
			try {
				setIsUpdating(true);
				await axios.patch(`/api/admin/pedidos/${id}/status`, { status: 'cancelado' });
				setPedido(prev => ({ ...prev, status: 'cancelado' }));
			} catch (err) {
				console.error('Erro ao cancelar pedido:', err);
				alert('Não foi possível cancelar o pedido.');
			} finally {
				setIsUpdating(false);
			}
		}
	};

	// Formatar data em formato legível
	const formatarData = (dataString) => {
		if (!dataString) return '';

		const data = new Date(dataString);
		return new Intl.DateTimeFormat('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(data);
	};

	// Calcular total
	const calcularTotal = () => {
		if (!pedido?.itens?.length) return 0;

		return pedido.itens.reduce((total, item) => {
			return total + (item.quantidade * item.precoUnitario);
		}, 0);
	};

	// Renderizar botões de ação conforme o status atual
	const renderBotoesAcao = () => {
		if (!pedido) return null;

		const botoesConforme = {
			'pendente': (
				<button
					onClick={() => handleStatusUpdate('preparo')}
					disabled={isUpdating}
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
				>
					Iniciar Preparo
				</button>
			),
			'preparo': (
				<button
					onClick={() => handleStatusUpdate('pronto')}
					disabled={isUpdating}
					className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
				>
					Marcar como Pronto
				</button>
			),
			'pronto': (
				<button
					onClick={() => handleStatusUpdate('entregue')}
					disabled={isUpdating}
					className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
				>
					Confirmar Entrega
				</button>
			)
		};

		return botoesConforme[pedido.status] || null;
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-100 text-red-700 p-4 rounded-md">
				<p>{error}</p>
				<button
					onClick={() => navigate('/admin/pedidos')}
					className="mt-4 bg-white text-red-700 border border-red-700 px-4 py-2 rounded"
				>
					Voltar para Pedidos
				</button>
			</div>
		);
	}

	if (!pedido) {
		return (
			<div className="text-center py-8">
				<p>Pedido não encontrado.</p>
				<button
					onClick={() => navigate('/admin/pedidos')}
					className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
				>
					Voltar para Pedidos
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			{/* Cabeçalho */}
			<div className="flex justify-between items-center mb-6">
				<div>
					<Link
						to="/admin/pedidos"
						className="text-blue-600 hover:text-blue-700 flex items-center mb-2"
					>
						<span className="material-icons text-sm mr-1">arrow_back</span>
						Voltar para Pedidos
					</Link>
					<h2 className="text-2xl font-bold">Pedido #{pedido.numero || pedido.id}</h2>
				</div>
				<StatusBadge status={pedido.status} className="text-sm" />
			</div>

			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				{/* Informações do pedido */}
				<div className="p-6 border-b">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<h3 className="text-gray-500 text-sm">Data do Pedido</h3>
							<p>{formatarData(pedido.dataCriacao)}</p>
						</div>
						<div>
							<h3 className="text-gray-500 text-sm">Cliente</h3>
							<p>{pedido.cliente?.nome || 'Cliente não identificado'}</p>
						</div>
						<div>
							<h3 className="text-gray-500 text-sm">Contato</h3>
							<p>{pedido.cliente?.telefone || 'N/A'}</p>
						</div>
						<div>
							<h3 className="text-gray-500 text-sm">Forma de Pagamento</h3>
							<p>{pedido.formaPagamento || 'N/A'}</p>
						</div>
					</div>
				</div>

				{/* Itens do pedido */}
				<div className="p-6 border-b">
					<h3 className="font-medium mb-4">Itens do Pedido</h3>
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
										Item
									</th>
									<th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
										Quantidade
									</th>
									<th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
										Preço Unit.
									</th>
									<th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
										Subtotal
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{pedido.itens?.map((item) => (
									<tr key={item.id}>
										<td className="px-4 py-3">
											<div>
												<p className="font-medium">{item.nome}</p>
												{item.observacao && (
													<p className="text-sm text-gray-500">{item.observacao}</p>
												)}
											</div>
										</td>
										<td className="px-4 py-3">
											{item.quantidade}
										</td>
										<td className="px-4 py-3">
											R$ {item.precoUnitario.toFixed(2)}
										</td>
										<td className="px-4 py-3 font-medium">
											R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr className="bg-gray-50">
									<td colSpan="3" className="px-4 py-3 text-right font-medium">
										Total
									</td>
									<td className="px-4 py-3 font-bold">
										R$ {calcularTotal().toFixed(2)}
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>

				{/* Observações */}
				{pedido.observacao && (
					<div className="p-6 border-b">
						<h3 className="font-medium mb-2">Observações</h3>
						<p className="text-gray-700">{pedido.observacao}</p>
					</div>
				)}

				{/* Ações */}
				<div className="p-6 flex justify-between items-center">
					<div className="flex space-x-2">
						{renderBotoesAcao()}
					</div>

					{/* Botão de cancelar (disponível apenas para pedidos não entregues ou cancelados) */}
					{!['entregue', 'cancelado'].includes(pedido.status) && (
						<button
							onClick={handleCancelarPedido}
							disabled={isUpdating}
							className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 disabled:opacity-50"
						>
							Cancelar Pedido
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default PedidoDetalhes;