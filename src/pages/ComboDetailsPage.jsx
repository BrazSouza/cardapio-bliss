import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { menuData, adicionalItens } from '../../src/data/menuData';
import { useCart } from '../components/CartContext';

const ComboDetailsPage = () => {
  const { comboId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Encontrar o combo específico
  const combo = menuData.combos.find(c => c.id === parseInt(comboId));

  // Estado para gerenciar adicionais selecionados
  const [selectedAdditionals, setSelectedAdditionals] = useState([]);
  const [quantity, setQuantity] = useState(1);

  if (!combo) {
    return <div>Combo não encontrado</div>;
  }

  // Função para adicionar/remover adicional
  const toggleAdditional = (additional) => {
    setSelectedAdditionals(current =>
      current.some(a => a.id === additional.id)
        ? current.filter(a => a.id !== additional.id)
        : [...current, additional]
    );
  };

  // Calcular preço total
  const calculateTotal = () => {
    const additionalsTotal = selectedAdditionals.reduce((sum, additional) => sum + additional.price, 0);
    return (combo.price + additionalsTotal) * quantity;
  };

  // Função para adicionar ao carrinho
  const handleAddToCart = () => {
    // Adicionar o combo ao carrinho
    const comboItem = {
      ...combo,
      quantity,
      totalPrice: calculateTotal()
    };
    addToCart(comboItem);

    // Adicionar adicionais selecionados
    selectedAdditionals.forEach(additional => {
      const additionalItem = {
        ...additional,
        parentComboId: combo.id,
        parentComboName: combo.name,
        isAdditional: true,
        quantity,
        displayName: `${additional.name} (para ${combo.name})`
      };
      addToCart(additionalItem);
    });

    // Redirecionar para o carrinho
    navigate('/carrinho');
  };

  return (
    <div className="combo-details-page">
      <div className="combo-header">
        <h1>{combo.name}</h1>
        <p>{combo.description}</p>
        <h2>R$ {combo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
      </div>

      <div className="adicionais-section">
        <h3>Escolha os Adicionais:</h3>
        <p>Escolha até 15 opções</p>

        {adicionalItens.map((additional) => (
          <div
            key={additional.id}
            className="adicional-item"
            onClick={() => toggleAdditional(additional)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              borderBottom: '1px solid #eee',
              backgroundColor: selectedAdditionals.some(a => a.id === additional.id)
                ? '#f0f0f0'
                : 'white'
            }}
          >
            <div>
              <span>{additional.name}</span>
              <span style={{ marginLeft: '10px', color: 'blue' }}>
                R$ {additional.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              {selectedAdditionals.some(a => a.id === additional.id) ? '✓' : '+'}
            </div>
          </div>
        ))}
      </div>

      <div className="quantity-section" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px'
      }}>
        <div>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{ padding: '5px 10px' }}
          >
            -
          </button>
          <span style={{ margin: '0 10px' }}>{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            style={{ padding: '5px 10px' }}
          >
            +
          </button>
        </div>
        <div>
          <strong>Total: R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: 'lightblue',
          border: 'none',
          marginTop: '10px'
        }}
      >
        Adicionar R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </button>
    </div>
  );
};

export default ComboDetailsPage;