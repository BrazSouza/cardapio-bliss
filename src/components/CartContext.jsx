import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Definição do contexto do carrinho
const CartContext = createContext();

// Estados iniciais
const initialState = {
	items: [],
	total: 0,
	quantity: 0,
};

// Ações do reducer
const CartTypes = {
	ADD_ITEM: 'ADD_ITEM',
	REMOVE_ITEM: 'REMOVE_ITEM',
	UPDATE_QUANTITY: 'UPDATE_QUANTITY',
	CLEAR_CART: 'CLEAR_CART',
};

// Função para calcular o total do carrinho
const calculateTotal = (items) => {
	return items.reduce((total, item) => {
		// Calcula o preço base do item vezes a quantidade
		let itemTotal = parseFloat(item.preco) * item.quantidade;

		// Adiciona o preço dos adicionais, se houver
		if (item.adicionais && item.adicionais.length > 0) {
			const adicionaisTotal = item.adicionais.reduce(
				(total, adicional) => total + parseFloat(adicional.preco || 0),
				0
			);
			itemTotal += adicionaisTotal * item.quantidade;
		}

		// Adiciona o preço das opções selecionadas, se houver
		if (item.opcoesSelecionadas && item.opcoesSelecionadas.length > 0) {
			const opcoesTotal = item.opcoesSelecionadas.reduce(
				(total, opcao) => total + parseFloat(opcao.precoAdicional || 0),
				0
			);
			itemTotal += opcoesTotal * item.quantidade;
		}

		return total + itemTotal;
	}, 0);
};

// Função para calcular a quantidade total de itens no carrinho
const calculateQuantity = (items) => {
	return items.reduce((total, item) => total + item.quantidade, 0);
};

// Reducer para gerenciar as ações do carrinho
const cartReducer = (state, action) => {
	switch (action.type) {
		case CartTypes.ADD_ITEM: {
			// Verifica se o produto já existe no carrinho com as mesmas opções e adicionais
			const existingItemIndex = state.items.findIndex(
				(item) => {
					if (item.id !== action.payload.id) return false;

					// Verifica se as opções selecionadas são iguais
					const opcoesIguais =
						(!item.opcoesSelecionadas && !action.payload.opcoesSelecionadas) ||
						(item.opcoesSelecionadas?.length === action.payload.opcoesSelecionadas?.length &&
							JSON.stringify(item.opcoesSelecionadas.sort()) ===
							JSON.stringify(action.payload.opcoesSelecionadas.sort()));

					// Verifica se os adicionais são iguais
					const adicionaisIguais =
						(!item.adicionais && !action.payload.adicionais) ||
						(item.adicionais?.length === action.payload.adicionais?.length &&
							JSON.stringify(item.adicionais.sort()) ===
							JSON.stringify(action.payload.adicionais.sort()));

					// Verifica se as observações são iguais
					const observacoesIguais = item.observacoes === action.payload.observacoes;

					return opcoesIguais && adicionaisIguais && observacoesIguais;
				}
			);

			let updatedItems;

			if (existingItemIndex !== -1) {
				// Se o item já existe, apenas aumenta a quantidade
				updatedItems = state.items.map((item, index) => {
					if (index === existingItemIndex) {
						return {
							...item,
							quantidade: item.quantidade + (action.payload.quantidade || 1)
						};
					}
					return item;
				});
			} else {
				// Se o item não existe, adiciona ao carrinho
				updatedItems = [
					...state.items,
					{ ...action.payload, quantidade: action.payload.quantidade || 1 }
				];
			}

			const total = calculateTotal(updatedItems);
			const quantity = calculateQuantity(updatedItems);

			// Salva o carrinho no localStorage
			localStorage.setItem('carrinho', JSON.stringify({
				items: updatedItems,
				total,
				quantity
			}));

			return { items: updatedItems, total, quantity };
		}

		case CartTypes.REMOVE_ITEM: {
			const updatedItems = state.items.filter((_, index) => index !== action.payload);
			const total = calculateTotal(updatedItems);
			const quantity = calculateQuantity(updatedItems);

			// Salva o carrinho no localStorage
			localStorage.setItem('carrinho', JSON.stringify({
				items: updatedItems,
				total,
				quantity
			}));

			return { items: updatedItems, total, quantity };
		}

		case CartTypes.UPDATE_QUANTITY: {
			const updatedItems = state.items.map((item, index) => {
				if (index === action.payload.index) {
					return { ...item, quantidade: action.payload.quantidade };
				}
				return item;
			});

			const total = calculateTotal(updatedItems);
			const quantity = calculateQuantity(updatedItems);

			// Salva o carrinho no localStorage
			localStorage.setItem('carrinho', JSON.stringify({
				items: updatedItems,
				total,
				quantity
			}));

			return { items: updatedItems, total, quantity };
		}

		case CartTypes.CLEAR_CART: {
			// Remove carrinho do localStorage
			localStorage.removeItem('carrinho');

			return initialState;
		}

		default:
			return state;
	}
};

// Provider do contexto do carrinho
export const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	// Carrega o carrinho do localStorage na inicialização
	useEffect(() => {
		const savedCart = localStorage.getItem('carrinho');

		if (savedCart) {
			try {
				const parsedCart = JSON.parse(savedCart);

				// Verifica se o carrinho salvo tem a estrutura esperada
				if (parsedCart && parsedCart.items) {
					// Atualiza o estado com os dados do localStorage
					dispatch({
						type: 'INITIALIZE_CART',
						payload: parsedCart
					});
				}
			} catch (error) {
				console.error('Erro ao carregar carrinho do localStorage:', error);
				localStorage.removeItem('carrinho');
			}
		}
	}, []);

	// Funções de utilidade para o carrinho
	const addToCart = (item) => {
		dispatch({ type: CartTypes.ADD_ITEM, payload: item });
	};

	const removeFromCart = (index) => {
		dispatch({ type: CartTypes.REMOVE_ITEM, payload: index });
	};

	const updateQuantity = (index, quantidade) => {
		if (quantidade <= 0) {
			removeFromCart(index);
		} else {
			dispatch({
				type: CartTypes.UPDATE_QUANTITY,
				payload: { index, quantidade }
			});
		}
	};

	const clearCart = () => {
		dispatch({ type: CartTypes.CLEAR_CART });
	};

	// Formata os itens do carrinho para exibição no WhatsApp
	const formatCartForWhatsApp = () => {
		let message = '🛒 *NOVO PEDIDO* 🛒\n\n';

		state.items.forEach((item, index) => {
			message += `*${index + 1}. ${item.nome}* - ${item.quantidade}x\n`;
			message += `   💰 R$ ${(parseFloat(item.preco) * item.quantidade).toFixed(2)}\n`;

			// Adiciona as opções selecionadas
			if (item.opcoesSelecionadas && item.opcoesSelecionadas.length > 0) {
				message += '   *Opções*:\n';
				item.opcoesSelecionadas.forEach(opcao => {
					const precoAdicional = opcao.precoAdicional ? ` (+R$ ${parseFloat(opcao.precoAdicional).toFixed(2)})` : '';
					message += `   - ${opcao.nome}${precoAdicional}\n`;
				});
			}

			// Adiciona os adicionais
			if (item.adicionais && item.adicionais.length > 0) {
				message += '   *Adicionais*:\n';
				item.adicionais.forEach(adicional => {
					message += `   - ${adicional.nome} (+R$ ${parseFloat(adicional.preco).toFixed(2)})\n`;
				});
			}

			// Adiciona observações, se houver
			if (item.observacoes) {
				message += `   *Observações*: ${item.observacoes}\n`;
			}

			message += '\n';
		});

		// Adiciona o total do pedido
		message += `\n*Total do Pedido: R$ ${state.total.toFixed(2)}*\n`;

		return message;
	};

	return (
		<CartContext.Provider
			value={{
				items: state.items,
				total: state.total,
				quantity: state.quantity,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				formatCartForWhatsApp
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

// Hook personalizado para usar o contexto do carrinho
export const useCart = () => {
	const context = useContext(CartContext);

	if (!context) {
		throw new Error('useCart deve ser usado dentro de um CartProvider');
	}

	return context;
};