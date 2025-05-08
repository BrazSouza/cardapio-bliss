import React from 'react';

/**
 * Componente para exibir produtos mais populares no dashboard
 * @param {Array} produtos - Array de produtos com dados de vendas
 */
function ProdutoPopulares({ produtos = [], isLoading = false }) {
	if (isLoading) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4">Produtos Mais Populares</h3>
				<div className="animate-pulse space-y-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="flex items-center">
								<div className="w-2 h-10 bg-gray-200 rounded-full mr-3"></div>
								<div className="h-4 bg-gray-200 rounded w-32"></div>
							</div>
							<div className="h-4 bg-gray-200 rounded w-16"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Se não há produtos, exibe mensagem
	if (!produtos || produtos.length === 0) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<h3 className="text-lg font-semibold mb-4">Produtos Mais Populares</h3>
				<p className="text-gray-500 text-center py-4">
					Nenhum dado de venda disponível
				</p>
			</div>
		);
	}

	// Cores para as barras dos produtos
	const colors = ['blue', 'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'green'];

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h3 className="text-lg font-semibold mb-4">Produtos Mais Populares</h3>
			<div className="space-y-4">
				{produtos.map((produto, index) => (
					<div key={produto.id} className="flex items-center justify-between">
						<div className="flex items-center">
							<div
								className={`w-2 h-10 bg-${colors[index % colors.length]}-500 rounded-full mr-3`}
							></div>
							<span className="font-medium">{produto.nome}</span>
						</div>
						<span className="text-gray-600">{produto.quantidadeVendida} vendidos</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default ProdutoPopulares;