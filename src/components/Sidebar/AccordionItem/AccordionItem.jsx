import React, { useState } from 'react';
import plusIcon from '/src/assets/plus.png';
import minusIcon from '/src/assets/minus.png';
import "./AccordionItem.css"
export default function FilterAccordion({ title, children, defaultOpen = true }) {
  // Локальный стейт, который управляет видимостью (открыт/закрыт)
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="filter-accordion-unit">
      
      {/* Шапка аккордеона (Кликабельная строчка) */}
      <div className="filter-accordion-unit__header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        
        {/* Компактная кнопка-иконка переключения */}
        <div className="filter-accordion-unit__toggle-btn">
          <img 
            src={isOpen ? minusIcon : plusIcon} 
            alt={isOpen ? "Свернуть" : "Развернуть"} 
            className="filter-accordion-unit__icon" 
          />
        </div>
      </div>

      {/* Выдвижное контентное поле ползунков времени */}
      <div className={`filter-accordion-unit__body ${isOpen ? 'is-open' : 'is-closed'}`}>
        <div className="filter-accordion-unit__content-wrapper">
          {children}
        </div>
      </div>

    </div>
  );
}