import React, { useState } from 'react';
import { useCart } from './CartContext';
import { adicionalItens } from '../../data/menuData';

const AdicionalItens = ({ combos }) => {
	const { addToCart } = useCart();
	const [selectedCombo, setSelectedCombo] = useState(null);

	const handleAddAdditional = (additional, combo) => {
		const additionalItem = {
			...additional,
			parentComboId: combo.id,
			parentComboName: combo.name,
			isAdditional: true,
			displayName: `${additional.name} (para ${combo.name})`
		};
		addToCart(additionalItem);
	};

	return (
		<div className="adicionais-container">
			<h4 className="adicionais-title">Escolha o combo para adicionar o item extra</h4>

			<div className="combos-selector">
				{combos.map(combo => (
					<div
						key={combo.id}
						className={`combo-option ${selectedCombo?.id === combo.id ? 'selected' : ''}`}
						onClick={() => setSelectedCombo(combo)}
					>
						<span className="combo-name">{combo.name}</span>
						<span className="combo-price">R$ {combo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
					</div>
				))}
			</div>

			{selectedCombo && (
				<div className="adicionais-lista">
					{adicionalItens.map((additional) => (
						<div
							key={additional.id}
							className="adicional-item"
							onClick={() => handleAddAdditional(additional, selectedCombo)}
						>
							<div className="adicional-item-info">
								<span className="adicional-item-icon">{additional.icon}</span>
								<span className="adicional-item-name">{additional.name}</span>
								<span className="adicional-item-price">+ R$ {additional.price.toFixed(2)}</span>
							</div>
							<button
								className="adicional-item-button"
								onClick={() => handleAddAdditional(additional, selectedCombo)}
							>
								Adicionar
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AdicionalItens;