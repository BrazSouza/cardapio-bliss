import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../admin/contexts/CartContext';
import OrderSummary from '../admin/components/cart/ResumoPedido';

function Checkout() {
	const { cart, getTotalPrice, clearCart } = useContext(CartContext);
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	// Formulário de checkout
	const [formData, setFormData] = useState({
		nome: '',
		telefone: '',
		email: '',
		endereco: '',
		observacoes: '',
		metodoPagamento: 'dinheiro',
		trocoPara: ''
	});

	// Redirecionar para o carrinho se estiver vazio
	useEffect(() => {
		if (cart.length === 0) {
			navigate('/carrinho');
		}
	}, [cart, navigate]);

	// Atualizar campos do formulário
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// Enviar pedido
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setIsSubmitting(true);
			setError(null);

			// Preparar dados do pedido
			const pedidoData = {
				cliente: {
					nome: formData.nome,
					telefone: formData.telefone,
					email: formData.email
				},
				endereco: formData.endereco,
				itens: cart.map(item => ({
					produtoId: item.id,
					quantidade: item.quantidade,
					precoUnitario: item.precoUnitario,
					observacao: item.observacao
				})),
				observacoes: formData.observacoes,
				metodoPagamento: formData.metodoPagamento,
				trocoPara: formData.metodoPagamento === 'dinheiro' ? formData.trocoPara : null,
				total: getTotalPrice()
			};

			// Enviar pedido para a API
			const response = await axios.post('/api/pedidos', pedidoData);

			// Limpar carrinho
			clearCart();

			// Redirecionar para página de confirmação
			navigate(`/pedido-confirmado/${response.data.id}`);

		} catch (err) {
			console.error('Erro ao finalizar pedido:', err);
			setError('Não foi possível finalizar seu pedido. Por favor, tente novamente.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-8">Finalizar Pedido</h1>

			{error && (
				<div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
					{error}
				</div>
			)}

			<div className="lg:grid lg:grid-cols-3 lg:gap-8">
				{/* Formulário de checkout */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg shadow-md p-6">
						<form onSubmit={handleSubmit}>
							{/* Seção de dados pessoais */}
							<div className="mb-6">
								<h2 className="text-lg font-semibold mb-4">Dados Pessoais</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
											Nome completo *
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

									<div>
										<label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
											Telefone *
										</label>
										<input
											type="tel"
											id="telefone"
											name="telefone"
											value={formData.telefone}
											onChange={handleChange}
											required
											placeholder="(XX) XXXXX-XXXX"
											className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>

								<div className="mt-4">
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
										E-mail
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>

							{/* Seção de endereço */}
							<div className="mb-6">
								<h2 className="text-lg font-semibold mb-4">Endereço de Entrega</h2>
								<div>
									<label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">
										Endereço completo *
									</label>
									<textarea
										id="endereco"
										name="endereco"
										value={formData.endereco}
										onChange={handleChange}
										required
										rows="3"
										placeholder="Rua, número, bairro, complemento, CEP"
										className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									></textarea>
								</div>
							</div>

							{/* Seção de pagamento */}
							<div className="mb-6">
								<h2 className="text-lg font-semibold mb-4">Forma de Pagamento</h2>

								<div className="space-y-4">
									<div>
										<label className="flex items-center">
											<input
												type="radio"
												name="metodoPagamento"
												value="dinheiro"
												checked={formData.metodoPagamento === 'dinheiro'}
												onChange={handleChange}
												className="mr-2"
											/>
											<span>Dinheiro</span>
										</label>

										{formData.metodoPagamento === 'dinheiro' && (
											<div className="mt-2 ml-6">
												<label htmlFor="trocoPara" className="block text-sm font-medium text-gray-700 mb-1">
													Troco para
												</label>
												<input
													type="text"
													id="trocoPara"
													name="trocoPara"
													value={formData.trocoPara}
													onChange={handleChange}
													placeholder="R$ 0,00"
													className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
												/>
											</div>
										)}
									</div>

									<div>
										<label className="flex items-center">
											<input
												type="radio"
												name="metodoPagamento"
												value="cartao"
												checked={formData.metodoPagamento === 'cartao'}
												onChange={handleChange}
												className="mr-2"
											/>
											<span>Cartão (pagamento na entrega)</span>
										</label>
									</div>

									<div>
										<label className="flex items-center">
											<input
												type="radio"
												name="metodoPagamento"
												value="pix"
												checked={formData.metodoPagamento === 'pix'}
												onChange={handleChange}
												className="mr-2"
											/>
											<span>PIX</span>
										</label>
									</div>
								</div>
							</div>

							{/* Observações */}
							<div className="mb-6">
								<h2 className="text-lg font-semibold mb-4">Observações</h2>
								<div>
									<textarea
										id="observacoes"
										name="observacoes"
										value={formData.observacoes}
										onChange={handleChange}
										rows="2"
										placeholder="Alguma informação adicional para o restaurante?"
										className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									></textarea>
								</div>
							</div>

							{/* Botões de ação (exibidos apenas em mobile) */}
							<div className="mt-8 lg:hidden">
								<button
									type="submit"
									disabled={isSubmitting}
									className={`w-full py-3 rounded-md font-medium text-white
                    ${isSubmitting
											? 'bg-blue-400 cursor-wait'
											: 'bg-blue-600 hover:bg-blue-700'
										}`}
								>
									{isSubmitting ? (
										<span className="flex items-center justify-center">
											<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
											Processando...
										</span>
									) : 'Finalizar Pedido'}
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* Resumo do pedido (lateral) */}
				<div className="mt-8 lg:mt-0">
					<OrderSummary
						items={cart}
						onCheckout={() => document.querySelector('form').requestSubmit()}
						isLoading={isSubmitting}
					/>

					<div className="mt-4">
						<button
							onClick={() => navigate('/carrinho')}
							className="text-blue-600 hover:text-blue-800 flex items-center"
						>
							<span className="material-icons mr-1">arrow_back</span>
							Voltar para o carrinho
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Checkout;