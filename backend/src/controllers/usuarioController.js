// src/controllers/usuarioController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const criarUsuario = async (req, res) => {
	const { email, senha, nome, telefone } = req.body;

	try {
		const novoUsuario = await prisma.usuario.create({
			data: {
				email,
				senha,
				nome,
				telefone
			}
		});

		res.status(201).json(novoUsuario);
	} catch (error) {
		console.error('Erro ao criar usuário:', error);
		res.status(500).json({ mensagem: 'Erro ao criar usuário' });
	}
};

module.exports = {
	criarUsuario
};
