import React, { useState } from 'react';

/**
 * Componente para filtrar pedidos por status, data, etc.
 * @param {function} onFilter - Função callback quando filtros são aplicados
 * @param {Object} initialFilters - Estado inicial dos filtros
 */
function PedidoFilter({ onFilter, initialFilters = {} }) {
	const [filters, setFilters] = useState({
		status: initialFilters.status || '',
		dataInicio: initialFilters.dataInicio || '',
		dataFim: initialFilters.dataFim || '',
		busca: initialFilters.busca || '',
		...initialFilters
	});

	// Lista de status para o dropdown
	const statusOptions = [
		{ value: '', label: 'Todos os status' },
		{ value: 'pendente', label: 'Pendente' },
		{ value: 'preparo', label: 'Em preparo' },
		{ value: 'pronto', label: 'Pronto' },
		{ value: 'entregue', label: 'Entregue' },
		{ value: 'cancelado', label: 'Cancelado' }
	];

	// Handler para mudanças nos inputs
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFilters(prev => ({ ...prev, [name]: value }));
	};

	// Handler para submissão do formulário
	const handleSubmit = (e) => {
		e.preventDefault();
		if (onFilter) {
			onFilter(filters);
		}
	};

	// Handler para limpar filtros
	const handleClear = () => {
		const clearedFilters = {
			status: '',
			dataInicio: '',
			dataFim: '',
			busca: ''
		};
		setFilters(clearedFilters);
		if (onFilter) {
			onFilter(clearedFilters);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-4 mb-6">
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* Busca por número/cliente */}
					<div>
						<label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-1">
							Busca
						</label>
						<input
							type="text"
							id="busca"
							name="busca"
							value={filters.busca}
							onChange={handleChange}
							placeholder="Número ou cliente"
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Filtro por status */}
					<div>
						<label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
							Status
						</label>
						<select
							id="status"
							name="status"
							value={filters.status}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{statusOptions.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					{/* Data início */}
					<div>
						<label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
							Data Início
						</label>
						<input
							type="date"
							id="dataInicio"
							name="dataInicio"
							value={filters.dataInicio}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Data fim */}
					<div>
						<label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
							Data Fim
						</label>
						<input
							type="date"
							id="dataFim"
							name="dataFim"
							value={filters.dataFim}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				{/* Botões de ação */}
				<div className="flex justify-end mt-4 space-x-2">
					<button
						type="button"
						onClick={handleClear}
						className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
					>
						Limpar
					</button>
					<button
						type="submit"
						className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
					>
						Aplicar Filtros
					</button>
				</div>
			</form>
		</div>
	);
}

export default PedidoFilter;