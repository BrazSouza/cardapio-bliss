import React, { useState, useEffect, useRef } from 'react';
import MenuItem from './MenuItem';

const MenuTab = ({ menuData, activeCategory, setActiveCategory, searchTerm, showCategories, pedirViaWhatsApp }) => {
	// Imagens para o banner de slideshow
	const bannerImages = [
		{ url: 'https://imagens.jotaja.com/empresa/4007/cabecalho_A1B6B6C067E93119A0BF7CD64DEBC202CF8903BA779BFD402A65D48C02B51873.jpg', caption: 'Promoção: Combo Duplo com Fritas' },
		{ url: 'https://imagens.jotaja.com/empresa/4007/cabecalho_A1B6B6C067E93119A0BF7CD64DEBC202CF8903BA779BFD402A65D48C02B51873.jpg', caption: 'Novos Sabores: Experimente Nossos Burgers Especiais' },
		{ url: 'https://imagens.jotaja.com/empresa/4007/cabecalho_A1B6B6C067E93119A0BF7CD64DEBC202CF8903BA779BFD402A65D48C02B51873.jpg', caption: 'Delivery Grátis em Pedidos Acima de R$50' }
	];

	// Estado para controlar o slide atual
	const [currentSlide, setCurrentSlide] = useState(0);

	// Referência para o container de categorias (carrossel)
	const categoriesRef = useRef(null);

	// Efeito para automatizar a transição dos slides
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) =>
				prev === bannerImages.length - 1 ? 0 : prev + 1
			);
		}, 5000); // Troca a cada 5 segundos

		return () => clearInterval(interval);
	}, [bannerImages.length]);

	// Função para rolar o carrossel de categorias para a esquerda
	const scrollLeft = () => {
		if (categoriesRef.current) {
			categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
		}
	};

	// Função para rolar o carrossel de categorias para a direita
	const scrollRight = () => {
		if (categoriesRef.current) {
			categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
		}
	};

	// Função para garantir que a categoria ativa esteja visível
	useEffect(() => {
		if (categoriesRef.current) {
			// Encontrar o elemento da categoria ativa
			const activeElement = categoriesRef.current.querySelector('.categories__pill--active');
			if (activeElement) {
				// Calcular a posição para centralizar o elemento
				const container = categoriesRef.current;
				const scrollLeft = activeElement.offsetLeft - (container.clientWidth / 2) + (activeElement.clientWidth / 2);
				container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
			}
		}
	}, [activeCategory]);

	// Função para renderizar itens filtrados
	const getFilteredItems = () => {
		let allItems = [];

		if (activeCategory === 'todos') {
			Object.keys(menuData).forEach((category) => {
				if (showCategories[category]) {
					allItems = [...allItems, ...menuData[category]];
				}
			});
		} else if (menuData[activeCategory]) {
			allItems = menuData[activeCategory];
		}

		// Filtrar por termo de busca
		if (searchTerm) {
			allItems = allItems.filter((item) =>
				item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		return allItems;
	};

	// Agrupar itens por categoria
	const getItemsByCategory = () => {
		const categories = {};

		if (activeCategory === 'todos') {
			Object.keys(menuData).forEach((category) => {
				if (showCategories[category] && menuData[category].length > 0) {
					categories[category] = menuData[category].filter((item) =>
						!searchTerm ||
						item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
						item.description.toLowerCase().includes(searchTerm.toLowerCase())
					);
				}
			});
		} else if (menuData[activeCategory]) {
			categories[activeCategory] = menuData[activeCategory].filter((item) =>
				!searchTerm ||
				item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		return categories;
	};

	return (
		<div className="fade-in">
			{/* Banner de slideshow */}
			<div className="banner-slideshow">
				{bannerImages.map((image, index) => (
					<div
						key={index}
						className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
						style={{ backgroundImage: `url(${image.url})` }}
					>
						{image.caption && <div className="banner-caption">{image.caption}</div>}
					</div>
				))}
				<div className="banner-dots">
					{bannerImages.map((_, index) => (
						<span key={index} className={`dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} />
					))}
				</div>
			</div>

			<div className="container">
				<div className="categories-carousel">
					<div className="categories" ref={categoriesRef}>
						<div className={`categories__pill ${activeCategory === 'todos' ? 'categories__pill--active' : ''}`} onClick={() => setActiveCategory('todos')}>
							Todos
						</div>
						{Object.keys(menuData).map((category) => (
							<div key={category} className={`categories__pill ${activeCategory === category ? 'categories__pill--active' : ''}`} onClick={() => setActiveCategory(category)}>
								{category === 'jantarFamilia' ? 'Jantar Família'
									: category === 'pratoDeFrios' ? 'Prato de Frios'
										: category === 'acai' ? 'Açaí'
											: category.charAt(0).toUpperCase() + category.slice(1)
								}
							</div>

						))}
					</div>
				</div>

				{Object.entries(getItemsByCategory()).map(
					([category, items]) =>
						items.length > 0 && (
							<div key={category} className="slide-up" style={{ marginBottom: '60px' }}>
								<div className="category-title">{category === 'jantarFamilia' ? 'Jantar Família' : category === 'pratoDeFrios'
									? 'Prato de Frios' : category.charAt(0).toUpperCase() + category.slice(1)}
								</div>
								<div className="menu-items">
									<div className="row align-items-center justify-content-center">
										<div className="col-auto">
											{items.map((item) => (
												<MenuItem key={item.id} item={item} onPedir={pedirViaWhatsApp} />
											))}
										</div>
									</div>
								</div>
							</div>
						),
				)}

				{getFilteredItems().length === 0 && (
					<div className="empty-state">
						<div className="empty-state__icon">🔍</div>
						<div className="empty-state__text">Nenhum item encontrado.</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MenuTab;