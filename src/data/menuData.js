export const menuData = {
    lanches: [
        {
            id: 1,
            name: 'Hamburguer',
            description: 'Pão, bife de Hamburguer, alface, tomate, milho e batata palha',
            price: 15.50,
            image: 'https://static.vecteezy.com/ti/vetor-gratis/p1/22915253-hamburguer-ilustracao-hamburguer-desenho-animado-ilustracao-para-criancas-livro-gratis-vetor.jpg',
        },
        {
            id: 2,
            name: 'Cheeseburger Bacon',
            description: 'Pão, hambúrguer 180g, queijo cheddar, bacon crocante, cebola caramelizada e molho barbecue.',
            price: 29.9,
            image: '/api/placeholder/120/120',
        },
        {
            id: 3,
            name: 'Burger Vegetariano',
            description: 'Pão integral, hambúrguer de grão de bico, rúcula, tomate seco e molho de ervas.',
            price: 27.9,
            image: '/api/placeholder/120/120',
        },
    ],

    combos: [
        {
            id: 4,
            name: 'Combo Tradicional',
            description: 'Hambúrguer clássico + batata frita média + refrigerante 350ml.',
            price: 39.9,
            image: '/api/placeholder/120/120',
            category: 'combos'
        },
        {
            id: 5,
            name: 'Combo Família',
            description: '2 hambúrgueres + 2 porções de batata frita + 4 refrigerantes.',
            price: 89.9,
            image: '/api/placeholder/120/120',
            category: 'combos'
        },
    ],

    porções: [
        {
            id: 6,
            name: 'Batata Frita',
            description: 'Porção média de batatas fritas crocantes.',
            price: 19.9,
            image: '/api/placeholder/120/120',
        },
        {
            id: 7,
            name: 'Nuggets',
            description: '10 unidades de nuggets de frango.',
            price: 24.9,
            image: '/api/placeholder/120/120',
        },
    ],

    jantarFamilia: [
        {
            id: 8,
            name: 'Batata Frita',
            description: 'Porção média de batatas fritas crocantes.',
            price: 19.9,
            image: '/api/placeholder/120/120',
        },
        {
            id: 9,
            name: 'Nuggets',
            description: '10 unidades de nuggets de frango.',
            price: 24.9,
            image: '/api/placeholder/120/120',
        },
    ],
    pratoDeFrios: [
        {
            id: 10,
            name: 'Batata Frita',
            description: 'Porção média de batatas fritas crocantes.',
            price: 19.9,
            image: '/api/placeholder/120/120',
        },
        {
            id: 11,
            name: 'Nuggets',
            description: '10 unidades de nuggets de frango.',
            price: 24.9,
            image: '/api/placeholder/120/120',
        },
    ],

    bebidas: [
        {
            id: 12,
            name: 'Refrigerante',
            description: 'Lata 350ml. Coca-cola, Guaraná ou Sprite.',
            price: 6.9,
            image: '/api/placeholder/120/120',
        },
        {
            id: 13,
            name: 'Suco Natural',
            description: '300ml. Laranja, abacaxi ou maracujá.',
            price: 9.9,
            image: '/api/placeholder/120/120',
        },
    ],

    sobremesas: [
        {
            id: 14,
            name: 'Brownie com Sorvete',
            description: 'Brownie caseiro com bola de sorvete de creme.',
            price: 15.9,
            image: '/api/placeholder/120/120',
        },
    ],

    açai: [
        {
            id: 15,
            name: 'Brownie com Sorvete',
            description: 'Brownie caseiro com bola de sorvete de creme.',
            price: 15.9,
            image: '/api/placeholder/120/120',
        },
    ],
};

export const adicionalItens = [
    {
        id: 'adicional-bacon',
        name: 'Bacon',
        price: 5.00,
        icon: '🥓'
    },
    {
        id: 'adicional-queijo',
        name: 'Queijo Extra',
        price: 2.50,
        icon: '🧀'
    },
    {
        id: 'adicional-ovo',
        name: 'Ovo',
        price: 2.50,
        icon: '🥚'
    },
    {
        id: 'adicional-cheddar',
        name: 'Cheddar',
        price: 2.00,
        icon: '🧀'
    },
    // Adicione os outros adicionais aqui
];

export const combos = [
    {
        id: 'combo-tradicional',
        name: 'Combo Tradicional',
        price: 39.90
    },
    {
        id: 'combo-familia',
        name: 'Combo Família',
        price: 89.90
    }
];