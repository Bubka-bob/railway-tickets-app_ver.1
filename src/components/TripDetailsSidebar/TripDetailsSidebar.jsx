import React, { useContext } from 'react';
import RouteContext from '../../components/context/RouteContext'; // Проверь пути к своим контекстам
import OrderContext from '../../components/context/OrderContext';
import AccordionItem from '../../components/Sidebar/AccordionItem/AccordionItem'; // Твой компонент аккордеона
import './TripDetailsSidebar.css';

export default function TripDetailsSidebar() {
  const { routeState } = useContext(RouteContext);
  const { orderState } = useContext(OrderContext);

  // Извлекаем данные поезда (или из RouteContext, или из сохранённого слепка в заказе)
  const trainData = routeState?.activeTrain || routeState?.selectedTrain || orderState?.savedTrainData;
  const departureData = (trainData?.train || trainData?.from) ? trainData : trainData?.departure;
  const arrivalData = trainData?.arrival;

  const dir = 'departure'; 

  // Извлекаем массив выбранных мест и билетов
  const depSeats = orderState?.legs?.[dir]?.seats || [];
  const selectedSeatsList = depSeats.filter(s => s && s.seatNumber);

  // Считаем количество пассажиров по категориям на основе флага из объекта места
  const adultsQty = selectedSeatsList.filter(s => !s.isChild).length;
  const childrenQty = selectedSeatsList.filter(s => s.isChild && !s.includeChildrenSeat).length;

  // 🔥 КОРОТКИЙ ПОДСЧЁТ СУММ: Просто складываем готовые цены выбранных мест по категориям!
  const adultsCost = selectedSeatsList.filter(s => !s.isChild).reduce((sum, s) => sum + (s.price || 0), 0);
  const childrenCost = selectedSeatsList.filter(s => s.isChild && !s.includeChildrenSeat).reduce((sum, s) => sum + (s.price || 0), 0);
  const grandTotal = adultsCost + childrenCost;

  // Форматирование времени в пути (секунды в "Ч : ММ")
  const formatDuration = (seconds) => {
    if (!seconds) return '0 : 00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} : ${String(minutes).padStart(2, '0')}`;
  };

  // Красивый вывод даты (например, "30.08.2018")
  const formatDateSimple = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="trip-details-sidebar-card">
      <h3 className="sidebar-main-title">Детали поездки</h3>

      {/* ==================== АККОРДЕОН 1: ТУДА ==================== */}
      {departureData && (
        <AccordionItem 
          title={
            <div className="sidebar-acc-header-content">
              <span className="sidebar-dir-tag sidebar-dir-tag--dep">➔</span>
              <span className="sidebar-dir-name">Туда</span>
              <span className="sidebar-dir-date-top">{formatDateSimple(departureData.from?.datetime)}</span>
            </div>
          }
          defaultOpen={false}
        >
          <div className="sidebar-acc-body-inner">
            <div className="sidebar-info-line">
              <span className="sidebar-info-label">№ Поезда</span>
              <span className="sidebar-info-value font-bold">{departureData.train?.name || '116С'}</span>
            </div>

            <div className="sidebar-info-line text-align-right">
              <span className="sidebar-info-label">Название</span>
              <span className="sidebar-info-value font-medium font-size-13 line-height-14">
                {departureData.from?.city?.name || 'Адлер'}<br />
                {departureData.to?.city?.name || 'Санкт-Петербург'}
              </span>
            </div>

            <div className="sidebar-timeline-visual-grid">
              <div className="timeline-station-node text-left">
                <span className="timeline-node-time">
                  {departureData.from?.datetime ? new Date(departureData.from.datetime * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '00:10'}
                </span>
                <span className="timeline-node-date">{formatDateSimple(departureData.from?.datetime)}</span>
                <span className="timeline-node-city">{departureData.from?.city?.name || 'Москва'}</span>
                <span className="timeline-node-station">{departureData.from?.railway_station_name || 'Курский'} вокзал</span>
              </div>

              <div className="timeline-duration-center">
                <span className="timeline-duration-digits">{formatDuration(departureData.duration || 34920)}</span>
                <span className="timeline-duration-arrow">➔</span>
              </div>

              <div className="timeline-station-node text-right">
                <span className="timeline-node-time">
                  {departureData.to?.datetime ? new Date(departureData.to.datetime * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '09:52'}
                </span>
                <span className="timeline-node-date">{formatDateSimple(departureData.to?.datetime)}</span>
                <span className="timeline-node-city">{departureData.to?.city?.name || 'Санкт-Петербург'}</span>
                <span className="timeline-node-station">{departureData.to?.railway_station_name || 'Ладожский'} вокзал</span>
              </div>
            </div>
          </div>
        </AccordionItem>
      )}

      {/* ==================== АККОРДЕОН 2: ОБРАТНО ==================== */}
      {arrivalData && (
        <AccordionItem 
          title={
            <div className="sidebar-acc-header-content">
              <span className="sidebar-dir-tag sidebar-dir-tag--arr">←</span>
              <span className="sidebar-dir-name">Обратно</span>
              <span className="sidebar-dir-date-top">{formatDateSimple(arrivalData.from?.datetime)}</span>
            </div>
          }
          defaultOpen={false}
        >
          <div className="sidebar-acc-body-inner">
            <div className="sidebar-info-line">
              <span className="sidebar-info-label">№ Поезда</span>
              <span className="sidebar-info-value font-bold">{arrivalData.train?.name}</span>
            </div>
            
            <div className="sidebar-info-line text-align-right">
              <span className="sidebar-info-label">Название</span>
              <span className="sidebar-info-value font-medium font-size-13 line-height-14">
                {arrivalData.from?.city?.name}<br />
                {arrivalData.to?.city?.name}
              </span>
            </div>

            <div className="sidebar-timeline-visual-grid">
              <div className="timeline-station-node text-left">
                <span className="timeline-node-time">{new Date(arrivalData.from?.datetime * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="timeline-node-date">{formatDateSimple(arrivalData.from?.datetime)}</span>
                <span className="timeline-node-city">{arrivalData.from?.city?.name}</span>
                <span className="timeline-node-station">{arrivalData.from?.railway_station_name} вокзал</span>
              </div>

              <div className="timeline-duration-center">
                <span className="timeline-duration-digits">{formatDuration(arrivalData.duration)}</span>
                <span className="timeline-duration-arrow">←</span>
              </div>

              <div className="timeline-station-node text-right">
                <span className="timeline-node-time">{new Date(arrivalData.to?.datetime * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="timeline-node-date">{formatDateSimple(arrivalData.to?.datetime)}</span>
                <span className="timeline-node-city">{arrivalData.to?.city?.name}</span>
                <span className="timeline-node-station">{arrivalData.to?.railway_station_name} вокзал</span>
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