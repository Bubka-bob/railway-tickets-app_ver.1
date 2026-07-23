import React, { useContext } from "react";
import OrderContext from "../../../context/OrderContext";
import { handleSeatSelection } from "../../../../utils/seatSelectionHelper"; 
import "./SecondCoach.css";

export default function CompartmentCoach({ seatsData = [], coachId, directionType, activeTicketType, maxLimits, coachData }) {
  const { orderState, setOrderState } = useContext(OrderContext);
  const currentCoachObject = coachData?.coach || coachData;
  const dir = directionType || 'departure';

  const currentLegSeats = orderState?.legs?.[dir]?.seats || [];
  const selectedSeatsList = currentLegSeats.filter(s => s && s.seatNumber !== null && s.seatNumber !== undefined);

  const availableSeatsMap = seatsData.reduce((acc, seat) => {
    acc[seat.index] = seat.available;
    return acc;
  }, {});

  const handleSeatClick = (number) => {
    setOrderState(prev => 
      handleSeatSelection(prev, dir, number, coachId, activeTicketType, maxLimits, currentCoachObject)
    );
  };

  const renderSeatButton = (number) => {
    const isAvailable = availableSeatsMap[number] ?? false;
    const seatObject = selectedSeatsList.find(
      s => String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number)
    );
    const isSelected = !!seatObject;

    let className = 'compartment-seat-node';
    if (!isAvailable) className += ' is-disabled';
    if (isSelected) {
      className += ' is-selected';
      if (seatObject.includeChildrenSeat) className += ' has-baby';
      else if (seatObject.isChild) className += ' is-child-type';
    }

    return (
      <button
        key={number}
        type="button"
        className={className}
        disabled={!isAvailable}
        onClick={() => handleSeatClick(number)}
      >
        {number}
      </button>
    );
  };

  // 🔥 ГЕНЕРИРУЕМ СТРОГО 8 КУПЕЙНЫХ КОМНАТ (МЕСТА С 1 ПО 32)
   const coupes = [];
  for (let i = 0; i < 8; i++) {
    const firstBottom = i * 4 + 1;
    const firstTop = i * 4 + 2;
    const secondBottom = i * 4 + 3;
    const secondTop = i * 4 + 4;

    coupes.push(
      <div key={`coupe-section-${i}`} className="netology-coupe-room-block">
        <div className="netology-coupe-seats-zone">
          
          {/* Левая вертикальная пара (со своей нижней стеной) */}
          <div className="netology-vertical-seats-pair">
            {renderSeatButton(firstTop)}
            {renderSeatButton(firstBottom)}
          </div>

          {/* 🔥 Дверной проем (проход) строго посередине купе */}
          <div className="netology-coupe-middle-door" />

          {/* Правая вертикальная пара (со своей нижней стеной) */}
          <div className="netology-vertical-seats-pair">
            {renderSeatButton(secondTop)}
            {renderSeatButton(secondBottom)}
          </div>

        </div>

        {/* Засечка коридора на стыке купе */}
        <div className="netology-corridor-notch" />
      </div>
    );
  }

  return (
    <div className="netology-wagon-outer-frame">
      <div className="netology-coupes-only-mesh-container">
        {coupes}
      </div>
    </div>
  );
}