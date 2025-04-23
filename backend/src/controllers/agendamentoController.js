const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Função para verificar disponibilidade de horários para agendamento
 * Esta função retorna horários disponíveis para o dia selecionado
 */
const verificarDisponibilidade = async (req, res) => {
	try {
		const { data } = req.query; // Formato: YYYY-MM-DD

		// Verificar se a data foi fornecida
		if (!data) {
			return res.status(400).json({ mensagem: 'É necessário fornecer uma data' });
		}

		// Criar objeto de data para o dia selecionado
		const dataAgendamento = new Date(data);

		// Verificar se é uma data válida
		if (isNaN(dataAgendamento.getTime())) {
			return res.status(400).json({ mensagem: 'Formato de data inválido. Use YYYY-MM-DD' });
		}

		// Definir horários disponíveis (isso pode vir de uma configuração)
		// Exemplo: Lanchonete funciona das 10h às 22h, com intervalo de 30 minutos
		const horarioInicio = 10; // 10:00
		const horarioFim = 22;    // 22:00
		const intervalo = 30;     // 30 minutos

		// Buscar pedidos já agendados para esta data
		const pedidosAgendados = await prisma.order.findMany({
			where: {
				scheduledFor: {
					gte: new Date(`${data}T00:00:00Z`),
					lt: new Date(`${data}T23:59:59Z`)
				}
			},
			select: {
				scheduledFor: true
			}
		});

		// Converter horários agendados para formato simples (HH:MM)
		const horariosOcupados = pedidosAgendados.map(pedido => {
			const hora = pedido.scheduledFor.getHours();
			const minutos = pedido.scheduledFor.getMinutes();
			return `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
		});

		// Gerar todos os horários possíveis
		const horariosDisponiveis = [];
		for (let hora = horarioInicio; hora < horarioFim; hora++) {
			for (let minuto = 0; minuto < 60; minuto += intervalo) {
				const horarioFormatado = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;

				// Verificar se o horário já está ocupado
				if (!horariosOcupados.includes(horarioFormatado)) {
					horariosDisponiveis.push(horarioFormatado);
				}
			}
		}

		// Definir regras adicionais (exemplo: limite de pedidos por horário)
		const limiteHorario = 3; // máximo de 3 pedidos por horário

		// Contar pedidos por horário
		const contagemHorarios = {};
		pedidosAgendados.forEach(pedido => {
			const hora = pedido.scheduledFor.getHours();
			const horarioBase = `${hora.toString().padStart(2, '0')}:00`;

			if (!contagemHorarios[horarioBase]) {
				contagemHorarios[horarioBase] = 1;
			} else {
				contagemHorarios[horarioBase]++;
			}
		});

		// Filtrar horários que ultrapassaram o limite
		const horariosFinais = horariosDisponiveis.filter(horario => {
			const horarioBase = `${horario.split(':')[0]}:00`;
			return !contagemHorarios[horarioBase] || contagemHorarios[horarioBase] < limiteHorario;
		});

		res.json({
			data: data,
			horariosDisponiveis: horariosFinais
		});
	} catch (erro) {
		console.error('Erro ao verificar disponibilidade:', erro);
		res.status(500).json({ mensagem: 'Erro ao verificar disponibilidade de horários' });
	}
};

module.exports = {
	verificarDisponibilidade
};