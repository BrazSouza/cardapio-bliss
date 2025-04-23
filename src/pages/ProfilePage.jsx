import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterNavigation from '../components/FooterNavigation';

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tentar obter dados do state (caso venha de redirecionamento)
    const stateData = location.state;

    try {
      const storedData = localStorage.getItem('user');

      if (stateData) {
        setUserData(stateData);
      } else if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } else {
        // Se não tem dados, redirecionar para editar perfil
        navigate('/perfil/editar');
      }
    } catch (error) {
      // Tratamento de erro seguro
      navigate('/perfil/editar');
    } finally {
      setIsLoading(false);
    }
  }, [location, navigate]);

  // Se está carregando ou não tem dados, mostrar loading
  if (isLoading || !userData) {
    return (
      <div className="profile-page">
        <div className="content-container d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
        <FooterNavigation activeTab="profile" />
      </div>
    );
  }

  const { fullName, phoneNumber, email } = userData;

  const handleEditProfile = () => {
    // Aqui, ao clicar no botão para editar, redireciona para a página de edição de perfil
    navigate('/perfil/editar', { state: userData });
  };

  const handlePedidos = () => {
    navigate('/carrinho', { state: userData });
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair da sua conta?")) {
      // Remover dados do localStorage
      localStorage.removeItem('userData');

      // Redirecionar para a home
      navigate('/');
    }
  };

  return (
    <div className="profile-page">
      <div className="content-container">
        <div className="profile-card" onClick={handleEditProfile}>
          <div className="profile-image">
            <img src="/assets/profile-placeholder.png" alt="Profile" />
          </div>

          <div className="profile-info">
            <h3>{fullName || 'Usuário'}</h3>
            {phoneNumber && <p>{phoneNumber}</p>}
            {email && <p>{email}</p>}
          </div>
        </div>

        <div className="profile-menu">
          <div className="menu-item" onClick={handlePedidos}>
            <div className="menu-icon">📋</div>
            <div className="menu-text">Meus pedidos</div>
            <div className="menu-arrow">›</div>
          </div>

          <div className="menu-item" onClick={handleLogout}>
            <div className="menu-icon">🚪</div>
            <div className="menu-text">Sair</div>
            <div className="menu-arrow">›</div>
          </div>
        </div>
      </div>

      <FooterNavigation activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
