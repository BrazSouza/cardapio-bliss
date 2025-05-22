const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:3000',
	credentials: true
}));
app.use(express.json());

// Middleware para verificar a conexão com o banco de dados
app.use(async (req, res, next) => {
	try {
		await prisma.$connect();
		next();
	} catch (error) {
		console.error('Erro ao conectar ao banco de dados:', error);
		res.status(500).json({ mensagem: 'Erro ao conectar ao banco de dados' });
	}
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes);


// Rota para testar o status do servidor
app.get('/api/status', (req, res) => {
	res.json({ status: 'online', timestamp: new Date() });
});


// Rota para verificar se o token é válido
app.get('/api/verificar-token', (req, res) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ mensagem: 'Token não fornecido' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return res.json({ valid: true, usuario: decoded.usuario });
	} catch (error) {
		return res.status(401).json({ mensagem: 'Token inválido' });
	}
});


// Tratamento de erros
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		mensagem: 'Ocorreu um erro no servidor',
		erro: process.env.NODE_ENV === 'development' ? err.message : undefined
	});
});



app.get('/', (req, res) => {
	res.json({ mensagem: 'API do Cardápio Digital funcionando!' });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ mensagem: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});


// Encerrar corretamente o Prisma quando o servidor for encerrado
process.on('SIGINT', async () => {
	await prisma.$disconnect();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	await prisma.$disconnect();
	process.exit(0);
});