// backend/src/controllers/adminProdutosController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar produtos para admin (com opções de filtro)
exports.listarProdutos = async (req, res) => {
	try {
		const { categoriaId, disponivel, busca, page = 1, limit = 20 } = req.query;
		const skip = (page - 1) * limit;

		// Construir filtro
		const where = {};

		if (categoriaId) {
			where.categoriaId = Number(categoriaId);
		}

		if (disponivel !== undefined) {
			where.disponivel = disponivel === 'true';
		}

		if (busca) {
			where.OR = [
				{ nome: { contains: busca, mode: 'insensitive' } },
				{ descricao: { contains: busca, mode: 'insensitive' } }
			];
		}

		const produtos = await prisma.produto.findMany({
			where,
			include: {
				categoria: true
			},
			orderBy: {
				nome: 'asc'
			},
			skip,
			take: Number(limit)
		});

		const total = await prisma.produto.count({ where });

		res.json({
			produtos,
			pagination: {
				total,
				page: Number(page),
				limit: Number(limit),
				pages: Math.ceil(total / limit)
			}
		});
	} catch (error) {
		res.status(500).json({ error: 'Erro ao listar produtos: ' + error.message });
	}
};

// Obter detalhes de um produto específico
exports.detalhesProduto = async (req, res) => {
	try {
		const { id } = req.params;

		const produto = await prisma.produto.findUnique({
			where: { id: Number(id) },
			include: {
				categoria: true
			}
		});

		if (!produto) {
			return res.status(404).json({ error: 'Produto não encontrado' });
		}

		res.json(produto);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao buscar detalhes do produto: ' + error.message });
	}
};

// Criar novo produto
exports.criarProduto = async (req, res) => {
	try {
		const { nome, descricao, preco, categoriaId, disponivel, imagem } = req.body;

		if (!nome || !preco || !categoriaId) {
			return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
		}

		// Verificar se categoria existe
		const categoriaExiste = await prisma.categoria.findUnique({
			where: { id: Number(categoriaId) }
		});

		if (!categoriaExiste) {
			return res.status(400).json({ error: 'Categoria não encontrada' });
		}

		const novoProduto = await prisma.produto.create({
			data: {
				nome,
				descricao,
				preco: Number(preco),
				categoriaId: Number(categoriaId),
				disponivel: disponivel !== undefined ? Boolean(disponivel) : true,
				imagem
			}
		});

		res.status(201).json(novoProduto);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao criar produto: ' + error.message });
	}
};

// Atualizar produto existente
exports.atualizarProduto = async (req, res) => {
	try {
		const { id } = req.params;
		const { nome, descricao, preco, categoriaId, disponivel, imagem } = req.body;

		const produto = await prisma.produto.findUnique({
			where: { id: Number(id) }
		});

		if (!produto) {
			return res.status(404).json({ error: 'Produto não encontrado' });
		}

		// Se categoriaId fornecido, verificar se categoria existe
		if (categoriaId) {
			const categoriaExiste = await prisma.categoria.findUnique({
				where: { id: Number(categoriaId) }
			});

			if (!categoriaExiste) {
				return res.status(400).json({ error: 'Categoria não encontrada' });
			}
		}

		const produtoAtualizado = await prisma.produto.update({
			where: { id: Number(id) },
			data: {
				nome: nome !== undefined ? nome : undefined,
				descricao: descricao !== undefined ? descricao : undefined,
				preco: preco !== undefined ? Number(preco) : undefined,
				categoriaId: categoriaId !== undefined ? Number(categoriaId) : undefined,
				disponivel: disponivel !== undefined ? Boolean(disponivel) : undefined,
				imagem: imagem !== undefined ? imagem : undefined
			}
		});

		res.json(produtoAtualizado);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao atualizar produto: ' + error.message });
	}
};

// Excluir produto
exports.excluirProduto = async (req, res) => {
	try {
		const { id } = req.params;

		// Verificar se o produto existe
		const produto = await prisma.produto.findUnique({
			where: { id: Number(id) }
		});

		if (!produto) {
			return res.status(404).json({ error: 'Produto não encontrado' });
		}

		// Verificar se o produto está em algum pedido
		const emPedido = await prisma.itemPedido.findFirst({
			where: { produtoId: Number(id) }
		});

		if (emPedido) {
			// Em vez de excluir, apenas marcar como indisponível
			await prisma.produto.update({
				where: { id: Number(id) },
				data: { disponivel: false }
			});

			return res.json({
				message: 'Produto está em pedidos existentes. Foi marcado como indisponível em vez de excluído.',
				desativado: true
			});
		}

		// Excluir produto se não estiver em pedidos
		await prisma.produto.delete({
			where: { id: Number(id) }
		});

		res.json({ message: 'Produto excluído com sucesso' });
	} catch (error) {
		res.status(500).json({ error: 'Erro ao excluir produto: ' + error.message });
	}
};