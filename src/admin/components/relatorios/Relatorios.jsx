
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import VendasPorPeriodoChart from '../components/relatorios/VendasPorPeriodoChart';
import ProdutosVendidosChart from '../components/relatorios/ProdutosVendidosChart';
import ResumoVendas from '../components/relatorios/ResumoVendas';

function Relatorios() {
	const [periodo, setPeriodo] = useState('semana');
	const [dataInicio, setDataInicio] = useState('');
	const [dataFim, setDataFim] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [dadosVendas, setDadosVendas] = useState(null);
	const [dadosProdutos, setDadosProdutos] = useState(null);
	const [resumo, setResumo] = useState(null);
	const { showError } = useToast();

	// Opções de período
	const periodos = [
		{ valor: 'hoje', label: 'Hoje' },
		{ valor: 'semana', label: 'Últimos 7 dias' },
		{ valor: 'mes', label: 'Último mês' },
		{ valor: 'personalizado', label: 'Personalizado' }
	];

	// Determinar datas com base no período selecionado
	useEffect(() => {
		if (periodo !== 'personalizado') {
			const hoje = new Date();
			let inicio = new Date();

			switch (periodo) {
				case 'hoje':
					inicio = new Date(hoje.setHours(0, 0, 0, 0));
					break;
				case 'semana':
					inicio = new Date(hoje.setDate(hoje.getDate() - 7));
					break;
				case 'mes':
					inicio = new Date(hoje.setMonth(hoje.getMonth() - 1));
					break;
				default:
					break;
			}

			setDataInicio(inicio.toISOString().split('T')[0]);
			setDataFim(new Date().toISOString().split('T')[0]);
		}
	}, [periodo]);

	// Buscar dados de relatórios
	const buscarDadosRelatorios = async () => {
		try {
			setIsLoading(true);

			// Validar datas para período personalizado
			if (periodo === 'personalizado') {
				if (!dataInicio || !dataFim) {
					showError('Por favor, selecione as datas de início e fim.');
					setIsLoading(false);
					return;
				}
			}

			// Parâmetros para as requisições
			const params = new URLSearchParams();
			params.append('dataInicio', dataInicio);
			params.append('dataFim', dataFim);

			// Buscar dados de vendas por período
			const vendasResponse = await axios.get(`/api/admin/relatorios/vendas-por-periodo?${params.toString()}`);
			setDadosVendas(vendasResponse.data);

			// Buscar dados de produtos vendidos
			const produtosResponse = await axios.get(`/api/admin/relatorios/produtos-vendidos?${params.toString()}`);
			setDadosProdutos(produtosResponse.data);

			// Buscar resumo
			const resumoResponse = await axios.get(`/api/admin/relatorios/resumo?${params.toString()}`);
			setResumo(resumoResponse.data);

		} catch (error) {
			console.error('Erro ao buscar dados de relatórios:', error);
			showError('Não foi possível carregar os relatórios. Tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	// Efeito para buscar dados quando o período ou datas mudam
	useEffect(() => {
		if (dataInicio && dataFim) {
			buscarDadosRelatorios();
		}
	}, [dataInicio, dataFim]);

	// Exportar relatório em CSV
	const exportarCSV = async () => {
		try {
			const params = new URLSearchParams();
			params.append('dataInicio', dataInicio);
			params.append('dataFim', dataFim);

			const response = await axios.get(`/api/admin/relatorios/exportar?${params.toString()}`, {
				responseType: 'blob'
			});

			// Criar um link para download
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;

			// Gerar nome do arquivo com a data atual
			const dataFormatada = new Date().toISOString().split('T')[0];
			link.setAttribute('download', `relatorio_vendas_${dataFormatada}.csv`);

			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (error) {
			console.error('Erro ao exportar relatório:', error);
			showError('Não foi possível exportar o relatório. Tente novamente.');
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Relatórios e Análises</h2>
				<button
					onClick={exportarCSV}
					className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
					disabled={isLoading || !resumo}
				>
					<span className="material-icons mr-1">file_download</span>
					Exportar CSV
				</button>
			</div>

			{/* Filtros de período */}
			<div className="bg-white rounded-lg shadow-md p-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Período
						</label>
						<select
							value={periodo}
							onChange={(e) => setPeriodo(e.target.value)}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{periodos.map((opcao) => (
								<option key={opcao.valor} value={opcao.valor}>
									{opcao.label}
								</option>
							))}
						</select>
					</div>

					{periodo === 'personalizado' && (
						<>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Data Início
								</label>
								<input
									type="date"
									value={dataInicio}
									onChange={(e) => setDataInicio(e.target.value)}
									className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Data Fim
								</label>
								<input
									type="date"
									value={dataFim}
									onChange={(e) => setDataFim(e.target.value)}
									className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<button
									onClick={buscarDadosRelatorios}
									className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
									disabled={isLoading}
								>
									{isLoading ? 'Carregando...' : 'Buscar'}
								</button>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Estado de carregamento */}
			{isLoading && (
				<div className="text-center py-8">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p className="mt-2 text-gray-500">Carregando relatórios...</p>
				</div>
			)}

			{/* Resumo de vendas */}
			{!isLoading && resumo && (
				<ResumoVendas dados={resumo} />
			)}

			{/* Gráficos */}
			{!isLoading && dadosVendas && dadosProdutos && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold mb-4">Vendas por Período</h3>
						<VendasPorPeriodoChart dados={dadosVendas} />
					</div>

					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h3>
						<ProdutosVendidosChart dados={dadosProdutos} />
					</div>
				</div>
			)}
		</div>
	);
}

export default Relatorios;