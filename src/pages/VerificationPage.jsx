import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import FooterNavigation from '../components/FooterNavigation';

const VerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const codeInputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { fullName, email, phoneNumber } = location.state || {};

  // Função para enviar código de verificação para o WhatsApp
  const sendVerificationCode = useCallback(async () => {
    setIsLoading(true);

    try {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Código de verificação gerado: ${randomCode}`);

      await new Promise(resolve => setTimeout(resolve, 1500));

      sessionStorage.setItem('verificationCode', randomCode);
      setCodeSent(true);
      alert(`Simulação: Código ${randomCode} enviado para ${phoneNumber} via WhatsApp`);
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      alert('Não foi possível enviar o código de verificação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber]);


  useEffect(() => {
    // Enviar o código assim que o componente for montado
    if (!codeSent) {
      sendVerificationCode();
    }

    // Focus no primeiro input
    if (codeInputs.current[0]) {
      codeInputs.current[0].focus();
    }

    // Setup countdown timer
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [codeSent, phoneNumber, sendVerificationCode]);

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    // Update code array
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-advance to next input
    if (value && index < 5 && codeInputs.current[index + 1]) {
      codeInputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputs.current[index - 1].focus();
    }
  };

  const handleResendCode = () => {
    setTimer(30);
    sendVerificationCode();
  };

  const handleContinue = () => {
    // Check if code is complete
    if (verificationCode.some(digit => digit === '')) {
      alert('Por favor, insira o código completo');
      return;
    }

    // Verificar se o código inserido corresponde ao código armazenado
    const enteredCode = verificationCode.join('');
    const storedCode = sessionStorage.getItem('verificationCode');

    if (enteredCode === storedCode) {
      // Código correto - salvar dados do usuário em localStorage para persistência
      const userData = {
        fullName,
        email,
        phoneNumber,
        isAuthenticated: true
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      navigate('/perfil', {
        state: {
          fullName,
          email,
          phoneNumber,
          registered: true
        }
      });
    } else {
      alert('Código de verificação incorreto. Por favor, tente novamente.');
      // Limpar os campos de código
      setVerificationCode(['', '', '', '', '', '']);
      if (codeInputs.current[0]) {
        codeInputs.current[0].focus();
      }
    }
  };

  return (
    <div className="verification-page">
      <Header title="ENTRAR OU CADASTRAR" showBackButton={true} />

      <div className="content-container">
        <div className="page-title">
          <h2>Confirme seu celular</h2>
          <p>Digite o código de 6 dígitos que enviamos por WhatsApp para <strong>{phoneNumber}</strong>.</p>
        </div>

        {isLoading ? (
          <div className="text-center my-4">
            <p>Enviando código de verificação...</p>
            <div className="spinner-border text-primary">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : (
          <div className="verification-code-container">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={el => codeInputs.current[index] = el}
                type="text"
                className="verification-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
        )}

        <div className="resend-container">
          {timer > 0 ? (
            <p>Não recebeu o código? Tente novamente em {timer}s</p>
          ) : (
            <button className="text-button" onClick={handleResendCode} disabled={isLoading}>
              Reenviar código
            </button>
          )}
        </div>

        <button
          className={`primary-button ${verificationCode.some(digit => digit === '') || isLoading ? 'disabled' : ''}`}
          onClick={handleContinue}
          disabled={verificationCode.some(digit => digit === '') || isLoading}
        >
          Continuar
        </button>
      </div>

      <FooterNavigation activeTab="profile" />
    </div>
  );
};

export default VerificationPage;