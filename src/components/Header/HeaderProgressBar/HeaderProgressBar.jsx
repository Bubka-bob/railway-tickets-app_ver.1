import React from 'react';
import './HeaderProgressBar.css'
import ticketIcon from '../../../assets/order-step-1.png';
import passengersIcon from '../../../assets/order-step-2.png';
import paymentIcon from '../../../assets/order-step-3.png';
import confirmIcon from '../../../assets/order-step-4.png';

export default function HeaderProgressBar({ currentStep = 1 }) {
  // Определяем, какую картинку фона применить в зависимости от активного шага
  const getBgImage = () => {
    switch (currentStep) {
      case 1: return ticketIcon;
      case 2: return passengersIcon;
      case 3: return paymentIcon;
      case 4: return confirmIcon;
      default: return ticketIcon;
    }
  };

  const steps = [
    { id: 1, text: 'Билеты' },
    { id: 2, text: 'Пассажиры' },
    { id: 3, text: 'Оплата' },
    { id: 4, text: 'Проверка' }
  ];

  return (
    <div 
      className="progress-bar-container" 
      style={{ backgroundImage: `url(${getBgImage()})` }}
    >
      <div className="progress-bar-grid">
        {steps.map((step) => (
          <div key={step.id} className="progress-grid-cell">
            <div className="progress-step__content">
              <span className="progress-step__number">{step.id}</span>
              <span className="progress-step__text">{step.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}