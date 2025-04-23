import React from 'react';

const PromocoesTab = ({ pedirViaWhatsApp }) => {
	const promocao = {
		id: 101,
		name: 'Combo Duplo - Leve 2, Pague 1',
		description: 'Toda terça-feira, na compra de um combo tradicional, ganhe outro igual!',
		price: 39.9,
		image: '/api/placeholder/120/120',
	};

	return (
		<div className="fade-in">
			<div className="banner">Nossas Promoções</div>

			<div className="menu-items">
				<div className="menu-item">
					<div className="menu-item__image">
						<img src={promocao.image} alt={promocao.name} />
					</div>
					<div className="menu-item__info">
						<div className="menu-item__title">{promocao.name}</div>
						<div className="menu-item__description">{promocao.description}</div>
						<div className="menu-item__price">R$ {promocao.price.toFixed(2)}</div>
						<button className="menu-item__add-button" onClick={() => pedirViaWhatsApp(promocao)}>
							Pedir no WhatsApp
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PromocoesTab;
