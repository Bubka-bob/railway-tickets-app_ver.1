import React from 'react';
// Импортируем готовые иконки начала и конца вагона из Figma (у тебя это PNG)
import wagonHeaderIcon from '../../../assets/wagon-header.png'; 
import wagonFooterIcon from '../../../assets/wagon-footer.png';

// Импорт дочерних схем вагонов
import SecondClass from "../WagonScheme/SecondClass/SecondClass";
import LuxuryCoach from "../WagonScheme/LuxuryCoach/LuxuryCoach"; // ➔ ДОБАВЛЕНО: Импортируем наш Люкс

import "./WagonScheme.css";

export default function WagonScheme({ wagon, classType, directionType, activeTicketType, maxLimits }) {
  if (!wagon) return <div className="wagon-loading-placeholder">Загрузка схемы вагона...</div>;

  const currentCoach = wagon.coach;
  const seatsList = wagon.seats || [];
  const coachId = currentCoach?._id;

  // Очищаем и форматируем номер вагона (только цифры)
  const wagonNum = currentCoach?.name ? currentCoach.name.replace(/\D/g, '') : '01';

  return (
    <div className="wagon-scheme-card">
      
      {/* 🚂 ГРАФИЧЕСКАЯ ИНТЕРАКТИВНАЯ КАРТА ВАГОНА */}
      <div className="wagon-map-layout">
        
        {/* Левая часть вагона (Голова поезда / тамбур) */}
        <div className="wagon-map-part wagon-map-part--header">
          {/* Чёрная плашка с номером вагона вынесена наверх над тамбуром */}
          <div className="wagon-number-top-badge">
            {wagonNum.padStart(2, '0')}
          </div>
          <img src={wagonHeaderIcon} alt="Начало вагона" className="wagon-part-img" />
        </div>

        {/* Центральная часть вагона — Сетка интерактивных мест кресел */}
        <div className="wagon-map-part wagon-map-part--grid-center">
          
          {/* ✅ Купе (SecondClass) — спускаем пропсы ниже */}
          {classType === 'second' && (
            <SecondClass 
              seatsData={seatsList} 
              coachId={coachId} 
              directionType={directionType}
              activeTicketType={activeTicketType}
              maxLimits={maxLimits}
            />
          )}

          {/* ✅ Люкс (LuxuryCoach) — спускаем пропсы ниже */}
          {classType === 'first' && (
            <LuxuryCoach 
              seatsData={seatsList} 
              coachId={coachId} 
              directionType={directionType}
              activeTicketType={activeTicketType}
              maxLimits={maxLimits}
            />
          )}
        </div>

        {/* Правая часть вагона (Хвост поезда / туалеты) */}
        <div className="wagon-map-part wagon-map-part--footer">
          <img src={wagonFooterIcon} alt="Конец вагона" className="wagon-part-img" />
        </div>

      </div>

    </div>
  );
}