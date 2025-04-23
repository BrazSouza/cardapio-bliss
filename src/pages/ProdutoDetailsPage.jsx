import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuData, adicionalItens } from '../../src/data/menuData';
import { useCart } from '../components/CartContext';

const ProdutoDetailsPage = () => {
	const { categoria, produtoId } = useParams();
	const navigate = useNavigate();
	const { addToCart } = useCart();

	// Encontrar o produto específico em todas as categorias
	const produto = useMemo(() => {
		for (const [key, items] of Object.entries(menuData)) {
			const produto = items.find(p => p.id === parseInt(produtoId));
			if (produto) return { ...produto, categoria: key };
		}
		return null;
	}, [produtoId]);

	// Estado para gerenciar adicionais selecionados
	const [selectedAdditionals, setSelectedAdditionals] = useState({});
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		// Salva a página anterior apenas se não for a página do carrinho
		const currentPath = window.location.pathname;
		if (currentPath !== '/carrinho') {
			sessionStorage.setItem('lastPage', currentPath);
		}
	}, []);

	if (!produto) {
		return <div>Produto não encontrado</div>;
	}

	// Função para adicionar/remover adicional com quantidade
	const updateAdditionalQuantity = (additional, newQuantity) => {
		setSelectedAdditionals(current => ({
			...current,
			[additional.id]: {
				...additional,
				quantity: newQuantity
			}
		}));
	};

	// Calcular preço total
	const calculateTotal = () => {
		const basePrice = produto.price * quantity;
		const additionalsTotal = Object.values(selectedAdditionals).reduce(
			(sum, additional) => sum + (additional.price * additional.quantity),
			0
		);
		return basePrice + additionalsTotal;
	};

	// Função de navegação de volta aprimorada
	const handleGoBack = () => {
		// Recupera a última página salva
		const lastPage = sessionStorage.getItem('lastPage');
		const currentPath = window.location.pathname;

		// Verifica se a última página é válida e diferente da página atual
		if (lastPage && lastPage !== currentPath) {
			navigate(lastPage);
			// Remove a última página do sessionStorage após navegar
			sessionStorage.removeItem('lastPage');
		} else {
			// Se não houver última página ou for a mesma página atual, vai para a página inicial
			navigate('/cardapio');
		}
	};

	// Função para adicionar ao carrinho
	const handleAddToCart = () => {
		// Adicionar o produto ao carrinho
		const produtoItem = {
			...produto,
			quantity,
			totalPrice: produto.price * quantity
		};

		// Converter adicionais selecionados para array
		const additionals = Object.values(selectedAdditionals)
			.filter(additional => additional.quantity > 0)
			.flatMap(additional =>
				Array(additional.quantity).fill().map(() => ({
					id: additional.id,
					name: additional.name,
					price: additional.price
				}))
			);

		// Adicionar produto com adicionais em uma única chamada
		addToCart(produtoItem, quantity, additionals);

		// Redirecionar para página inicial
		navigate('/cardapio');
	};

	return (
		<div className="produto-details-page" style={{ maxWidth: '500px', margin: '0 auto' }}>
			<button className='back-button' onClick={handleGoBack}>←</button>

			<div className="produto-header" style={{ textAlign: 'center', padding: '15px' }}>
				<img
					src={produto.image}
					alt={produto.name}
					style={{
						width: '100%',
						maxHeight: '300px',
						objectFit: 'cover',
						borderRadius: '10px'
					}}
				/>

				<h1 style={{ margin: '10px 0' }}>{produto.name}</h1>
				<p style={{ color: '#666' }}>{produto.description}</p>
				<h2 style={{ color: '#8b1a30' }}>
					R$ {produto.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
				</h2>
			</div>

			{/* Seção de Adicionais */}
			<div className="adicionais-section" style={{ padding: '15px' }}>
				<h3>Escolha os Adicionais:</h3>
				<p style={{ color: '#666' }}>Escolha até 15 opções</p>

				{adicionalItens.map((additional) => (
					<div
						key={additional.id}
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '10px',
							borderBottom: '1px solid #eee',
							backgroundColor: selectedAdditionals[additional.id] ? '#f0f0f0' : 'white'
						}}
					>
						<div>
							<span>{additional.name}</span>
							<span style={{ marginLeft: '10px', color: '#8b1a30' }}>
								R$ {additional.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
							</span>
						</div>

						{/* Botões de quantidade para adicionais */}
						{selectedAdditionals[additional.id] ? (
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<button
									onClick={() => updateAdditionalQuantity(
										additional,
										Math.max(0, (selectedAdditionals[additional.id]?.quantity || 0) - 1)
									)}
									style={{
										padding: '5px 10px',
										backgroundColor: '#f0f0f0',
										border: 'none',
										borderRadius: '5px',
										margin: '0 5px'
									}}
								>
									-
								</button>
								<span>{selectedAdditionals[additional.id]?.quantity || 0}</span>
								<button
									onClick={() => updateAdditionalQuantity(
										additional,
										(selectedAdditionals[additional.id]?.quantity || 0) + 1
									)}
									style={{
										padding: '5px 10px',
										backgroundColor: '#f0f0f0',
										border: 'none',
										borderRadius: '5px',
										margin: '0 5px'
									}}
								>
									+
								</button>
							</div>
						) : (
							<button
								onClick={() => updateAdditionalQuantity(additional, 1)}
								style={{
									backgroundColor: 'transparent',
									border: '1px solid #8b1a30',
									color: '#8b1a30',
									borderRadius: '5px',
									padding: '5px 10px'
								}}
							>
								+
							</button>
						)}
					</div>
				))}
			</div>

			{/* Seção de Quantidade */}
			<div
				className="quantity-section"
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '15px'
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<button
						onClick={() => setQuantity(Math.max(1, quantity - 1))}
						style={{
							padding: '5px 10px',
							backgroundColor: '#f0f0f0',
							border: 'none',
							borderRadius: '5px',
							margin: '0 5px'
						}}
					>
						-
					</button>
					<span style={{ margin: '0 10px' }}>{quantity}</span>
					<button
						onClick={() => setQuantity(quantity + 1)}
						style={{
							padding: '5px 10px',
							backgroundColor: '#f0f0f0',
							border: 'none',
							borderRadius: '5px',
							margin: '0 5px'
						}}
					>
						+
					</button>
				</div>
				<div>
					<strong>Total: R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
				</div>
			</div>

			{/* Botão de Adicionar ao Carrinho */}
			<div style={{ padding: '15px' }}>
				<button onClick={handleAddToCart} style={{ width: '100%', padding: '15px', backgroundColor: '#8b1a30', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold' }}>
					Adicionar R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
				</button>
			</div>

			{/* Navegação Inferior */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					padding: '10px',
					borderTop: '1px solid #eee'
				}}
			>
				<button
					onClick={() => navigate('/')}
					style={{
						background: 'none',
						border: 'none',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					🏠 Início
				</button>
				<button
					onClick={() => navigate('/carrinho')}
					style={{
						background: 'none',
						border: 'none',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					🛒 Carrinho
				</button>
			</div>
		</div>
	);
};

export default ProdutoDetailsPage;