import React from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

// Registrando componentes do Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

/**
 * Componente de gráfico para exibir vendas por período
 * @param {Array} dados - Array de dados de vendas por data
 */
function VendasPorPeriodoChart({ dados }) {
	if (!dados || !dados.length) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-gray-500">Nenhum dado disponível</p>
			</div>
		);
	}

	// Formatação de data para o eixo X
	const formatarData = (dataString) => {
		const data = new Date(dataString);
		return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
	};

	// Configuração dos dados do gráfico
	const chartData = {
		labels: dados.map(item => formatarData(item.data)),
		datasets: [
			{
				label: 'Total de Vendas (R$)',
				data: dados.map(item => item.valorTotal),
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.5)',
				tension: 0.3,
				yAxisID: 'y'
			},
			{
				label: 'Quantidade de Pedidos',
				data: dados.map(item => item.quantidadePedidos),
				borderColor: 'rgb(99, 102, 241)',
				backgroundColor: 'rgba(99, 102, 241, 0.5)',
				tension: 0.3,
				yAxisID: 'y1'
			}
		]
	};

	// Opções do gráfico
	const options = {
		responsive: true,
		interaction: {
			mode: 'index',
			intersect: false,
		},
		stacked: false,
		plugins: {
			title: {
				display: true,
				text: 'Vendas e Pedidos por Período'
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						let label = context.dataset.label || '';
						if (label) {
							label += ': ';
						}
						if (context.datasetIndex === 0) {
							label += new Intl.NumberFormat('pt-BR', {
								style: 'currency',
								currency: 'BRL'
							}).format(context.parsed.y);
						} else {
							label += context.parsed.y;
						}
						return label;
					}
				}
			}
		},
		scales: {
			y: {
				type: 'linear',
				display: true,
				position: 'left',
				title: {
					display: true,
					text: 'Valor Total (R$)'
				},
				ticks: {
					callback: function (value) {
						return new Intl.NumberFormat('pt-BR', {
							style: 'currency',
							currency: 'BRL',
							maximumFractionDigits: 0
						}).format(value);
					}
				}
			},
			y1: {
				type: 'linear',
				display: true,
				position: 'right',
				title: {
					display: true,
					text: 'Quantidade de Pedidos'
				},
				ticks: {
					precision: 0
				},
				// Evita que os grids deste eixo sejam exibidos
				grid: {
					drawOnChartArea: false,
				},
			},
			x: {
				title: {
					display: true,
					text: 'Data'
				}
			}
		}
	};

	return <Line data={chartData} options={options} />;
}

export default VendasPorPeriodoChart;