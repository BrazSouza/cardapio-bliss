import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../admin/components/cart/CartItem';
import OrderSummary from '../admin/components/cart/ResumoPedido';

function Carrinho() {
	const { cart, updateItemQuantity, removeItem, clearCart } = useCart();
	const [isProcessing, setIsProcessing] = useState(false);
	const navigate = useNavigate();

	// Verificar se há itens no carrinho
	const isCartEmpty = !cart || cart.length === 0;

	// Função para lidar com o checkout
	const handleCheckout = async () => {
		try {
			setIsProcessing(true);

			// Navegar para a página de checkout
			navigate('/checkout');
		} catch (error) {
			console.error('Erro ao processar pedido:', error);
			setIsProcessing(false);
			// Aqui poderia exibir mensagem de erro
		}
	};

	// Função para continuar comprando
	const handleContinueShopping = () => {
		navigate('/cardapio');
	};

	// Função para limpar o carrinho
	const handleClearCart = () => {
		if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
			clearCart();
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-8">Meu Carrinho</h1>

			{isCartEmpty ? (
				<div className="bg-white rounded-lg shadow-md p-8 text-center">
					<div className="text-5xl mb-4 text-gray-400">
						<span className="material-icons" style={{ fontSize: '4rem' }}>shopping_cart</span>
					</div>
					<h2 className="text-xl font-medium mb-2">Seu carrinho está vazio</h2>
					<p className="text-gray-500 mb-6">
						Adicione itens ao seu carrinho para continuar.
					</p>
					<button
						onClick={handleContinueShopping}
						className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
					>
						Ver Cardápio
					</button>
				</div>
			) : (
				<div className="lg:grid lg:grid-cols-3 lg:gap-8">
					{/* Lista de itens do carrinho */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-md p-6 mb-6 lg:mb-0">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-semibold">Itens do Carrinho ({cart.length})</h2>
								<button
									onClick={handleClearCart}
									className="text-red-500 hover:text-red-700 text-sm flex items-center"
								>
									<span className="material-icons text-sm mr-1">delete</span>
									Limpar
								</button>
							</div>

							<div className="divide-y">
								{cart.map(item => (
									<CartItem
										key={item.id}
										item={item}
										onUpdateQuantity={updateItemQuantity}
										onRemove={removeItem}
									/>
								))}
							</div>

							<div className="mt-6">
								<button
									onClick={handleContinueShopping}
									className="text-blue-600 hover:text-blue-800 flex items-center"
								>
									<span className="material-icons mr-1">arrow_back</span>
									Continuar comprando
								</button>
							</div>
						</div>
					</div>

					{/* Resumo do pedido */}
					<div className="mt-8 lg:mt-0">
						<OrderSummary
							items={cart}
							onCheckout={handleCheckout}
							isLoading={isProcessing}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default Carrinho;