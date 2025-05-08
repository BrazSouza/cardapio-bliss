// Localização: /src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
	const [formData, setFormData] = useState({
		email: '',
		senha: ''
	});
	const [erro, setErro] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useContext(AuthContext);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErro('');
		setIsLoading(true);

		try {
			// Validação básica
			if (!formData.email || !formData.senha) {
				setErro('Email e senha são obrigatórios');
				setIsLoading(false);
				return;
			}

			// Enviar requisição para a API
			const response = await axios.post('http://localhost:5000/api/auth/login', formData);

			// Salvar token e informações do usuário no contexto
			login(response.data.token, response.data.usuario);

			// Redirecionar com base no papel do usuário
			if (response.data.usuario.role === 'ADMIN') {
				navigate('/dashboard');
			} else {
				navigate('/dashboard');
			}
		} catch (error) {
			console.error('Erro no login:', error);

			if (error.response) {
				// Erro retornado pelo servidor
				setErro(error.response.data.error || 'Credenciais inválidas');
			} else if (error.request) {
				// A requisição foi feita mas não houve resposta
				setErro('Não foi possível conectar ao servidor');
			} else {
				// Algo aconteceu na configuração da requisição
				setErro('Erro ao realizar login');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Entrar
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Acesse sua conta para continuar
					</p>
				</div>

				{erro && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
						<span className="block sm:inline">{erro}</span>
					</div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email" className="sr-only">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Email"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="senha" className="sr-only">Senha</label>
							<input
								id="senha"
								name="senha"
								type="password"
								autoComplete="current-password"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Senha"
								value={formData.senha}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="lembrar"
								name="lembrar"
								type="checkbox"
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label htmlFor="lembrar" className="ml-2 block text-sm text-gray-900">
								Lembrar-me
							</label>
						</div>

						<div className="text-sm">
							<Link to="/esqueceu-senha" className="font-medium text-blue-600 hover:text-blue-500">
								Esqueceu sua senha?
							</Link>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
								} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
						>
							{isLoading ? (
								<>
									<span className="absolute left-0 inset-y-0 flex items-center pl-3">
										<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									</span>
									Entrando...
								</>
							) : (
								'Entrar'
							)}
						</button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Não tem uma conta?{' '}
							<Link to="/dashboard" className="font-medium text-blue-600 hover:text-blue-500">
								Registre-se
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;