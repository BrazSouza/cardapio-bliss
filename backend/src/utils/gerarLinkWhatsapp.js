
const gerarLinkWhatsapp = (numero, pedido, usuario) => {
	const nomeCliente = usuario.nome || 'Cliente';
	let mensagem = `📦 *Novo Pedido de ${nomeCliente}*\n\n`;

	pedido.itens.forEach((item, index) => {
		mensagem += `*${index + 1}.* ${item.produto.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
	});

	mensagem += `\n🧾 *Total:* R$ ${pedido.total.toFixed(2)}`;
	mensagem += `\n📍 Status: ${pedido.status}`;
	mensagem += `\n\nMensagem gerada pelo sistema.`;

	return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
};

module.exports = gerarLinkWhatsapp;
