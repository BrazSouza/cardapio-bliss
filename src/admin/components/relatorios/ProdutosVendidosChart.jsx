import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

// Registrando componentes do Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

/**
 * Componente de gráfico para exibir produtos mais vendidos
 * @param {Array} dados - Array de dados de produtos vendidos
 */
function ProdutosVendidosChart({ dados }) {
	if (!dados || !dados.length) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-gray-500">Nenhum dado disponível</p>
			</div>
		);
	}

	// Ordenar produtos por quantidade vendida (decrescente)
	const produtosOrdenados = [...dados].sort((a, b) => b.quantidade - a.quantidade);

	// Limitar a quantidade de produtos exibidos
	const produtosExibidos = produtosOrdenados.slice(0, 10);

	// Cores para as barras
	const cores = [
		'rgba(54, 162, 235, 0.8)', // azul
		'rgba(255, 99, 132, 0.8)',  // rosa
		'rgba(75, 192, 192, 0.8)',  // verde-água
		'rgba(255, 159, 64, 0.8)',  // laranja
		'rgba(153, 102, 255, 0.8)', // roxo
		'rgba(255, 205, 86, 0.8)',  // amarelo
		'rgba(201, 203, 207, 0.8)', // cinza
		'rgba(255, 99, 71, 0.8)',   // tomate
		'rgba(46, 204, 113, 0.8)',  // esmeralda
		'rgba(156, 39, 176, 0.8)'   // roxo intenso
	];

	// Configuração dos dados do gráfico
	const chartData = {
		labels: produtosExibidos.map(item => item.nome),
		datasets: [
			{
				label: 'Quantidade Vendida',
				data: produtosExibidos.map(item => item.quantidade),
				backgroundColor: cores,
				borderWidth: 1
			}
		]
	};

	// Opções do gráfico
	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: false
			},
			title: {
				display: true,
				text: 'Top 10 Produtos Mais Vendidos'
			},
			tooltip: {
				callbacks: {
					title: function (tooltipItems) {
						return tooltipItems[0].label;
					},
					label: function (context) {
						let label = '';
						const item = produtosExibidos[context.dataIndex];

						// Quantidade
						label = `Quantidade: ${context.parsed.y} unidades`;

						// Adicionar valor total se disponível
						if (item.valorTotal) {
							label += `\nValor Total: ${new Intl.NumberFormat('pt-BR', {
								style: 'currency',
								currency: 'BRL'
							}).format(item.valorTotal)}`;
						}

						return label;
					}
				}
			}
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Quantidade Vendida'
				},
				ticks: {
					precision: 0
				}
			},
			x: {
				title: {
					display: true,
					text: 'Produtos'
				},
				ticks: {
					maxRotation: 45,
					minRotation: 45,
					callback: function (value, index) {
						const nome = this.getLabelForValue(value);
						// Truncar nomes longos
						return nome.length > 15 ? nome.substring(0, 12) + '...' : nome;
					}
				}
			}
		}
	};

	return <Bar data={chartData} options={options} />;
}

export default ProdutosVendidosChart;