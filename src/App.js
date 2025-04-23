import '../src/style/globals.scss';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Importe o AuthProvider
import Header from './components/Header';
import FooterNavigation from './components/FooterNavigation';
import Cardapio from './components/Cardapio';
import ComboDetailsPage from './pages/ComboDetailsPage';
import CombosList from './components/CombosList';
import CarrinhoPage from './pages/CarrinhoPage';
import ProdutoDetailsPage from './pages/ProdutoDetailsPage';
import { menuData } from './data/menuData';
import WelcomePage from './pages/WelcomePage';
import UserInfoPage from './pages/UserInfoPage';
import VerificationPage from './pages/VerificationPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';

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
      <Route path="/" element={<WelcomePage />} />
      <Route path="/cadastro/info" element={<UserInfoPage />} />
      <Route path="/cadastro/verificacao" element={<VerificationPage />} />

      {/* Rotas protegidas */}
      <Route path="/cardapio" element={
        <ProtectedRouteWrapper>
          <Cardapio data={menuData.lanches} />
        </ProtectedRouteWrapper>
      } />
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

    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <AppContent />
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;