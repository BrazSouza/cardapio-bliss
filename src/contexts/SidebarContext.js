import React, { createContext, useState, useEffect, useContext } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			if (window.innerWidth >= 768) {
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		return () => {
			window.removeEventListener('resize', checkScreenSize);
		};
	}, []);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<SidebarContext.Provider value={{ isExpanded: isOpen, toggleSidebar }}>
			{children}
		</SidebarContext.Provider>
	);
};

// ✅ Adicione esta função:
export const useSidebarContext = () => {
	return useContext(SidebarContext);
};

export default SidebarProvider;
