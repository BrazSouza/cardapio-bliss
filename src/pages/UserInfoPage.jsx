// logica/views/components/UserInfoPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';

const UserInfoPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier || '';

  const [userData, setUserData] = useState({
    nome: identifier,
    telefone: '',
    endereco: '',
    cep: '',
    complemento: '',
    referencia: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // logica/views/components/UserInfoPage.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (!userData.nome || !userData.telefone || !userData.endereco) {
      setError('Nome, telefone e endereço são obrigatórios');
      return;
    }

    // Validação de telefone (formato básico)
    const phoneRegex = /^\d{10,11}$/; // 10 ou 11 dígitos
    if (!phoneRegex.test(userData.telefone.replace(/\D/g, ''))) {
      setError('Telefone inválido. Use apenas números (com DDD)');
      return;
    }

    // Registra o usuário
    const result = await register(userData);

    if (result.success) {
      // Salvar os dados no localStorage ou contexto
      localStorage.setItem('user', JSON.stringify(userData)); // Armazenando no localStorage

      // Redirecionar para o cardápio após o cadastro
      navigate('/cardapio');
    } else {
      setError('Erro ao cadastrar. Tente novamente.');
    }
  };


  return (
    <div className="user-info-container">
      <h1>Complete seu cadastro</h1>
      <p>Precisamos de algumas informações para entregar seu pedido</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome completo</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={userData.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={userData.telefone}
            onChange={handleChange}
            placeholder="(99) 99999-9999"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={userData.endereco}
            onChange={handleChange}
            placeholder="Rua, número, bairro"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cep">CEP</label>
          <input
            type="text"
            id="cep"
            name="cep"
            value={userData.cep}
            onChange={handleChange}
            placeholder="00000-000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="complemento">Complemento</label>
          <input
            type="text"
            id="complemento"
            name="complemento"
            value={userData.complemento}
            onChange={handleChange}
            placeholder="Apartamento, bloco, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="referencia">Ponto de referência</label>
          <input
            type="text"
            id="referencia"
            name="referencia"
            value={userData.referencia}
            onChange={handleChange}
            placeholder="Próximo ao..."
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-primary">
          Concluir cadastro
        </button>
      </form>
    </div>
  );
};

export default UserInfoPage;