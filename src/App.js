import '../src/styles/globals.scss';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Importe o AuthProvider
import Header from './components/Header';
import FooterNavigation from './components/FooterNavigation';
import ComboDetailsPage from './pages/ComboDetailsPage';
import CombosList from './components/CombosList';
import CarrinhoPage from './pages/CarrinhoPage';
import ProdutoDetailsPage from './pages/ProdutoDetailsPage';
import WelcomePage from './pages/WelcomePage';
import UserInfoPage from './pages/UserInfoPage';
import VerificationPage from './pages/VerificationPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import Protected from './components/Protected';


// Páginas públicas
// import Home from './pages/Home';
import Cardapio from './pages/Cardapio';
import Login from './pages/Login';
// import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import PedidoConfirmado from './pages/PedidoConfirmado';
import AcompanharPedido from './pages/AcompanharPedido';


// Páginas administrativas
import AdminLayout from './admin/components/layout/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Categorias from './admin/pages/Categorias';
import Pedidos from './admin/pages/Pedidos';
import Configuracoes from './admin/pages/Configuracoes';
import ProtectedRoute from './admin/components/auth/ProtectedRoute';
import { NotificationProvider } from './contexts/NotificationContext';
import PedidoDetalhes from './admin/pages/PedidosDetalhe';



// Componente para rotas protegidas como componente funcional
const ProtectedRouteWrapper = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const hideHeader = ['/login', '/', '/cadastro/info', '/cadastro/verificacao'].includes(location.pathname);

  // Modificar a lógica para considerar também o estado de autenticação
  const hideFooter =
    ['/login', '/', '/cadastro/info', '/cadastro/verificacao'].includes(location.pathname) ||
    !isAuthenticated;

  return (
    <div className="app-container">
      {!hideHeader && <Header />}
      {children}
      {!hideFooter && <FooterNavigation />}
    </div>
  );
};

// Componente que contém as rotas
const AppContent = () => {
  return (
    <Routes>


      {/* Rotas públicas */}

      {/* <Route path="/" element={<Home />} />
      <Route path="/cardapio" element={<Cardapio />} />
      */}
      <Route path="/cardapio" element={<Cardapio />} />
      <Route path="/carrinho" element={<CarrinhoPage />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/carrinho" element={<Carrinho />} /> */}
      <Route path="/pedido/confirmado/:id" element={<PedidoConfirmado />} />
      <Route path="/pedido/acompanhar/:id" element={<AcompanharPedido />} />
      <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="configuracoes" element={<Configuracoes />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/categorias" element={<Categorias />} />





        {/* Rotas protegidas administrativas */}
        <Route element={<ProtectedRoute />}>
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="pedidos/:id" element={<PedidoDetalhes />} />
          {/* 
        <Route path="produtos" element={<Produtos />} />
        <Route path="produtos/novo" element={<ProdutoForm />} />
        <Route path="produtos/:id" element={<ProdutoForm />} />
        */}
        </Route>
      </Route>

      <Route path="/" element={<WelcomePage />} />
      <Route path="/cadastro/info" element={<UserInfoPage />} />
      <Route path="/cadastro/verificacao" element={<VerificationPage />} /> 

      {/* Rotas protegidas */}
      {/* <Route path="/cardapio" element={
        <ProtectedRouteWrapper>
          <Cardapio data={menuData.lanches} />
        </ProtectedRouteWrapper>
      } /> */}
      <Route path="/combo/:comboId" element={
        <ProtectedRouteWrapper>
          <ComboDetailsPage />
        </ProtectedRouteWrapper>
      } />
      <Route path="/combos" element={
        <ProtectedRouteWrapper>
          <CombosList />
        </ProtectedRouteWrapper>
      } />
      <Route path="/produto/:categoria/:produtoId" element={
        <ProtectedRouteWrapper>
          <ProdutoDetailsPage />
        </ProtectedRouteWrapper>
      } />
      <Route path="/carrinho" element={ 
        <ProtectedRouteWrapper>
          <CarrinhoPage />
        </ProtectedRouteWrapper>
      } />
      <Route path="/perfil" element={
        <ProtectedRouteWrapper>
          <ProfilePage />
        </ProtectedRouteWrapper>
      } />
      <Route path="/perfil/editar" element={<ProfileEditPage />} />

      {/* Redirecionar 404 para home */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />

    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
          <Layout>
            <AppContent />
          </Layout>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;