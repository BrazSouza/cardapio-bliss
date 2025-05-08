const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const gerarLinkWhatsapp = require('../utils/gerarLinkWhatsapp');

/**
 * Função para criar um novo pedido, com suporte a agendamento
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 */

// Criar um novo pedido
const criarPedido = async (req, res) => {
	try {
		const { clienteId, itens, observacoes, endereco } = req.body;
		const usuarioId = req.usuario.id; // Obtido do middleware de autenticação

		// Validar se há itens no pedido
		if (!itens || itens.length === 0) {
			return res.status(400).json({ message: 'O pedido deve conter pelo menos um item' });
		}
		console.log("Body recebido:", req.body);

		// Iniciar uma transação para garantir consistência dos dados
		const pedido = await prisma.$transaction(async (prisma) => {




			// Buscar produtos para validar disponibilidade e preços
			const productIds = itens.map(item => item.produtoId);
			const produtos = await prisma.produto.findMany({
				where: { id: { in: productIds }, disponivel: true }
			});

			// Verificar se todos os produtos estão disponíveis
			if (produtos.length !== productIds.length) {
				throw new Error('Um ou mais produtos não estão disponíveis');
			}

			// Calcular o total e preparar os itens do pedido
			let total = 0;
			const itensPedido = itens.map(item => {
				const produto = produtos.find(p => p.id === item.produtoId);
				const itemTotal = produto.preco * item.quantidade;
				total += itemTotal;

				return {
					produtoId: item.produtoId,
					quantidade: item.quantidade,
					preco: produto.preco // Preço no momento da compra
				};
			});

			// Criar o pedido com seus itens
			return await prisma.pedido.create({
				data: {
					clienteId,
					status: 'pendente',
					observacoes,
					endereco,
					// Outras propriedades...
				},
				include: {
					cliente: true,
					itens: {
						include: {
							produto: true
						}
					}
				}

			});
		});

		// Após criar o pedido com sucesso, gere o link do WhatsApp
		const numeroLoja = process.env.TELEFONE_LOJA;
		const linkWhatsapp = gerarLinkWhatsapp(numeroLoja, pedido, req.usuario);

		// Enviar notificação em tempo real
		const io = req.app.get('io');
		notificationService.enviarNotificacaoNovoPedido(io, pedido);


		return res.status(201).json({
			pedido,
			linkWhatsapp
		});

	} catch (error) {
		console.error('Erro ao criar pedido:', error);
		res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
	}

	return res.status(201).json({
		pedido,
		whatsappLink
	});

};



// Listar pedidos do usuário logado
const getUserOrders = async (req, res) => {
	try {
		const usuarioId = req.usuario.id;

		const pedidos = await prisma.pedido.findMany({
			where: { usuarioId },
			include: {
				itens: {
					include: {
						produto: true
					}
				}
			},
			orderBy: {
				criadoEm: 'desc'
			}
		});

		res.json(pedidos);
	} catch (error) {
		console.error('Erro ao buscar pedidos:', error);
		res.status(500).json({ message: 'Erro ao buscar pedidos' });
	}
};

// Obter detalhes de um pedido específico
const getOrderDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const usuarioId = req.usuario.id;

		const pedido = await prisma.pedido.findFirst({
			where: {
				id: Number(id),
				usuarioId // Garante que o usuário só veja seus próprios pedidos
			},
			include: {
				itens: {
					include: {
						produto: true
					}
				}
			}
		});

		if (!pedido) {
			return res.status(404).json({ message: 'Pedido não encontrado' });
		}

		res.json(pedido);
	} catch (error) {
		console.error('Erro ao buscar detalhes do pedido:', error);
		res.status(500).json({ message: 'Erro ao buscar detalhes do pedido' });
	}
};

// Atualizar status do pedido
const updateOrderStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		// Lista de status válidos
		const validStatuses = ["pendente", "confirmado", "emPreparo", 'out_for_delivery', "entregue", "cancelado"];

		if (!validStatuses.includes(status)) {
			return res.status(400).json({
				message: 'Status inválido',
				validStatuses
			});
		}

		const pedido = await prisma.pedido.update({
			where: { id: Number(id) },
			data: { status },
			include: {
				itens: {
					include: {
						produto: true
					}
				},
				usuario: true,
				endereco: true
			}
		});

		res.json(pedido);
	} catch (error) {
		console.error('Erro ao atualizar status do pedido:', error);
		res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
	}
};

// Cancelar pedido (apenas se estiver pendente)
const cancelOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const usuarioId = req.usuario.id;

		// Buscar o pedido
		const pedido = await prisma.pedido.findFirst({
			where: { id: Number(id), usuarioId }
		});

		if (!pedido) {
			return res.status(404).json({ message: 'Pedido não encontrado' });
		}

		// Verificar se o pedido pode ser cancelado
		if (pedido.status !== "pendente" && pedido.status !== "confirmado") {
			return res.status(400).json({
				message: 'Apenas pedidos pendentes ou confirmados podem ser cancelados'
			});
		}

		// Atualizar status para cancelado
		const updatedOrder = await prisma.pedido.update({
			where: { id: Number(id) },
			data: { status: "cancelado" }
		});

		res.json({
			message: 'Pedido cancelado com sucesso',
			pedido: updatedOrder
		});
	} catch (error) {
		console.error('Erro ao cancelar pedido:', error);
		res.status(500).json({ message: 'Erro ao cancelar pedido' });
	}
};






module.exports = {
	criarPedido,
	getUserOrders,
	getOrderDetails,
	updateOrderStatus,
	cancelOrder
};