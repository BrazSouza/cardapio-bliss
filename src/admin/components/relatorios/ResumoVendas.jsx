import React from 'react';

/**
 * Componente para exibir estatísticas de resumo de vendas
 * @param {Object} dados - Dados do resumo de vendas
 */
function ResumoVendas({ dados }) {
	if (!dados) {
		return null;
	}

	// Formatar valores monetários
	const formatarMoeda = (valor) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(valor);
	};

	// Calcular variação percentual
	const calcularVariacao = (atual, anterior) => {
		if (!anterior) return 100;
		const variacao = ((atual - anterior) / anterior) * 100;
		return variacao.toFixed(2);
	};

	// Determinar a cor da variação
	const corVariacao = (valor) => {
		const num = parseFloat(valor);
		if (num > 0) return 'text-green-500';
		if (num < 0) return 'text-red-500';
		return 'text-gray-500';
	};

	// Determinar o ícone da variação
	const iconeVariacao = (valor) => {
		const num = parseFloat(valor);
		if (num > 0) return 'arrow_upward';
		if (num < 0) return 'arrow_downward';
		return 'remove';
	};

	// Cards com estatísticas
	const estatisticas = [
		{
			titulo: 'Total de Vendas',
			valor: formatarMoeda(dados.totalVendas || 0),
			comparacao: dados.comparacaoVendas
				? `${calcularVariacao(dados.totalVendas, dados.comparacaoVendas)}%`
				: null,
			icone: 'payments',
			corIcone: 'text-blue-500',
			corFundo: 'bg-blue-100'
		},
		{
			titulo: 'Pedidos Realizados',
			valor: dados.totalPedidos || 0,
			comparacao: dados.comparacaoPedidos
				? `${calcularVariacao(dados.totalPedidos, dados.comparacaoPedidos)}%`
				: null,
			icone: 'shopping_bag',
			corIcone: 'text-indigo-500',
			corFundo: 'bg-indigo-100'
		},
		{
			titulo: 'Ticket Médio',
			valor: dados.ticketMedio ? formatarMoeda(dados.ticketMedio) : formatarMoeda(0),
			comparacao: dados.comparacaoTicket
				? `${calcularVariacao(dados.ticketMedio, dados.comparacaoTicket)}%`
				: null,
			icone: 'bar_chart',
			corIcone: 'text-teal-500',
			corFundo: 'bg-teal-100'
		}
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
			{estatisticas.map((item, index) => (
				<div
					key={index}
					className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
				>
					<div>
						<h4 className="text-sm font-medium text-gray-600">{item.titulo}</h4>
						<p className="text-xl font-semibold">{item.valor}</p>
						{item.comparacao && (
							<div className={`flex items-center text-sm ${corVariacao(item.comparacao)}`}>
								<span className="material-icons text-base mr-1">{iconeVariacao(item.comparacao)}</span>
								{item.comparacao}
							</div>
						)}
					</div>
					<div className={`p-3 rounded-full ${item.corFundo}`}>
						<span className={`material-icons text-2xl ${item.corIcone}`}>{item.icone}</span>
					</div>
				</div>
			))}
		</div>
	);
}

export default ResumoVendas;
