import React, { useContext } from "react";
import OrderContext from "../../../../components/context/OrderContext";
import { handleSeatSelection } from "../../../../utils/seatSelectionHelper"; 
import "./FourthCoach.css";

export default function SittingCoach({ seatsData = [], coachId, directionType, activeTicketType, maxLimits, coachData }) {
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

    const isEven = Number(number) % 2 === 0;
    let className = 'sitting-seat-node';
    

    if (!isAvailable) className += ' is-disabled';
    if (isSelected) {
      className += ' is-selected';
     
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

  const topRows = [];
  for (let i = 0; i < 16; i++) {
    const topSeat = i * 2 + 2;    
    const bottomSeat = i * 2 + 1;
    topRows.push(
      <div key={`sitting-top-pair-${i}`} className="sitting-vertical-pair">
        {renderSeatButton(topSeat)}
        {renderSeatButton(bottomSeat)}
      </div>
    );
  }

 
  const bottomRows = [];
  

  bottomRows.push(
    <div key="sitting-bottom-start" className="sitting-vertical-pair">
      <div className="sitting-empty-stub-space"></div> 
      {renderSeatButton(33)}
    </div>
  );

  
  for (let i = 0; i < 14; i++) {
    const topSeat = 34 + (i * 2);   
    const bottomSeat = 35 + (i * 2); 
    bottomRows.push(
      <div key={`sitting-bottom-pair-${i}`} className="sitting-vertical-pair">
        {renderSeatButton(topSeat)}
        {renderSeatButton(bottomSeat)}
      </div>
    );
  }

  bottomRows.push(
    <div key="sitting-bottom-end" className="sitting-vertical-pair">
      <div className="sitting-empty-stub-space"></div> 
      {renderSeatButton(62)}
    </div>
  );

  return (
    <div className="netology-sitting-coach-mesh-container">
      
      <div className="sitting-top-horizontal-ribbon">
        {topRows}
      </div>

      <div className="sitting-middle-aisle-corridor"></div>


      <div className="sitting-bottom-horizontal-ribbon">
        {bottomRows}
      </div>
    </div>
  );
}