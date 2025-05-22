// // backend/src/controllers/adminDashboardController.js
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// // Função que já existe no adminController.js - apenas movendo
// async function getEstatisticas(req, res) {

// 	try {
// 		const hoje = new Date();
// 		hoje.setHours(0, 0, 0, 0);

// 		// Pedidos do dia
// 		const pedidosHoje = await prisma.pedido.count({
// 			where: {
// 				criadoEm: {
// 					gte: hoje
// 				}
// 			}
// 		});

// 		// Faturamento do dia
// 		const faturamentoHoje = await prisma.pedido.aggregate({
// 			where: {
// 				criadoEm: {
// 					gte: hoje
// 				},
// 				status: {
// 					not: 'cancelado'
// 				}
// 			},
// 			_sum: {
// 				total: true
// 			}
// 		});

// 		// Produtos mais vendidos
// 		const produtosMaisVendidos = await prisma.itemPedido.groupBy({
// 			by: ['produtoId'],
// 			_sum: {
// 				quantidade: true
// 			},
// 			orderBy: {
// 				_sum: {
// 					quantidade: 'desc'
// 				}
// 			},
// 			take: 5
// 		});

// 		// Buscar detalhes dos produtos mais vendidos
// 		const detalhesProdutos = await Promise.all(
// 			produtosMaisVendidos.map(async (item) => {
// 				const produto = await prisma.produto.findUnique({
// 					where: { id: item.produtoId }
// 				});
// 				return {
// 					id: produto.id,
// 					nome: produto.nome,
// 					quantidadeVendida: item._sum.quantidade
// 				};
// 			})
// 		);

// 		res.json({
// 			pedidosHoje,
// 			faturamentoHoje: faturamentoHoje._sum.total || 0,
// 			produtosMaisVendidos: detalhesProdutos
// 		});
// 	} catch (error) {
// 		res.status(500).json({ error: 'Erro ao buscar estatísticas: ' + error.message });
// 	}
// };

// // Nova função para pedidos por hora
// async function getPedidosPorHora(req, res) {
// 	try {
// 		const hoje = new Date();
// 		hoje.setHours(0, 0, 0, 0);

// 		const pedidos = await prisma.pedido.findMany({
// 			where: {
// 				criadoEm: {
// 					gte: hoje
// 				}
// 			},
// 			select: {
// 				criadoEm: true
// 			}
// 		});

// 		// Contagem de pedidos por hora (0-23)
// 		const pedidosPorHora = Array(24).fill(0);

// 		pedidos.forEach(pedido => {
// 			const hora = pedido.criadoEm.getHours();
// 			pedidosPorHora[hora]++;
// 		});

// 		// Formatar para resposta
// 		const resultado = pedidosPorHora.map((quantidade, hora) => ({
// 			hora: hora,
// 			quantidade: quantidade
// 		}));

// 		res.json(resultado);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Erro ao buscar pedidos por hora: ' + error.message });
// 	}
// };

// // Nova função para faturamento por período
// async function getFaturamentoPeriodo(req, res) {
// 	try {
// 		const { periodo = 'semana' } = req.query;
// 		const hoje = new Date();
// 		hoje.setHours(23, 59, 59, 999);

// 		let dataInicio;

// 		// Determinar período de análise
// 		if (periodo === 'semana') {
// 			dataInicio = new Date(hoje);
// 			dataInicio.setDate(hoje.getDate() - 6);
// 			dataInicio.setHours(0, 0, 0, 0);
// 		} else if (periodo === 'mes') {
// 			dataInicio = new Date(hoje);
// 			dataInicio.setDate(1);
// 			dataInicio.setHours(0, 0, 0, 0);
// 		} else if (periodo === 'ano') {
// 			dataInicio = new Date(hoje.getFullYear(), 0, 1);
// 		} else {
// 			return res.status(400).json({ error: 'Período inválido' });
// 		}

// 		// Buscar pedidos no período
// 		const pedidos = await prisma.pedido.findMany({
// 			where: {
// 				criadoEm: {
// 					gte: dataInicio,
// 					lte: hoje
// 				},
// 				status: {
// 					not: 'cancelado'
// 				}
// 			},
// 			select: {
// 				criadoEm: true,
// 				total: true
// 			}
// 		});

// 		// Processar dados para formato adequado ao gráfico
// 		let resultado = [];

// 		if (periodo === 'semana' || periodo === 'mes') {
// 			// Mapa para armazenar totais por dia
// 			const totaisPorDia = {};

// 			// Inicializar dias no período
// 			for (let d = new Date(dataInicio); d <= hoje; d.setDate(d.getDate() + 1)) {
// 				const dataFormatada = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
// 				totaisPorDia[dataFormatada] = 0;
// 			}

// 			// Somar valores por dia
// 			pedidos.forEach(pedido => {
// 				const data = pedido.criadoEm;
// 				const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}`;
// 				totaisPorDia[dataFormatada] = (totaisPorDia[dataFormatada] || 0) + pedido.total;
// 			});

// 			// Converter para array para resposta
// 			resultado = Object.entries(totaisPorDia).map(([data, total]) => ({
// 				data,
// 				total
// 			}));

// 		} else if (periodo === 'ano') {
// 			// Mapa para armazenar totais por mês
// 			const totaisPorMes = {};
// 			const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// 			// Inicializar meses no período
// 			for (let m = 0; m < 12; m++) {
// 				totaisPorMes[meses[m]] = 0;
// 			}

// 			// Somar valores por mês
// 			pedidos.forEach(pedido => {
// 				const mes = pedido.criadoEm.getMonth();
// 				totaisPorMes[meses[mes]] = (totaisPorMes[meses[mes]] || 0) + pedido.total;
// 			});

// 			// Converter para array para resposta
// 			resultado = meses.map(mes => ({
// 				mes,
// 				total: totaisPorMes[mes]
// 			}));
// 		}

// 		res.json(resultado);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Erro ao buscar faturamento por período: ' + error.message });
// 	}
// };

// module.exports = {
// 	getEstatisticas,
// 	getPedidosPorHora,
// 	getFaturamentoPeriodo
// };