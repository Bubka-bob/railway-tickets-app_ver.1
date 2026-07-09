import React, { useState, useEffect, useContext } from 'react';
import WagonTabs from '../WagonTabs/WagonTabs';
import WagonNumbers from '../WagonNumbers';
import WagonScheme from '../WagonScheme/WagonScheme';
import SeatsTrainHeader from '../SeatsTrainHeader/SeatsTrainHeader';
import OrderContext from '../../context/OrderContext';
import "./DirectionSeatsBlock.css";

export default function DirectionSeatsBlock({ wagons = [], routeData, directionType, isReturn = false }) {
  // Достаем глобальный стейт заказа и функцию его изменения напрямую из контекста
  const { orderState, setOrderState } = useContext(OrderContext);
  
  const [activeTab, setActiveTab] = useState('');
  const [activeWagonId, setActiveWagonId] = useState(null); 
  const [activeCard, setActiveCard] = useState('adult'); // Локально храним только подсветку активного инпута

  const dir = directionType || (isReturn ? 'arrival' : 'departure');
  
  // ⚛️ ЧИСТЫЙ REACT: Читаем числа пассажиров напрямую из глобального стейта (Память работает из коробки!)
  const counts = orderState?.personCount?.[dir] || { adult: 0, child: 0, baby: 0 };

  // Группируем строго по w.coach.class_type
  const groupedWagons = {
    first: wagons ? wagons.filter(w => w?.coach?.class_type === 'first') : [],
    second: wagons ? wagons.filter(w => w?.coach?.class_type === 'second') : [],
    third: wagons ? wagons.filter(w => w?.coach?.class_type === 'third') : [],
    fourth: wagons ? wagons.filter(w => w?.coach?.class_type === 'fourth') : []
  };

  useEffect(() => {
    // Автоинициализация табов первого вагона
    if (wagons && wagons.length > 0 && !activeWagonId) {
      const type = Object.keys(groupedWagons).find(key => groupedWagons[key]?.length > 0);
      if (type) {
        setActiveTab(type);
        const firstWagonId = groupedWagons[type][0]?.coach?._id;
        if (firstWagonId) setActiveWagonId(firstWagonId);
      }
    }
  }, [wagons, activeWagonId]);

  const currentWagon = wagons ? wagons.find(w => w?.coach?._id === activeWagonId) : null;
  const coach = currentWagon?.coach;

  const currentLegSeats = orderState?.legs?.[dir]?.seats || [];
  const selectedSeatsList = currentLegSeats.filter(s => s && s.seatNumber !== null && s.seatNumber !== undefined);

  // ⚛️ ЧИСТЫЙ REACT: Вычисляем стоимости декларативно прямо перед рендером, без побочных эффектов
  const adultsPriceTotal = selectedSeatsList.reduce((sum, seat) => {
    if (!coach || !coach.class_type || seat.isChild || seat.includeChildrenSeat) return sum;
    let price = coach.class_type === 'first' || coach.class_type === 'fourth' ? (coach.price || 0) : (Number(seat.seatNumber) % 2 === 0 ? coach.top_price : coach.bottom_price) || coach.price || 0;
    return sum + Number(price);
  }, 0);

  const childrenPriceTotal = selectedSeatsList.reduce((sum, seat) => {
    if (!coach || !coach.class_type || !seat.isChild || seat.includeChildrenSeat) return sum;
    let price = coach.class_type === 'first' || coach.class_type === 'fourth' ? (coach.price || 0) : (Number(seat.seatNumber) % 2 === 0 ? coach.top_price : coach.bottom_price) || coach.price || 0;
    return sum + (Number(price) / 2);
  }, 0);

  const totalOrderPrice = adultsPriceTotal + childrenPriceTotal;

  // ⚛️ ЧИСТЫЙ REACT: Прямое иммутабельное обновление инпутов и автоматическое подрезание мест
  const handleQtyChange = (type, inputValue) => {
    const numericValue = inputValue === '' ? 0 : Number(inputValue);
    
    setOrderState(prev => {
      const currentSeats = (prev?.legs?.[dir]?.seats || []).filter(s => s && s.seatNumber !== null);
      
      // Разделяем выбранные на схеме места по категориям пассажиров
      const selectedAdults = currentSeats.filter(s => s.passengerInfo?.isAdult === true);
      const selectedChildren = currentSeats.filter(s => s.isChild === true && !s.includeChildrenSeat);
      const selectedBabies = currentSeats.filter(s => s.includeChildrenSeat === true);

      // Формируем новые лимиты
      const newAdultCount = type === 'adult' ? numericValue : (prev?.personCount?.[dir]?.adult || 0);
      const newChildCount = type === 'child' ? numericValue : (prev?.personCount?.[dir]?.child || 0);
      const newBabyCount = type === 'baby' ? numericValue : (prev?.personCount?.[dir]?.baby || 0);

      // Если мест на схеме больше, чем новое число в инпуте, подрезаем массив мест
      const updatedAdults = selectedAdults.length > newAdultCount ? selectedAdults.slice(0, newAdultCount) : selectedAdults;
      const updatedChildren = selectedChildren.length > newChildCount ? selectedChildren.slice(0, newChildCount) : selectedChildren;
      const updatedBabies = selectedBabies.length > newBabyCount ? selectedBabies.slice(0, newBabyCount) : selectedBabies;

      const finalSeatsArray = [...updatedAdults, ...updatedChildren, ...updatedBabies];

      // Сразу пересчитываем цены для totalPriceSummary, чтобы сайдбар на следующей странице мгновенно их увидел
      const nextAdultsCost = finalSeatsArray.filter(s => s.passengerInfo?.isAdult === true).reduce((sum, s) => sum + (s.price || 0), 0); // Если цены пишутся хелпером, иначе они посчитаются из редьюса сайдбара
      const nextChildrenCost = finalSeatsArray.filter(s => s.isChild === true && !s.includeChildrenSeat).reduce((sum, s) => sum + (s.price || 0), 0);

      return {
        ...prev,
        savedTrainData: routeData,
        totalPrice: finalSeatsArray.length > 0 ? totalOrderPrice : 0, // Подстраховка
        personCount: {
          ...prev?.personCount,
          [dir]: { adult: newAdultCount, child: newChildCount, baby: newBabyCount }
        },
        totalPriceSummary: {
          adults: type === 'adult' && numericValue === 0 ? 0 : adultsPriceTotal,
          children: type === 'child' && numericValue === 0 ? 0 : childrenPriceTotal,
          grandTotal: totalOrderPrice
        },
        legs: {
          ...prev?.legs,
          [dir]: { ...prev?.legs?.[dir], seats: finalSeatsArray }
        }
      };
    });
  };

  // ФУНКЦИЯ КЛИКА НА КНОПКУ «ВЫБРАТЬ ДРУГОЙ ПОЕЗД» С ПОЛНЫМ ОБНУЛЕНИЕМ КОНТЕКСТА СРАЗУ ВО ВСЕХ ИНПУТАХ
  const handleBackToTrainsClick = () => {
    setOrderState({
      personCount: { departure: { adult: 0, child: 0, baby: 0 }, arrival: { adult: 0, child: 0, baby: 0 } },
      legs: { departure: { routeDirectionId: null, seats: [] }, arrival: { routeDirectionId: null, seats: [] } },
      totalPrice: 0,
      totalPriceSummary: { adults: 0, children: 0, grandTotal: 0 },
      savedTrainData: null
    });
    window.history.back();
  };

  return (
    <div className={`seats-direction-card-block ${isReturn ? 'seats-direction-card-block--return' : ''}`}>
      
      {/* СЛОЙ 1: НАВИГАЦИЯ НАЗАД С ПОЛНЫМ ОБНУЛЕНИЕМ ИНПУТОВ И МЕСТ */}
      <div className="seats-back-navigation">
        <div className={`seats-back-navigation__arrow-box ${isReturn ? 'seats-back-navigation__arrow-box--return' : ''}`}>➔</div>
        <button className="seats-back-navigation__btn" onClick={handleBackToTrainsClick}>
          Выбрать другой поезд
        </button>
      </div>

      {/* СЛОЙ 2: ПЛАШКА ПОЕЗДА */}
      {routeData && (
        <div className="seats-embedded-train-card-container">
          <SeatsTrainHeader routeStateData={routeData} isReturn={isReturn} />
        </div>
      )}

      {/* СЛОЙ 3: КОЛИЧЕСТВО БИЛЕТОВ (Полностью контролируемые инпуты без локальных useState) */}
      <div className="tickets-qty-layer">
        <h3 className="seats-layer-title">Количество билетов</h3>
        <div className="tickets-qty-grid">
          
          <div className={`qty-card ${activeCard === 'adult' ? 'qty-card--active' : ''}`} onClick={() => setActiveCard('adult')}>
            <div className="qty-card__input-zone">
              <span>Взрослых — </span>
              <input 
                type="number" 
                min="0"
                value={counts.adult === 0 ? '' : counts.adult} 
                onFocus={() => setActiveCard('adult')} 
                onChange={(e) => handleQtyChange('adult', e.target.value)} 
              />
            </div>
          </div>

          <div className={`qty-card ${activeCard === 'child' ? 'qty-card--active' : ''}`} onClick={() => setActiveCard('child')}>
            <div className="qty-card__input-zone">
              <span>Детских — </span>
              <input 
                type="number" 
                min="0"
                value={counts.child === 0 ? '' : counts.child} 
                onFocus={() => setActiveCard('child')} 
                onChange={(e) => handleQtyChange('child', e.target.value)} 
              />
            </div>
          </div>

          <div className={`qty-card ${activeCard === 'baby' ? 'qty-card--active' : ''}`} onClick={() => setActiveCard('baby')}>
            <div className="qty-card__input-zone">
              <span>Детских "без места" — </span>
              <input 
                type="number" 
                min="0"
                value={counts.baby === 0 ? '' : counts.baby} 
                onFocus={() => setActiveCard('baby')} 
                onChange={(e) => handleQtyChange('baby', e.target.value)} 
              />
            </div>
          </div>

        </div>
      </div>

      {/* СЛОЙ 4: ТИП ВАГОНА */}
      {activeTab && (
        <WagonTabs groupedWagons={groupedWagons} activeTab={activeTab} setActiveTab={setActiveTab} setActiveWagonId={(id) => setActiveWagonId(id)} />
      )}

      {/* СЛОЙ 5: НОМЕРА ВАГОНОВ */}
      {activeTab && groupedWagons[activeTab]?.length > 0 && (
        <WagonNumbers wagonsList={groupedWagons[activeTab]} activeWagonId={activeWagonId} setActiveWagonId={setActiveWagonId} />
      )}

      {/* СЛОЙ 6: ЧЕРТЕЖ ВАГОНА */}
      {currentWagon && activeTab && (
        <WagonScheme 
          wagon={currentWagon} 
          classType={activeTab} 
          directionType={dir} 
          activeTicketType={activeCard}
          maxLimits={counts} 
        />
      )}
      
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