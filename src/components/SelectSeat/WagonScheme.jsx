import React from 'react';
// Импортируйте ваши готовые иконки начала и конца вагона из Figma
import wagonHeaderIcon from '../../assets/wagon-header.png'; 
import wagonFooterIcon from '../../assets/wagon-footer.png';

export default function WagonScheme({ wagon, classType }) {
  const currentCoach = wagon.coach;

  return (
    <div className="wagon-scheme-card">
      
      {/* Шапка схемы: выводит номер текущего вагона и сводную инфу */}
      <div className="wagon-scheme-header">
        <div className="wagon-scheme-header__num-block">
          <span className="wagon-big-number">{String(currentCoach?.name || '01').padStart(2, '0')}</span> вагон
        </div>
        <div className="wagon-scheme-header__info">
          <p>Свободных мест: <strong className="orange-text-bold">{wagon.avaliable_seats || 0}</strong></p>
        </div>
      </div>

      {/* 🚂 ГРАФИЧЕСКАЯ ИНТЕРАКТИВНАЯ КАРТА ВАГОНА */}
      <div className="wagon-map-layout">
        
        {/* Левая часть вагона (Голова поезда / тамбур) */}
        <div className="wagon-map-part wagon-map-part--header">
          <img src={wagonHeaderIcon} alt="Начало вагона" className="wagon-part-img" />
        </div>

        {/* Центральная часть вагона — Сетка интерактивных мест кресел */}
        <div className="wagon-map-part wagon-map-part--grid-center">
          <div className={`seats-interactive-grid seats-interactive-grid--${classType}`}>
            {wagon.seats?.map(seat => {
              const isAvailable = seat.available;
              return (
                <button
                  key={seat.index}
                  disabled={!isAvailable}
                  className={`interactive-seat-unit ${isAvailable ? 'is-free' : 'is-busy'}`}
                >
                  {seat.index}
                </button>
              );
            })}
          </div>
        </div>

        {/* Правая часть вагона (Хвост поезда / туалеты) */}
        <div className="wagon-map-part wagon-map-part--footer">
          <img src={wagonFooterIcon} alt="Конец вагона" className="wagon-part-img" />
        </div>

      </div>

    </div>
  );
}