export const handleSeatSelection = (prevOrderState, directionType, number, coachId, activeTicketType, maxLimits, coachData) => {
  const dir = directionType || 'departure';
  const legData = prevOrderState?.legs?.[dir] || { routeDirectionId: null, seats: [] };
  
  // Очищаем массив от дефолтных пустых элементов Нетологии { seatNumber: null }
  const currentSeats = (legData.seats || []).filter(
    s => s && s.seatNumber !== null && s.seatNumber !== undefined
  );

  const isAlreadySelected = currentSeats.some(
    s => String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number)
  );

  let updatedSeats;

  if (isAlreadySelected) {
    updatedSeats = currentSeats.filter(
      s => !(String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number))
    );
  } else {
    const allowedLimit = Number(maxLimits?.[activeTicketType] || 0);
    const currentTypeCount = currentSeats.filter(s => {
      if (activeTicketType === 'adult') return s.passengerInfo?.isAdult === true;
      if (activeTicketType === 'child') return s.isChild === true && s.includeChildrenSeat === false;
      return s.includeChildrenSeat === true;
    }).length;

    if (allowedLimit === 0) {
      alert('Сначала укажите количество билетов для выбранной категории пассажира!');
      return prevOrderState;
    }

    if (currentTypeCount >= allowedLimit) {
      const typeNames = { adult: 'взрослых', child: 'детских', baby: 'без места' };
      alert(`Вы уже выбрали максимум мест для категории: ${typeNames[activeTicketType]}`);
      return prevOrderState;
    }

    const newSeat = {
      coachId,
      seatNumber: Number(number),
      isChild: activeTicketType === 'child' || activeTicketType === 'baby',
      includeChildrenSeat: activeTicketType === 'baby',
      passengerInfo: { 
        isAdult: activeTicketType === 'adult', 
        firstName: null, lastName: null, patronymic: null, gender: null, birthday: null, documentType: null, documentData: null 
      }
    };

    updatedSeats = [...currentSeats, newSeat];
  }

  // ==========================================================================
  // 💰 РАСЧЁТ ЦЕН ПРЯМО В МОМЕНТ КЛИКА ДЛЯ ПЕРЕДАЧИ ЧЕРЕЗ КОНТЕКСТ
  // ==========================================================================
  const adultsPriceTotal = updatedSeats.reduce((sum, seat) => {
    if (!coachData || seat.isChild || seat.includeChildrenSeat) return sum;
    let price = coachData.class_type === 'first' || coachData.class_type === 'fourth' 
      ? (coachData.price || 0) 
      : (Number(seat.seatNumber) % 2 === 0 ? coachData.top_price : coachData.bottom_price) || coachData.price || 0;
    return sum + Number(price);
  }, 0);

  const childrenPriceTotal = updatedSeats.reduce((sum, seat) => {
    if (!coachData || !seat.isChild || seat.includeChildrenSeat) return sum;
    let price = coachData.class_type === 'first' || coachData.class_type === 'fourth' 
      ? (coachData.price || 0) 
      : (Number(seat.seatNumber) % 2 === 0 ? coachData.top_price : coachData.bottom_price) || coachData.price || 0;
    return sum + (Number(price) / 2);
  }, 0);

  const totalOrderPrice = adultsPriceTotal + childrenPriceTotal;

  // Возвращаем обновленный глобальный стейт, где цены уже намертво сохранены в контексте!
  return {
    ...prevOrderState,
    totalPrice: totalOrderPrice,
    totalPriceSummary: {
      adults: adultsPriceTotal,
      children: childrenPriceTotal,
      grandTotal: totalOrderPrice
    },
    legs: {
      ...prevOrderState.legs,
      [dir]: { ...legData, seats: updatedSeats }
    }
  };
};