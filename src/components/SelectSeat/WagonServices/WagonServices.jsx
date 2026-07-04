import React, { useState } from 'react';
import './WagonServices.css';
import SVGicon from '../../SVGicon/SVGicon';

export default function WagonServices({ coach }) {
  const [selectedServices, setSelectedServices] = useState([]);

  // Добавляем точный текст подсказок из Figma
  const servicesConfig = [
    { 
      id: 'air', 
      iconName: 'have_air_conditioning', 
      apiField: coach?.have_air_conditioning,
      tooltipText: 'кондиционер' 
    },
    { 
      id: 'wifi', 
      iconName: 'have_wifi', 
      apiField: coach?.have_wifi,
      tooltipText: 'Wi-Fi' 
    },
    { 
      id: 'linens', 
      iconName: 'have_bed_linen', 
      apiField: coach?.is_linens_included,
      tooltipText: 'белье' 
    }
  ];

  const handleServiceClick = (id, isIncluded) => {
    if (isIncluded) return;
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="wagon-services-section">
      <span className="wagon-stat-item__label">
        Обслуживание <span className="sub-label-gray">ФПК</span>
      </span>
      
      <div className="wagon-services-icons">
        {servicesConfig.map(({ id, iconName, apiField, tooltipText }) => {
          const isIncluded = apiField === true;
          const isSelected = selectedServices.includes(id);

          let stateClass = 'service-btn--unselected';
          if (isIncluded) stateClass = 'service-btn--included';
          if (isSelected) stateClass = 'service-btn--selected';

          return (
            <button
              key={id}
              type="button"
              className={`service-btn ${stateClass}`}
              onClick={() => handleServiceClick(id, isIncluded)}
              disabled={isIncluded}
              /* ➔ Передаем текст подсказки в CSS через дата-атрибут */
              data-tooltip={tooltipText}
            >
              <span className="service-btn__icon-wrapper">
                <SVGicon name={iconName} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}