/**
 * Script para fazer backup dos dados do banco PostgreSQL
 * Pode ser executado via cron job
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Configurações
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, 'backups');
const DB_NAME = process.env.POSTGRES_DB || 'cardapio_digital';
const DB_USER = process.env.POSTGRES_USER || 'postgres';
const DB_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
const DB_PORT = process.env.POSTGRES_PORT || '5432';

// Criar diretório de backup se não existir
if (!fs.existsSync(BACKUP_DIR)) {
	fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Gerar nome do arquivo de backup com timestamp
const timestamp = new Date()
	.toISOString()
	.replace(/[:.]/g, '-')
	.replace('T', '_')
	.slice(0, 19);
const backupFileName = `${DB_NAME}_${timestamp}.sql`;
const backupFilePath = path.join(BACKUP_DIR, backupFileName);

try {
	// Executar pg_dump para criar backup
	console.log(`Iniciando backup do banco de dados ${DB_NAME}...`);

	const command = `PGPASSWORD=${DB_PASSWORD} pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -F p > ${backupFilePath}`;

	execSync(command, { stdio: 'inherit' });

	console.log(`Backup concluído com sucesso! Arquivo: ${backupFilePath}`);

	// Manter apenas os últimos 7 backups para economizar espaço
	const files = fs.readdirSync(BACKUP_DIR)
		.filter(file => file.startsWith(DB_NAME))
		.map(file => path.join(BACKUP_DIR, file));

	if (files.length > 7) {
		// Ordenar por data de modificação (mais antigos primeiro)
		files.sort((a, b) => {
			return fs.statSync(a).mtime.getTime() - fs.statSync(b).mtime.getTime();
		});

		// Remover backups mais antigos
		const filesToRemove = files.slice(0, files.length - 7);
		filesToRemove.forEach(file => {
			fs.unlinkSync(file);
			console.log(`Backup antigo removido: ${file}`);
		});
	}
} catch (error) {
	console.error('Erro ao criar backup:', error.message);
	process.exit(1);
}