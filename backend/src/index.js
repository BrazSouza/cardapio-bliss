// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const ordemRoutes = require('./routes/ordemRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const rotaUsuario = require('./routes/usuarioRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');



// Registrar rotas
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', ordemRoutes);
app.use('/api/enderecos', enderecoRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/agendamento', agendamentoRoutes);
app.use('/api/usuarios', rotaUsuario);
app.use('/api', adminRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);






// Rota inicial
app.get('/', (req, res) => {
	res.send('API do cardápio digital funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});