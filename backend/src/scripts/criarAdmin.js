// Localização: /scripts/criarAdmin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function criarOuAtualizarAdmin() {
	try {
		console.log('Verificando se já existe um administrador...');

		const adminExistente = await prisma.usuario.findFirst({
			where: { role: 'ADMIN' }
		});

		const novosDados = {
			nome: 'Administrador Atualizado',
			email: 'braz@exemplo.com',
			senha: '@Naoseiasenha1' // Altere essa senha em produção
		};

		const senhaHash = await bcrypt.hash('@Naoseiasenha1', 10);

		if (adminExistente) {

			await prisma.usuario.create({
				data: {
					email: 'braz@exemplo.com',
					senha: senhaHash,
					role: 'ADMIN'
				}
			});

			console.log('Administrador existente atualizado com sucesso:');
			console.log(`Novo email: ${novosDados.email}`);
			console.log(`Nova senha: ${novosDados.senha}`);
		} else {
			await prisma.usuario.create({
				data: {
					nome: novosDados.nome,
					email: novosDados.email,
					senha: senhaHash,
					role: 'ADMIN'
				}
			});

			console.log('Novo administrador criado com sucesso:');
			console.log(`Email: ${novosDados.email}`);
			console.log(`Senha: ${novosDados.senha}`);
		}

		console.log('\nAVISO: Altere essa senha após o primeiro login!');
	} catch (error) {
		console.error('Erro ao criar ou atualizar administrador:', error);
	} finally {
		await prisma.$disconnect();
	}
}

criarOuAtualizarAdmin();
