/**
 * Utilitário para gerar links de WhatsApp e formatar mensagens
 */

// Número do WhatsApp da lanchonete (inclua o código do país)
const LANCHONETE_WHATSAPP = '5599999999999'; // Substitua pelo número real

/**
 * Formata um pedido para envio via WhatsApp
 * @param {Object} pedido - Dados do pedido
 * @param {Array} pedido.itens - Itens do pedido
 * @param {number} pedido.total - Valor total do pedido
 * @param {Object} usuario - Dados do usuário
 * @returns {string} - Mensagem formatada para envio
 */
export const formatarPedidoWhatsapp = (pedido, usuario) => {
	if (!pedido || !pedido.itens || !pedido.itens.length) {
		throw new Error('Nenhum item no carrinho');
	}

	if (!usuario || !usuario.nome || !usuario.endereco || !usuario.telefone) {
		throw new Error('Informações do usuário incompletas');
	}

	let mensagem = '🍔 *NOVO PEDIDO* 🍔\n\n';

	// Informações do cliente
	mensagem += '*DADOS DO CLIENTE*\n';
	mensagem += `👤 *Nome*: ${usuario.nome}\n`;
	mensagem += `📞 *Telefone*: ${usuario.telefone}\n`;
	mensagem += `📍 *Endereço*: ${usuario.endereco}\n`;

	if (usuario.complemento) {
		mensagem += `🏠 *Complemento*: ${usuario.complemento}\n`;
	}

	if (usuario.referencia) {
		mensagem += `🔍 *Referência*: ${usuario.referencia}\n`;
	}

	mensagem += '\n*ITENS DO PEDIDO*\n';

	// Lista de itens
	pedido.itens.forEach((item, index) => {
		mensagem += `\n*${index + 1}. ${item.nome}* - ${item.quantidade}x\n`;
		mensagem += `   💰 Valor unitário: R$ ${parseFloat(item.preco).toFixed(2)}\n`;

		// Adiciona as opções selecionadas
		if (item.opcoesSelecionadas && item.opcoesSelecionadas.length > 0) {
			mensagem += '   *Opções escolhidas*:\n';
			item.opcoesSelecionadas.forEach(opcao => {
				const precoAdicional = opcao.precoAdicional > 0
					? ` (+R$ ${parseFloat(opcao.precoAdicional).toFixed(2)})`
					: '';
				mensagem += `   - ${opcao.nome}${precoAdicional}\n`;
			});
		}

		// Adiciona os adicionais
		if (item.adicionais && item.adicionais.length > 0) {
			mensagem += '   *Adicionais*:\n';
			item.adicionais.forEach(adicional => {
				mensagem += `   - ${adicional.nome} (+R$ ${parseFloat(adicional.preco).toFixed(2)})\n`;
			});
		}

		// Adiciona observações, se houver
		if (item.observacoes) {
			mensagem += `   *Observações*: ${item.observacoes}\n`;
		}
	});

	// Informações de pagamento
	mensagem += '\n*RESUMO*\n';
	mensagem += `💵 *Total do pedido*: R$ ${pedido.total.toFixed(2)}\n`;

	if (pedido.formaPagamento) {
		mensagem += `💳 *Forma de pagamento*: ${pedido.formaPagamento}\n`;

		if (pedido.formaPagamento.toLowerCase().includes('dinheiro') && pedido.troco) {
			mensagem += `💰 *Troco para*: R$ ${parseFloat(pedido.troco).toFixed(2)}\n`;
		}
	}

	return mensagem;
};

/**
 * Gera um link para WhatsApp com a mensagem de pedido formatada
 * @param {Object} pedido - Dados do pedido
 * @param {Object} usuario - Dados do usuário
 * @returns {string} - URL para abrir o WhatsApp com a mensagem pré-preenchida
 */
export const gerarLinkWhatsapp = (pedido, usuario) => {
	try {
		const mensagem = formatarPedidoWhatsapp(pedido, usuario);

		// Codifica a mensagem para URL
		const mensagemCodificada = encodeURIComponent(mensagem);

		// Gera o link do WhatsApp
		return `https://wa.me/${LANCHONETE_WHATSAPP}?text=${mensagemCodificada}`;
	} catch (error) {
		console.error('Erro ao gerar link do WhatsApp:', error);
		throw error;
	}
};

/**
 * Abre o WhatsApp com o pedido formatado
 * @param {Object} pedido - Dados do pedido
 * @param {Object} usuario - Dados do usuário
 * @returns {boolean} - Verdadeiro se aberto com sucesso
 */
export const abrirWhatsappComPedido = (pedido, usuario) => {
	try {
		const link = gerarLinkWhatsapp(pedido, usuario);

		// Abre o link em uma nova janela/aba
		window.open(link, '_blank');
		return true;
	} catch (error) {
		console.error('Erro ao abrir WhatsApp:', error);
		return false;
	}
};

export default {
	formatarPedidoWhatsapp,
	gerarLinkWhatsapp,
	abrirWhatsappComPedido
};