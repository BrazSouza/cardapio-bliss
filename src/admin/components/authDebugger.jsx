import React, { useState } from 'react';
import axios from 'axios';

/**
 * Componente para depurar problemas de autenticação
 * Deve ser colocado em: src/components/admin/AuthDebugger.jsx
 */
function AuthDebugger() {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [resposta, setResposta] = useState(null);
	const [erro, setErro] = useState(null);
	const [loading, setLoading] = useState(false);

	// Função para testar a autenticação
	const testarAutenticacao = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErro(null);
		setResposta(null);

		try {
			const response = await axios.post('/api/auth/login', { email, senha });
			setResposta({
				status: response.status,
				data: response.data,
				headers: response.headers
			});
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('user', JSON.stringify(response.data.user));
		} catch (error) {
			console.error('Erro na autenticação:', error);
			setErro({
				message: error.response?.data?.message || error.message,
				status: error.response?.status,
				data: error.response?.data
			});
		} finally {
			setLoading(false);
		}
	};

	// Função para verificar token atual
	const verificarToken = () => {
		const token = localStorage.getItem('token');
		const user = localStorage.getItem('user');

		if (token && user) {
			setResposta({
				tokenExiste: true,
				token: token.substring(0, 20) + '...',
				user: JSON.parse(user)
			});
		} else {
			setErro({
				message: 'Token ou usuário não encontrado no localStorage',
				tokenExiste: false,
				userExiste: !!user
			});
		}
	};

	// Função para limpar tokens
	const limparTokens = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setResposta({ message: 'Tokens removidos com sucesso' });
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto my-10">
			<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Depurador de Autenticação</h2>

			<form onSubmit={testarAutenticacao}>
				<div className="mb-4">
					<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="mb-6">
					<label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
					<input
						type="password"
						id="senha"
						value={senha}
						onChange={(e) => setSenha(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="flex flex-col space-y-3">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
					>
						{loading ? 'Testando...' : 'Testar Login'}
					</button>

					<button
						type="button"
						onClick={verificarToken}
						className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
					>
						Verificar Token Atual
					</button>

					<button
						type="button"
						onClick={limparTokens}
						className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
					>
						Limpar Tokens
					</button>
				</div>
			</form>

			{erro && (
				<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
					<h3 className="text-red-800 font-semibold mb-2">Erro:</h3>
					<pre className="text-xs overflow-auto bg-red-100 p-2 rounded">
						{JSON.stringify(erro, null, 2)}
					</pre>
				</div>
			)}

			{resposta && (
				<div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
					<h3 className="text-green-800 font-semibold mb-2">Resposta:</h3>
					<pre className="text-xs overflow-auto bg-green-100 p-2 rounded">
						{JSON.stringify(resposta, null, 2)}
					</pre>
				</div>
			)}

			<div className="mt-6 text-sm text-gray-500">
				<p>Dicas de depuração:</p>
				<ul className="list-disc ml-5 mt-2">
					<li>Verifique se o backend está rodando</li>
					<li>Confira se a URL da API está correta</li>
					<li>Confirme se as credenciais estão corretas</li>
					<li>Verifique o formato da resposta do servidor</li>
				</ul>
			</div>
		</div>
	);
}

export default AuthDebugger;