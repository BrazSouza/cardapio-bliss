// src/routesConfig.js
import Cardapio from './pages/Cardapio';
import Login from './pages/Login';
import MontarAcai from './pages/MontarAcai';
import PedidoConfirmado from './pages/PedidoConfirmado';
import AcompanharPedido from './pages/AcompanharPedido';
import ComboDetailsPage from './pages/ComboDetailsPage';
import CombosList from './components/CombosList';
import ProdutoDetailsPage from './pages/ProdutoDetailsPage';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import WelcomePage from './pages/WelcomePage';
import VerificationPage from './pages/VerificationPage';
import PedidoDetalhes from './admin/pages/PedidosDetalhe';
import Pedidos from './admin/pages/Pedidos';

const publicRoutes = [
	{ path: '/', element: <WelcomePage /> },
	{ path: '/login', element: <Login /> },
	{ path: '/cadastro/verificacao', element: <VerificationPage /> },
	{ path: '/cardapio', element: <Cardapio /> },
	{ path: '/pedido/confirmado/:id', element: <PedidoConfirmado /> },
	{ path: '/pedido/acompanhar/:id', element: <AcompanharPedido /> },
];

const protectedRoutes = [
	{ path: '/montar-produto/:id', element: <MontarAcai /> },
	{ path: '/combo/:comboId', element: <ComboDetailsPage /> },
	{ path: '/combos', element: <CombosList /> },
	{ path: '/produto/:categoria/:produtoId', element: <ProdutoDetailsPage /> },
	{ path: '/carrinho', element: <Carrinho /> },
	{ path: '/checkout', element: <Checkout /> },
	{ path: '/perfil/editar', element: <ProfilePage /> },
	{ path: '/registro', element: <ProfileEditPage /> },
];

const adminRoutes = [
	{ path: '/pedidos', element: <Pedidos /> },
	{ path: '/pedidos/:id', element: <PedidoDetalhes /> },
];

export { publicRoutes, protectedRoutes, adminRoutes };