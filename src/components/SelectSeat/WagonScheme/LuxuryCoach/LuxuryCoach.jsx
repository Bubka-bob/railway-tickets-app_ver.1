import React, { useContext } from "react";
import OrderContext from "../../../../components/context/OrderContext";
// ➔ 1. Импортируем наш универсальный изолированный хелпер
import { handleSeatSelection } from "../../../../utils/seatSelectionHelper"; 
import "./LuxuryCoach.css";

export default function LuxuryCoach({ seatsData = [], coachId, directionType, activeTicketType, maxLimits }) {
  const { orderState, setOrderState } = useContext(OrderContext);

  const dir = directionType || 'departure';
  const currentLeg = orderState?.legs?.[dir] || { routeDirectionId: null, seats: [] };
  const selectedSeatsList = (currentLeg.seats || []).filter(s => s && s.seatNumber !== null);

  const availableSeatsMap = seatsData.reduce((acc, seat) => {
    acc[seat.index] = seat.available;
    return acc;
  }, {});

  // ➔ 2. ТЕПЕРЬ ФУНКЦИЯ ВЫГЛЯДИТ ВОТ ТАК:
   const handleSeatClick = (number) => {
    setOrderState(prev => 
      handleSeatSelection(prev, dir, number, coachId, activeTicketType, maxLimits)
    );
  };

  const renderSeatButton = (number) => {
    const isAvailable = availableSeatsMap[number] ?? false;
    const seatObject = selectedSeatsList.find(
      s => String(s.coachId) === String(coachId) && s.seatNumber === number
    );
    const isSelected = !!seatObject;

    let className = 'luxury-seat';
    if (!isAvailable) className += ' luxury-seat--disabled';
    if (isSelected) {
      className += ' luxury-seat--selected';
      if (seatObject.includeChildrenSeat) className += ' luxury-seat--baby';
      else if (seatObject.isChild) className += ' luxury-seat--child';
    }

    return (
      <button 
      key={number} 
      type="button" 
      className={className} 
      disabled={!isAvailable} 
      onClick={() => handleSeatClick(number)}>
        {number}
      </button>
    );
  };

  // ... Твой цикл генерации 8 купе Люкса
  const compartments = [];
  for (let i = 0; i < 8; i++) {
    const leftSeat = i * 2 + 1;
    const rightSeat = i * 2 + 2;
    compartments.push(
      <div key={`section-${i}`} className="luxury-section-block">
        <div className="luxury-compartment-room">
          {renderSeatButton(leftSeat)}
          <div className="luxury-room-window-space"></div>
          {renderSeatButton(rightSeat)}
        </div>
        <div className="luxury-corridor-sector"></div>
      </div>
    );
  }

  return <div className="luxury-coach-body-inner">{compartments}</div>;
}