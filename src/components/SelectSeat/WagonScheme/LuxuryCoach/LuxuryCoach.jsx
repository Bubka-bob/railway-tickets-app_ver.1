import React, { useContext } from "react";
import OrderContext from "../../../../components/context/OrderContext";
import { handleSeatSelection } from "../../../../utils/seatSelectionHelper"; 
import "./LuxuryCoach.css";

export default function LuxuryCoach({ seatsData = [], coachId, directionType, activeTicketType, maxLimits, coachData }) {
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
        onClick={() => handleSeatClick(number)}
      >
        {number}
      </button>
    );
  };

  
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