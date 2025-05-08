import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// ⬇️ Registro necessário para evitar erro de escalas
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

function ChartPedidos({ data }) {
	const chartData = {
		labels: data?.map(item => item.hora) || [],
		datasets: [
			{
				label: 'Pedidos por Hora',
				data: data?.map(item => item.quantidade) || [],
				fill: false,
				backgroundColor: 'rgb(59, 130, 246)',
				borderColor: 'rgba(59, 130, 246, 0.7)',
				tension: 0.1
			}
		]
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Pedidos por Hora'
			}
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					precision: 0
				}
			}
		}
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md">
			<Line data={chartData} options={options} />
		</div>
	);
}

export default ChartPedidos;
