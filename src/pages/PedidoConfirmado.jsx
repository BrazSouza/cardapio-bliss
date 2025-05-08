import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function PedidoConfirmado() {
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

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
				<div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
				<p className="text-gray-600">Carregando informações do pedido...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
				<div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
					<div className="text-red-500 text-5xl mb-4">
						<span className="material-icons text-5xl">error_outline</span>
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Ops! Ocorreu um erro</h2>
					<p className="text-gray-600 mb-6">{error}</p>
					<Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
						Voltar ao Início
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
			<div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md">
				<div className="text-center mb-6">
					<div className="text-green-500 text-5xl mb-4">
						<span className="material-icons text-6xl">check_circle</span>
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h2>
					<p className="text-gray-600">
						Seu pedido #{pedido?.numero || pedidoId} foi recebido com sucesso.
					</p>
				</div>

				{pedido && (
					<div className="border-t border-b border-gray-200 py-4 my-6">
						<div className="mb-4">
							<p className="text-sm text-gray-500">Data do Pedido</p>
							<p className="font-medium">{formatarData(pedido.dataCriacao)}</p>
						</div>

						<div className="mb-4">
							<p className="text-sm text-gray-500">Status</p>
							<p className="font-medium capitalize">{pedido.status}</p>
						</div>

						<div className="mb-4">
							<p className="text-sm text-gray-500">Total</p>
							<p className="font-medium">R$ {pedido.valorTotal?.toFixed(2) || '0.00'}</p>
						</div>

						{pedido.observacoes && (
							<div className="mb-4">
								<p className="text-sm text-gray-500">Observações</p>
								<p className="font-medium">{pedido.observacoes}</p>
							</div>
						)}
					</div>
				)}

				<div className="space-y-4">
					<p className="text-center text-gray-600">
						Você receberá atualizações sobre o status do seu pedido.
					</p>

					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 text-center">
							Voltar ao Cardápio
						</Link>
						<Link to={`/acompanhar/${pedidoId}`} className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 text-center">
							Acompanhar Pedido
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PedidoConfirmado;