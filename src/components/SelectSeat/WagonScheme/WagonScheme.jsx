import React from 'react';
// Импортируем готовые иконки начала и конца вагона из Figma (у тебя это PNG)
import wagonHeaderIcon from '../../../assets/wagon-header.png'; 
import wagonFooterIcon from '../../../assets/wagon-footer.png';

// Импорт дочерних схем вагонов
import SecondCoach from "./SecondCoach/SecondCoach";
import LuxuryCoach from "./LuxuryCoach/LuxuryCoach";
import ThirdCoach from "./ThirdCoach/ThirdCoach";
import FourthCoach from "./FourthCoach/FourthCoach";

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
         
          {classType === 'first' && (
            <LuxuryCoach 
              seatsData={seatsList} 
              coachId={coachId} 
              directionType={directionType}
              activeTicketType={activeTicketType}
              maxLimits={maxLimits}
              coachData={currentCoach}
            />
          )}
          
          {classType === 'second' && (
            <SecondCoach 
              seatsData={seatsList} 
              coachId={coachId} 
              directionType={directionType}
              activeTicketType={activeTicketType}
              maxLimits={maxLimits}
              coachData={currentCoach}
            />
          )}
           
          {classType === 'third' && (
            <ThirdCoach 
              seatsData={seatsList} 
              coachId={coachId} 
              directionType={directionType}
              activeTicketType={activeTicketType}
              maxLimits={maxLimits}
              coachData={currentCoach}
            />
          )}

          {classType === 'fourth' && (
            <FourthCoach 
              seatsData={seatsList} 
              coachId={coachId} 
              directionType={directionType}
              activeTicketType={activeTicketType}
              maxLimits={maxLimits}
              coachData={currentCoach}
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