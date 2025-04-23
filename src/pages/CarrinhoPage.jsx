import React from 'react';
import { useCart } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';

const CarrinhoPage = () => {
	const { cartItems } = useCart(); // Não use calculateTotal do contexto
	const navigate = useNavigate();

	// Calcular o total localmente em vez de usar a função do contexto
	const calculateLocalTotal = () => {
		return cartItems.reduce((total, item) => {
			// Calcular o preço do item base
			let itemTotal = item.price * item.quantity;

			// Adicionar o preço dos adicionais, se houver
			if (item.additionals && item.additionals.length > 0) {
				const additionalsTotal = item.additionals.reduce(
					(addTotal, additional) => addTotal + additional.price,
					0
				);
				itemTotal += additionalsTotal;
			}

			return total + itemTotal;
		}, 0);
	};

	// Calculamos o total uma vez aqui
	const total = calculateLocalTotal();

	const handleGoBack = () => {
		const lastPage = sessionStorage.getItem('lastPage');
		if (lastPage) {
			navigate(lastPage);
		} else {
			navigate(-1);
		}
	};

	const finalizarPedido = () => {
		// Gera um ID único para o pedido
		const pedidoId = Math.random().toString(36).substr(2, 9);

		// Mensagem inicial de pedido
		const mensagemPedido = `
*Pedido para Confirmação*

📋 Número do Pedido: #${pedidoId}
🕒 Data: ${new Date().toLocaleString()}

*Itens do Pedido:*
${cartItems.map(item => {
			// Base do item
			let itemText = `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`;

			// Adicionar adicionais se existirem
			if (item.additionals && item.additionals.length > 0) {
				const additionalsText = item.additionals
					.map(add => `  • ${add.name} - R$ ${add.price.toFixed(2)}`)
					.join('\n');
				itemText += '\n' + additionalsText;
			}

			return itemText;
		}).join('\n\n')}

*Total:* R$ ${total.toFixed(2)}

Por favor, CONFIRME este pedido.
  `;

		// Número de WhatsApp fixo do restaurante
		const telefoneRestaurante = '5527997283813';

		// Gera URL do WhatsApp com a mensagem
		const whatsappUrl = `https://wa.me/${telefoneRestaurante}?text=${encodeURIComponent(mensagemPedido)}`;

		// Abre o WhatsApp Web ou App
		window.open(whatsappUrl, '_blank');
	};

	// Verifica se o carrinho está vazio
	const isCartEmpty = cartItems.length === 0;

	return (
		<div className="cart-page">
			{!isCartEmpty && (
				<>
					<span className='text-tempo'>Tempo de entrega</span>
					<div className="cart-header">
						<button className="back-button" onClick={handleGoBack}>
							←
						</button>
						<span>🕒 60 - 120 min</span>
					</div>
				</>
			)}


			{isCartEmpty ? (
				// Conteúdo quando carrinho está vazio
				<div className="empty-cart-container">
					<div className="empty-cart-image">
						{/* Alteração crítica: Vamos usar uma imagem estática em vez de uma URL externa */}
						<div
							style={{
								width: '200px',
								height: '200px',
								margin: '20px auto',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: '#f8f8f8',
								borderRadius: '8px',
								border: '1px solid #ddd'
							}}
						>
							<span style={{ color: '#888', textAlign: 'center' }}>Carrinho Vazio</span>
						</div>
					</div>
					<div className="empty-cart-message">
						<h3>Seu carrinho está vazio</h3>
						<p>Adicione alguns itens deliciosos para começar o seu pedido!</p>
						<button className="return-menu-button" onClick={() => navigate('/cardapio')}>
							Ver Cardápio
						</button>
					</div>
				</div>
			) : (
				// Conteúdo quando carrinho tem itens
				<>
					<div className="cart-items">
						{cartItems.map((item) => (
							<div key={item.id} className="cart-item">
								<div className="item-main">
									<span>{item.quantity}x {item.name}</span>
									<span>R$ {(item.price * item.quantity).toFixed(2)}</span>
								</div>

								{item.additionals && item.additionals.length > 0 && (
									<div className="item-additionals">
										{item.additionals.map((additional) => (
											<div key={additional.id} className="additional-item">
												• {additional.name} - R$ {additional.price.toFixed(2)}
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>

					<div className="cart-total">
						<div className="cart-summary">
							<div className="summary-row">
								<span>Subtotal</span>
								<span>R$ {total.toFixed(2)}</span>
							</div>
							<div className="summary-row">
								<span>Taxa de entrega</span>
								<span>R$ 0,00</span>
							</div>
							<div className="summary-row total">
								<span>Total</span>
								<span>R$ {total.toFixed(2)}</span>
							</div>
						</div>

						<button
							className="finish-order-button"
							onClick={finalizarPedido}
						>
							Finalizar Pedido no WhatsApp
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default CarrinhoPage;