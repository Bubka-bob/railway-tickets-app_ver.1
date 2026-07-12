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

  // ==========================================
  // 🆕 ЛОКАЛЬНЫЙ СТЕЙТ ДЛЯ ПЛАТНЫХ УСЛУГ
  // Хранит цены выбранных опций (белье, wifi) по направлениям
  // ==========================================
  const [servicesSelection, setServicesSelection] = useState({
    departure: {}, // Пример: { linens: 250 }
    arrival: {}    
  });

  // Функция переключения услуги. Вызывается из WagonServices и передается глубже
  const handleToggleService = (serviceKey, serviceId, price) => {
  setServicesSelection(prev => {
    // Разбираем ключ обратно на направление и вагон
    const [direction] = serviceKey.split('_');

    // Находим текущий стейт выбранного вагона или создаем пустой
    const wagonState = prev[serviceKey] ?? {};

    if (wagonState[serviceId]) {
      // Удаляем только из стейта этого вагона
      delete wagonState[serviceId];
    } else {
      // Добавляем только в стейт этого вагона
      wagonState[serviceId] = price;
    }

    // Возвращаем обновленный стейт
    return {
      ...prev,
      [serviceKey]: Object.keys(wagonState).length > 0 ? wagonState : undefined, // Убираем пустые объекты
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

  // Вычисляем сумму только доп. услуг под вагоном (для отображения в реальном времени)
  const getCurrentServicesTotal = (dir) => Object.values(servicesSelection[dir]).reduce((sum, p) => sum + p, 0);

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

          {/* ОБЩАЯ КНОПКА ДАЛЕЕ с передачей данных о сервисах */}
          <div className="bottom-submit-row">
            <button 
              className="main-orange-submit-btn" 
              onClick={() => {
                // Здесь можно также обновить глобальный totalPriceSummary, если он нужен другим компонентам до PassengersPage
                navigate('/order/passengers', { 
                  state: { selectedServices: servicesSelection } 
                });
              }}
            >
              ДАЛЕЕ
            </button>
          </div>
        </>
      )}
    </div>
  );
}