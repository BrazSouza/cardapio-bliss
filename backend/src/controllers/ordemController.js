const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Função para criar um novo pedido, com suporte a agendamento
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 */

// Criar um novo pedido
const criarPedido = async (req, res) => {
	try {
		const { items } = req.body;
		const userId = req.user.id; // Obtido do middleware de autenticação

		// Validar se há itens no pedido
		if (!items || items.length === 0) {
			return res.status(400).json({ message: 'O pedido deve conter pelo menos um item' });
		}

		// Iniciar uma transação para garantir consistência dos dados
		const order = await prisma.$transaction(async (prisma) => {
			// Buscar produtos para validar disponibilidade e preços
			const productIds = items.map(item => item.productId);
			const products = await prisma.product.findMany({
				where: { id: { in: productIds }, available: true }
			});

			// Verificar se todos os produtos estão disponíveis
			if (products.length !== productIds.length) {
				throw new Error('Um ou mais produtos não estão disponíveis');
			}

			// Calcular o total e preparar os itens do pedido
			let total = 0;
			const orderItems = items.map(item => {
				const product = products.find(p => p.id === item.productId);
				const itemTotal = product.price * item.quantity;
				total += itemTotal;

				return {
					productId: item.productId,
					quantity: item.quantity,
					price: product.price // Preço no momento da compra
				};
			});

			// Criar o pedido com seus itens
			return await prisma.order.create({
				data: {
					userId,
					total,
					status: 'pending',
					items: {
						create: orderItems
					}
				},
				include: {
					items: {
						include: {
							product: true
						}
					}
				}
			});
		});

		// Após criar o pedido com sucesso, gere o link do WhatsApp
		const storePhoneNumber = process.env.STORE_PHONE_NUMBER; // Número do WhatsApp da loja no formato internacional (ex: 5511999999999)
		const whatsappLink = generateWhatsAppLink(
			storePhoneNumber,
			order,
			whatsappLink,
			req.user
		)

		res.status(201).json(order);
	} catch (error) {
		console.error('Erro ao criar pedido:', error);
		res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
	}
};

// Listar pedidos do usuário logado
const getUserOrders = async (req, res) => {
	try {
		const userId = req.user.id;

		const orders = await prisma.order.findMany({
			where: { userId },
			include: {
				items: {
					include: {
						product: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		res.json(orders);
	} catch (error) {
		console.error('Erro ao buscar pedidos:', error);
		res.status(500).json({ message: 'Erro ao buscar pedidos' });
	}
};

// Obter detalhes de um pedido específico
const getOrderDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		const order = await prisma.order.findFirst({
			where: {
				id: Number(id),
				userId // Garante que o usuário só veja seus próprios pedidos
			},
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		});

		if (!order) {
			return res.status(404).json({ message: 'Pedido não encontrado' });
		}

		res.json(order);
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
		const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

		if (!validStatuses.includes(status)) {
			return res.status(400).json({
				message: 'Status inválido',
				validStatuses
			});
		}

		const order = await prisma.order.update({
			where: { id: Number(id) },
			data: { status },
			include: {
				items: {
					include: {
						product: true
					}
				},
				user: true,
				address: true
			}
		});

		res.json(order);
	} catch (error) {
		console.error('Erro ao atualizar status do pedido:', error);
		res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
	}
};

// Cancelar pedido (apenas se estiver pendente)
const cancelOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		// Buscar o pedido
		const order = await prisma.order.findFirst({
			where: { id: Number(id), userId }
		});

		if (!order) {
			return res.status(404).json({ message: 'Pedido não encontrado' });
		}

		// Verificar se o pedido pode ser cancelado
		if (order.status !== 'pending' && order.status !== 'confirmed') {
			return res.status(400).json({
				message: 'Apenas pedidos pendentes ou confirmados podem ser cancelados'
			});
		}

		// Atualizar status para cancelado
		const updatedOrder = await prisma.order.update({
			where: { id: Number(id) },
			data: { status: 'cancelled' }
		});

		res.json({
			message: 'Pedido cancelado com sucesso',
			order: updatedOrder
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