import React, { useContext } from 'react';
import RouteContext from '../../components/context/RouteContext'; // Проверь пути к своим контекстам
import OrderContext from '../../components/context/OrderContext';
import AccordionItem from '../../components/Sidebar/AccordionItem/AccordionItem'; // Твой компонент аккордеона
import './TripDetailsSidebar.css';

export default function TripDetailsSidebar() {
  const { routeState } = useContext(RouteContext);
  const { orderState } = useContext(OrderContext);

  // 🚂 БЕРЁМ ДАННЫЕ ПОЕЗДА: Извлекаем плоский объект из routeState или из savedTrainData
  const trainData = routeState?.departure_train_name ? routeState : orderState?.savedTrainData;

  // 👤 БЕРЁМ МАССИВЫ МЕСТ НАПРЯМУЮ ИЗ КОНТЕКСТА ДЛЯ ОБОИХ НАПРАВЛЕНИЙ
  const departureSeats = orderState?.legs?.departure?.seats?.filter(s => s && s.seatNumber !== null) || [];
  const arrivalSeats = orderState?.legs?.arrival?.seats?.filter(s => s && s.seatNumber !== null) || [];

  // Считаем общее количество билетов в заказе по категориям (показываем максимум из двух направлений)
  const depAdults = departureSeats.filter(s => s.passengerInfo?.isAdult === true).length;
  const arrAdults = arrivalSeats.filter(s => s.passengerInfo?.isAdult === true).length;
  const adultsQty = Math.max(depAdults, arrAdults);

  const depChildren = departureSeats.filter(s => s.isChild === true && !s.includeChildrenSeat).length;
  const arrChildren = arrivalSeats.filter(s => s.isChild === true && !s.includeChildrenSeat).length;
  const childrenQty = Math.max(depChildren, arrChildren);

  // ==========================================================================
  // 💰 ЧИСТЫЙ REACT: СУММИРОВАНИЕ ЦЕН И ТУДА, И ОБРАТНО ИЗ ВСЕХ ВАГОНОВ
  // ==========================================================================
  
  // Складываем честные цены взрослых билетов из обоих направлений
  const adultsCost = [...departureSeats, ...arrivalSeats]
    .filter(s => s.passengerInfo?.isAdult === true)
    .reduce((sum, s) => sum + Number(s.price || 0), 0);

  // Складываем честные цены детских билетов из обоих направлений
  const childrenCost = [...departureSeats, ...arrivalSeats]
    .filter(s => s.isChild === true && !s.includeChildrenSeat)
    .reduce((sum, s) => sum + Number(s.price || 0), 0);

  // Итоговый чек — это сквозная сумма за абсолютно все выбранные места в приложении!
  const grandTotal = adultsCost + childrenCost;

  // Хелпер для перевода первой буквы города в верхний регистр (например, "москва" -> "Москва")
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Хелпер красивого отображения даты из формата YYYY-MM-DD в ДД.ММ.ГГГГ
  const formatServerDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('.')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`; // Пересобираем в ДД.ММ.ГГГГ
    }
    return dateStr;
  };

  // Автономное извлечение серверных дат из твоего плоского объекта
  const depFromDate = formatServerDate(trainData?.departure_date_start || "30.08.2018");
  const depToDate = formatServerDate(trainData?.departure_date_start_arrival || "31.08.2018");
  
  const arrFromDate = formatServerDate(trainData?.arrival_date_end || "09.09.2018");
  const arrToDate = formatServerDate(trainData?.arrival_date_end_arrival || "10.09.2018");

  return (
    <div className="trip-details-sidebar-card">
      <h3 className="sidebar-main-title">Детали поездки</h3>

      {/* ==================== АККОРДЕОН 1: ТУДА ==================== */}
      {trainData?.departure_train_name && (
        <AccordionItem 
          title={
            <div className="sidebar-acc-header-content">
              <span className="sidebar-dir-tag sidebar-dir-tag--dep">➔</span>
              <span className="sidebar-dir-name">Туда</span>
              <span className="sidebar-dir-date-top">{depFromDate}</span>
            </div>
          }
          defaultOpen={false}
        >
          <div className="sidebar-acc-body-inner">
            <div className="sidebar-info-line">
              <span className="sidebar-info-label">№ Поезда</span>
              <span className="sidebar-info-value font-bold">{trainData.departure_train_name}</span>
            </div>

            <div className="sidebar-info-line text-align-right">
              <span className="sidebar-info-label">Название</span>
              <span className="sidebar-info-value font-medium font-size-13 line-height-14">
                {capitalize(trainData.departure_from_city_name)}<br />
                {capitalize(trainData.departure_to_city_name)}
              </span>
            </div>

            <div className="sidebar-timeline-visual-grid">
              <div className="timeline-station-node text-left">
                <span className="timeline-node-time">{trainData.departure_from_datetime}</span>
                <span className="timeline-node-date">{depFromDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.departure_from_city_name)}</span>
                <span className="sidebar-node-station">{trainData.departure_from_railway_station_name} вокзал</span>
              </div>

              <div className="timeline-duration-center">
                <span className="timeline-duration-digits">{trainData.departure_duration}</span>
                <span className="timeline-duration-arrow">➔</span>
              </div>

              <div className="timeline-station-node text-right">
                <span className="timeline-node-time">{trainData.departure_to_datetime}</span>
                <span className="timeline-node-date">{depToDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.departure_to_city_name)}</span>
                <span className="sidebar-node-station">{trainData.departure_to_railway_station_name} вокзал</span>
              </div>
            </div>
          </div>
        </AccordionItem>
      )}

      {/* ==================== АККОРДЕОН 2: ОБРАТНО ==================== */}
      {trainData?.arrival_train_name && (
        <AccordionItem 
          title={
            <div className="sidebar-acc-header-content">
              <span className="sidebar-dir-tag sidebar-dir-tag--arr">←</span>
              <span className="sidebar-dir-name">Обратно</span>
              <span className="sidebar-dir-date-top">{arrFromDate}</span>
            </div>
          }
          defaultOpen={false}
        >
          <div className="sidebar-acc-body-inner">
            <div className="sidebar-info-line">
              <span className="sidebar-info-label">№ Поезда</span>
              <span className="sidebar-info-value font-bold">{trainData.arrival_train_name}</span>
            </div>
            
            <div className="sidebar-info-line text-align-right">
              <span className="sidebar-info-label">Название</span>
              <span className="sidebar-info-value font-medium font-size-13 line-height-14">
                {capitalize(trainData.arrival_from_city_name)}<br />
                {capitalize(trainData.arrival_to_city_name)}
              </span>
            </div>

            <div className="sidebar-timeline-visual-grid">
              <div className="timeline-station-node text-left">
                <span className="timeline-node-time">{trainData.arrival_from_datetime}</span>
                <span className="timeline-node-date">{arrFromDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.arrival_from_city_name)}</span>
                <span className="sidebar-node-station">{trainData.arrival_from_railway_station_name} вокзал</span>
              </div>

              <div className="timeline-duration-center">
                <span className="timeline-duration-digits">{trainData.arrival_duration}</span>
                <span className="timeline-duration-arrow">←</span>
              </div>

              <div className="timeline-station-node text-right">
                <span className="timeline-node-time">{trainData.arrival_to_datetime}</span>
                <span className="timeline-node-date">{arrToDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.arrival_to_city_name)}</span>
                <span className="sidebar-node-station">{trainData.arrival_to_railway_station_name} вокзал</span>
              </div>
            </div>
          </div>
        </AccordionItem>
      )}

      {/* ==================== АККОРДЕОН 3: ПАССАЖИРЫ ==================== */}
      <AccordionItem 
        title={
          <div className="sidebar-acc-header-content">
            <span className="sidebar-dir-tag sidebar-dir-tag--pass">👤</span>
            <span className="sidebar-dir-name">Пассажиры</span>
          </div>
        }
        defaultOpen={false}
      >
        <div className="sidebar-acc-body-inner sidebar-passengers-body">
          {adultsQty > 0 && (
            <div className="sidebar-passenger-row">
              <span className="passenger-type-text">{adultsQty} Взрослых</span>
              <span className="passenger-type-cost">
                {adultsCost.toLocaleString('ru-RU')} <span className="cost-currency">₽</span>
              </span>
            </div>
          )}
          
          {childrenQty > 0 && (
            <div className="sidebar-passenger-row">
              <span className="passenger-type-text">{childrenQty} Ребенок</span>
              <span className="passenger-type-cost">
                {childrenCost.toLocaleString('ru-RU')} <span className="cost-currency">₽</span>
              </span>
            </div>
          )}
          
          {adultsQty === 0 && childrenQty === 0 && (
            <div className="sidebar-passenger-row label-empty">Пассажиры не выбраны</div>
          )}
        </div>
      </AccordionItem>

      {/* ==================== НИЖНИЙ ЧЕК С ИТОГОМ ==================== */}
      <div className="sidebar-total-checkout-footer">
        <span className="sidebar-total-label">Итог</span>
        <span className="sidebar-total-sum-value">
          {grandTotal.toLocaleString('ru-RU')} <span className="sidebar-total-currency">₽</span>
        </span>
      </div>
    </div>
  );
}