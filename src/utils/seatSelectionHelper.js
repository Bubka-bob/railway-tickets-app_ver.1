export const handleSeatSelection = (prevOrderState, directionType, number, coachId, activeTicketType, maxLimits) => {
  const dir = directionType || 'departure';

  // 🛠️ 1. СИНХРОНИЗАЦИЯ БИЛЕТОВ: Записываем числа из локальных инпутов родителя в personCount заказа
  const syncPersonCount = {
    ...prevOrderState?.personCount,
    [dir]: {
      adult: Number(maxLimits?.adult || 0),
      child: Number(maxLimits?.child || 0),
      baby: Number(maxLimits?.baby || 0),
    }
  };

  const legData = prevOrderState?.legs?.[dir] || { routeDirectionId: null, seats: [] };
  
  // 🛠️ 2. БЕЗОПАСНАЯ ОЧИСТКА: Удаляем дефолтный пустой объект Нетологии { seatNumber: null }
  const currentSeats = (legData.seats || []).filter(
    s => s && s.seatNumber !== null && s.seatNumber !== undefined
  );
  
  // 🛠️ 3. ИСПРАВЛЕНО СРАВНЕНИЕ ТИПОВ: Принудительно приводим к типам String и Number, чтобы избежать конфликтов JS
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
    // Проверяем лимиты билетов на основе пропсов из локальных стейтов родителя
    const allowedLimit = Number(maxLimits?.[activeTicketType] || 0);

    // Считаем, сколько мест выбранной категории (взрослый/ребенок) уже забронировано
    const currentTypeCount = currentSeats.filter(s => {
      if (activeTicketType === 'adult') return s.passengerInfo?.isAdult === true;
      if (activeTicketType === 'child') return s.isChild === true && s.includeChildrenSeat === false;
      return s.includeChildrenSeat === true; // 'baby' (без места)
    }).length;

    if (allowedLimit === 0) {
      alert('Сначала укажите количество билетов для выбранной категории пассажира!');
      return prevOrderState; // Возвращаем стейт без изменений
    }

    if (currentTypeCount >= allowedLimit) {
      const typeNames = { adult: 'взрослых', child: 'детских', baby: 'без места' };
      alert(`Вы уже выбрали максимум мест для категории: ${typeNames[activeTicketType]}`);
      return prevOrderState;
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

  // Возвращаем обновленное иммутабельное состояние в контекст
  return {
    ...prevOrderState,
    personCount: syncPersonCount, // Сохраняем синхронизированные билеты
    legs: {
      ...prevOrderState.legs,
      [dir]: {
        ...legData,
        seats: updatedSeats // Сохраняем обновленный массив мест
      }
    }
  };
};