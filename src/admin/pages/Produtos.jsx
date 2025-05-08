import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Produtos() {
	const [produtos, setProdutos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filtro, setFiltro] = useState('');
	const [categoriaFiltro, setCategoriaFiltro] = useState('');
	const [categorias, setCategorias] = useState([]);

	// Buscar produtos e categorias
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Buscar produtos e categorias em paralelo
				const [produtosRes, categoriasRes] = await Promise.all([
					axios.get('/api/admin/produtos'),
					axios.get('/api/admin/categorias')
				]);

				setProdutos(produtosRes.data);
				setCategorias(categoriasRes.data);
			} catch (err) {
				console.error('Erro ao buscar dados:', err);
				setError('Não foi possível carregar os produtos. Por favor, tente novamente.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Filtrar produtos
	const produtosFiltrados = produtos.filter(produto => {
		const matchNome = produto.nome.toLowerCase().includes(filtro.toLowerCase());
		const matchCategoria = categoriaFiltro ? produto.categoriaId === categoriaFiltro : true;
		return matchNome && matchCategoria;
	});

	// Alternar visibilidade do produto (ativo/inativo)
	const toggleProdutoAtivo = async (id, estadoAtual) => {
		try {
			await axios.patch(`/api/admin/produtos/${id}`, {
				ativo: !estadoAtual
			});

			// Atualizar estado local
			setProdutos(produtos.map(produto =>
				produto.id === id ? { ...produto, ativo: !produto.ativo } : produto
			));
		} catch (err) {
			console.error('Erro ao atualizar status do produto:', err);
			alert('Erro ao atualizar status do produto. Por favor, tente novamente.');
		}
	};

	// Deletar produto
	const handleDeleteProduto = async (id) => {
		if (window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
			try {
				await axios.delete(`/api/admin/produtos/${id}`);

				// Remover do estado local
				setProdutos(produtos.filter(produto => produto.id !== id));
			} catch (err) {
				console.error('Erro ao excluir produto:', err);
				alert('Erro ao excluir produto. Por favor, tente novamente.');
			}
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
				<Link
					to="/admin/produtos/novo"
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
				>
					<span className="material-icons mr-1">add</span>
					Novo Produto
				</Link>
			</div>

			{/* Filtros */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label htmlFor="filtro" className="block text-sm font-medium text-gray-700 mb-1">
							Buscar produto
						</label>
						<input
							type="text"
							id="filtro"
							value={filtro}
							onChange={(e) => setFiltro(e.target.value)}
							placeholder="Nome do produto"
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
							Categoria
						</label>
						<select
							id="categoria"
							value={categoriaFiltro}
							onChange={(e) => setCategoriaFiltro(e.target.value)}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Todas as categorias</option>
							{categorias.map(categoria => (
								<option key={categoria.id} value={categoria.id}>
									{categoria.nome}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Status de carregamento */}
			{isLoading && (
				<div className="text-center py-8">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p className="mt-2 text-gray-500">Carregando produtos...</p>
				</div>
			)}

			{/* Mensagem de erro */}
			{error && (
				<div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
					{error}
				</div>
			)}

			{/* Lista de produtos */}
			{!isLoading && !error && (
				<>
					{produtosFiltrados.length === 0 ? (
						<div className="bg-white rounded-lg shadow-md p-8 text-center">
							<span className="material-icons text-4xl text-gray-400 mb-2">restaurant_menu</span>
							<p className="text-gray-500">Nenhum produto encontrado.</p>
							<p className="text-gray-500 text-sm mt-1">
								Tente ajustar os filtros ou adicione um novo produto.
							</p>
						</div>
					) : (
						<div className="bg-white rounded-lg shadow-md overflow-hidden">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Produto
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Categoria
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Preço
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Ações
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{produtosFiltrados.map((produto) => {
										// Encontrar o nome da categoria
										const categoria = categorias.find(cat => cat.id === produto.categoriaId);

										return (
											<tr key={produto.id}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														{produto.imagem ? (
															<div className="flex-shrink-0 h-10 w-10 mr-3">
																<img
																	className="h-10 w-10 rounded-md object-cover"
																	src={produto.imagem}
																	alt={produto.nome}
																/>
															</div>
														) : (
															<div className="flex-shrink-0 h-10 w-10 mr-3 bg-gray-200 rounded-md flex items-center justify-center">
																<span className="material-icons text-gray-400">restaurant</span>
															</div>
														)}
														<div>
															<div className="text-sm font-medium text-gray-900">
																{produto.nome}
															</div>
															{produto.descricao && (
																<div className="text-sm text-gray-500 truncate max-w-xs">
																	{produto.descricao}
																</div>
															)}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{categoria?.nome || 'Sem categoria'}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													R$ {produto.preco?.toFixed(2) || '0.00'}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${produto.ativo
														? 'bg-green-100 text-green-800'
														: 'bg-gray-100 text-gray-800'
														}`}>
														{produto.ativo ? 'Ativo' : 'Inativo'}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<div className="flex justify-end space-x-2">
														<button
															onClick={() => toggleProdutoAtivo(produto.id, produto.ativo)}
															className={`p-1 rounded-full ${produto.ativo
																? 'text-gray-500 hover:text-gray-700'
																: 'text-green-500 hover:text-green-700'
																}`}
														>
															<span className="material-icons text-sm">
																{produto.ativo ? 'visibility_off' : 'visibility'}
															</span>
														</button>
														<Link
															to={`/admin/produtos/${produto.id}`}
															className="p-1 rounded-full text-blue-500 hover:text-blue-700"
														>
															<span className="material-icons text-sm">edit</span>
														</Link>
														<button
															onClick={() => handleDeleteProduto(produto.id)}
															className="p-1 rounded-full text-red-500 hover:text-red-700"
														>
															<span className="material-icons text-sm">delete</span>
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Produtos;