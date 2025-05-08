// Adicione estas importações no topo do arquivo server.js
const http = require('http');
const { Server } = require('socket.io');

// Modificar a criação do servidor Express para:
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		methods: ['GET', 'POST']
	}
});

// Configuração do Socket.IO (adicionar antes de app.listen)
io.on('connection', (socket) => {
	console.log('Usuário conectado:', socket.id);

	socket.on('disconnect', () => {
		console.log('Usuário desconectado:', socket.id);
	});
});

// Disponibilizar o io para uso em outros arquivos
app.set('io', io);

// Modificar a inicialização do servidor para:
server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
