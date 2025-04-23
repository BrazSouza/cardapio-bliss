// // logica/views/components/LoginPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

// const LoginPage = () => {
//   const { login, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [identifier, setIdentifier] = useState('');
//   const [error, setError] = useState('');


//   const redirectAfterLogin = () => {
//     const from = location.state?.from?.pathname || '/cardapio';
//     navigate(from);
//   };


//   // Redirecionar se já estiver autenticado
//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     if (isAuthenticated && user) {
//       redirectAfterLogin();
//     }
//   }, [isAuthenticated, location]);



//   // Verifica se é o primeiro acesso
//   const [isFirstAccess, setIsFirstAccess] = useState(false);

//   useEffect(() => {
//     const checkFirstAccess = () => {
//       const savedUser = localStorage.getItem('user');
//       setIsFirstAccess(!savedUser);
//     };

//     checkFirstAccess();
//   }, []);

//   // logica/views/components/LoginPage.jsx
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const sanitizedInput = identifier.trim(); // remove espaços no início/fim


//     if (!identifier) {
//       setError('Por favor, informe seu nome ou telefone');
//       setLoading(false);
//       return;
//     }

//     if (isFirstAccess) {
//       navigate('/cadastro/info', { state: { identifier } });
//     } else {
//       const result = await login(sanitizedInput);

//       if (!result.success) {
//         setError('Usuário não encontrado. Verifique as informações ou cadastre-se.');
//       }
//     }

//     setLoading(false);
//   };



//   return (
//     <div className="login-container">
//       <h1>{isFirstAccess ? 'Bem-vindo!' : 'Bem-vindo de volta!'}</h1>

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="identifier">
//             {isFirstAccess ? 'Como podemos te chamar?' : 'Nome ou Telefone'}
//           </label>
//           <input
//             type="text"
//             id="identifier"
//             value={identifier}
//             onChange={(e) => setIdentifier(e.target.value)}
//             placeholder={isFirstAccess ? "Seu nome" : "Entre com seu nome ou telefone"}
//             required
//           />
//         </div>

//         {error && <p className="error-message">{error}</p>}

//         <button type="submit" className="btn-primary" disabled={loading}>
//           {loading ? 'Entrando...' : isFirstAccess ? 'Continuar' : 'Entrar'}
//         </button>

//       </form>
//     </div>
//   );
// };

// export default LoginPage;