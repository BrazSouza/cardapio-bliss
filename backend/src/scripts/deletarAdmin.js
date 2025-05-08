// Localização sugerida: scripts/deletarAdmin.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deletarAdmin() {
	try {
		console.log('Procurando administrador...');

		const admin = await prisma.usuario.findFirst({
			where: { role: 'ADMIN' }
		});

		if (!admin) {
			console.log('Nenhum administrador encontrado.');
			return;
		}

		await prisma.usuario.delete({
			where: { id: admin.id }
		});

		console.log(`Administrador deletado com sucesso: ${admin.email}`);
	} catch (error) {
		console.error('Erro ao deletar administrador:', error);
	} finally {
		await prisma.$disconnect();
	}
}

deletarAdmin();
