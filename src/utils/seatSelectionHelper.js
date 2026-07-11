export const handleSeatSelection = (prevOrderState, directionType, number, coachId, activeTicketType, maxLimits, coachData) => {
  const dir = directionType || 'departure';
  const legData = prevOrderState?.legs?.[dir] || { routeDirectionId: null, seats: [] };
  
  // Безопасно очищаем массив от дефолтных пустых элементов Нетологии { seatNumber: null }
  const currentSeats = (legData.seats || []).filter(
    s => s && s.seatNumber !== null && s.seatNumber !== undefined
  );

  const isAlreadySelected = currentSeats.some(
    s => String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number)
  );

  let updatedSeats;

  if (isAlreadySelected) {
    // Если место уже выбрано — снимаем выбор
    updatedSeats = currentSeats.filter(
      s => !(String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number))
    );
  } else {
    const allowedLimit = Number(maxLimits?.[activeTicketType] || 0);

    // Считаем выбранные места текущей категории
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

    // 💰 ВЫЧИСЛЯЕМ И ФИКСИРУЕМ ЦЕНУ МЕСТА СТРОГО В МОМЕНТ КЛИКА
    let singleSeatPrice = 0;
    if (coachData) {
      if (activeTicketType === 'baby') {
        singleSeatPrice = 0; // Младенцы всегда бесплатно
      } else if (coachData.class_type === 'first' || coachData.class_type === 'fourth') {
        singleSeatPrice = Number(coachData.price || coachData.top_price || coachData.bottom_price || 0);
      } else {
        const isTop = Number(number) % 2 === 0 && Number(number) <= 36;
        singleSeatPrice = Number((isTop ? coachData.top_price : coachData.bottom_price) || coachData.price || 0);
      }
      
      if (activeTicketType === 'child') {
        singleSeatPrice = singleSeatPrice / 2; // Детская скидка 50%
      }
    }

    const newSeat = {
      coachId,
      seatNumber: Number(number),
      price: singleSeatPrice, // 🔥 Сиденье намертво запомнило цену своего вагона!
      isChild: activeTicketType === 'child' || activeTicketType === 'baby',
      includeChildrenSeat: activeTicketType === 'baby',
      passengerInfo: { 
        isAdult: activeTicketType === 'adult', 
        firstName: null, lastName: null, patronymic: null, gender: null, birthday: null, documentType: null, documentData: null 
      }
    };

    updatedSeats = [...currentSeats, newSeat];
  }

  // Просто возвращаем обновленный массив мест в леге, не ломая общую математику
  return {
    ...prevOrderState,
    legs: {
      ...prevOrderState.legs,
      [dir]: { ...legData, seats: updatedSeats }
    }
  };
};