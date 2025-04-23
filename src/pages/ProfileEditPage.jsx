import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';

const ProfileEditPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth(); // Captura tudo o que useAuth retorna

	const [isSaving, setIsSaving] = useState(false);
	const [fullName, setFullName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [address, setAddress] = useState({
		street: '',
		number: '',
		complement: '',
		neighborhood: '',
		city: '',
		state: '',
		zipCode: ''
	});

	useEffect(() => {
		// Carregar dados do usuário do state ou localStorage
		const userData = location.state || JSON.parse(localStorage.getItem('user') || '{}');

		if (userData) {
			setFullName(userData.fullName || '');
			setPhoneNumber(userData.phoneNumber || '');
			setAddress(userData.address || {
				street: '',
				number: '',
				complement: '',
				neighborhood: '',
				city: '',
				state: '',
				zipCode: ''
			});
		}
	}, [location.state]);

	const handleAddressChange = (field, value) => {
		setAddress(prev => ({
			...prev,
			[field]: value
		}));
	};

	// No handleSave do ProfileEditPage.js
	const handleSave = () => {
		// ... validação existente ...

		setIsSaving(true);

		try {
			const updatedUserData = {
				fullName,
				phoneNumber,
				address,
				isAuthenticated: true
			};

			// Salvar no localStorage
			localStorage.setItem('user', JSON.stringify(updatedUserData));

			// Atualizar o estado do usuário no AuthContext antes de navegar
			if (auth.register) {
				auth.register(updatedUserData).then(() => {
					// Navegue apenas após o estado ser atualizado
					navigate('/cardapio');
				});
			} else {
				// Fallback caso register não esteja disponível
				navigate('/cardapio', { state: updatedUserData });
			}
		} catch (error) {
		}
	};
	return (
		<div className="profile-edit-page">
			<div className="content-container">
				<div className="form-group">
					<label className="form-label">Nome completo *</label>
					<input
						type="text"
						className="form-input"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						placeholder="Digite seu nome completo"
					/>
				</div>

				<div className="form-group">
					<label className="form-label">Telefone *</label>
					<div className="phone-input-container">
						<div className="country-code">
							<div className="flag">🇧🇷</div>
							<span>+55</span>
						</div>
						<input
							type="tel"
							className="phone-input"
							placeholder="(XX) XXXXX-XXXX"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
						/>
					</div>
				</div>

				<h2 className="mt-4">Endereço</h2>
				<div className="form-row">
					<div className="form-group">
						<label className="form-label">Bairro *</label>
						<input
							type="text"
							className="form-input"
							value={address.neighborhood}
							onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
							placeholder="Nome do bairro"
						/>
					</div>

					<div className="form-group col-8">
						<label className="form-label">Rua *</label>
						<input
							type="text"
							className="form-input"
							value={address.street}
							onChange={(e) => handleAddressChange('street', e.target.value)}
							placeholder="Nome da rua"
						/>
					</div>
				</div>

				<div className="form-row">
					<div className="form-group col-8">
						<label className="form-label">Cidade *</label>
						<input
							type="text"
							className="form-input"
							value={address.city}
							onChange={(e) => handleAddressChange('city', e.target.value)}
							placeholder="Nome da cidade"
						/>
					</div>

					<div className="form-group col-4">
						<label className="form-label">Número *</label>
						<input
							type="number"
							className="form-input"
							value={address.number}
							onChange={(e) => handleAddressChange('number', e.target.value)}
							placeholder="123"
						/>
					</div>
				</div>

				<div className="form-group">
					<label className="form-label">Complemento</label>
					<input
						type="text"
						className="form-input"
						value={address.complement}
						onChange={(e) => handleAddressChange('complement', e.target.value)}
						placeholder="Apto, Bloco, etc."
					/>
				</div>

				<button
					className={`primary-button mb-5 ${isSaving ? 'disabled' : ''}`}
					onClick={handleSave}
					disabled={isSaving}
				>
					{isSaving ? 'Salvando...' : 'Salvar'}
				</button>
			</div>
		</div>
	);
};

export default ProfileEditPage;