const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listarProdutos = async (req, res) => {
	try {
		const produtos = await prisma.produto.findMany({
			where: { disponivel: true },
			include: {
				categoria: true,
				opcoesProduto: true,
				adicionaisProduto: true
			}
		});

		res.json(produtos);
	} catch (erro) {
		console.error('Erro ao listar produtos:', erro);
		res.status(500).json({ mensagem: 'Erro ao listar produtos' });
	}
};

exports.listarCategorias = async (req, res) => {
	try {
		const categorias = await prisma.categoria.findMany({
			where: { ativo: true },
			orderBy: { exibirOrdem: 'asc' }
		});

		res.json(categorias);
	} catch (erro) {
		console.error('Erro ao listar categorias:', erro);
		res.status(500).json({ mensagem: 'Erro ao listar categorias' });
	}
};

exports.obterProdutosPorCategoria = async (req, res) => {
	try {
		const { categoriaId } = req.params;

		const produtos = await prisma.produto.findMany({
			where: {
				categoriaId: parseInt(categoriaId),
				disponivel: true
			},
			include: {
				opcoesProduto: true,
				adicionaisProduto: true
			}
		});

		res.json(produtos);
	} catch (erro) {
		console.error('Erro ao obter produtos por categoria:', erro);
		res.status(500).json({ mensagem: 'Erro ao obter produtos' });
	}
};

exports.obterProdutoPorId = async (req, res) => {
	try {
		const { id } = req.params;

		const produto = await prisma.produto.findUnique({
			where: {
				id: parseInt(id)
			},
			include: {
				categoria: true,
				opcoesProduto: true,
				adicionaisProduto: {
					where: { disponivel: true }
				}
			}
		});

		if (!produto) {
			return res.status(404).json({ mensagem: 'Produto não encontrado' });
		}

		res.json(produto);
	} catch (erro) {
		console.error('Erro ao obter produto:', erro);
		res.status(500).json({ mensagem: 'Erro ao obter produto' });
	}
};