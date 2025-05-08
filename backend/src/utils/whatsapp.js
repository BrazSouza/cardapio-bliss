// utils/whatsapp.js
const formatWhatsAppMessage = (pedido, usuario) => {
	// Cabeçalho da mensagem
	let message = `🛒 *NOVO PEDIDO #${pedido.id}*\n`;
	message += `👤 *Cliente:* ${usuario.nome}\n`;
	message += `📞 *Telefone:* ${usuario.telefone || 'Não informado'}\n\n`;

	// Itens do pedido
	message += `*ITENS DO PEDIDO:*\n`;
	pedido.itens.forEach(item => {
		message += `• ${item.quantidade}x ${item.produto.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
		// Adiciona observações se houver
		if (item.observacoes) {
			message += `   _Obs: ${item.observacoes}_\n`;
		}
	});

	// Total e informações adicionais
	message += `\n💰 *TOTAL: R$ ${pedido.total.toFixed(2)}*\n`;

	// Método de pagamento
	if (pedido.metodoPagamento) {
		message += `💳 *Pagamento:* ${pedido.metodoPagamento}\n`;
		if (pedido.changeNeeded) {
			message += `🔄 *Troco para:* R$ ${pedido.changeNeeded.toFixed(2)}\n`;
		}
	}

	// Endereço de entrega se for delivery
	if (pedido.endereco) {
		message += `\n📍 *ENDEREÇO DE ENTREGA:*\n`;
		message += `${pedido.endereco.rua}, ${pedido.endereco.numero}\n`;
		if (pedido.endereco.complemento) {
			message += `${pedido.endereco.complemento}\n`;
		}
		message += `${pedido.endereco.bairro}, ${pedido.endereco.cidade}\n`;
		message += `CEP: ${pedido.endereco.cep}\n`;
	}

	// Observações gerais do pedido
	if (pedido.observacoes) {
		message += `\n📝 *OBSERVAÇÕES:*\n${pedido.observacoes}\n`;
	}

	return encodeURIComponent(message);
};

// Gera o link para WhatsApp
const generateWhatsAppLink = (phoneNumber, pedido, usuario) => {
	const message = formatWhatsAppMessage(pedido, usuario);
	return `https://wa.me/${phoneNumber}?text=${message}`;
};

module.exports = {
	formatWhatsAppMessage,
	generateWhatsAppLink
};