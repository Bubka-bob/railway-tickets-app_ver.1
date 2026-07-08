import React, { useState, useEffect, useContext } from 'react';
import WagonTabs from '../WagonTabs/WagonTabs';
import WagonNumbers from '../WagonNumbers';
import WagonScheme from '../WagonScheme/WagonScheme';
import SeatsTrainHeader from '../SeatsTrainHeader/SeatsTrainHeader';
import OrderContext from '../../context/OrderContext';
import "./DirectionSeatsBlock.css";

export default function DirectionSeatsBlock({ wagons = [], routeData, directionType, isReturn = false }) {
  const [activeTab, setActiveTab] = useState('');
  const [activeWagonId, setActiveWagonId] = useState(null); // Сюда будет бережно сохраняться coach._id
  const { orderState } = useContext(OrderContext);

  const [activeCard, setActiveCard] = useState('adult');
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [babyCount, setBabyCount] = useState(0);

   const dir = directionType || (isReturn ? 'arrival' : 'departure');
  // Группируем строго по w.coach.class_type
  const groupedWagons = {
    first: wagons ? wagons.filter(w => w?.coach?.class_type === 'first') : [],
    second: wagons ? wagons.filter(w => w?.coach?.class_type === 'second') : [],
    third: wagons ? wagons.filter(w => w?.coach?.class_type === 'third') : [],
    fourth: wagons ? wagons.filter(w => w?.coach?.class_type === 'fourth') : []
  };

  useEffect(() => {
    // Автоинициализация: только если вагоны пришли, а выбор еще не сделан
    if (wagons && wagons.length > 0 && !activeWagonId) {
      const type = Object.keys(groupedWagons).find(key => groupedWagons[key]?.length > 0);
      if (type) {
        setActiveTab(type);
        // 🛠️ ИСПРАВЛЕНО: Достаем _id из объекта coach, как это отдает API
        const firstWagonId = groupedWagons[type][0]?.coach?._id;
        if (firstWagonId) {
          setActiveWagonId(firstWagonId);
        }
      }
    }
  }, [wagons, activeWagonId]);

  // 🛠️ ИСПРАВЛЕНО: Ищем вагон по w.coach._id
  const currentWagon = wagons ? wagons.find(w => w?.coach?._id === activeWagonId) : null;
  const coach = currentWagon?.coach;

  const currentLegSeats = orderState?.legs?.[dir]?.seats || [];
  
  // Строго очищаем массив от дефолтных пустых элементов Нетологии { seatNumber: null }
  const selectedSeatsList = currentLegSeats.filter(
    s => s && s.seatNumber !== null && s.seatNumber !== undefined
  );

  const totalOrderPrice = selectedSeatsList.reduce((sum, seat) => {
    // Если вагон или его параметры еще не загрузились, возвращаем текущую сумму
    if (!coach || !coach.class_type) return sum;
    
    // 1. Если это ребенок "без места" (baby), по ТЗ его билет стоит 0 рублей
    if (seat.includeChildrenSeat) {
      return sum + 0;
    }

    let seatPrice = 0;
    
    // 2. Вычисляем базовую стоимость места на основе данных вагона от API с подстраховкой || 0
    if (coach.class_type === 'first' || coach.class_type === 'fourth') {
      seatPrice = Number(coach.price || coach.top_price || coach.bottom_price || 0);
    } else {
      const seatNum = Number(seat.seatNumber || 0);
      const isTop = seatNum % 2 === 0 && seatNum <= 36;
      const isSide = seatNum >= 37;

      if (isSide) {
        seatPrice = Number(coach.side_price || coach.price || 0);
      } else if (isTop) {
        seatPrice = Number(coach.top_price || coach.bottom_price || coach.price || 0);
      } else {
        seatPrice = Number(coach.bottom_price || coach.top_price || coach.price || 0);
      }
    }

    // 3. Применяем скидку 50% на билет, если стоит флаг детского билета
    if (seat.isChild) {
      return sum + (seatPrice / 2);
    }

    return sum + seatPrice;
  }, 0);

  return (
    <div className={`seats-direction-card-block ${isReturn ? 'seats-direction-card-block--return' : ''}`}>
      {/* СЛОЙ 1: НАВИГАЦИЯ НАЗАД */}
      <div className="seats-back-navigation">
        <div className={`seats-back-navigation__arrow-box ${isReturn ? 'seats-back-navigation__arrow-box--return' : ''}`}>➔</div>
        <button className="seats-back-navigation__btn" onClick={() => window.history.back()}>
          Выбрать другой поезд
        </button>
      </div>

      {/* СЛОЙ 2: ПЛАШКА ПОЕЗДА ПО МАКЕТУ FIGMA */}
      {routeData && (
        <div className="seats-embedded-train-card-container">
          <SeatsTrainHeader routeStateData={routeData} isReturn={isReturn} />
        </div>
      )}

      {/* СЛОЙ 3: КОЛИЧЕСТВО БИЛЕТОВ */}
      <div className="tickets-qty-layer">
        <h3 className="seats-layer-title">Количество билетов</h3>
        <div className="tickets-qty-grid">
          <div className={`qty-card ${activeCard === 'adult' ? 'qty-card--active' : ''}`} onClick={() => setActiveCard('adult')}>
            <div className="qty-card__input-zone">
              <span>Взрослых — </span>
              <input type="number" value={adultCount} onFocus={() => setActiveCard('adult')} onChange={(e) => setAdultCount(Number(e.target.value))} />
            </div>
          </div>

          <div className={`qty-card ${activeCard === 'child' ? 'qty-card--active' : ''}`} onClick={() => setActiveCard('child')}>
            <div className="qty-card__input-zone">
              <span>Детских — </span>
              <input type="number" value={childCount} onFocus={() => setActiveCard('child')} onChange={(e) => setChildCount(Number(e.target.value))} />
            </div>
          </div>

          <div className={`qty-card ${activeCard === 'baby' ? 'qty-card--active' : ''}`} onClick={() => setActiveCard('baby')}>
            <div className="qty-card__input-zone">
              <span>Детских "без места" — </span>
              <input type="number" value={babyCount} onFocus={() => setActiveCard('baby')} onChange={(e) => setBabyCount(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      {/* СЛОЙ 4: ТИП ВАГОНА */}
      {activeTab && (
        <WagonTabs 
          groupedWagons={groupedWagons} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          // 🛠️ ИСПРАВЛЕНО: При переключении больших табов передаем coach._id первого вагона
          setActiveWagonId={(id) => setActiveWagonId(id)} 
        />
      )}

      {/* СЛОЙ 5: НОМЕРА ВАГОНОВ */}
      {activeTab && groupedWagons[activeTab]?.length > 0 && (
        <>
          <WagonNumbers 
            wagonsList={groupedWagons[activeTab]} 
            activeWagonId={activeWagonId} 
            setActiveWagonId={setActiveWagonId} 
          />
          
        </>
      )}

      {/* СЛОЙ 6: ЧЕРТЕЖ ВАГОНА */}
      {currentWagon && activeTab && (
        <WagonScheme 
          wagon={currentWagon} 
          classType={activeTab} 
          directionType={directionType} 
          activeTicketType={activeCard} // Твой локальный стейт активной карточки ('adult'/'child'/'baby')
          maxLimits={{ adult: adultCount, child: childCount, baby: babyCount }} // Твои локальные счетчики
        />
      )}
      {/* 🛠️ ДОБАВЛЕНО: ОТРИСОВКА ИТОГОВОЙ СТОИМОСТИ МЕСТ СПРАВА ВНИЗУ */}
      {selectedSeatsList.length > 0 && (
        <div className="seats-total-price-summary-bar">
          <span className="total-price-summary-bar__value">
            {totalOrderPrice.toLocaleString('ru-RU')} <span className="total-currency-rub">₽</span>
          </span>
        </div>
      )}
    </div>
  );
}
    