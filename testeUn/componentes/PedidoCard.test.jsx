import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

// Mock do módulo de contexto de autenticação
jest.mock('../context/AuthContext', () => ({
	useAuth: () => ({
		login: jest.fn().mockImplementation((email, password) => {
			if (email === 'admin@example.com' && password === 'password') {
				return Promise.resolve({ success: true });
			}
			return Promise.reject(new Error('Credenciais inválidas'));
		}),
		isAuthenticated: false
	})
}));

describe('Login Component', () => {
	beforeEach(() => {
		// Limpar mocks entre testes
		jest.clearAllMocks();
	});

	test('renderiza formulário de login corretamente', () => {
		render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		);

		expect(screen.getByText(/Acesso ao Painel Administrativo/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
	});

	test('exibe erro quando campos estão vazios', async () => {
		render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		);

		// Clicar no botão de login sem preencher os campos
		fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

		// Verificar se as mensagens de erro aparecem
		await waitFor(() => {
			expect(screen.getByText(/E-mail é obrigatório/i)).toBeInTheDocument();
			expect(screen.getByText(/Senha é obrigatória/i)).toBeInTheDocument();
		});
	});

	test('chama função de login com credenciais corretas', async () => {
		// Mock da função login
		const mockLogin = jest.fn().mockResolvedValue({ success: true });

		// Mock do contexto de autenticação
		jest.mock('../context/AuthContext', () => ({
			useAuth: () => ({
				login: mockLogin,
				isAuthenticated: false
			})
		}));

		render(
			<BrowserRouter>
				<Login />
			</BrowserRouter>
		);

		// Preencher formulário
		fireEvent.change(screen.getByLabelText(/E-mail/i), {
			target: { value: 'admin@example.com' }
		});

		fireEvent.change(screen.getByLabelText(/Senha/i), {
			target: { value: 'password' }
		});

		// Submeter formulário
		fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

		// Verificar se a função de login foi chamada com os valores corretos
		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'password');
		});
	});
});