// Configuração para testes com Jest e React Testing Library
import '@testing-library/jest-dom';

// Mock para o axios
jest.mock('axios', () => ({
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
	delete: jest.fn(),
	patch: jest.fn(),
}));

// Mock para react-router-dom
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => jest.fn(),
	useParams: () => ({}),
	useLocation: () => ({
		pathname: '/'
	})
}));

// Mock para localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
});

// Silenciar warnings de console durante testes
console.error = jest.fn();
console.warn = jest.fn();