import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PedidoFilter from '../components/pedidos/PedidoFilter';
import PedidoCard from '../components/pedidos/PedidoCard';

function Pedidos() {
	const [pedidos, setPedidos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filtros, setFiltros] = useState({});
	const [paginaAtual, setPaginaAtual] = useState(1);
	const [totalPaginas, setTotalPaginas] = useState(1);

	// Buscar pedidos com filtros e paginação
	const fetchPedidos = async (pagina = 1, filtrosAplicados = {}) => {
		try {
			setIsLoading(true);
			setError(null);

			// Preparar query params para a requisição
			const params = new URLSearchParams();
			params.append('pagina', pagina);

			// Adicionar filtros aos params se existirem
			if (filtrosAplicados.status) params.append('status', filtrosAplicados.status);
			if (filtrosAplicados.dataInicio) params.append('dataInicio', filtrosAplicados.dataInicio);
			if (filtrosAplicados.dataFim) params.append('dataFim', filtrosAplicados.dataFim);
			if (filtrosAplicados.busca) params.append('busca', filtrosAplicados.busca);

			const response = await axios.get(`/api/admin/pedidos?${params.toString()}`);

			setPedidos(response.data.pedidos);
			setTotalPaginas(response.data.totalPaginas);
			setPaginaAtual(response.data.paginaAtual);
		} catch (err) {
			console.error('Erro ao buscar pedidos:', err);
			setError('Não foi possível carregar os pedidos. Por favor, tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	// Efeito inicial para carregar pedidos
	useEffect(() => {
		fetchPedidos(paginaAtual, filtros);
	}, [filtros, paginaAtual]);

	// Handler para aplicar filtros
	const handleFilterApply = (novosFiltros) => {
		setFiltros(novosFiltros);
		setPaginaAtual(1); // Resetar para a primeira página ao filtrar
		fetchPedidos(1, novosFiltros);
	};

	// Handler para mudança de página
	const handlePageChange = (novaPagina) => {
		setPaginaAtual(novaPagina);
		fetchPedidos(novaPagina, filtros);
	};

	// Handler para atualização de status (ação rápida)
	const handleStatusUpdate = async (pedidoId, novoStatus) => {
		try {
			await axios.patch(`/api/admin/pedidos/${pedidoId}/status`, {
				status: novoStatus
			});

			// Atualizar o estado local
			setPedidos(pedidos.map(pedido =>
				pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
			));
		} catch (err) {
			console.error('Erro ao atualizar status do pedido:', err);
			alert('Não foi possível atualizar o status do pedido. Por favor, tente novamente.');
		}
	};

	// Renderizar botões de paginação
	const renderPaginacao = () => {
		const paginas = [];

		// Botão anterior
		paginas.push(
			<button
				key="prev"
				onClick={() => handlePageChange(paginaAtual - 1)}
				disabled={paginaAtual === 1}
				className={`px-3 py-1 mx-1 rounded ${paginaAtual === 1
					? 'bg-gray-200 text-gray-500 cursor-not-allowed'
					: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
			>
				&lt;
			</button>
		);

		// Números das páginas
		for (let i = 1; i <= totalPaginas; i++) {
			// Se tiver muitas páginas, mostrar só algumas
			if (
				i === 1 ||
				i === totalPaginas ||
				(i >= paginaAtual - 1 && i <= paginaAtual + 1)
			) {
				paginas.push(
					<button
						key={i}
						onClick={() => handlePageChange(i)}
						className={`px-3 py-1 mx-1 rounded ${paginaAtual === i
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
					>
						{i}
					</button>
				);
			} else if (
				i === paginaAtual - 2 ||
				i === paginaAtual + 2
			) {
				// Mostrar reticências para páginas omitidas
				paginas.push(
					<span key={i} className="px-3 py-1 mx-1">
						...
					</span>
				);
			}
		}

		// Botão próximo
		paginas.push(
			<button
				key="next"
				onClick={() => handlePageChange(paginaAtual + 1)}
				disabled={paginaAtual === totalPaginas}
				className={`px-3 py-1 mx-1 rounded ${paginaAtual === totalPaginas
					? 'bg-gray-200 text-gray-500 cursor-not-allowed'
					: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
			>
				&gt;
			</button>
		);

		return (
			<div className="flex justify-center mt-6">
				{paginas}
			</div>
		);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Gerenciar Pedidos</h2>
			</div>

			{/* Filtros */}
			<PedidoFilter onFilter={handleFilterApply} initialFilters={filtros} />

			{/* Status de carregamento */}
			{isLoading && (
				<div className="text-center py-8">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p className="mt-2 text-gray-500">Carregando pedidos...</p>
				</div>
			)}

			{/* Mensagem de erro */}
			{error && (
				<div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
					{error}
				</div>
			)}

			{/* Lista de pedidos */}
			{!isLoading && !error && (
				<>
					{pedidos.length === 0 ? (
						<div className="bg-white rounded-lg shadow-md p-8 text-center">
							<span className="material-icons text-4xl text-gray-400 mb-2">receipt_long</span>
							<p className="text-gray-500">Não há pedidos para exibir.</p>
							<p className="text-gray-500 text-sm mt-1">
								Tente ajustar os filtros ou volte mais tarde.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{pedidos.map(pedido => (
								<PedidoCard
									key={pedido.id}
									pedido={pedido}
									onStatusUpdate={handleStatusUpdate}
								/>
							))}
						</div>
					)}

					{/* Paginação */}
					{pedidos.length > 0 && renderPaginacao()}
				</>
			)}
		</div>
	);
}

export default Pedidos;