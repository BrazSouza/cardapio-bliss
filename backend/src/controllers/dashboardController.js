// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// /**
//  * Controller para endpoints relacionados ao Dashboard
//  */
// const dashboardController = {
// 	/**
// 	 * Obter estatísticas gerais para o dashboard
// 	 */
// 	getEstatisticas: async (req, res) => {
// 		try {
// 			// Data de hoje (início do dia)
// 			const hoje = new Date();
// 			hoje.setHours(0, 0, 0, 0);

// 			// Buscar total de pedidos de hoje
// 			const pedidosHoje = await prisma.pedido.count({
// 				where: {
// 					dataCriacao: {
// 						gte: hoje
// 					}
// 				}
// 			});

// 			// Buscar faturamento de hoje
// 			const resultadoFaturamento = await prisma.pedido.aggregate({
// 				where: {
// 					dataCriacao: {
// 						gte: hoje
// 					},
// 					status: {
// 						notIn: ['cancelado']
// 					}
// 				},
// 				_sum: {
// 					valorTotal: true
// 				}
// 			});

// 			const faturamentoHoje = resultadoFaturamento._sum.valorTotal || 0;

// 			// Calcular taxa de conclusão (pedidos concluídos / total de pedidos) * 100
// 			const pedidosConcluidos = await prisma.pedido.count({
// 				where: {
// 					dataCriacao: {
// 						gte: hoje
// 					},
// 					status: 'entregue'
// 				}
// 			});

// 			const taxaConclusao = pedidosHoje > 0 ? Math.round((pedidosConcluidos / pedidosHoje) * 100) : 0;

// 			// Ticket médio
// 			const ticketMedio = pedidosHoje > 0 ? faturamentoHoje / pedidosHoje : 0;

// 			// Buscar produtos mais vendidos hoje
// 			const produtosMaisVendidos = await prisma.itemPedido.groupBy({
// 				by: ['produtoId'],
// 				where: {
// 					pedido: {
// 						dataCriacao: {
// 							gte: hoje
// 						},
// 						status: {
// 							notIn: ['cancelado']
// 						}
// 					}
// 				},
// 				_sum: {
// 					quantidade: true
// 				},
// 				orderBy: {
// 					_sum: {
// 						quantidade: 'desc'
// 					}
// 				},
// 				take: 5
// 			});

// 			// Buscar informações completas dos produtos
// 			const produtosDetalhados = await Promise.all(
// 				produtosMaisVendidos.map(async (item) => {
// 					const produto = await prisma.produto.findUnique({
// 						where: { id: item.produtoId }
// 					});

// 					return {
// 						id: produto.id,
// 						nome: produto.nome,
// 						quantidadeVendida: item._sum.quantidade
// 					};
// 				})
// 			);

// 			// Retornar os dados
// 			res.json({
// 				pedidosHoje,
// 				faturamentoHoje,
// 				taxaConclusao,
// 				ticketMedio,
// 				produtosMaisVendidos: produtosDetalhados
// 			});
// 		} catch (error) {
// 			console.error("Erro ao buscar estatísticas:", error);
// 			res.status(500).json({ error: "Erro ao buscar estatísticas" });
// 		}
// 	},

// 	/**
// 	 * Obter dados de pedidos por hora para o gráfico
// 	 */
// 	getPedidosPorHora: async (req, res) => {
// 		try {
// 			// Data de hoje (início do dia)
// 			const hoje = new Date();
// 			hoje.setHours(0, 0, 0, 0);

// 			// Buscar todos os pedidos de hoje
// 			const pedidos = await prisma.pedido.findMany({
// 				where: {
// 					dataCriacao: {
// 						gte: hoje
// 					}
// 				},
// 				select: {
// 					dataCriacao: true
// 				}
// 			});

// 			// Agrupar por hora
// 			const pedidosPorHora = Array(24).fill().map((_, i) => ({
// 				hora: `${i}:00`,
// 				quantidade: 0
// 			}));

// 			// Contar pedidos por hora
// 			pedidos.forEach(pedido => {
// 				const hora = new Date(pedido.dataCriacao).getHours();
// 				pedidosPorHora[hora].quantidade += 1;
// 			});

// 			// Filtrar apenas as horas que já passaram hoje
// 			const horaAtual = new Date().getHours();
// 			const resultado = pedidosPorHora.slice(0, horaAtual + 1);

// 			res.json(resultado);
// 		} catch (error) {
// 			console.error("Erro ao buscar pedidos por hora:", error);
// 			res.status(500).json({ error: "Erro ao buscar pedidos por hora" });
// 		}
// 	},

// 	/**
// 	 * Obter resumo de vendas por período
// 	 */
// 	getResumoVendas: async (req, res) => {
// 		try {
// 			// Obter o período da query (hoje, semana, mes, ano)
// 			const periodo = req.query.periodo || 'semana';

// 			// Definir data de início com base no período
// 			let dataInicio = new Date();
// 			let dataInicioAnterior = new Date();

// 			switch (periodo) {
// 				case 'hoje':
// 					// Início do dia atual
// 					dataInicio.setHours(0, 0, 0, 0);
// 					// Dia anterior
// 					dataInicioAnterior.setDate(dataInicioAnterior.getDate() - 1);
// 					dataInicioAnterior.setHours(0, 0, 0, 0);
// 					break;
// 				case 'semana':
// 					// Início da semana atual (domingo)
// 					const diaSemana = dataInicio.getDay();
// 					dataInicio.setDate(dataInicio.getDate() - diaSemana);
// 					dataInicio.setHours(0, 0, 0, 0);
// 					// Semana anterior
// 					dataInicioAnterior.setDate(dataInicioAnterior.getDate() - diaSemana - 7);
// 					dataInicioAnterior.setHours(0, 0, 0, 0);
// 					break;
// 				case 'mes':
// 					// Início do mês atual
// 					dataInicio.setDate(1);
// 					dataInicio.setHours(0, 0, 0, 0);
// 					// Mês anterior
// 					dataInicioAnterior.setMonth(dataInicioAnterior.getMonth() - 1);
// 					dataInicioAnterior.setDate(1);
// 					dataInicioAnterior.setHours(0, 0, 0, 0);
// 					break;
// 				case 'ano':
// 					// Início do ano atual
// 					dataInicio.setMonth(0, 1);
// 					dataInicio.setHours(0, 0, 0, 0);
// 					// Ano anterior
// 					dataInicioAnterior.setFullYear(dataInicioAnterior.getFullYear() - 1);
// 					dataInicioAnterior.setMonth(0, 1);
// 					dataInicioAnterior.setHours(0, 0, 0, 0);
// 					break;
// 			}

// 			// Data final (agora)
// 			const dataFim = new Date();

// 			// Data final do período anterior
// 			const dataFimAnterior = new Date(dataInicio);
// 			dataFimAnterior.setMilliseconds(-1);

// 			// Buscar dados do período atual
// 			const [totalPedidos, faturamento, totalItens, pedidosConcluidos] = await Promise.all([
// 				// Total de pedidos
// 				prisma.pedido.count({
// 					where: {
// 						dataCriacao: {
// 							gte: dataInicio,
// 							lte: dataFim
// 						}
// 					}
// 				}),

// 				// Faturamento total
// 				prisma.pedido.aggregate({
// 					where: {
// 						dataCriacao: {
// 							gte: dataInicio,
// 							lte: dataFim
// 						},
// 						status: {
// 							notIn: ['cancelado']
// 						}
// 					},
// 					_sum: {
// 						valorTotal: true
// 					}
// 				}),

// 				// Total de itens vendidos
// 				prisma.itemPedido.aggregate({
// 					where: {
// 						pedido: {
// 							dataCriacao: {
// 								gte: dataInicio,
// 								lte: dataFim
// 							},
// 							status: {
// 								notIn: ['cancelado']
// 							}
// 						}
// 					},
// 					_sum: {
// 						quantidade: true
// 					}
// 				}),

// 				// Pedidos concluídos
// 				prisma.pedido.count({
// 					where: {
// 						dataCriacao: {
// 							gte: dataInicio,
// 							lte: dataFim
// 						},
// 						status: 'entregue'
// 					}
// 				})
// 			]);

// 			// Buscar dados do período anterior para comparação
// 			const [totalPedidosAnterior, faturamentoAnterior] = await Promise.all([
// 				// Total de pedidos
// 				prisma.pedido.count({
// 					where: {
// 						dataCriacao: {
// 							gte: dataInicioAnterior,
// 							lte: dataFimAnterior
// 						}
// 					}
// 				}),

// 				// Faturamento total
// 				prisma.pedido.aggregate({
// 					where: {
// 						dataCriacao: {
// 							gte: dataInicioAnterior,
// 							lte: dataFimAnterior
// 						},
// 						status: {
// 							notIn: ['cancelado']
// 						}
// 					},
// 					_sum: {
// 						valorTotal: true
// 					}
// 				})
// 			]);

// 			// Calcular ticket médio e taxa de conclusão
// 			const valorFaturamento = faturamento._sum.valorTotal || 0;
// 			const ticketMedio = totalPedidos > 0 ? valorFaturamento / totalPedidos : 0;
// 			const taxaConclusao = totalPedidos > 0 ? (pedidosConcluidos / totalPedidos) * 100 : 0;

// 			// Calcular crescimento em relação ao período anterior
// 			const valorFaturamentoAnterior = faturamentoAnterior._sum.valorTotal || 0;
// 			const crescimento = valorFaturamentoAnterior > 0
// 				? ((valorFaturamento - valorFaturamentoAnterior) / valorFaturamentoAnterior) * 100
// 				: 0;

// 			// Preparar resposta
// 			const resultado = {
// 				totais: {
// 					pedidos: totalPedidos,
// 					faturamento: valorFaturamento,
// 					ticketMedio: ticketMedio,
// 					itensVendidos: totalItens._sum.quantidade || 0,
// 					taxaConclusao: taxaConclusao
// 				},
// 				comparacao: {
// 					periodo: periodo,
// 					crescimento: crescimento
// 				}
// 			};

// 			res.json(resultado);
// 		} catch (error) {
// 			console.error("Erro ao buscar resumo de vendas:", error);
// 			res.status(500).json({ error: "Erro ao buscar resumo de vendas" });
// 		}
// 	},

// 	/**
// 	 * Obter pedidos recentes para o dashboard
// 	 */
// 	getPedidosRecentes: async (req, res) => {
// 		try {
// 			const limite = parseInt(req.query.limite) || 5;

// 			const pedidos = await prisma.pedido.findMany({
// 				take: limite,
// 				orderBy: {
// 					dataCriacao: 'desc'
// 				},
// 				include: {
// 					cliente: {
// 						select: {
// 							id: true,
// 							nome: true
// 						}
// 					}
// 				}
// 			});

// 			res.json(pedidos);
// 		} catch (error) {
// 			console.error("Erro ao buscar pedidos recentes:", error);
// 			res.status(500).json({ error: "Erro ao buscar pedidos recentes" });
// 		}
// 	}
// };

// module.exports = dashboardController;