import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfileEditPage = () => {
	const navigate = useNavigate();
	const { currentUser, atualizarUsuarioAtual } = useAuth();

	// Estado simplificado para armazenar os dados do usuário
	const [usuario, setUsuario] = useState({
		id: '',
		nome: '',
		telefone: '',
		bairro: '',
		rua: '',
		cidade: '',
		numero: '',
		complemento: ''
	});

	// Estados para feedback ao usuário
	const [loading, setLoading] = useState(true);
	const [salvando, setSalvando] = useState(false);
	const [mensagem, setMensagem] = useState(null);
	const [erro, setErro] = useState(null);

	// Função para carregar os dados do usuário atual
	useEffect(() => {
		if (currentUser) {
			// Se temos o usuário no contexto, usar esses dados
			setUsuario({
				id: currentUser.id || '',
				nome: currentUser.nome || '',
				telefone: currentUser.telefone || '',
				bairro: currentUser.bairro || '',
				rua: currentUser.rua || '',
				cidade: currentUser.cidade || '',
				numero: currentUser.numero || '',
				complemento: currentUser.complemento || ''
			});
			setLoading(false);
		} else {
			setErro('Usuário não encontrado. Faça login novamente.');
			setLoading(false);
		}
	}, [currentUser]);

	// Função para atualizar o estado quando um campo é alterado
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUsuario(prev => ({
			...prev,
			[name]: value
		}));
	};

	// Função para formatar o telefone durante a digitação
	const handleTelefoneChange = (e) => {
		let value = e.target.value.replace(/\D/g, '');

		if (value.length <= 11) {
			// Formatação: (XX) XXXXX-XXXX
			let telefoneFormatado = value;

			if (value.length > 2) {
				telefoneFormatado = `(${value.slice(0, 2)}) ${value.slice(2)}`;
			}

			if (value.length > 7) {
				telefoneFormatado = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
			}

			setUsuario(prev => ({
				...prev,
				telefone: telefoneFormatado
			}));
		}
	};

	// Função para salvar as alterações
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setSalvando(true);
			setErro(null);
			setMensagem(null);

			// Preparar os dados para envio (limpando a formatação do telefone)
			const dadosAtualizados = {
				nome: usuario.nome,
				telefone: usuario.telefone.replace(/\D/g, ''),
				bairro: usuario.bairro,
				rua: usuario.rua,
				cidade: usuario.cidade,
				numero: usuario.numero,
				complemento: usuario.complemento || ''
			};

			await axios.put(`/api/usuarios/${usuario.id}`, dadosAtualizados);

			// Atualizar os dados no contexto após salvar
			await atualizarUsuarioAtual();

			setMensagem('Dados atualizados com sucesso!');

			// Redirecionar para a página de perfil após 1.5 segundos
			setTimeout(() => {
				navigate('/perfil');
			}, 1500);
		} catch (error) {
			console.error('Erro ao atualizar dados:', error);
			setErro(
				error.response?.data?.mensagem ||
				'Não foi possível atualizar seus dados. Verifique as informações e tente novamente.'
			);
		} finally {
			setSalvando(false);
		}
	};

	// Função para cancelar e voltar para a página de perfil
	const handleCancelar = () => {
		navigate('/perfil');
	};

	if (loading) {
		return <div className="loading-container">Carregando...</div>;
	}

	return (
		<div className="profile-edit-container">
			<h1>Editar Meu Perfil</h1>

			{erro && <div className="mensagem-erro">{erro}</div>}
			{mensagem && <div className="mensagem-sucesso">{mensagem}</div>}

			<form onSubmit={handleSubmit}>
				<section className="secao-dados">
					<h2>Informações Pessoais</h2>

					<div className="campo-formulario">
						<label htmlFor="nome">Nome completo *</label>
						<input
							type="text"
							id="nome"
							name="nome"
							value={usuario.nome}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="campo-formulario">
						<label htmlFor="telefone">Telefone *</label>
						<input
							type="text"
							id="telefone"
							name="telefone"
							value={usuario.telefone}
							onChange={handleTelefoneChange}
							placeholder="(00) 00000-0000"
							required
						/>
					</div>
				</section>

				<section className="secao-dados">
					<h2>Endereço</h2>

					<div className="linha-formulario">
						<div className="campo-formulario">
							<label htmlFor="bairro">Bairro *</label>
							<input
								type="text"
								id="bairro"
								name="bairro"
								value={usuario.bairro}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="campo-formulario">
							<label htmlFor="cidade">Cidade *</label>
							<input
								type="text"
								id="cidade"
								name="cidade"
								value={usuario.cidade}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					<div className="campo-formulario">
						<label htmlFor="rua">Rua *</label>
						<input
							type="text"
							id="rua"
							name="rua"
							value={usuario.rua}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="linha-formulario">
						<div className="campo-formulario">
							<label htmlFor="numero">Número *</label>
							<input
								type="text"
								id="numero"
								name="numero"
								value={usuario.numero}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="campo-formulario">
							<label htmlFor="complemento">Complemento</label>
							<input
								type="text"
								id="complemento"
								name="complemento"
								value={usuario.complemento || ''}
								onChange={handleChange}
							/>
						</div>
					</div>
				</section>

				<div className="botoes-acao">
					<button
						type="button"
						className="botao-cancelar"
						onClick={handleCancelar}
					>
						Cancelar
					</button>
					<button
						type="submit"
						className="botao-salvar"
						disabled={salvando}
					>
						{salvando ? 'Salvando...' : 'Salvar'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProfileEditPage;