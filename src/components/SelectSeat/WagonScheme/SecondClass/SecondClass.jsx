import React from 'react';
import './SecondClass.css';

export default function SecondClass({ seats, onSeatClick, selectedSeats = [] }) {
  const safeSeats = Array.isArray(seats) ? seats : [];

  // Фильтруем плоский массив с бэкенда на две независимые горизонтальные линии
  const topBerths = safeSeats.filter(seat => seat.index % 2 === 0);   // Чётные — верхний ряд (2, 4, 6...)
  const bottomBerths = safeSeats.filter(seat => seat.index % 2 !== 0); // Нечётные — нижний ряд (1, 3, 5...)

  // Универсальная функция рендеринга одной интерактивной кнопки-полки
  const renderSeatButton = (seatObj) => {
    const isFree = seatObj.available;
    const isChosen = selectedSeats.includes(seatObj.index);

    return (
      <button
        key={seatObj.index}
        disabled={!isFree}
        type="button"
        className={`seat-chip-unit ${isFree ? 'is-available' : 'is-booked'} ${isChosen ? 'is-chosen' : ''}`}
        onClick={() => onSeatClick && onSeatClick(seatObj.index)}
      >
        {seatObj.index}
      </button>
    );
  };

  return (
    <div className="wagon-second-class-wrapper">
      <div className="compartments-grid-container">
        
        {/* ВЕРХНИЙ РЯД ПОЛОК (Чётные места: 2, 4, 6, 8... 32) */}
        <div className="compartment-horizontal-track compartment-horizontal-track--top">
          {topBerths.map(renderSeatButton)}
        </div>

        {/* НИЖНИЙ РЯД ПОЛОК (Нечётные места: 1, 3, 5, 7... 31) */}
        <div className="compartment-horizontal-track compartment-horizontal-track--bottom">
          {bottomBerths.map(renderSeatButton)}
        </div>

      </div>
    </div>
  );
}