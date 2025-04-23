import React from 'react';
import { useNavigate } from 'react-router-dom';
import { menuData } from '../../src/data/menuData';

const CombosList = () => {
	const navigate = useNavigate();

	const handleComboClick = (comboId) => {
		navigate(`/combo/${comboId}`);
	};

	return (
		<div className="combos-section">
			<h2>Combos</h2>
			{menuData.combos.map((combo) => (
				<div
					key={combo.id}
					onClick={() => handleComboClick(combo.id)}
					style={{
						display: 'flex',
						alignItems: 'center',
						padding: '10px',
						borderBottom: '1px solid #eee',
						cursor: 'pointer'
					}}
				>
					<div style={{ marginRight: '10px' }}>
						<img
							src={combo.image}
							alt={combo.name}
							style={{ width: '80px', height: '80px', objectFit: 'cover' }}
						/>
					</div>
					<div>
						<h3>{combo.name}</h3>
						<p>{combo.description}</p>
						<strong>R$ {combo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
					</div>
				</div>
			))}
		</div>
	);
};

export default CombosList;