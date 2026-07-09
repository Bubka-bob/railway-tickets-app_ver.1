export const handleSeatSelection = (prevOrderState, directionType, number, coachId, activeTicketType, maxLimits) => {
  const dir = directionType || 'departure';
  const legData = prevOrderState?.legs?.[dir] || { routeDirectionId: null, seats: [] };
  
  // 🛠️ 1. БЕЗОПАСНАЯ ОЧИСТКА: Удаляем дефолтный пустой объект Нетологии { seatNumber: null }
  const currentSeats = (legData.seats || []).filter(
    s => s && s.seatNumber !== null && s.seatNumber !== undefined
  );
  
  // 🛠️ 2. СРАВНЕНИЕ ТИПОВ: Принудительно приводим к типам String и Number для избежания конфликтов JS
  const isAlreadySelected = currentSeats.some(
    s => String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number)
  );

  let updatedSeats;

  if (isAlreadySelected) {
    // Если место уже выбрано — снимаем выбор (вырезаем его из массива)
    updatedSeats = currentSeats.filter(
      s => !(String(s.coachId) === String(coachId) && Number(s.seatNumber) === Number(number))
    );
  } else {
    // Считываем лимит из инпута для текущей активной категории пассажира
    const allowedLimit = Number(maxLimits?.[activeTicketType] || 0);

    // Считаем, сколько мест выбранной категории (взрослый/ребенок) уже забронировано
    const currentTypeCount = currentSeats.filter(s => {
      if (activeTicketType === 'adult') return s.passengerInfo?.isAdult === true;
      if (activeTicketType === 'child') return s.isChild === true && s.includeChildrenSeat === false;
      return s.includeChildrenSeat === true; // 'baby' (без места)
    }).length;

    // 🛠️ ПРОВЕРКА 1: Если в инпуте пусто или ноль — запрещаем выбор места
    if (allowedLimit === 0) {
      alert('Сначала укажите количество билетов для выбранной категории пассажира!');
      return prevOrderState; // Возвращаем стейт без изменений
    }

    // 🛠️ ПРОВЕРКА 2: Если количество мест достигло лимита из инпута — блокируем клик
    if (currentTypeCount >= allowedLimit) {
      const typeNames = { adult: 'взрослых', child: 'детских', baby: 'без места' };
      alert(`Вы уже выбрали максимум мест для категории: ${typeNames[activeTicketType]}`);
      return prevOrderState; // Возвращаем стейт без изменений
    }

    // Создаем объект нового места строго по спецификации Netology API
    const newSeat = {
      coachId,
      seatNumber: Number(number), // Пишем как чистое число
      isChild: activeTicketType === 'child' || activeTicketType === 'baby',
      includeChildrenSeat: activeTicketType === 'baby',
      passengerInfo: {
        isAdult: activeTicketType === 'adult',
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

  // Возвращаем обновленное состояние для контекста
  return {
    ...prevOrderState,
    legs: {
      ...prevOrderState.legs,
      [dir]: {
        ...legData,
        seats: updatedSeats
      }
    }
  };
};