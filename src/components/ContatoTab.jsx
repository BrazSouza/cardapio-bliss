import React from 'react';

const ContatoTab = () => {
	return (
		<div className="fade-in">
			<div className="banner">Entre em Contato</div>

			<div className="menu-items">
				<div className="menu-item">
					<div className="menu-item__info" style={{ padding: '20px' }}>
						<div className="menu-item__title">Informações de Contato</div>
						<div className="menu-item__description">
							<p>Telefone: (11) 99999-9999</p>
							<p>WhatsApp: (11) 99999-9999</p>
							<p>E-mail: contato@seurestaurante.com.br</p>
							<p>Endereço: Av. Principal, 123</p>
							<p>Horário de Funcionamento: 11h às 23h</p>
						</div>
						<div className="contact-buttons">
							<a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="whatsapp-button">
								Fale conosco pelo WhatsApp
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContatoTab;
