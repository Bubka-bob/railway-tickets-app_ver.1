import React, { useContext } from "react";
import OrderContext from "../../../../components/context/OrderContext";
import { handleSeatSelection } from "../../../../utils/seatSelectionHelper"; 
import "./ThirdCoach.css";

export default function PlacardCoach({ seatsData = [], coachId, directionType, activeTicketType, maxLimits, coachData }) {
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

  const renderSeatButton = (number, isSide = false) => {
    const isAvailable = availableSeatsMap[number] ?? false;
    const seatObject = selectedSeatsList.find(
      s => String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number)
    );
    const isSelected = !!seatObject;

    const isEven = Number(number) % 2 === 0;
    let className = isSide ? 'placard-side-seat-node' : 'placard-coupe-seat-node';
    
    className += isEven ? ' seat-grey-top' : ' seat-white-bottom';

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

  // 🔥 СИНХРОННАЯ ГЕНЕРАЦИЯ СЕКТОРОВ ВАГОНА (8 ШТУК)
  const wagonSectors = [];
  for (let i = 0; i < 8; i++) {
    // Верхняя часть (Купе)
    const firstBottom = i * 4 + 1;
    const firstTop = i * 4 + 2;
    const secondBottom = i * 4 + 3;
    const secondTop = i * 4 + 4;

    // Нижняя часть (Боковые места парами: левое и правое в секции)
    // По логике РЖД: секция 1 содержит 53, 54; секция 2 содержит 51, 52 и т.д. (идут справа налево)
    // Но мы берем последовательный вывод мест из вашего массива (33-48) для точного совпадения с вашим макетом:
    const leftSideSeat = 33 + (i * 2);
    const rightSideSeat = 34 + (i * 2);

    wagonSectors.push(
      <div key={`placard-sector-${i}`} className="placard-wagon-step-sector">
        
        {/* КУПЕЙНЫЙ ОТСЕК СВЕРХУ */}
        <div className="placard-coupe-block-segment">
          <div className="placard-coupe-pair-vertical">
            {renderSeatButton(firstTop)}
            {renderSeatButton(firstBottom)}
          </div>
          
          {/* Дверной проем по центру купе */}
          <div className="placard-coupe-door-gap" />
          
          <div className="placard-coupe-pair-vertical">
            {renderSeatButton(secondTop)}
            {renderSeatButton(secondBottom)}
          </div>
        </div>

        {/* СВОБОДНЫЙ ПРОХОД (КОРИДОР) МЕЖДУ КУПЕ И БОКОВЫМИ */}
        <div className="placard-inner-corridor-path" />

        {/* БОКОВОЙ ОТСЕК СНИЗУ */}
        <div className="placard-side-block-segment">
          {renderSeatButton(leftSideSeat, true)}
          {renderSeatButton(rightSideSeat, true)}
        </div>

      </div>
    );
  }

  return (
    <div className="netology-placard-outer-frame">
      <div className="netology-placard-mesh-only-wrapper">
        {wagonSectors}
      </div>
    </div>
  );
}