import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComboCard = ({ combo }) => {
	const navigate = useNavigate();

	const handleComboClick = () => {
		navigate(`/combo/${combo.id}`);
	};

	return (
		<div
			className="combo-card"
			onClick={handleComboClick}
			style={{
				cursor: 'pointer',
				border: '1px solid #ddd',
				borderRadius: '8px',
				padding: '15px',
				marginBottom: '15px',
				display: 'flex',
				alignItems: 'center',
				boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
			}}
		>
			<div style={{ marginRight: '15px' }}>
				<img
					src={combo.image}
					alt={combo.name}
					style={{
						width: '100px',
						height: '100px',
						objectFit: 'cover',
						borderRadius: '8px'
					}}
				/>
			</div>
			<div style={{ flex: 1 }}>
				<h3 style={{ margin: 0, color: '#333' }}>{combo.name}</h3>
				<p style={{ margin: '5px 0', color: '#666' }}>{combo.description}</p>
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}>
					<span style={{
						fontWeight: 'bold',
						color: '#8b1a30'
					}}>
						R$ {combo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ComboCard;