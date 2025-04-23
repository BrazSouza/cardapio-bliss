import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);
	const [isCartOpen, setIsCartOpen] = useState(false);

	// Adicionar item ao carrinho com suporte a adicionais
	const addToCart = (item, quantity = 1, additionals = []) => {
		// Criar um identificador único que inclui o item e seus adicionais
		const uniqueItemKey = JSON.stringify({
			itemId: item.id,
			additionals: additionals.map(a => a.id).sort()
		});

		const existingItemIndex = cartItems.findIndex(cartItem =>
			JSON.stringify({
				itemId: cartItem.id,
				additionals: cartItem.additionals?.map(a => a.id).sort() || []
			}) === uniqueItemKey
		);

		if (existingItemIndex !== -1) {
			// Se o item já existe, incrementa a quantidade
			const updatedCartItems = [...cartItems];
			updatedCartItems[existingItemIndex] = {
				...updatedCartItems[existingItemIndex],
				quantity: updatedCartItems[existingItemIndex].quantity + quantity
			};
			setCartItems(updatedCartItems);
		} else {
			// Adiciona novo item com adicionais
			setCartItems([...cartItems, {
				...item,
				quantity,
				additionals
			}]);
		}

		// Abrir carrinho automaticamente
		setIsCartOpen(true);
	};

	// Calcular total do carrinho, incluindo adicionais
	const calculateTotal = () => {
		return cartItems.reduce((total, item) => {
			const itemTotal = item.price * item.quantity;
			const additionalsTotal = item.additionals
				? item.additionals.reduce((addTotal, additional) =>
					addTotal + (additional.price * item.quantity), 0)
				: 0;
			return total + itemTotal + additionalsTotal;
		}, 0);
	};

	const removeFromCart = (itemId, additionals = []) => {
		const uniqueItemKey = JSON.stringify({
			itemId: itemId,
			additionals: additionals.map(a => a.id).sort()
		});

		setCartItems(cartItems.filter(cartItem =>
			JSON.stringify({
				itemId: cartItem.id,
				additionals: cartItem.additionals?.map(a => a.id).sort() || []
			}) !== uniqueItemKey
		));
	};

	const updateQuantity = (itemId, additionals, newQuantity) => {
		const uniqueItemKey = JSON.stringify({
			itemId: itemId,
			additionals: additionals.map(a => a.id).sort()
		});

		if (newQuantity < 1) {
			removeFromCart(itemId, additionals);
		} else {
			setCartItems(cartItems.map(item => {
				const itemKey = JSON.stringify({
					itemId: item.id,
					additionals: item.additionals?.map(a => a.id).sort() || []
				});

				return itemKey === uniqueItemKey
					? { ...item, quantity: newQuantity }
					: item;
			}));
		}
	};

	const clearCart = () => {
		setCartItems([]);
	};

	return (
		<CartContext.Provider value={{
			cartItems,
			isCartOpen,
			setIsCartOpen,
			addToCart,
			removeFromCart,
			updateQuantity,
			calculateTotal,
			clearCart
		}}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
};

export default CartContext;