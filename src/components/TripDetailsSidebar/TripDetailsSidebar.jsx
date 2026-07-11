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

  const dir = 'departure'; 

  const depSeats = orderState?.legs?.[dir]?.seats || [];
  const selectedSeatsList = depSeats.filter(s => s && s.seatNumber !== null);

  const adultsQty = orderState?.personCount?.[dir]?.adult || 0;
  const childrenQty = orderState?.personCount?.[dir]?.child || 0;

  // ➔ 🛠️ БЕРЁМ ГОТОВЫЕ ИДЕАЛЬНЫЕ ЦЕНЫ ИЗ КОНТЕКСТА ПРОШЛОЙ СТРАНИЦЫ
  const adultsCost = Number(orderState?.totalPriceSummary?.adults || 0);
  const childrenCost = Number(orderState?.totalPriceSummary?.children || 0);
  const grandTotal = Number(orderState?.totalPriceSummary?.grandTotal || orderState?.totalPrice || 0);

  // Хелпер для перевода первой буквы города в верхний регистр (например, "москва" -> "Москва")
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatServerDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('.')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`; // Из YYYY-MM-DD в ДД.ММ.ГГГГ
    return dateStr;
  };

  
  const searchDateStart = routeState?.searchParams?.date_start || sessionStorage.getItem('search_date_start');

  
  const depFromDate = formatServerDate(
    trainData?.departure_date_start || 
    trainData?.departure_date || 
    searchDateStart || 
    "30.08.2018" // Fallback строго по макету Figma
  );

  const depToDate = formatServerDate(
    trainData?.departure_date_start_arrival || 
    trainData?.departure_to_date || 
    trainData?.arrival_date || 
    "31.08.2018" // Fallback строго по макету Figma
  );

  const arrFromDate = formatServerDate(trainData?.arrival_date_end || "09.09.2018");
  const arrToDate = formatServerDate(trainData?.arrival_date_end_arrival || "10.09.2018");

  return (
    <div className="trip-details-sidebar-card">
      <h3 className="sidebar-main-title">Детали поездки</h3>

      {/* ==================== АККОРДЕОН 1: ТУДА (ПО ТВОЕМУ ЛОГУ) ==================== */}
      {trainData?.departure_train_name && (
        <AccordionItem 
          title={
            <div className="sidebar-acc-header-content">
              <span className="sidebar-dir-tag sidebar-dir-tag--dep">➔</span>
              <span className="sidebar-dir-name">Туда</span>
              {/* Если на бэкенде есть дата, можно вывести её, иначе пока оставляем пустой или статичной */}
              <span className="sidebar-dir-date-top">{depFromDate}</span>
            </div>
          }
          defaultOpen={false}
        >
          <div className="sidebar-acc-body-inner">
            {/* Строка: Номер поезда */}
            <div className="sidebar-info-line">
              <span className="sidebar-info-label">№ Поезда</span>
              <span className="sidebar-info-value">{trainData.departure_train_name}</span>
            </div>

            {/* Строка: Название городов маршрута */}
            <div className="sidebar-info-line text-align-right">
              <span className="sidebar-info-label">Название</span>
              <span className="sidebar-info-value">
                {capitalize(trainData.departure_from_city_name)}<br />
                {capitalize(trainData.departure_to_city_name)}
              </span>
            </div>

            {/* Сетка расписания станций, дат и времени строго по структуре твоего объекта */}
            <div className="sidebar-timeline-visual-grid">
              
              {/* Станция Отправления */}
              <div className="timeline-station-node text-left">
                <span className="timeline-node-time">{trainData.departure_from_datetime}</span>
                <span className="timeline-node-date">{depFromDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.departure_from_city_name)}</span>
                <span className="timeline-node-station">{trainData.departure_from_railway_station_name} вокзал</span>
              </div>

              {/* Время в пути посередине */}
              <div className="timeline-duration-center">
                <span className="timeline-duration-digits">{trainData.departure_duration}</span>
                <span className="timeline-duration-arrow">➔</span>
              </div>

              {/* Станция Прибытия */}
              <div className="timeline-station-node text-right">
                <span className="timeline-node-time">{trainData.departure_to_datetime}</span>
                <span className="timeline-node-date">{depToDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.departure_to_city_name)}</span>
                <span className="timeline-node-station">{trainData.departure_to_railway_station_name} вокзал</span>
              </div>

            </div>
          </div>
        </AccordionItem>
      )}

      {/* ==================== АККОРДЕОН 2: ОБРАТНО (ЕСЛИ ПРИЙДУТ ДАННЫЕ ARRIVAL) ==================== */}
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
              <span className="sidebar-info-value">{trainData.arrival_train_name}</span>
            </div>
            {/* Строка: Название городов маршрута */}
            <div className="sidebar-info-line text-align-right">
              <span className="sidebar-info-label">Название</span>
              <span className="sidebar-info-value">
                {capitalize(trainData.arrival_from_city_name)}<br />
                {capitalize(trainData.arrival_to_city_name)}
              </span>
            </div>

            {/* Сетка расписания станций, дат и времени строго по структуре твоего объекта */}
            <div className="sidebar-timeline-visual-grid">
              
              {/* Станция Отправления */}
              <div className="timeline-station-node text-left">
                <span className="timeline-node-time">{trainData.arrival_from_datetime}</span>
                <span className="timeline-node-date">{arrFromDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.arrival_from_city_name)}</span>
                <span className="timeline-node-station">{trainData.arrival_from_railway_station_name} вокзал</span>
              </div>

              {/* Время в пути посередине */}
              <div className="timeline-duration-center">
                <span className="timeline-duration-digits">{trainData.arrival_duration}</span>
                <span className="timeline-duration-arrow">➔</span>
              </div>

              {/* Станция Прибытия */}
              <div className="timeline-station-node text-right">
                <span className="timeline-node-time">{trainData.arrival_to_datetime}</span>
                <span className="timeline-node-date">{arrToDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.arrival_to_city_name)}</span>
                <span className="timeline-node-station">{trainData.arrival_to_railway_station_name} вокзал</span>
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
          {/* Строка взрослых билетов и стоимости */}
          {adultsQty > 0 && (
            <div className="sidebar-passenger-row">
              <span className="passenger-type-text">{adultsQty} Взрослых</span>
              <span className="passenger-type-cost">
                {adultsCost.toLocaleString('ru-RU')} <span className="cost-currency">₽</span>
              </span>
            </div>
          )}
          
          {/* Строка детских билетов и стоимости */}
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