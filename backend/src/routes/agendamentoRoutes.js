const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const autenticacao = require('../middleware/auth');

// Rota para verificar disponibilidade de horários
router.get('/disponibilidade', agendamentoController.verificarDisponibilidade);

module.exports = router;