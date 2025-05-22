import '../src/styles/globals.scss';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet
} from 'react-router-dom';

import { CartProvider } from './components/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

import Header from './components/Header';
import FooterNavigation from './components/FooterNavigation';
import Protected from './components/Protected';
import ProtectedRoute from './admin/components/auth/ProtectedRoute';

import { publicRoutes, protectedRoutes, adminRoutes } from './routesConfig';

// Wrapper para carregar usuário
const ProtectedRouteWrapper = () => {
  const { loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  return <Outlet />;
};

// Layout base com Header/Footer condicionais
const Layout = ({ children }) => {
  const location = useLocation();
  const { token, currentUser } = useAuth();
  const isAuthenticated = !!token && !!currentUser;

  const hideHeader = ['/', '/login', '/cadastro/info', '/cadastro/verificacao'].includes(location.pathname);
  const hideFooter = hideHeader || !isAuthenticated;

  return (
    <div className="app-container">
      {!hideHeader && <Header />}
      <main>{children}</main>
      {!hideFooter && <FooterNavigation />}
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      {publicRoutes.map(({ path, element }, index) => (
        <Route key={index} path={path} element={element} />
      ))}

      {/* Rotas protegidas para usuários autenticados */}
      <Route element={<ProtectedRouteWrapper />}>
        {protectedRoutes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={<Protected>{element}</Protected>} />
        ))}
      </Route>

      {/* Rotas administrativas */}
      <Route element={<ProtectedRoute />}>
        {adminRoutes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Route>

      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <CartProvider>
        <AuthProvider>
          <NotificationProvider>
            <Layout>
              <AppContent />
            </Layout>
          </NotificationProvider>
        </AuthProvider>
      </CartProvider>
    </Router>
  );
};

export default App;
