import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import RouteContext from '../../components/context/RouteContext'; // Проверь пути к своим контекстам
import OrderContext from '../../components/context/OrderContext';
import AccordionItem from '../../components/Sidebar/AccordionItem/AccordionItem'; // Твой компонент аккордеона
import './TripDetailsSidebar.css';

export default function TripDetailsSidebar() {
  const location = useLocation();
  const passedServices = location.state?.selectedServices || {}; 
  
  const { routeState } = useContext(RouteContext);
  const { orderState } = useContext(OrderContext);

  const trainData = routeState?.departure_train_name ? routeState : orderState?.savedTrainData;
  const departureSeats = orderState?.legs?.departure?.seats?.filter(s => s && s.seatNumber !== null) || [];
  const arrivalSeats = orderState?.legs?.arrival?.seats?.filter(s => s && s.seatNumber !== null) || [];

  const adultsQty = Math.max(
    departureSeats.filter(s => s.passengerInfo?.isAdult === true).length,
    arrivalSeats.filter(s => s.isChild === false).length
  );
  const childrenQty = Math.max(
    departureSeats.filter(s => s.isChild === true && !s.includeChildrenSeat).length,
    arrivalSeats.filter(s => s.isChild === true && !s.includeChildrenSeat).length
  );

  const servicesCost = Object.values(passedServices)
    .flatMap(Object.values) // Делаем плоский массив [price1, price2...]
    .reduce((sum, p) => sum + Number(p), 0);

   const adultsCost = [...departureSeats, ...arrivalSeats].filter(s => s.passengerInfo?.isAdult === true).reduce((sum, s) => sum + Number(s.price || 0), 0);
  const childrenCost = [...departureSeats, ...arrivalSeats].filter(s => s.isChild === true && !s.includeChildrenSeat).reduce((sum, s) => sum + Number(s.price || 0), 0);

  const grandTotal = adultsCost + childrenCost + servicesCost;

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  const formatServerDate = (dateStr) => dateStr.includes('.') ? dateStr : dateStr.split('-').reverse().join('.');
  
  const depFromDate = formatServerDate(trainData?.departure_date_start || "30.08.2018");
  const depToDate = formatServerDate(trainData?.departure_date_start_arrival || "31.08.2018");
  const arrFromDate = formatServerDate(trainData?.arrival_date_end || "09.09.2018");
  const arrToDate = formatServerDate(trainData?.arrival_date_end_arrival || "10.09.2018");

  const getServiceLabel = (id) => ({ linens: 'Постельное белье', wifi: 'Wi-Fi' }[id] || id);

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
              <span className="sidebar-info-value">{trainData.departure_train_name}</span>
            </div>

            <div className="sidebar-info-line">
              <span className="sidebar-info-label">Название</span>
              <span className="sidebar-info-value">
                {capitalize(trainData.departure_from_city_name)}<br />
                {capitalize(trainData.departure_to_city_name)}
              </span>
            </div>

            <div className="sidebar-timeline-visual-grid">
              <div className="timeline-station-node">
                <span className="timeline-node-time">{trainData.departure_from_datetime}</span>
                <span className="timeline-node-date">{depFromDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.departure_from_city_name)}</span>
                <span className="sidebar-node-station">{trainData.departure_from_railway_station_name} вокзал</span>
              </div>

              <div className="timeline-duration-center">
                <span className="timeline-duration-digits">{trainData.departure_duration}</span>
                <span className="timeline-duration-arrow">➔</span>
              </div>

              <div className="timeline-station-node">
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
              <span className="sidebar-info-value">{trainData.arrival_train_name}</span>
            </div>
            
            <div className="sidebar-info-line">
              <span className="sidebar-info-label">Название</span>
              <span className="sidebar-info-value">
                {capitalize(trainData.arrival_from_city_name)}<br />
                {capitalize(trainData.arrival_to_city_name)}
              </span>
            </div>

            <div className="sidebar-timeline-visual-grid">
              <div className="timeline-station-node">
                <span className="timeline-node-time">{trainData.arrival_from_datetime}</span>
                <span className="timeline-node-date">{arrFromDate}</span>
                <span className="timeline-node-city">{capitalize(trainData.arrival_from_city_name)}</span>
                <span className="sidebar-node-station">{trainData.arrival_from_railway_station_name} вокзал</span>
              </div>

              <div className="timeline-duration-center">
                <span className="timeline-duration-digits">{trainData.arrival_duration}</span>
                <span className="timeline-duration-arrow">←</span>
              </div>

              <div className="timeline-station-node">
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
          {/* ⚙️ СПИСОК ВЫБРАННЫХ УСЛУГ */}
          {Object.keys(passedServices).map(wagonKey => {
            const wagonServices = passedServices[wagonKey];
            if (!wagonServices || Object.keys(wagonServices).length === 0) return null;

            // Разбираем вагон
            const isArrival = wagonKey.startsWith('arrival');
            const directionLabel = isArrival ? 'Обратно:' : 'Туда:';

            return (
              <React.Fragment key={wagonKey}>
                <div class="sidebar-service-group-label">{directionLabel}</div>
                {Object.entries(wagonServices).map(([serviceId, price]) => (
                  <div key={`${wagonKey}_${serviceId}`} class="sidebar-passenger-row service-row">
                    <span class="sidebar-service-label">{getServiceLabel(serviceId)}</span>
                    <span class="sidebar-service-cost">{price.toLocaleString()} ₽</span>
                  </div>
                ))}
              </React.Fragment>
            );
          })}
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