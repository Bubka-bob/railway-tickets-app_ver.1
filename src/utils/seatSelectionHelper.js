export const handleSeatSelection = (prevOrderState, directionType, number, coachId, activeTicketType, maxLimits, coachData) => {
  const dir = directionType || 'departure';
  const legData = prevOrderState?.legs?.[dir] || { routeDirectionId: null, seats: [] };
  
  // Безопасно очищаем массив от дефолтных пустых элементов Нетологии { seatNumber: null }
  const currentSeats = (legData.seats || []).filter(
    s => s && s.seatNumber !== null && s.seatNumber !== undefined
  );

  // Проверяем, выбрано ли уже это конкретное место в текущем вагоне
  const isAlreadySelected = currentSeats.some(
    s => String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number)
  );

  let updatedSeats;

  if (isAlreadySelected) {
    // ➔ ОТМЕНА МЕСТА: Просто вырезаем его из массива выбранных сидений направления
    updatedSeats = currentSeats.filter(
      s => !(String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number))
    );
  } else {
    // ➔ ВЫБОР МЕСТА: Проверяем лимиты билетов по категориям перед добавлением
    const currentType = String(activeTicketType).trim();
    const allowedLimit = Number(maxLimits?.[currentType] || 0);

    // Считаем выбранные места текущей возрастной категории пассажира
    const currentTypeCount = currentSeats.filter(s => {
      if (currentType === 'adult') return s.passengerInfo?.isAdult === true;
      if (currentType === 'child') return s.isChild === true && s.includeChildrenSeat === false;
      return s.includeChildrenSeat === true; // baby
    }).length;

    // ПРОВЕРКА 1: Если в инпуте количества билетов ноль — блокируем клик
    if (allowedLimit === 0) {
      alert('Сначала укажите количество билетов для выбранной категории пассажира!');
      return prevOrderState;
    }

    // ПРОВЕРКА 2: Блокируем клик, если количество мест достигло лимита из инпута
    if (currentTypeCount >= allowedLimit) {
      const typeNames = { adult: 'взрослых', child: 'детских', baby: 'без места' };
      alert(`Вы уже выбрали максимум мест для категории: ${typeNames[currentType] || 'пассажира'}`);
      return prevOrderState;
    }

    // ==========================================================================
    // 💰 ВЫЧИСЛЯЕМ И ФИКСИРУЕМ СТРОГО ЧИСТУЮ ЦЕНУ ПОЛКИ В МОМЕНТ КЛИКА
    // ==========================================================================
    let singleSeatPrice = 0;
    if (coachData) {
      if (currentType === 'baby') {
        singleSeatPrice = 0; // Младенцы без места всегда бесплатно
      } else if (coachData.class_type === 'first' || coachData.class_type === 'fourth') {
        singleSeatPrice = Number(coachData.price || coachData.top_price || coachData.bottom_price || 0);
      } else {
        // Для купе и плацкарта проверяем ярус: четные индексы до 36 — это верхние полки
        const isTop = Number(number) % 2 === 0 && Number(number) <= 36;
        singleSeatPrice = Number((isTop ? coachData.top_price : coachData.bottom_price) || coachData.price || 0);
      }
      
      // Если выбран детский билет — режем базовую цену полки пополам по ТЗ диплома Нетологии
      if (currentType === 'child') {
        singleSeatPrice = singleSeatPrice / 2;
      }
    }

    // Создаем объект нового места и зашиваем чистую базовую цену полки вагона
    const newSeat = {
      coachId,
      seatNumber: Number(number),
      price: singleSeatPrice, // 🔥 Намертво фиксируем чистые рубли!
      isChild: currentType === 'child' || currentType === 'baby',
      includeChildrenSeat: currentType === 'baby',
      passengerInfo: { 
        isAdult: currentType === 'adult', 
        firstName: null, 
        lastName: null, 
        patronymic: null, 
        gender: null, 
        birthday: null, 
        documentType: null, 
        documentData: null 
      }
    };

    updatedSeats = [...currentSeats, newSeat];
  }

  // Возвращаем обновленный стейт мест в леге, не рассчитывая промежуточные суммы
  return {
    ...prevOrderState,
    legs: {
      ...prevOrderState.legs,
      [dir]: { ...legData, seats: updatedSeats }
    }
  };
};