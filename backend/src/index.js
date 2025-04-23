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





// Registrar rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', produtoRoutes);
app.use('/api/orders', ordemRoutes);
app.use('/api/addresses', enderecoRoutes);
app.use('/api/favorites', favoritoRoutes);
app.use('/api/agendamento', agendamentoRoutes);




// Rota inicial
app.get('/', (req, res) => {
	res.send('API do cardápio digital funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});