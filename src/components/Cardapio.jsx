import React, { useState, useEffect } from 'react';
import { menuData } from '../../src/data/menuData'
import MenuTab from './MenuTab'; // Ajuste o caminho conforme necessário

const Cardapio = ({ pedirViaWhatsApp }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [activeCategory, setActiveCategory] = useState('todos');
	const [showCategories, setShowCategories] = useState({});

	// Inicializar estado de visibilidade das categorias
	useEffect(() => {
		const initialShowCategories = {};
		Object.keys(menuData).forEach((category) => {
			initialShowCategories[category] = true;
		});
		setShowCategories(initialShowCategories);
	}, []);


	return (
		<MenuTab
			menuData={menuData}
			activeCategory={activeCategory}
			setActiveCategory={setActiveCategory}
			searchTerm={searchTerm}
			setSearchTerm={setSearchTerm}
			showCategories={showCategories}
			pedirViaWhatsApp={pedirViaWhatsApp}
		/>
	);
};

export default Cardapio;