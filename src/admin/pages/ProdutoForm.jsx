import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProdutoForm() {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditMode = !!id;

	const [formData, setFormData] = useState({
		nome: '',
		descricao: '',
		preco: '',
		categoriaId: '',
		imagem: '',
		ativo: true
	});

	const [categorias, setCategorias] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState(null);
	const [preview, setPreview] = useState('');
	const [imageFile, setImageFile] = useState(null);

	// Buscar categorias e, se for edição, dados do produto
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Buscar categorias
				const categoriasRes = await axios.get('/api/admin/categorias');
				setCategorias(categoriasRes.data);

				// Se for modo de edição, buscar dados do produto
				if (isEditMode) {
					const produtoRes = await axios.get(`/api/admin/produtos/${id}`);
					const produto = produtoRes.data;

					setFormData({
						nome: produto.nome || '',
						descricao: produto.descricao || '',
						preco: produto.preco?.toString() || '',
						categoriaId: produto.categoriaId || '',
						imagem: produto.imagem || '',
						ativo: produto.ativo === undefined ? true : produto.ativo
					});

					if (produto.imagem) {
						setPreview(produto.imagem);
					}
				}
			} catch (err) {
				console.error('Erro ao carregar dados:', err);
				setError('Não foi possível carregar os dados necessários. Por favor, tente novamente.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, isEditMode]);

	// Handler para mudanças nos campos do formulário
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	// Handler para mudança da imagem
	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setImageFile(file);

			// Criar preview da imagem
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// Remover imagem
	const handleRemoveImage = () => {
		setImageFile(null);
		setPreview('');
		setFormData(prev => ({ ...prev, imagem: '' }));
	};

	// Enviar formulário
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setIsSaving(true);
			setError(null);

			let imageUrl = formData.imagem;

			// Se houver uma nova imagem, fazer upload primeiro
			if (imageFile) {
				const formDataUpload = new FormData();
				formDataUpload.append('imagem', imageFile);

				const uploadRes = await axios.post('/api/admin/upload', formDataUpload);
				imageUrl = uploadRes.data.url;
			}

			// Preparar dados
			const produtoData = {
				...formData,
				preco: parseFloat(formData.preco),
				imagem: imageUrl
			};

			// Salvar produto (criar ou atualizar)
			if (isEditMode) {
				await axios.put(`/api/admin/produtos/${id}`, produtoData);
			} else {
				await axios.post('/api/admin/produtos', produtoData);
			}

			// Redirecionar para a lista de produtos
			navigate('/admin/produtos');
		} catch (err) {
			console.error('Erro ao salvar produto:', err);
			setError('Erro ao salvar produto. Por favor, verifique os dados e tente novamente.');
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-2xl font-bold">
					{isEditMode ? 'Editar Produto' : 'Novo Produto'}
				</h2>
			</div>

			{error && (
				<div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
					{error}
				</div>
			)}

			<div className="bg-white rounded-lg shadow-md p-6">
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Coluna 1 */}
						<div className="space-y-6">
							{/* Nome */}
							<div>
								<label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
									Nome do Produto*
								</label>
								<input
									type="text"
									id="nome"
									name="nome"
									value={formData.nome}
									onChange={handleChange}
									required
									className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Descrição */}
							<div>
								<label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
									Descrição
								</label>
								<textarea
									id="descricao"
									name="descricao"
									value={formData.descricao}
									onChange={handleChange}
									rows="4"
									className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								></textarea>
							</div>

							{/* Preço */}
							<div>
								<label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
									Preço (R$)*
								</label>
								<input
									type="number"
									id="preco"
									name="preco"
									value={formData.preco}
									onChange={handleChange}
									step="0.01"
									min="0"
									required
									className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Categoria */}
							<div>
								<label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700 mb-1">
									Categoria*
								</label>
								<select
									id="categoriaId"
									name="categoriaId"
									value={formData.categoriaId}
									onChange={handleChange}
									required
									className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="">Selecione uma categoria</option>
									{categorias.map(categoria => (
										<option key={categoria.id} value={categoria.id}>
											{categoria.nome}
										</option>
									))}
								</select>
							</div>

							{/* Status */}
							<div className="flex items-center">
								<input
									type="checkbox"
									id="ativo"
									name="ativo"
									checked={formData.ativo}
									onChange={handleChange}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
									Produto ativo (disponível para pedidos)
								</label>
							</div>
						</div>

						{/* Coluna 2 - Imagem */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Imagem do Produto
							</label>

							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
								{preview ? (
									<div className="text-center">
										<img
											src={preview}
											alt="Preview"
											className="mx-auto h-32 w-32 object-cover rounded-md"
										/>
										<button
											type="button"
											onClick={handleRemoveImage}
											className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
										>
											Remover imagem
										</button>
									</div>
								) : (
									<div className="space-y-1 text-center">
										<svg
											className="mx-auto h-12 w-12 text-gray-400"
											stroke="currentColor"
											fill="none"
											viewBox="0 0 48 48"
											aria-hidden="true"
										>
											<path
												d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<div className="flex text-sm text-gray-600">
											<label
												htmlFor="image-upload"
												className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
											>
												<span>Fazer upload de imagem</span>
												<input
													id="image-upload"
													name="image-upload"
													type="file"
													accept="image/*"
													onChange={handleImageChange}
													className="sr-only"
												/>
											</label>
											<p className="pl-1">ou arraste e solte</p>
										</div>
										<p className="text-xs text-gray-500">
											PNG, JPG, GIF até 2MB
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Botões */}
					<div className="mt-8 flex justify-end space-x-3">
						<button
							type="button"
							onClick={() => navigate('/admin/produtos')}
							className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isSaving}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
						>
							{isSaving && (
								<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
							)}
							{isEditMode ? 'Atualizar Produto' : 'Salvar Produto'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ProdutoForm;