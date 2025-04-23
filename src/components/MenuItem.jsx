// import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const MenuItem = ({ item }) => {
	const navigate = useNavigate();
	// const { addToCart } = useCart();

	const handleItemClick = () => {
		navigate(`/produto/${item.categoria}/${item.id}`)
	};


	return (
		<div className="container">
			<div className="menu-items">
				<div className="menu-item" onClick={handleItemClick}>
					<div className="menu-item__image">
						<img src={item.image} alt={item.name} />
					</div>
					<div className="menu-item__info">
						<div className="menu-item__title">{item.name}</div>
						<div className="menu-item__description">{item.description}</div>
						<div className="menu-item__price">
							R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
				</div>
			</div>
		</div >
	);
};

export default MenuItem;