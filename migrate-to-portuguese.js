const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Tabela de tradução (inglês -> português)
const modelTranslations = {
	'User': 'Usuario',
	'Category': 'Categoria',
	'Product': 'Produto',
	'Order': 'Pedido',
	'OrderItem': 'ItemPedido',
	'Address': 'Endereco',
	'ProductOption': 'OpcaoProduto',
	'ProductAddon': 'AdicionalProduto',
	'OrderItemOption': 'OpcaoItemPedido',
	'OrderItemAddon': 'AdicionalItemPedido',
};

const fieldTranslations = {
	// Campos de User
	'name': 'nome',
	'email': 'email', // manter igual
	'password': 'senha',
	'phone': 'telefone',
	'orders': 'pedidos',
	'addresses': 'enderecos',
	'favorites': 'favoritos',
	'favoritedBy': 'favoritadoPor',

	// Campos de Category
	'description': 'descricao',
	'products': 'produtos',
	'displayOrder': 'ordemExibicao',
	'isActive': 'ativo',

	// Campos de Product
	'price': 'preco',
	'promotionalPrice': 'precoPromocional',
	'imageUrl': 'imagemUrl',
	'ingredients': 'ingredientes',
	'prepTime': 'tempoPreparo',
	'calories': 'calorias',
	'isHighlighted': 'destaque',
	'isBestSeller': 'maisVendido',
	'available': 'disponivel',
	'isVegetarian': 'vegetariano',
	'isGlutenFree': 'semGluten',
	'isSpicy': 'picante',
	'categoryId': 'categoriaId',
	'category': 'categoria',
	'orderItems': 'itensPedido',
	'productOptions': 'opcoesProduto',
	'productAddons': 'adicionaisProduto',

	// Campos de Order
	'userId': 'usuarioId',
	'user': 'usuario',
	'status': 'status', // manter igual
	'total': 'total', // manter igual
	'deliveryFee': 'taxaEntrega',
	'paymentMethod': 'metodoPagamento',
	'items': 'itens',
	'notes': 'observacoes',
	'scheduledFor': 'agendadoPara',
	'addressId': 'enderecoId',
	'address': 'endereco',

	// Campos de OrderItem
	'orderId': 'pedidoId',
	'order': 'pedido',
	'productId': 'produtoId',
	'product': 'produto',
	'quantity': 'quantidade',
	'options': 'opcoes',
	'addons': 'adicionais',

	// Campos de Address
	'street': 'rua',
	'number': 'numero',
	'complement': 'complemento',
	'neighborhood': 'bairro',
	'city': 'cidade',
	'state': 'estado',
	'zipcode': 'cep',
	'isDefault': 'padrao',

	// Campos de ProductOption/OpcaoProduto
	'options': 'opcoes',
	'isRequired': 'obrigatorio',

	// Campos de ProductAddon/AdicionalProduto
	'available': 'disponivel',

	// Campos comuns
	'id': 'id', // manter igual
	'createdAt': 'criadoEm',
	'updatedAt': 'atualizadoEm',
};

// Tradução de valores específicos
const valueTranslations = {
	'pending': 'pendente',
	'confirmed': 'confirmado',
	'preparing': 'emPreparo',
	'ready': 'pronto',
	'delivering': 'emEntrega',
	'delivered': 'entregue',
	'cancelled': 'cancelado',
};

// Função para traduzir o conteúdo de um arquivo
function translateContent(content) {
	let translatedContent = content;

	// Traduzir modelos (com cuidado para não substituir substrings)
	Object.entries(modelTranslations).forEach(([english, portuguese]) => {
		const regex = new RegExp(`\\b${english}\\b`, 'g');
		translatedContent = translatedContent.replace(regex, portuguese);
	});

	// Traduzir campos (com cuidado para não substituir substrings)
	Object.entries(fieldTranslations).forEach(([english, portuguese]) => {
		const regex = new RegExp(`\\b${english}\\b`, 'g');
		translatedContent = translatedContent.replace(regex, portuguese);
	});

	// Traduzir valores específicos (com cuidado para não substituir substrings)
	Object.entries(valueTranslations).forEach(([english, portuguese]) => {
		const regex = new RegExp(`["']${english}["']`, 'g');
		translatedContent = translatedContent.replace(regex, `"${portuguese}"`);
	});

	return translatedContent;
}

// Função para traduzir o Schema do Prisma
function translatePrismaSchema(content) {
	let translatedContent = content;

	// Traduzir modelo
	Object.entries(modelTranslations).forEach(([english, portuguese]) => {
		const modelRegex = new RegExp(`model\\s+${english}\\s+{`, 'g');
		translatedContent = translatedContent.replace(modelRegex, `model ${portuguese} {`);
	});

	// Traduzir campos e relações
	Object.entries(fieldTranslations).forEach(([english, portuguese]) => {
		// Campo normal
		const fieldRegex = new RegExp(`\\b${english}\\s+`, 'g');
		translatedContent = translatedContent.replace(fieldRegex, `${portuguese} `);

		// Relação
		const relationRegex = new RegExp(`\\b${english}\\s+${modelTranslations[english] || english}\\b`, 'g');
		if (modelTranslations[english]) {
			translatedContent = translatedContent.replace(
				relationRegex,
				`${portuguese} ${modelTranslations[english]}`
			);
		}
	});

	return translatedContent;
}

// Função para processar recursivamente todos os arquivos em um diretório
async function processDirectory(dir) {
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			// Pular node_modules e .git
			if (entry.name !== 'node_modules' && entry.name !== '.git') {
				await processDirectory(fullPath);
			}
		} else if (entry.isFile()) {
			// Processar apenas arquivos .js e schema.prisma
			if (entry.name.endsWith('.js') || entry.name === 'schema.prisma') {
				try {
					const content = await readFile(fullPath, 'utf8');
					let translatedContent;

					if (entry.name === 'schema.prisma') {
						translatedContent = translatePrismaSchema(content);
					} else {
						translatedContent = translateContent(content);
					}

					if (content !== translatedContent) {
						console.log(`Atualizando arquivo: ${fullPath}`);
						await writeFile(fullPath, translatedContent, 'utf8');
					}
				} catch (error) {
					console.error(`Erro ao processar arquivo ${fullPath}:`, error);
				}
			}
		}
	}
}

// Função principal
async function main() {
	try {
		const rootDir = process.argv[2] || '.'; // Diretório passado como argumento ou diretório atual
		console.log(`Iniciando migração para português no diretório: ${rootDir}`);
		await processDirectory(rootDir);
		console.log('Migração concluída!');

		console.log('\nPróximos passos:');
		console.log('1. Verifique as mudanças em seu código com "git diff" ou similar');
		console.log('2. Gere uma nova migração do Prisma com "npx prisma migrate dev --name traducao_para_portugues"');
		console.log('3. Teste sua aplicação para garantir que tudo esteja funcionando corretamente');
	} catch (error) {
		console.error('Erro durante a migração:', error);
	}
}

// Executar o script
main();