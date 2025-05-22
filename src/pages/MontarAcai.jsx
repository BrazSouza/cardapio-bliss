// pages/MontarAcai.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../../src/admin/contexts/CartContext';
import api from '../utils/api';

const MontarAcai = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { adicionarAoCarrinho } = useContext(CartContext);

	const [produto, setProduto] = useState(null);
	const [opcoesSelecionadas, setOpcoesSelecionadas] = useState({});
	const [adicionaisSelecionados, setAdicionaisSelecionados] = useState({});
	const [quantidade, setQuantidade] = useState(1);
	const [observacoes, setObservacoes] = useState('');
	const [carregando, setCarregando] = useState(true);

	useEffect(() => {
		const carregarProduto = async () => {
			try {
				const resposta = await api.get(`/produtos/${id}`);
				setProduto(resposta.data);

				// Inicializar opções
				const opcoesIniciais = {};
				resposta.data.opcoesProduto.forEach(opcao => {
					if (opcao.obrigatorio && opcao.opcoes.length > 0) {
						opcoesIniciais[opcao.id] = opcao.opcoes[0];
					} else {
						opcoesIniciais[opcao.id] = null;
					}
				});
				setOpcoesSelecionadas(opcoesIniciais);

				setCarregando(false);
			} catch (erro) {
				console.error('Erro ao carregar produto:', erro);
				setCarregando(false);
			}
		};

		carregarProduto();
	}, [id]);

	const handleOpcaoChange = (opcaoId, valor) => {
		setOpcoesSelecionadas(prev => ({
			...prev,
			[opcaoId]: valor
		}));
	};

	const handleAdicionalChange = (adicionalId, isChecked) => {
		setAdicionaisSelecionados(prev => {
			const novoState = { ...prev };
			if (isChecked) {
				novoState[adicionalId] = {
					id: adicionalId,
					quantidade: 1
				};
			} else {
				delete novoState[adicionalId];
			}
			return novoState;
		});
	};

	const handleAdicionalQuantidade = (adicionalId, quantidade) => {
		if (quantidade < 1) return;

		setAdicionaisSelecionados(prev => ({
			...prev,
			[adicionalId]: {
				...prev[adicionalId],
				quantidade
			}
		}));
	};

	const calcularTotal = () => {
		if (!produto) return 0;

		let total = produto.preco * quantidade;

		// Adicionar valor dos adicionais
		Object.values(adicionaisSelecionados).forEach(adicional => {
			const adicionalProduto = produto.adicionaisProduto.find(a => a.id === adicional.id);
			if (adicionalProduto) {
				total += adicionalProduto.preco * adicional.quantidade;
			}
		});

		return total;
	};

	const handleAdicionarAoCarrinho = () => {
		// Verificar se todas as opções obrigatórias foram selecionadas
		const opcoesObrigatorias = produto.opcoesProduto.filter(op => op.obrigatorio);
		const todasOpcoesObrigatoriasPreenchidas = opcoesObrigatorias.every(
			op => opcoesSelecionadas[op.id]
		);

		if (!todasOpcoesObrigatoriasPreenchidas) {
			alert('Por favor, preencha todas as opções obrigatórias');
			return;
		}

		// Formatar opções selecionadas para salvar no carrinho
		const opcoesFormatadas = Object.entries(opcoesSelecionadas)
			.filter(([_, valor]) => valor !== null)
			.map(([id, valor]) => {
				const opcao = produto.opcoesProduto.find(op => op.id === parseInt(id));
				return {
					id: parseInt(id),
					nome: opcao.nome,
					valorSelecionado: valor
				};
			});

		// Formatar adicionais selecionados
		const adicionaisFormatados = Object.values(adicionaisSelecionados).map(adicional => {
			const adicionalProduto = produto.adicionaisProduto.find(a => a.id === adicional.id);
			return {
				id: adicional.id,
				nome: adicionalProduto.nome,
				preco: adicionalProduto.preco,
				quantidade: adicional.quantidade
			};
		});

		// Adicionar ao carrinho
		adicionarAoCarrinho({
			produto,
			quantidade,
			opcoesSelecionadas: opcoesFormatadas,
			adicionaisSelecionados: adicionaisFormatados,
			observacoes,
			precoTotal: calcularTotal()
		});

		navigate('/carrinho');
	};

	if (carregando) {
		return <div className="container mt-5">Carregando...</div>;
	}

	if (!produto) {
		return <div className="container mt-5">Produto não encontrado</div>;
	}

	return (
		<div className="container mt-4">
			<h2>Monte seu {produto.nome}</h2>

			<div className="card mb-4">
				<div className="card-body">
					<div className="row">
						<div className="col-md-4">
							{produto.imagemUrl && (
								<img
									src={produto.imagemUrl}
									alt={produto.nome}
									className="img-fluid rounded"
								/>
							)}
						</div>
						<div className="col-md-8">
							<h3>{produto.nome}</h3>
							<p>{produto.descricao}</p>
							<p className="fs-5">Preço: R$ {produto.preco.toFixed(2)}</p>

							<div className="mb-3">
								<label>Quantidade:</label>
								<div className="input-group" style={{ maxWidth: '150px' }}>
									<button
										className="btn btn-outline-secondary"
										type="button"
										onClick={() => quantidade > 1 && setQuantidade(quantidade - 1)}
									>
										-
									</button>
									<input
										type="number"
										className="form-control text-center"
										value={quantidade}
										onChange={(e) => {
											const val = parseInt(e.target.value);
											if (val > 0) setQuantidade(val);
										}}
										min="1"
									/>
									<button
										className="btn btn-outline-secondary"
										type="button"
										onClick={() => setQuantidade(quantidade + 1)}
									>
										+
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Opções do produto */}
			{produto.opcoesProduto.length > 0 && (
				<div className="card mb-4">
					<div className="card-header">
						<h4>Opções</h4>
					</div>
					<div className="card-body">
						{produto.opcoesProduto.map(opcao => (
							<div key={opcao.id} className="mb-3">
								<label className="form-label">
									{opcao.nome} {opcao.obrigatorio && <span className="text-danger">*</span>}
								</label>
								<select
									className="form-select"
									value={opcoesSelecionadas[opcao.id] || ''}
									onChange={(e) => handleOpcaoChange(opcao.id, e.target.value)}
									required={opcao.obrigatorio}
								>
									<option value="">Selecione...</option>
									{opcao.opcoes.map((op, idx) => (
										<option key={idx} value={op}>{op}</option>
									))}
								</select>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Adicionais */}
			{produto.adicionaisProduto.length > 0 && (
				<div className="card mb-4">
					<div className="card-header">
						<h4>Adicionais</h4>
					</div>
					<div className="card-body">
						{produto.adicionaisProduto.map(adicional => {
							const isSelected = !!adicionaisSelecionados[adicional.id];
							return (
								<div key={adicional.id} className="mb-3 d-flex align-items-center">
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											id={`adicional-${adicional.id}`}
											checked={isSelected}
											onChange={(e) => handleAdicionalChange(adicional.id, e.target.checked)}
											disabled={!adicional.disponivel}
										/>
										<label className="form-check-label" htmlFor={`adicional-${adicional.id}`}>
											{adicional.nome} - R$ {adicional.preco.toFixed(2)}
										</label>
									</div>

									{isSelected && (
										<div className="ms-auto">
											<div className="input-group" style={{ width: '120px' }}>
												<button
													className="btn btn-sm btn-outline-secondary"
													type="button"
													onClick={() => handleAdicionalQuantidade(
														adicional.id,
														adicionaisSelecionados[adicional.id].quantidade - 1
													)}
												>
													-
												</button>
												<input
													type="number"
													className="form-control form-control-sm text-center"
													value={adicionaisSelecionados[adicional.id].quantidade}
													onChange={(e) => {
														const val = parseInt(e.target.value);
														if (val > 0) handleAdicionalQuantidade(adicional.id, val);
													}}
													min="1"
												/>
												<button
													className="btn btn-sm btn-outline-secondary"
													type="button"
													onClick={() => handleAdicionalQuantidade(
														adicional.id,
														adicionaisSelecionados[adicional.id].quantidade + 1
													)}
												>
													+
												</button>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Observações */}
			<div className="card mb-4">
				<div className="card-header">
					<h4>Observações</h4>
				</div>
				<div className="card-body">
					<textarea
						className="form-control"
						rows="3"
						placeholder="Alguma observação especial para este item? Ex: sem cebola, bem passado, etc."
						value={observacoes}
						onChange={(e) => setObservacoes(e.target.value)}
					></textarea>
				</div>
			</div>

			{/* Total e botões */}
			<div className="card mb-4">
				<div className="card-body">
					<div className="d-flex justify-content-between align-items-center">
						<h3>Total: R$ {calcularTotal().toFixed(2)}</h3>
						<button
							className="btn btn-primary btn-lg"
							onClick={handleAdicionarAoCarrinho}
						>
							Adicionar ao Carrinho
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MontarAcai;