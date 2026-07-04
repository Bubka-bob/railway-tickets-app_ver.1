import React from "react";
import "./LuxuryCoach.css";

export default function LuxuryCoach({ seatsData = [], coachId, selectedSeats = [], onSeatToggle }) {
  const availableSeatsMap = seatsData.reduce((acc, seat) => {
    acc[seat.index] = seat.available;
    return acc;
  }, {});

  const renderSeatButton = (number) => {
    const isAvailable = availableSeatsMap[number] ?? false;
    const isSelected = selectedSeats.includes(`${coachId}_${number}`);

    let className = 'luxury-seat';
    if (!isAvailable) className += ' luxury-seat--disabled';
    if (isSelected) className += ' luxury-seat--selected';

    return (
      <button
        key={number}
        type="button"
        className={className}
        disabled={!isAvailable}
        onClick={() => onSeatToggle && onSeatToggle(number, coachId)}
      >
        {number}
      </button>
    );
  };

  const sections = [];
  for (let i = 0; i < 8; i++) {
    const leftSeat = i * 2 + 1;
    const rightSeat = i * 2 + 2;

    sections.push(
      <div key={`section-${i}`} className="luxury-section-block">
        {/* Верхняя часть — жилая комната купе */}
        <div className="luxury-compartment-room">
          {renderSeatButton(leftSeat)}
          <div className="luxury-room-window-space"></div> {/* Пространство между местами */}
          {renderSeatButton(rightSeat)}
        </div>
        {/* Нижняя часть — сектор коридора под этим купе */}
        <div className="luxury-corridor-sector"></div>
      </div>
    );
  }

  return (
    <div className="luxury-coach-body-inner">
      {sections}
    </div>
  );
}