import React from 'react';
// Импортируйте ваши готовые иконки начала и конца вагона из Figma
import wagonHeaderIcon from '../../../assets/wagon-header.png'; 
import wagonFooterIcon from '../../../assets/wagon-footer.png';
import SecondClass from "../WagonScheme/SecondClass/SecondClass"
import "./WagonScheme.css"

// 🔴 ИСПРАВЛЕНО: Принимаем в пропсы объект текущего активного вагона (wagon) вместо wagons
export default function WagonScheme({ wagon, classType }) {
  
  // Защита от undefined данных при первой асинхронной загрузке
  if (!wagon) return <div className="wagon-loading-placeholder">Загрузка схемы вагона...</div>;

  const currentCoach = wagon.coach;
  const seatsList = wagon.seats || [];

  // Вычисляем реальное количество свободных мест на клиенте для проверки
  const freeSeatsCount = seatsList.filter(seat => seat.available).length;

  return (
    <div className="wagon-scheme-card">
      
      {/* Шапка схемы: выводит номер текущего вагона и сводную инфу */}
      <div className="wagon-scheme-header">
        <div className="wagon-scheme-header__num-block">
          {/* ✅ ИСПРАВЛЕНО: Переменная перепривязана к легитимному объекту currentCoach */}
          <span className="wagon-big-number">
            {String(currentCoach?.name || '01').padStart(2, '0')}
          </span> вагон
        </div>
        <div className="wagon-scheme-header__info">
          {/* ✅ ИСПРАВЛЕНО: Выводим реальное серверное количество мест */}
          <p>Свободных мест: <strong className="orange-text-bold">{wagon.avaliable_seats || freeSeatsCount}</strong></p>
        </div>
      </div>

      {/* 🚂 ГРАФИЧЕСКАЯ ИНТЕРАКТИВНАЯ КАРТА ВАГОНА */}
      <div className="wagon-map-layout">
        
        {/* Левая часть вагона (Голова поезда / тамбур) */}
        <div className="wagon-map-part wagon-map-part--header">
          <img src={wagonHeaderIcon} alt="Начало вагона" className="wagon-part-img" />
          <div className="wagon-number-label-inside-blueprint">
            {String(currentCoach?.name || '01').padStart(2, '0')}
          </div>
        </div>

        {/* Центральная часть вагона — Сетка интерактивных мест кресел */}
        <div className="wagon-map-part wagon-map-part--grid-center">
          {/* ✅ ИСПРАВЛЕНО: Разметка очищена от сломанных комментариев. 
             Если это Купе (second), вызываем ваш дочерний компонент отрисовки комнат */}
          {classType === 'second' && <SecondClass seats={seatsList} />}
          
        </div>

        {/* Правая часть вагона (Хвост поезда / туалеты) */}
        <div className="wagon-map-part wagon-map-part--footer">
          <img src={wagonFooterIcon} alt="Конец вагона" className="wagon-part-img" />
        </div>

      </div>

    </div>
  );
}