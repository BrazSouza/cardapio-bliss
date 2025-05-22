// authMiddleware.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ mensagem: 'Token não fornecido' });
	}

	// Formato do header: "Bearer TOKEN"
	const parts = authHeader.split(' ');

	if (parts.length !== 2) {
		return res.status(401).json({ mensagem: 'Formato de token inválido' });
	}

	const [scheme, token] = parts;

	if (!/^Bearer$/i.test(scheme)) {
		return res.status(401).json({ mensagem: 'Formato de token inválido' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_temporaria');

	// Buscar usuário no banco para garantir que ele ainda existe
		const usuario = await prisma.usuario.findUnique({
			where: { id: decoded.id }
		});

		if (!usuario) {
			return res.status(401).json({ mensagem: 'Usuário não encontrado' });
		}

		req.usuario = {
			id: usuario.id,
			nome: usuario.nome
		};

		return next();
	} catch (error) {
		return res.status(401).json({ mensagem: 'Token inválido' });
	}
};