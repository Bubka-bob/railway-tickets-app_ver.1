import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useGetSeats from '../../services/useGetSeats';
import AppContext from '../../components/context/AppContext';
import RouteContext from '../context/RouteContext';
import OrderContext from '../context/OrderContext';
import DirectionSeatsBlock from '../../components/SelectSeat/DirectionSeatsBlock/DirectionSeatsBlock';
import './SelectSeat.css';

export default function SelectSeat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { appState } = useContext(AppContext);
  const { routeState } = useContext(RouteContext); 
  const trainId = searchParams.get('id');

  // ✅ Достаем глобальный стейт заказа из контекста
  const { orderState, setOrderState } = useContext(OrderContext) || {};

  // ==========================================
  // 🆕 ЛОКАЛЬНЫЙ СТЕЙТ ДЛЯ ПЛАТНЫХ УСЛУГ
  // ==========================================
  const [servicesSelection, setServicesSelection] = useState({
    departure: {}, 
    arrival: {}    
  });

  const handleToggleService = (serviceKey, serviceId, price) => {
    setServicesSelection(prev => {
      const [direction] = serviceKey.split('_');
      const wagonState = prev[serviceKey] ?? {};

      if (wagonState[serviceId]) {
        delete wagonState[serviceId];
      } else {
        wagonState[serviceId] = price;
      }

      return {
        ...prev,
        [serviceKey]: Object.keys(wagonState).length > 0 ? wagonState : undefined,
      };
    });
  };

  const { resultDeparture, resultArrival } = useGetSeats({
    departure_id: trainId,
    arrival_id: appState?.arrival_id || null,
    have_first_class: appState?.have_first_class ? 'true' : null,
    have_second_class: appState?.have_second_class ? 'true' : null,
    have_third_class: appState?.have_third_class ? 'true' : null,
    have_fourth_class: appState?.have_fourth_class ? 'true' : null,
    have_wifi: appState?.have_wifi ? 'true' : null,
    have_air_conditioning: appState?.have_air_conditioning ? 'true' : null,
    have_express: appState?.have_express ? 'true' : null,
  });

  // Вычисляем сумму доп. услуг
  const getCurrentServicesTotal = (dir) => {
    if (!servicesSelection[dir]) return 0;
    return Object.values(servicesSelection[dir]).reduce((sum, p) => sum + (Number(p) || 0), 0);
  };

  // ==========================================================================
  // 💰 ЛОГИКА ФИНАЛЬНОГО РАСЧЕТА И ЗАПИСИ СУММЫ ПРИ ПЕРЕХОДЕ
  // ==========================================================================
  const handleGoToPassengersPage = () => {
    if (!setOrderState) return;

    // 1. Вытаскиваем все сиденья, которые пользователь выбрал на интерактивной схеме
    const departureSeats = orderState?.legs?.departure?.seats?.filter(s => s && s.seatNumber !== null) || [];
    const arrivalSeats = orderState?.legs?.arrival?.seats?.filter(s => s && s.seatNumber !== null) || [];

    // 2. Считаем чистую стоимость всех выбранных кресел (Туда + Обратно)
    const baseSeatsPriceTotal = [...departureSeats, ...arrivalSeats].reduce((sum, s) => sum + Number(s.price || 0), 0);

    // 3. Вычисляем доплаты за Wi-Fi и постельное белье, разворачивая наш стейт услуг
    const currentServicesCost = Object.values(servicesSelection)
      .filter(Boolean)
      .flatMap(Object.values) // Собираем плоский массив всех цен выбранных галочек
      .reduce((sum, p) => sum + Number(p || 0), 0);

    // 4. Складываем базовые места и доп. услуги, умноженные на количество билетов
    const finalOrderCalculatedPrice = baseSeatsPriceTotal + currentServicesCost;

    // 🔥 ЗАПИСЫВАЕМ ВСЁ В КОНТЕКСТ: Теперь и услуги, и итоговая цена намертво летят по страницам!
    setOrderState(prev => ({
      ...prev,
      totalPrice: finalOrderCalculatedPrice, // Зашиваем готовую сумму, чтобы VerificationPage прочитал её
      services: servicesSelection,           // Сохраняем объект услуг для вывода в сайдбаре
      savedTrainData: routeState             // Подстраховка объекта поезда
    }));

    // Переходим на страницу заполнения ФИО анкет
    navigate('/order/passengers', { 
      state: { selectedServices: servicesSelection } 
    });
  };

  return (
    <div className="select-seats-content-flow">
      {(resultDeparture?.isLoading || resultArrival?.isLoading) && <div className="seats-status-msg">Загрузка схем вагонов...</div>}
      {(resultDeparture?.error || resultArrival?.error) && <div className="seats-status-msg error">Ошибка API</div>}

      {!resultDeparture?.isLoading && !resultDeparture?.error && (
        <>
          {/* ТУДА */}
          {resultDeparture?.result?.length > 0 && (
            <DirectionSeatsBlock 
              wagons={resultDeparture.result} 
              routeData={routeState} 
              directionType="departure" 
              onToggleService={handleToggleService}
              localServices={servicesSelection}
              currentServicesTotal={getCurrentServicesTotal('departure')}
            />
          )}

          {/* ОБРАТНО */}
          {appState?.arrival_id && resultArrival?.result?.length > 0 && (
            <DirectionSeatsBlock 
              wagons={resultArrival.result} 
              routeData={routeState} 
              directionType="arrival" 
              isReturn={true}
              onToggleService={handleToggleService}
              localServices={servicesSelection}
              currentServicesTotal={getCurrentServicesTotal('arrival')}
            />
          )}

          {/* ОБЩАЯ КНОПКА ДАЛЕЕ С ЗАПИСЬЮ ИТОГОВОГО ЧЕКА В КОНТЕКСТ */}
          <div className="bottom-submit-row">
            <button 
              className="main-orange-submit-btn" 
              onClick={handleGoToPassengersPage} /* ➔ Вызываем нашу функцию записи цен */
            >
              ДАЛЕЕ
            </button>
          </div>
        </>
      )}
    </div>
  );
}