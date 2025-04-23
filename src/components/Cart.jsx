import React, { useState } from 'react';
import { useCart } from './CartContext';

const Cart = () => {
	const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, calculateTotal, clearCart } = useCart();

	const [observation, setObservation] = useState('');

	const handleWhatsAppOrder = () => {
		if (cartItems.length === 0) {
			alert('Seu carrinho está vazio!');
			return;
		}

		const orderItems = cartItems.map(item =>
			`${item.name} (x${item.quantity}) - R$ ${(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
		).join('\n');

		const totalPrice = calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

		const message = `🍔 *Pedido*:\n\n${orderItems}\n\n*Observações:*\n${observation || 'Sem observações'}\n\n*Total:* R$ ${totalPrice}`;

		const whatsappUrl = `https://wa.me/5527997283813?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, '_blank');

		// Limpar carrinho após enviar pedido
		clearCart();
		setObservation('');
		setIsCartOpen(false);
	};

	if (!isCartOpen) return null;

	return (
		<div className="cart-overlay">
			<div className="cart-container">
				<div className="cart-header">
					<h2>Seu Pedido</h2>
					<button onClick={() => setIsCartOpen(false)}>✕</button>
				</div>

				{cartItems.length === 0 ? (
					<div className="cart-empty">Seu carrinho está vazio</div>
				) : (
					<div className="cart-items">
						{cartItems.map((item) => (
							<div key={item.id} className="cart-item">
								{item.isAdditional && (
									<div className="additional-tag">
										Adicional para {item.parentItemName}
									</div>
								)}
								<img src={item.image} alt={item.name} className="cart-item-image" />
								<div className="cart-item-details">
									<h3>{item.name}</h3>
									<div className="cart-item-quantity">
										<button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
										<span>{item.quantity}</span>
										<button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
									</div>
									<p>R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
									<button onClick={() => removeFromCart(item.id)} className="remove-item">Remover</button>
								</div>
							</div>
						))}
					</div>
				)}

				<div className="cart-observation">
					<textarea
						placeholder="Alguma observação para o pedido? (Opcional)"
						value={observation}
						onChange={(e) => setObservation(e.target.value)}
						rows={3}
					/>
				</div>

				<div className="cart-total">
					<strong>Total:</strong> R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
				</div>

				<button className="cart-send-order" onClick={handleWhatsAppOrder} disabled={cartItems.length === 0}>
					Enviar Pedido pelo WhatsApp
				</button>
			</div>
		</div>
	);
};

export default Cart;