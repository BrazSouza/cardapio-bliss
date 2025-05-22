import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser } = useAuth(); // ✅ Apenas aqui
  const navigate = useNavigate();

  const handleEditAddress = () => {
    navigate('/registro');
  };


  if (!currentUser) {
    return <p>Carregando informações...</p>;
  }

  // console.log('DADOS DO USUÁRIO:', currentUser);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1 style={{ color: '#0C1E42' }}>Meu Perfil</h1>

      <div style={cardStyle}>
        <p>Nome: {currentUser?.nome}</p>
        <p>Telefone: {currentUser?.telefone}</p>
        <p>Endereço:</p>
        <ul>
          <li>Bairro: {currentUser?.endereco?.bairro}</li>
          <li>Cidade: {currentUser?.endereco?.cidade}</li>
          <li>Rua: {currentUser?.endereco?.rua}</li>
          <li>Número: {currentUser?.endereco?.numero}</li>
          <li>Complemento: {currentUser?.endereco?.complemento}</li>
        </ul>

        <button onClick={handleEditAddress} style={editButtonStyle}>
          Editar Endereço
        </button>
      </div>

      <div style={cardStyle}>
        <h2>Meus Pedidos</h2>
        <p>Você ainda não realizou nenhum pedido.</p>
      </div>
    </div>
  );
};

const cardStyle = {
  background: '#f8f9fa',
  padding: '16px',
  marginBottom: '20px',
  borderRadius: '12px',
  boxShadow: '0 0 10px rgba(0,0,0,0.05)'
};

const editButtonStyle = {
  marginTop: 12,
  padding: '8px 16px',
  backgroundColor: '#0C1E42',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer'
};

export default ProfilePage;
