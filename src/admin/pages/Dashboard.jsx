import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/dashboard/StatisticaCard';
import ChartPedidos from '../components/dashboard/ChartGraficoPedidos';
import ProdutoPopulares from '../components/dashboard/ProdutoPopulares';
import ResumoVendas from '../components/dashboard/ResumoVendas';
import { Link } from 'react-router-dom';

function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState(null);
	const [pedidosPorHora, setPedidosPorHora] = useState([]);
	const [resumoVendas, setResumoVendas] = useState(null);
	const [periodoDados, setPeriodoDados] = useState('semana');
	const [pedidosRecentes, setPedidosRecentes] = useState([]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);

				// Buscar estatísticas gerais em paralelo para melhor performance
				const [statsResponse, pedidosHoraResponse, resumoResponse, pedidosRecentesResponse] = await Promise.all([
					axios.get('/api/admin/estatisticas'),
					axios.get('/api/admin/dashboard/pedidos-por-hora'),
					axios.get(`/api/admin/dashboard/resumo-vendas?periodo=${periodoDados}`),
					axios.get('/api/admin/pedidos/recentes?limite=5')
				]);

				setStats(statsResponse.data);
				setPedidosPorHora(pedidosHoraResponse.data);
				setResumoVendas(resumoResponse.data);
				setPedidosRecentes(pedidosRecentesResponse.data);
			} catch (error) {
				console.error('Erro ao carregar dados do dashboard:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [periodoDados]);

	// Handler para mudar o período do resumo de vendas
	const handleChangePeriodo = async (periodo) => {
		setPeriodoDados(periodo);
	};

	// Função para formatar data
	const formatarData = (dataString) => {
		if (!dataString) return '';

		const data = new Date(dataString);
		return new Intl.DateTimeFormat('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).format(data);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold">Dashboard</h2>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Pedidos Hoje"
					value={stats?.pedidosHoje || 0}
					icon="shopping_bag"
					color="blue"
				/>
				<StatCard
					title="Faturamento Hoje"
					value={`R$ ${stats?.faturamentoHoje?.toFixed(2) || '0.00'}`}
					icon="attach_money"
					color="green"
				/>
				<StatCard
					title="Taxa de Conclusão"
					value={`${stats?.taxaConclusao || 0}%`}
					icon="check_circle"
					color="indigo"
				/>
				<StatCard
					title="Ticket Médio"
					value={`R$ ${stats?.ticketMedio?.toFixed(2) || '0.00'}`}
					icon="receipt"
					color="purple"
				/>
			</div>

			{/* Gráficos e resumos */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Pedidos por hora (ocupa 2 colunas) */}
				<div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
					<h3 className="text-lg font-semibold mb-4">Pedidos por Hora</h3>
					<ChartPedidos data={pedidosPorHora} />
				</div>

				{/* Resumo de Vendas (1 coluna) */}
				<div>
					<div className="mb-2 flex justify-end">
						<select
							value={periodoDados}
							onChange={(e) => handleChangePeriodo(e.target.value)}
							className="text-sm border border-gray-300 rounded px-2 py-1"
						>
							<option value="hoje">Hoje</option>
							<option value="semana">Esta semana</option>
							<option value="mes">Este mês</option>
							<option value="ano">Este ano</option>
						</select>
					</div>
					<ResumoVendas
						dados={resumoVendas}
						isLoading={loading}
						periodo={periodoDados}
					/>
				</div>
			</div>

			{/* Produtos populares e pedidos recentes */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Produtos mais vendidos */}
				<ProdutoPopulares produtos={stats?.produtosMaisVendidos} isLoading={loading} />

				{/* Pedidos Recentes */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-semibold">Pedidos Recentes</h3>
						<Link to="/admin/pedidos" className="text-blue-600 hover:underline text-sm">
							Ver todos
						</Link>
					</div>

					{pedidosRecentes && pedidosRecentes.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead>
									<tr>
										<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº</th>
										<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
										<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
										<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
										<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{pedidosRecentes.map((pedido) => (
										<tr key={pedido.id} className="hover:bg-gray-50">
											<td className="px-4 py-2 whitespace-nowrap text-sm">
												<Link to={`/admin/pedidos/${pedido.id}`} className="text-blue-600 hover:underline">
													#{pedido.numero || pedido.id}
												</Link>
											</td>
											<td className="px-4 py-2 whitespace-nowrap text-sm">{pedido.cliente?.nome || 'Cliente não identificado'}</td>
											<td className="px-4 py-2 whitespace-nowrap text-sm">{formatarData(pedido.dataCriacao)}</td>
											<td className="px-4 py-2 whitespace-nowrap text-sm">R$ {pedido.valorTotal?.toFixed(2) || '0.00'}</td>
											<td className="px-4 py-2 whitespace-nowrap">
												<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${pedido.status === 'entregue' ? 'bg-green-100 text-green-800' :
														pedido.status === 'cancelado' ? 'bg-red-100 text-red-800' :
															pedido.status === 'pronto' ? 'bg-blue-100 text-blue-800' :
																pedido.status === 'preparo' ? 'bg-yellow-100 text-yellow-800' :
																	'bg-gray-100 text-gray-800'}`}
												>
													{pedido.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p className="text-gray-500 text-center py-4">
							Não há pedidos recentes para exibir.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default Dashboard;