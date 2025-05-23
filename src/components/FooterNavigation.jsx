// Correção mais robusta do FooterNavigation.jsx

import { useCart } from './CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FooterNavigation = ({ isEnabled = true }) => {
	// Aqui está o problema: cartItems pode estar vindo como undefined
	const { cartItems = [] } = useCart() || {}; // Garante que se useCart retornar undefined, usamos um objeto vazio, e garante que cartItems será um array vazio se não existir
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	// Verificação segura da autenticação
	if (!auth || !auth.token || !auth.currentUser) return null;

	const navigationItems = [
		{
			icon: '🏠',
			label: 'Início',
			route: '/cardapio',
			active: location.pathname === '/cardapio'
		},
		{
			icon: '📋',
			label: 'Pedidos',
			route: '/carrinho',
			active: location.pathname === '/carrinho',
			// Certifique-se de que cartItems existe e tem a propriedade length
			badge: cartItems && Array.isArray(cartItems) ? cartItems.length : 0
		},
		{
			icon: '👤',
			label: 'Perfil',
			route: '/perfil/editar',
			active: location.pathname === '/perfil/editar'
		}
	];

	const handleNavigation = (route) => {
		if (isEnabled) {
			navigate(route);
		}
	};

	return (
		<footer
			className="footer-navigation fixed-bottom"
			style={{
				borderTop: '2px solid #8B1A30',
				background: '#FCF6F5',
				opacity: isEnabled ? 1 : 0.5,
				pointerEvents: isEnabled ? 'auto' : 'none'
			}}
		>
			<div className="d-flex justify-content-around align-items-center">
				{navigationItems.map((item) => (
					<div
						key={item.route}
						className={`footer-nav-item text-center ${item.active ? 'active' : ''}`}
						onClick={() => handleNavigation(item.route)}
					>
						<div className="position-relative">
							<span className="footer-nav-icon" style={{ fontSize: '25px' }}>{item.icon}</span>
							{item.badge > 0 && (
								<span className="badge bg-danger position-absolute translate-middle" style={{ top: '13px', left: '50px' }}>
									{item.badge}
								</span>
							)}
						</div>
						<span className="footer-nav-label" style={{ color: '#8B1A30', fontWeight: '700' }}>{item.label}</span>
					</div>
				))}
			</div>
		</footer>
	);
};

export default FooterNavigation;