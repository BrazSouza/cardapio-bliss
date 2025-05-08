// backend/src/middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function adminAuth(req, res, next) {
	try {
		// Verifica se o token está presente
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			return res.status(401).json({ error: 'Token não fornecido' });
		}

		// Decodifica o token
		const decodificado = jwt.verify(token, process.env.JWT_SECRET);
		const usuarioId = decodificado.id;

		// Busca o usuário no banco
		const usuario = await prisma.usuario.findUnique({
			where: { id: usuarioId }
		});

		if (!usuario) {
			return res.status(401).json({ error: 'Usuário não encontrado' });
		}

		// Verifica se o usuário é admin
		if (!usuario.isAdmin) {
			return res.status(403).json({ error: 'Acesso negado: privilégios de administrador necessários' });
		}

		// Adiciona o usuário ao objeto de requisição
		req.usuario = usuario;
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Token inválido' });
	}
}

module.exports = adminAuth;