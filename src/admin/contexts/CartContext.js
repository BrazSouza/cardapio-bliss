import React, { createContext, useState, useEffect } from 'react';

// Criar o contexto
export const CartContext = createContext();

/**
 * Provider para gerenciar o estado do carrinho em toda a aplicação
 */
export function CartProvider({ children }) {
	// Estado do carrinho - buscado do localStorage se disponível
	const [cart, setCart] = useState(() => {
		try {
			const savedCart = localStorage.getItem('cart');
			return savedCart ? JSON.parse(savedCart) : [];
		} catch (error) {
			console.error('Erro ao carregar carrinho do localStorage:', error);
			return [];
		}
	});

	// Salvar carrinho no localStorage sempre que ele mudar
	useEffect(() => {
		try {
			localStorage.setItem('cart', JSON.stringify(cart));
		} catch (error) {
			console.error('Erro ao salvar carrinho no localStorage:', error);
		}
	}, [cart]);

	/**
	 * Adicionar item ao carrinho
	 * @param {Object} produto - Produto a ser adicionado
	 * @param {number} quantidade - Quantidade a ser adicionada
	 * @param {string} observacao - Observações sobre o item
	 */
	const addItem = (produto, quantidade = 1, observacao = '') => {
		if (!produto) return;

		setCart(currentCart => {
			// Verificar se o produto já existe no carrinho
			const itemIndex = currentCart.findIndex(
				item => item.id === produto.id && item.observacao === observacao
			);

			if (itemIndex >= 0) {
				// Se o produto já existe, atualizar quantidade
				const updatedCart = [...currentCart];
				updatedCart[itemIndex] = {
					...updatedCart[itemIndex],
					quantidade: updatedCart[itemIndex].quantidade + quantidade
				};
				return updatedCart;
			} else {
				// Se o produto não existe, adicionar novo item
				return [...currentCart, {
					id: produto.id,
					nome: produto.nome,
					precoUnitario: produto.preco,
					imagemUrl: produto.imagemUrl || null,
					quantidade,
					observacao
				}];
			}
		});
	};

	/**
	 * Atualizar quantidade de um item no carrinho
	 * @param {string|number} id - ID do item a ser atualizado
	 * @param {number} quantidade - Nova quantidade
	 */
	const updateItemQuantity = (id, quantidade) => {
		if (quantidade < 1) return;

		setCart(currentCart =>
			currentCart.map(item =>
				item.id === id ? { ...item, quantidade } : item
			)
		);
	};

	/**
	 * Remover item do carrinho
	 * @param {string|number} id - ID do item a ser removido
	 */
	const removeItem = (id) => {
		setCart(currentCart => currentCart.filter(item => item.id !== id));
	};

	/**
	 * Limpar todo o carrinho
	 */
	const clearCart = () => {
		setCart([]);
	};

	/**
	 * Calcular o total de itens no carrinho
	 */
	const getTotalItems = () => {
		return cart.reduce((total, item) => total + item.quantidade, 0);
	};

	/**
	 * Calcular o valor total do carrinho
	 */
	const getTotalPrice = () => {
		return cart.reduce(
			(total, item) => total + (item.precoUnitario * item.quantidade),
			0
		);
	};

	// Valores e funções expostos pelo contexto
	const value = {
		cart,
		addItem,
		updateItemQuantity,
		removeItem,
		clearCart,
		getTotalItems,
		getTotalPrice
	};

	return (
		<CartContext.Provider value={value}>
			{children}
		</CartContext.Provider>
	);
}

export default CartContext;