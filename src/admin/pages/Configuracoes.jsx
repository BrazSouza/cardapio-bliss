import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Configuracoes() {
	// Estado para informações do restaurante
	const [restaurante, setRestaurante] = useState({
		nome: '',
		descricao: '',
		telefone: '',
		endereco: '',
		horarioFuncionamento: '',
		logoUrl: ''
	});

	// Estado para configurações do aplicativo
	const [appConfig, setAppConfig] = useState({
		aceitaPedidos: true,
		tempoEstimadoEntrega: 30,
		taxaEntrega: 0,
		pedidoMinimo: 0
	});

	// Estados para gerenciar o formulário
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState({ type: '', text: '' });

	// Buscar configurações
	useEffect(() => {
		const fetchConfiguracoes = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get('/api/admin/configuracoes');

				// Atualizar estados com dados do servidor
				if (response.data.restaurante) {
					setRestaurante(response.data.restaurante);
				}

				if (response.data.appConfig) {
					setAppConfig(response.data.appConfig);
				}
			} catch (error) {
				console.error('Erro ao carregar configurações:', error);
				setMessage({
					type: 'error',
					text: 'Não foi possível carregar as configurações. Por favor, tente novamente.'
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchConfiguracoes();
	}, []);

	// Handler para alterações nos campos de restaurante
	const handleRestauranteChange = (e) => {
		const { name, value } = e.target;
		setRestaurante(prev => ({
			...prev,
			[name]: value
		}));
	};

	// Handler para alterações nos campos de config do app
	const handleAppConfigChange = (e) => {
		const { name, value, type, checked } = e.target;

		setAppConfig(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	// Handler para salvar configurações
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setIsSaving(true);
			setMessage({ type: '', text: '' }); // Limpa mensagens anteriores

			await axios.post('/api/admin/configuracoes', {
				restaurante,
				appConfig
			});

			setMessage({
				type: 'success',
				text: 'Configurações salvas com sucesso!'
			});
		} catch (error) {
			console.error('Erro ao salvar configurações:', error);
			setMessage({
				type: 'error',
				text: 'Erro ao salvar configurações. Por favor, tente novamente.'
			});
		} finally {
			setIsSaving(false);
		}
	};

	// Estado de carregamento
	if (isLoading) {
		return (
			<div className="text-center py-16">
				<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p className="mt-2 text-gray-500">Carregando configurações...</p>
			</div>
		);
	}

	return (
		<div className="pb-8">
			<h2 className="text-2xl font-bold mb-6">Configurações</h2>

			{/* Mensagem de sucesso/erro */}
			{message.text && (
				<div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
					}`}>
					{message.text}
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Configurações do Restaurante */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold mb-4">Informações do Restaurante</h3>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Nome do Restaurante
								</label>
								<input
									type="text"
									name="nome"
									value={restaurante.nome}
									onChange={handleRestauranteChange}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Descrição
								</label>
								<textarea
									name="descricao"
									value={restaurante.descricao}
									onChange={handleRestauranteChange}
									rows="3"
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Telefone
								</label>
								<input
									type="text"
									name="telefone"
									value={restaurante.telefone}
									onChange={handleRestauranteChange}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Endereço
								</label>
								<input
									type="text"
									name="endereco"
									value={restaurante.endereco}
									onChange={handleRestauranteChange}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Horário de Funcionamento
								</label>
								<input
									type="text"
									name="horarioFuncionamento"
									value={restaurante.horarioFuncionamento}
									onChange={handleRestauranteChange}
									placeholder="Ex: Seg-Sex: 10h às 22h, Sáb-Dom: 11h às 23h"
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									URL do Logotipo
								</label>
								<input
									type="text"
									name="logoUrl"
									value={restaurante.logoUrl}
									onChange={handleRestauranteChange}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>
						</div>
					</div>

					{/* Configurações do App */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold mb-4">Configurações do Aplicativo</h3>

						<div className="space-y-4">
							<div className="flex items-center">
								<input
									type="checkbox"
									id="aceitaPedidos"
									name="aceitaPedidos"
									checked={appConfig.aceitaPedidos}
									onChange={handleAppConfigChange}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
								/>
								<label htmlFor="aceitaPedidos" className="ml-2 block text-sm text-gray-700">
									Aceitar Novos Pedidos
								</label>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Tempo Estimado de Entrega (minutos)
								</label>
								<input
									type="number"
									name="tempoEstimadoEntrega"
									value={appConfig.tempoEstimadoEntrega}
									onChange={handleAppConfigChange}
									min="0"
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Taxa de Entrega (R$)
								</label>
								<input
									type="number"
									name="taxaEntrega"
									value={appConfig.taxaEntrega}
									onChange={handleAppConfigChange}
									min="0"
									step="0.01"
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Valor Mínimo do Pedido (R$)
								</label>
								<input
									type="number"
									name="pedidoMinimo"
									value={appConfig.pedidoMinimo}
									onChange={handleAppConfigChange}
									min="0"
									step="0.01"
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Botões de ação */}
				<div className="flex justify-end mt-6">
					<button
						type="submit"
						disabled={isSaving}
						className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''
							}`}
					>
						{isSaving ? 'Salvando...' : 'Salvar Configurações'}
					</button>
				</div>
			</form>
		</div>
	);
}

export default Configuracoes;