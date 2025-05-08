import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function AcompanharPedido() {
	const { pedidoId } = useParams();
	const [pedido, setPedido] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPedido = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`/api/pedidos/${pedidoId}`);
				setPedido(response.data);
			} catch (err) {
				console.error('Erro ao buscar detalhes do pedido:', err);
				setError('Não foi possível carregar os detalhes do seu pedido.');
			} finally {
				setLoading(false);
			}
		};

		if (pedidoId) {
			fetchPedido();

			// Atualizar status do pedido a cada 30 segundos
			const intervalId = setInterval(fetchPedido, 30000);

			return () => clearInterval(intervalId);
		}
	}, [pedidoId]);

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

	// Mapear o status para definir o progresso na timeline
	const getStatusProgress = (status) => {
		const statusMap = {
			'pendente': 1,
			'preparo': 2,
			'pronto': 3,
			'entregue': 4,
			'cancelado': 0
		};

		return statusMap[status?.toLowerCase()] || 0;
	};

	// Renderizar a Timeline de status
	const renderTimeline = () => {
		if (!pedido) return null;

		const progress = getStatusProgress(pedido.status);
		const isCanceled = pedido.status?.toLowerCase() === 'cancelado';

		if (isCanceled) {
			return (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-center">
					<span className="material-icons text-3xl mb-2">cancel</span>
					<p className="font-medium">Este pedido foi cancelado</p>
					<p className="text-sm mt-1">{formatarData(pedido.dataAtualizacao)}</p>
				</div>
			);
		}

		const steps = [
			{ key: 'pendente', label: 'Pedido Recebido', icon: 'receipt_long' },
			{ key: 'preparo', label: 'Em Preparo', icon: 'restaurant' },
			{ key: 'pronto', label: 'Pronto', icon: 'check_circle' },
			{ key: 'entregue', label: 'Entregue', icon: 'local_shipping' }
		];

		return (
			<div className="px-4 py-6">
				<div className="flex items-center justify-between">
					{steps.map((step, index) => (
						<React.Fragment key={step.key}>
							{/* Conectores entre os passos */}
							{index > 0 && (
								<div className={`flex-1 h-1 mx-2 ${index <= progress - 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
							)}

							{/* Círculos de status */}
							<div className="relative">
								<div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${index < progress ? 'border-green-500 bg-green-500 text-white' :
									index === progress - 1 ? 'border-green-500 bg-green-500 text-white' :
										'border-gray-300 bg-white text-gray-500'
									}`}>
									<span className="material-icons text-sm">{step.icon}</span>
								</div>
								<div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
									<p className={`text-xs font-medium ${index < progress ? 'text-green-600' :
										index === progress - 1 ? 'text-green-600' :
											'text-gray-500'
										}`}>
										{step.label}
									</p>
								</div>
							</div>
						</React.Fragment>
					))}
				</div>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto p-4 md:p-8">
				<div className="flex justify-center">
					<div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-4xl mx-auto p-4 md:p-8">
				<div className="bg-red-50 p-6 rounded-lg shadow-md text-center">
					<div className="text-red-500 mb-4">
						<span className="material-icons text-4xl">error_outline</span>
					</div>
					<h2 className="text-xl font-bold text-gray-800 mb-2">Ops! Ocorreu um erro</h2>
					<p className="text-gray-600 mb-6">{error}</p>
					<Link to="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
						Voltar ao Início
					</Link>
				</div>
			</div>
		);
	}

	if (!pedido) {
		return (
			<div className="max-w-4xl mx-auto p-4 md:p-8">
				<div className="bg-yellow-50 p-6 rounded-lg shadow-md text-center">
					<div className="text-yellow-500 mb-4">
						<span className="material-icons text-4xl">search</span>
					</div>
					<h2 className="text-xl font-bold text-gray-800 mb-2">Pedido não encontrado</h2>
					<p className="text-gray-600 mb-6">Não conseguimos encontrar informações para este pedido.</p>
					<Link to="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
						Voltar ao Início
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-4 md:p-8">
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{/* Cabeçalho */}
				<div className="bg-blue-600 text-white p-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
						<div>
							<h1 className="text-xl font-bold mb-1">Acompanhar Pedido #{pedido.numero || pedidoId}</h1>
							<p className="text-blue-100">Realizado em {formatarData(pedido.dataCriacao)}</p>
						</div>
						<div className="mt-4 md:mt-0">
							<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-blue-800">
								{pedido.status?.toUpperCase()}
							</span>
						</div>
					</div>
				</div>

				{/* Timeline de Status */}
				<div className="border-b border-gray-200">
					{renderTimeline()}
				</div>

				{/* Detalhes do Pedido */}
				<div className="p-6">
					<h2 className="text-lg font-semibold mb-4">Detalhes do Pedido</h2>

					{/* Itens do pedido */}
					<div className="border rounded-lg overflow-hidden mb-6">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Item
									</th>
									<th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
										Qtd
									</th>
									<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Preço
									</th>
									<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Subtotal
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{pedido.itens?.map((item) => (
									<tr key={item.id}>
										<td className="px-6 py-4">
											<div className="text-sm font-medium text-gray-900">{item.produto?.nome || item.nome}</div>
											{item.observacao && (
												<div className="text-xs text-gray-500 mt-1">{item.observacao}</div>
											)}
										</td>
										<td className="px-6 py-4 text-sm text-gray-500 text-center">
											{item.quantidade}
										</td>
										<td className="px-6 py-4 text-sm text-gray-500 text-right">
											R$ {Number(item.precoUnitario).toFixed(2)}
										</td>
										<td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
											R$ {(item.quantidade * Number(item.precoUnitario)).toFixed(2)}
										</td>
									</tr>
								))}
							</tbody>
							<tfoot className="bg-gray-50">
								<tr>
									<td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
										Total
									</td>
									<td className="px-6 py-4 text-right text-base font-semibold text-gray-900">
										R$ {pedido.valorTotal?.toFixed(2) || '0.00'}
									</td>
								</tr>
							</tfoot>
						</table>
					</div>

					{/* Informações adicionais */}
					{pedido.observacoes && (
						<div className="mb-6">
							<h3 className="text-sm font-medium text-gray-700 mb-2">Observações do Pedido</h3>
							<p className="text-gray-600 bg-gray-50 p-3 rounded-md">{pedido.observacoes}</p>
						</div>
					)}

					{/* Botões de ação */}
					<div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
						<Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 text-center">
							Voltar ao Cardápio
						</Link>
						{['pendente', 'preparo'].includes(pedido.status?.toLowerCase()) && (
							<button
								className="bg-white text-red-600 border border-red-600 px-6 py-2 rounded-md font-medium hover:bg-red-50 text-center"
								onClick={() => {
									// Implementar função para cancelar pedido
									if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
										alert('Função de cancelamento a ser implementada');
									}
								}}
							>
								Cancelar Pedido
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default AcompanharPedido;