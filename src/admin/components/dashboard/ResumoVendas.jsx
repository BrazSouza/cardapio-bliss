import React from 'react';

/**
 * Componente para exibir resumo de vendas no dashboard
 * @param {Object} dados - Dados de vendas do período
 * @param {boolean} isLoading - Estado de carregamento
 */
function ResumoVendas({ dados, isLoading = false, periodo = 'semana' }) {
	// Componente de loading
	if (isLoading) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">Resumo de Vendas</h3>
					<div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="space-y-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex justify-between items-center">
							<div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
							<div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Se não houver dados
	if (!dados || !dados.totais) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4">Resumo de Vendas</h3>
				<p className="text-gray-500 text-center py-4">
					Nenhum dado de venda disponível para o período
				</p>
			</div>
		);
	}

	// Mapeamento dos títulos de períodos
	const tituloPeriodo = {
		'hoje': 'Hoje',
		'semana': 'Esta semana',
		'mes': 'Este mês',
		'ano': 'Este ano'
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold">Resumo de Vendas</h3>
				<span className="text-sm text-gray-500">{tituloPeriodo[periodo] || 'Período atual'}</span>
			</div>

			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<span className="text-gray-600">Total de Pedidos:</span>
					<span className="font-medium">{dados.totais.pedidos || 0}</span>
				</div>

				<div className="flex justify-between items-center">
					<span className="text-gray-600">Faturamento:</span>
					<span className="font-medium">R$ {(dados.totais.faturamento || 0).toFixed(2)}</span>
				</div>

				<div className="flex justify-between items-center">
					<span className="text-gray-600">Ticket Médio:</span>
					<span className="font-medium">R$ {(dados.totais.ticketMedio || 0).toFixed(2)}</span>
				</div>

				<div className="flex justify-between items-center">
					<span className="text-gray-600">Itens Vendidos:</span>
					<span className="font-medium">{dados.totais.itensVendidos || 0}</span>
				</div>

				<div className="flex justify-between items-center">
					<span className="text-gray-600">Taxa de Conclusão:</span>
					<span className="font-medium">{(dados.totais.taxaConclusao || 0).toFixed(1)}%</span>
				</div>
			</div>

			{dados.comparacao && (
				<div className="mt-4 pt-4 border-t border-gray-200">
					<div className={`flex items-center ${dados.comparacao.crescimento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
						<span className="material-icons text-sm mr-1">
							{dados.comparacao.crescimento >= 0 ? 'trending_up' : 'trending_down'}
						</span>
						<span className="text-sm">
							{Math.abs(dados.comparacao.crescimento).toFixed(1)}% em relação ao período anterior
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

export default ResumoVendas;