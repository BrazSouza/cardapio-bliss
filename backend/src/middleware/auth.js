// Localização: /middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Chave secreta para JWT - deve ser a mesma usada no authController
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_deve_ser_alterada';

// Middleware para verificar token JWT
const autenticar = async (req, res, next) => {
	try {
		// Verificar se o header Authorization existe
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.status(401).json({ error: 'Token não fornecido' });
		}

		// Extrair o token do header (formato "Bearer token")
		const token = authHeader.split(' ')[1];
		if (!token) {
			return res.status(401).json({ error: 'Formato de token inválido' });
		}

		// Verificar e decodificar o token
		const decoded = jwt.verify(token, JWT_SECRET);

		// Verificar se o usuário ainda existe no banco de dados
		const usuario = await prisma.usuario.findUnique({
			where: { id: decoded.id }
		});

		if (!usuario) {
			return res.status(401).json({ error: 'Usuário não encontrado' });
		}

		// Adicionar o usuário à requisição para uso nos controllers
		req.usuario = {
			id: decoded.id,
			email: decoded.email,
			role: decoded.role
		};

		// Continuar para o próximo middleware ou controller
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expirado' });
		}
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: 'Token inválido' });
		}
		console.error('Erro no middleware de autenticação:', error);
		return res.status(500).json({ error: 'Erro interno na autenticação' });
	}
};

// Middleware para verificar se o usuário é admin
const verificarAdmin = (req, res, next) => {
	if (!req.usuario || req.usuario.role !== 'ADMIN') {
		return res.status(403).json({ error: 'Acesso negado. Apenas administradores têm permissão.' });
	}
	next();
};

// Middleware para verificar se o usuário é o dono do recurso ou admin
const verificarProprioUsuarioOuAdmin = (req, res, next) => {
	const usuarioId = parseInt(req.params.id);

	if (
		!req.usuario ||
		(req.usuario.id !== usuarioId && req.usuario.role !== 'ADMIN')
	) {
		return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para esta ação.' });
	}
	next();
};

module.exports = {
	autenticar,
	verificarAdmin,
	verificarProprioUsuarioOuAdmin
};