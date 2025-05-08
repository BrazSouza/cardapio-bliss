import React from 'react';

/**
 * Componente de resumo do pedido que exibe o total e botão de finalização
 * 
 * @param {Array} items - Lista de itens no carrinho
 * @param {Function} onCheckout - Função chamada ao clicar em finalizar pedido
 * @param {Boolean} isLoading - Estado de carregamento durante processamento do pedido
 */
function OrderSummary({ items = [], onCheckout, isLoading = false }) {
	// Formatar preço para exibição
	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(price);
	};

	// Calcular subtotal (soma de todos os itens)
	const subtotal = items.reduce((total, item) => {
		return total + (item.precoUnitario * item.quantidade);
	}, 0);

	// Taxa de entrega (pode vir de configurações ou props)
	const taxaEntrega = 0; // Exemplo: Retirada no local sem taxa

	// Total final do pedido
	const total = subtotal + taxaEntrega;

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>

			{/* Lista de itens resumida */}
			<div className="space-y-2 mb-4">
				{items.map(item => (
					<div key={item.id} className="flex justify-between text-sm">
						<span>{item.quantidade}x {item.nome}</span>
						<span>{formatPrice(item.precoUnitario * item.quantidade)}</span>
					</div>
				))}
			</div>

			{/* Linha divisória */}
			<div className="border-t my-4"></div>

			{/* Subtotal */}
			<div className="flex justify-between mb-2">
				<span className="text-gray-600">Subtotal</span>
				<span>{formatPrice(subtotal)}</span>
			</div>

			{/* Taxa de entrega */}
			<div className="flex justify-between mb-4">
				<span className="text-gray-600">Taxa de entrega</span>
				<span>{taxaEntrega === 0 ? 'Grátis' : formatPrice(taxaEntrega)}</span>
			</div>

			{/* Total */}
			<div className="flex justify-between font-bold text-lg mb-6">
				<span>Total</span>
				<span>{formatPrice(total)}</span>
			</div>

			{/* Botão de checkout */}
			<button
				onClick={onCheckout}
				disabled={isLoading || items.length === 0}
				className={`w-full py-3 rounded-md font-medium text-white transition-colors
          ${items.length === 0
						? 'bg-gray-400 cursor-not-allowed'
						: isLoading
							? 'bg-blue-400 cursor-wait'
							: 'bg-blue-600 hover:bg-blue-700'
					}`}
			>
				{isLoading ? (
					<span className="flex items-center justify-center">
						<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
						Processando...
					</span>
				) : items.length === 0 ? 'Carrinho vazio' : 'Finalizar Pedido'}
			</button>
		</div>
	);
}

export default OrderSummary;