
/**
 * Componente para exibir um item no carrinho
 * 
 * @param {Object} item - Item do carrinho com nome, preço, quantidade
 * @param {Function} onUpdateQuantity - Função para atualizar a quantidade
 * @param {Function} onRemove - Função para remover item do carrinho
 */
function CartItem({ item, onUpdateQuantity, onRemove }) {
	if (!item) return null;

	// Formatar preço para exibição
	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(price);
	};

	return (
		<div className="flex items-center justify-between py-4 border-b">
			{/* Imagem do produto (se disponível) */}
			<div className="flex items-center">
				{item.imagemUrl ? (
					<img
						src={item.imagemUrl}
						alt={item.nome}
						className="w-16 h-16 object-cover rounded mr-4"
					/>
				) : (
					<div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
						<span className="material-icons text-gray-400">restaurant</span>
					</div>
				)}

				{/* Informações do produto */}
				<div>
					<h3 className="font-medium">{item.nome}</h3>
					{item.observacao && (
						<p className="text-sm text-gray-500 mt-1">{item.observacao}</p>
					)}
					<p className="text-gray-900 font-medium mt-1">
						{formatPrice(item.precoUnitario)}
					</p>
				</div>
			</div>

			{/* Controles de quantidade */}
			<div className="flex items-center">
				<div className="flex items-center border rounded">
					<button
						onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantidade - 1))}
						className="px-3 py-1 hover:bg-gray-100"
						aria-label="Diminuir quantidade"
					>
						<span className="material-icons text-gray-600">remove</span>
					</button>

					<span className="px-3 py-1 min-w-[30px] text-center">
						{item.quantidade}
					</span>

					<button
						onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}
						className="px-3 py-1 hover:bg-gray-100"
						aria-label="Aumentar quantidade"
					>
						<span className="material-icons text-gray-600">add</span>
					</button>
				</div>

				{/* Botão remover */}
				<button
					onClick={() => onRemove(item.id)}
					className="ml-4 text-red-500 hover:text-red-700"
					aria-label="Remover item"
				>
					<span className="material-icons">delete_outline</span>
				</button>
			</div>
		</div>
	);
}

export default CartItem;