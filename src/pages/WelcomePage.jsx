import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logotipo.png';
import { useAuth } from '../contexts/AuthContext';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/cardapio'); // redireciona diretamente para o cardápio
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="welcome-page">
      <div className="overlay"></div>

      <div className="welcome-content">
        <img src={logo} alt="Logo Bliss Burger" className="logo" />

        <h2>Já possui conta?</h2>

        <button
          className="primary-button"
          onClick={() => {
            if (isAuthenticated) {
              navigate('/cardapio');
            } else {
              navigate('/login');
            }
          }}
        >
          Entrar ou cadastrar
        </button>

      </div>
    </div>
  );
};

export default WelcomePage;
