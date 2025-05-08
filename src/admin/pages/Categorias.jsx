import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Categorias() {
	const [categorias, setCategorias] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Estado para categoria em edição/criação
	const [categoriaAtual, setCategoriaAtual] = useState({ id: null, nome: '', ativa: true });
	const [isEdicao, setIsEdicao] = useState(false);
	const [isSalvando, setIsSalvando] = useState(false);

	// Buscar categorias
	const fetchCategorias = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get('/api/admin/categorias');
			setCategorias(response.data);
		} catch (err) {
			console.error('Erro ao buscar categorias:', err);
			setError('Não foi possível carregar as categorias.');
		} finally {
			setIsLoading(false);
		}
	};

	// Efeito inicial para carregar categorias
	useEffect(() => {
		fetchCategorias();
	}, []);

	// Handler para editar categoria
	const handleEditar = (categoria) => {
		setCategoriaAtual(categoria);
		setIsEdicao(true);
	};

	// Handler para criar nova categoria
	const handleNovo = () => {
		setCategoriaAtual({ id: null, nome: '', ativa: true });
		setIsEdicao(true);
	};

	// Handler para cancelar edição
	const handleCancelar = () => {
		setCategoriaAtual({ id: null, nome: '', ativa: true });
		setIsEdicao(false);
	};

	// Handler para alteração de inputs
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setCategoriaAtual(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	// Handler para salvar categoria
	const handleSalvar = async () => {
		try {
			// Validação simples
			if (!categoriaAtual.nome.trim()) {
				alert('O nome da categoria é obrigatório.');
				return;
			}

			setIsSalvando(true);

			if (categoriaAtual.id) {
				// Atualizar categoria existente
				await axios.put(`/api/admin/categorias/${categoriaAtual.id}`, categoriaAtual);
			} else {
				// Criar nova categoria
				await axios.post('/api/admin/categorias', categoriaAtual);
			}

			// Resetar estado e recarregar categorias
			setCategoriaAtual({ id: null, nome: '', ativa: true });
			setIsEdicao(false);
			fetchCategorias();
		} catch (err) {
			console.error('Erro ao salvar categoria:', err);
			alert('Não foi possível salvar a categoria. Tente novamente.');
		} finally {
			setIsSalvando(false);
		}
	};

	// Handler para alternar status da categoria
	const handleToggleStatus = async (categoria) => {
		try {
			await axios.patch(`/api/admin/categorias/${categoria.id}/status`, {
				ativa: !categoria.ativa
			});

			// Atualizar lista local
			setCategorias(categorias.map(cat =>
				cat.id === categoria.id ? { ...cat, ativa: !cat.ativa } : cat
			));
		} catch (err) {
			console.error('Erro ao alterar status da categoria:', err);
			alert('Não foi possível alterar o status da categoria.');
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
				{!isEdicao && (
					<button
						onClick={handleNovo}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						<span className="material-icons text-sm mr-1">add</span>
						Nova Categoria
					</button>
				)}
			</div>

			{/* Formulário de edição/criação */}
			{isEdicao && (
				<div className="bg-white rounded-lg shadow-md p-6 mb-6">
					<h3 className="text-lg font-semibold mb-4">
						{categoriaAtual.id ? 'Editar Categoria' : 'Nova Categoria'}
					</h3>

					<div className="space-y-4">
						<div>
							<label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
								Nome da Categoria
							</label>
							<input
								type="text"
								id="nome"
								name="nome"
								value={categoriaAtual.nome}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Digite o nome da categoria"
							/>
						</div>

						<div className="flex items-center">
							<input
								type="checkbox"
								id="ativa"
								name="ativa"
								checked={categoriaAtual.ativa}
								onChange={handleChange}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label htmlFor="ativa" className="ml-2 block text-sm text-gray-700">
								Categoria ativa
							</label>
						</div>

						<div className="flex justify-end space-x-2 pt-3">
							<button
								onClick={handleCancelar}
								className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
							>
								Cancelar
							</button>
							<button
								onClick={handleSalvar}
								disabled={isSalvando}
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
							>
								{isSalvando ? 'Salvando...' : 'Salvar'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Estado de carregamento */}
			{isLoading && (
				<div className="text-center py-8">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p className="mt-2 text-gray-500">Carregando categorias...</p>
				</div>
			)}

			{/* Mensagem de erro */}
			{error && (
				<div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
					{error}
				</div>
			)}

			{/* Lista de categorias */}
			{!isLoading && !error && (
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					{categorias.length === 0 ? (
						<div className="p-6 text-center">
							<p className="text-gray-500">Nenhuma categoria cadastrada.</p>
						</div>
					) : (
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Nome
									</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Produtos
									</th>
									<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Ações
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{categorias.map((categoria) => (
									<tr key={categoria.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="font-medium text-gray-900">{categoria.nome}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${categoria.ativa
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'
													}`}
											>
												{categoria.ativa ? 'Ativa' : 'Inativa'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{categoria.qtdProdutos || 0}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<button
												onClick={() => handleEditar(categoria)}
												className="text-blue-600 hover:text-blue-900 mr-3"
												title="Editar"
											>
												<span className="material-icons">edit</span>
											</button>
											<button
												onClick={() => handleToggleStatus(categoria)}
												className={`${categoria.ativa ? 'text-gray-600' : 'text-green-600'
													} hover:opacity-75`}
												title={categoria.ativa ? 'Desativar' : 'Ativar'}
											>
												<span className="material-icons">
													{categoria.ativa ? 'visibility_off' : 'visibility'}
												</span>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			)}
		</div>
	);
}

export default Categorias;