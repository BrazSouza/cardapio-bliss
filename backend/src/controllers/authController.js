// Localização: /controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Chave secreta para JWT - idealmente deve estar em variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_deve_ser_alterada';

const authController = {
	// Login de usuário
	async login(req, res) {
		try {
			const { email, senha } = req.body;

			// Validação básica
			if (!email || !senha) {
				return res.status(400).json({ error: 'Email e senha são obrigatórios' });
			}

			// Buscar usuário pelo email
			const usuario = await prisma.usuario.findUnique({
				where: { email }
			});

			// Verificar se o usuário existe
			if (!usuario) {
				// Por segurança, não indicamos exatamente qual campo está errado
				return res.status(401).json({ error: 'Credenciais inválidas' });
			}

			// Verificar se a senha está correta
			const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
			if (!senhaCorreta) {
				return res.status(401).json({ error: 'Credenciais inválidas' });
			}

			// Gerar token JWT
			const token = jwt.sign(
				{
					id: usuario.id,
					email: usuario.email,
					role: usuario.role
				},
				JWT_SECRET,
				{ expiresIn: '24h' }
			);

			// Retornar token e dados básicos do usuário (sem a senha)
			res.json({
				token,
				usuario: {
					id: usuario.id,
					nome: usuario.nome,
					email: usuario.email,
					role: usuario.role
				}
			});
		} catch (error) {
			console.error('Erro no login:', error);
			res.status(500).json({ error: 'Erro ao realizar login' });
		}
	},

	// Registro de novo usuário
	async registro(req, res) {
		try {
			const { nome, email, senha, role = 'CLIENTE' } = req.body;

			// Validação básica
			if (!nome || !email || !senha) {
				return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
			}

			// Verificar se o email já está em uso
			const usuarioExistente = await prisma.usuario.findUnique({
				where: { email }
			});

			if (usuarioExistente) {
				return res.status(400).json({ error: 'Este email já está em uso' });
			}

			// Hash da senha
			const saltRounds = 10;
			const senhaHash = await bcrypt.hash(senha, saltRounds);

			// Criar novo usuário
			const novoUsuario = await prisma.usuario.create({
				data: {
					nome,
					email,
					senha: senhaHash,
					role
				}
			});

			// Gerar token JWT para o novo usuário
			const token = jwt.sign(
				{
					id: novoUsuario.id,
					email: novoUsuario.email,
					role: novoUsuario.role
				},
				JWT_SECRET,
				{ expiresIn: '24h' }
			);

			// Retornar token e dados básicos do usuário (sem a senha)
			res.status(201).json({
				token,
				usuario: {
					id: novoUsuario.id,
					nome: novoUsuario.nome,
					email: novoUsuario.email,
					role: novoUsuario.role
				}
			});
		} catch (error) {
			console.error('Erro no registro:', error);
			res.status(500).json({ error: 'Erro ao registrar usuário' });
		}
	},

	// Verificar token atual
	async verificarToken(req, res) {
		// O middleware já verificou o token, então só precisamos retornar o usuário
		try {
			const usuario = await prisma.usuario.findUnique({
				where: { id: req.usuario.id },
				select: {
					id: true,
					nome: true,
					email: true,
					role: true
				}
			});

			if (!usuario) {
				return res.status(404).json({ error: 'Usuário não encontrado' });
			}

			res.json({ usuario });
		} catch (error) {
			console.error('Erro ao verificar token:', error);
			res.status(500).json({ error: 'Erro ao verificar autenticação' });
		}
	},

	// Criar um usuário administrativo (apenas para desenvolvimento)
	async criarAdmin(req, res) {
		try {
			// Este endpoint deve estar protegido ou desativado em produção
			const { nome, email, senha } = req.body;

			// Verificar se já existe um admin no sistema
			const adminExistente = await prisma.usuario.findFirst({
				where: { role: 'ADMIN' }
			});

			if (adminExistente) {
				return res.status(400).json({
					error: 'Um usuário administrativo já existe',
					// Incluir o email apenas para facilitar o desenvolvimento
					adminEmail: adminExistente.email
				});
			}

			// Hash da senha
			const saltRounds = 10;
			const senhaHash = await bcrypt.hash(senha, saltRounds);

			// Criar o admin
			const admin = await prisma.usuario.create({
				data: {
					nome,
					email,
					senha: senhaHash,
					role: 'ADMIN'
				}
			});

			res.status(201).json({
				message: 'Usuário administrativo criado com sucesso',
				admin: {
					id: admin.id,
					nome: admin.nome,
					email: admin.email
				}
			});
		} catch (error) {
			console.error('Erro ao criar admin:', error);
			res.status(500).json({ error: 'Erro ao criar usuário administrativo' });
		}
	}
};

module.exports = authController;