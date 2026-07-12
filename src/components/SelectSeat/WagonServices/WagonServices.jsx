import React, { useState } from 'react';
import './WagonServices.css';
import SVGicon from '../../SVGicon/SVGicon';
import OrderContext from '../../context/OrderContext'; 

export default function WagonServices({ 
  coach,
  onToggleService, 
  currentDirection, 
  activeClassType,
  localServices // <-- Принимаем данные о выбранных сервисах
}) {
  const config = [
    { id: 'linens', iconName: 'have_bed_linen', apiField: coach.is_linens_included, price: coach.linens_price || 0 },
    { id: 'wifi', iconName: 'have_wifi', apiField: coach.have_wifi, price: coach.wifi_price || 0 }
  ];

  return (
    <div className="wagon-services-section">
      <span className="wagon-stat-item__label">Обслуживание <span className="sub-label-gray">ФПК</span></span>
      <div className="wagon-services-icons">
        {config.map(({ id, iconName, apiField, price }) => {
          const isIncluded = apiField === true; // В стоимость билета включено

          // ✅ ИСПРАВЛЕНИЕ: Проверка должна идти по конкретному вагону!
          // Мы ищем объект с ключом вида "departure_63d4f21c987654" или "arrival_63d4f21c987654"
          const serviceKey = `${currentDirection}_${coach?._id}`;
          const isSelected = !isIncluded && !!localServices[serviceKey]?.[id]; // Выбрано пользователем?

          let stateClass = 'service-btn--unselected';
          if (isIncluded) stateClass = 'service-btn--included'; // Серый фон
          else if (isSelected) stateClass = 'service-btn--selected'; // Оранжевый квадрат

          return (
            <button
              key={id}
              type="button"
              className={`service-btn ${stateClass}`}
              onClick={() => !isIncluded && onToggleService(serviceKey, id, price)} 
              disabled={isIncluded} // Заблокировано, если белье уже входит в цену билета
              data-tooltip={id === 'linens' ? 'белье' : 'Wi-Fi'}
            >
              <SVGicon name={iconName} />
            </button>
          );
        })}
      </div>
    </div>
  );
}