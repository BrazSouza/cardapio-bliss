// utils/whatsapp.js
const formatWhatsAppMessage = (order, user) => {
	// Cabeçalho da mensagem
	let message = `🛒 *NOVO PEDIDO #${order.id}*\n`;
	message += `👤 *Cliente:* ${user.name}\n`;
	message += `📞 *Telefone:* ${user.phone || 'Não informado'}\n\n`;

	// Itens do pedido
	message += `*ITENS DO PEDIDO:*\n`;
	order.items.forEach(item => {
		message += `• ${item.quantity}x ${item.product.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
		// Adiciona observações se houver
		if (item.notes) {
			message += `   _Obs: ${item.notes}_\n`;
		}
	});

	// Total e informações adicionais
	message += `\n💰 *TOTAL: R$ ${order.total.toFixed(2)}*\n`;

	// Método de pagamento
	if (order.paymentMethod) {
		message += `💳 *Pagamento:* ${order.paymentMethod}\n`;
		if (order.changeNeeded) {
			message += `🔄 *Troco para:* R$ ${order.changeNeeded.toFixed(2)}\n`;
		}
	}

	// Endereço de entrega se for delivery
	if (order.address) {
		message += `\n📍 *ENDEREÇO DE ENTREGA:*\n`;
		message += `${order.address.street}, ${order.address.number}\n`;
		if (order.address.complement) {
			message += `${order.address.complement}\n`;
		}
		message += `${order.address.neighborhood}, ${order.address.city}\n`;
		message += `CEP: ${order.address.zipcode}\n`;
	}

	// Observações gerais do pedido
	if (order.notes) {
		message += `\n📝 *OBSERVAÇÕES:*\n${order.notes}\n`;
	}

	return encodeURIComponent(message);
};

// Gera o link para WhatsApp
const generateWhatsAppLink = (phoneNumber, order, user) => {
	const message = formatWhatsAppMessage(order, user);
	return `https://wa.me/${phoneNumber}?text=${message}`;
};

module.exports = {
	formatWhatsAppMessage,
	generateWhatsAppLink
};