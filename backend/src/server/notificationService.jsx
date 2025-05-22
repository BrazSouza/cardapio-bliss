/**
 * Serviço para gerenciar notificações em tempo real via Socket.IO
 */

/**
 * Envia notificação sobre novo pedido para administradores
 * @param {Object} io - Instância do Socket.IO
 * @param {Object} pedido - Dados do pedido criado
 */
const enviarNotificacaoNovoPedido = (io, pedido) => {
	io.emit('novo_pedido', {
		id: pedido.id,
		numero: pedido.numero,
		cliente: pedido.cliente?.nome || 'Cliente não identificado',
		valor: calcularTotalPedido(pedido),
		horario: new Date().toISOString(),
		mensagem: `Novo pedido #${pedido.numero} recebido`
	});
};

/**
 * Envia notificação sobre atualização de status de pedido
 * @param {Object} io - Instância do Socket.IO
 * @param {Object} pedido - Dados do pedido atualizado
 */
const enviarNotificacaoStatusPedido = (io, pedido) => {
	// Emite para o admin
	io.emit('pedido_atualizado', {
		id: pedido.id,
		numero: pedido.numero,
		status: pedido.status,
		mensagem: `Pedido #${pedido.numero} atualizado para ${pedido.status}`
	});

	// Se houver um clienteId específico, notificar apenas esse cliente
	if (pedido.clienteId) {
		io.emit(`pedido_cliente_${pedido.clienteId}`, {
			id: pedido.id,
			numero: pedido.numero,
			status: pedido.status,
			mensagem: `Seu pedido #${pedido.numero} foi atualizado para ${traduzirStatus(pedido.status)}`
		});
	}
};

/**
 * Calcula o valor total de um pedido
 * @param {Object} pedido - Dados do pedido
 * @returns {Number} - Valor total calculado
 */
const calcularTotalPedido = (pedido) => {
	if (!pedido.itens || !Array.isArray(pedido.itens)) return 0;

	return pedido.itens.reduce((total, item) => {
		return total + (item.quantidade * item.precoUnitario);
	}, 0);
};

/**
 * Traduz status para uma versão mais amigável ao usuário
 * @param {String} status - Status do pedido
 * @returns {String} - Status traduzido
 */
const traduzirStatus = (status) => {
	const traducoes = {
		'pendente': 'Pendente',
		'preparo': 'Em preparo',
		'pronto': 'Pronto para retirada',
		'entregue': 'Entregue',
		'cancelado': 'Cancelado'
	};

	return traducoes[status] || status;
};

module.exports = {
	enviarNotificacaoNovoPedido,
	enviarNotificacaoStatusPedido
};