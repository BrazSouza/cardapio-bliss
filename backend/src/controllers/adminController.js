// // backend/src/controllers/adminController.js
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// // Listar todos os pedidos para o admin
// exports.listarPedidos = async (req, res) => {
// 	try {
// 		const { status, page = 1, limit = 10 } = req.query;
// 		const skip = (page - 1) * limit;

// 		const where = {};
// 		if (status) {
// 			where.status = status;
// 		}

// 		const pedidos = await prisma.pedido.findMany({
// 			where,
// 			include: {
// 				usuario: {
// 					select: {
// 						id: true,
// 						nome: true,
// 						email: true,
// 						telefone: true
// 					}
// 				},
// 				endereco: true,
// 				itens: {
// 					include: {
// 						produto: true
// 					}
// 				}
// 			},
// 			orderBy: {
// 				criadoEm: 'desc'
// 			},
// 			skip,
// 			take: Number(limit)
// 		});

// 		const total = await prisma.pedido.count({ where });

// 		res.json({
// 			pedidos,
// 			pagination: {
// 				total,
// 				page: Number(page),
// 				limit: Number(limit),
// 				pages: Math.ceil(total / limit)
// 			}
// 		});
// 	} catch (error) {
// 		res.status(500).json({ error: 'Erro ao listar pedidos: ' + error.message });
// 	}
// };

// // Atualizar status de um pedido
// exports.atualizarStatusPedido = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const { status } = req.body;

// 		const statusPermitidos = ['pendente', 'confirmado', 'emPreparo', 'pronto', 'emEntrega', 'entregue', 'cancelado'];

// 		if (!statusPermitidos.includes(status)) {
// 			return res.status(400).json({ error: 'Status inválido' });
// 		}

// 		const pedidoAtualizado = await prisma.pedido.update({
// 			where: { id: Number(id) },
// 			data: { status }
// 		});

// 		res.json(pedidoAtualizado);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Erro ao atualizar status do pedido: ' + error.message });
// 	}
// };

// // Obter detalhes de um pedido específico
// exports.detalhesPedido = async (req, res) => {
// 	try {
// 		const { id } = req.params;

// 		const pedido = await prisma.pedido.findUnique({
// 			where: { id: Number(id) },
// 			include: {
// 				usuario: {
// 					select: {
// 						id: true,
// 						nome: true,
// 						email: true,
// 						telefone: true
// 					}
// 				},
// 				endereco: true,
// 				itens: {
// 					include: {
// 						produto: true
// 					}
// 				}
// 			}
// 		});

// 		if (!pedido) {
// 			return res.status(404).json({ error: 'Pedido não encontrado' });
// 		}

// 		res.json(pedido);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Erro ao buscar detalhes do pedido: ' + error.message });
// 	}
// };

// Excluir uma categoria
// exports.excluirCategoria = async (req, res) => {
// 	try {
// 		const { id } = req.params;

// 		const categoriaExistente = await prisma.categoria.findUnique({
// 			where: { id: Number(id) }
// 		});

// 		if (!categoriaExistente) {
// 			return res.status(404).json({ error: 'Categoria não encontrada' });
// 		}

// 		await prisma.categoria.delete({
// 			where: { id: Number(id) }
// 		});

// 		res.status(204).send(); // Resposta de sucesso sem conteúdo
// 	} catch (error) {
// 		res.status(500).json({ error: 'Erro ao excluir categoria: ' + error.message });
// 	}
// };