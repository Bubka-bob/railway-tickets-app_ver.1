import React, { useState, useEffect, useContext } from 'react';
import WagonTabs from '../WagonTabs/WagonTabs';
import WagonNumbers from '../WagonNumbers';
import WagonScheme from '../WagonScheme/WagonScheme';
import SeatsTrainHeader from '../SeatsTrainHeader/SeatsTrainHeader';
import OrderContext from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import "./DirectionSeatsBlock.css";

export default function DirectionSeatsBlock({ 
  wagons = [], 
  routeData, 
  directionType, 
  isReturn = false, 
  onToggleService, // <-- Прием новых пропсов
  localServices    // <-- Прием новых пропсов
}) {
  const { orderState, setOrderState } = useContext(OrderContext);
  const dir = directionType || (isReturn ? 'arrival' : 'departure');
  
  const [activeTab, setActiveTab] = useState('');
  const [activeWagonId, setActiveWagonId] = useState(null); 
  const [activeTicketType, setActiveTicketType] = useState('adult');

  const currentLegSeats = orderState?.legs?.[dir]?.seats || [];
  const selectedSeatsList = currentLegSeats.filter(s => s && s.seatNumber !== null && s.seatNumber !== undefined);

  // Контролируемые инпуты билетов напрямую из глобального контекста заказа
  const counts = orderState?.personCount?.[dir] || { adult: 0, child: 0, baby: 0 };

  // Сумма за места
  const seatsTotal = selectedSeatsList.reduce((sum, s) => sum + Number(s.price || 0), 0);
  // Сумма за услуги из ЛОКАЛЬНОГО стейта страницы SelectSeatsPage
  const getCurrentServicesTotal = () => {
  const relevantWagons = Object.entries(localServices)
    .filter(([key]) => key.startsWith(dir + '_'))
    .map(([, services]) => services);

  return relevantWagons.flatMap(Object.values).reduce((sum, p) => sum + p, 0);
};

const servicesTotal = getCurrentServicesTotal(); // <-- Вызов функции
const currentTotalPrice = seatsTotal + servicesTotal;

 const groupedWagons = {
  first: Array.isArray(wagons) ? wagons.filter(w => w?.coach?.class_type === 'first') : [],
  second: Array.isArray(wagons) ? wagons.filter(w => w?.coach?.class_type === 'second') : [],
  third: Array.isArray(wagons) ? wagons.filter(w => w?.coach?.class_type === 'third') : [],
  fourth: Array.isArray(wagons) ? wagons.filter(w => w?.coach?.class_type === 'fourth') : []
};

useEffect(() => {
  if (wagons.length > 0 && !activeWagonId) {
    // Ищем ПЕРВЫЙ НЕПУСТОЙ тип вагона (например, сначала ищем Люкс/first, если там есть вагоны)
    const availableType = Object.keys(groupedWagons).find(key => groupedWagons[key].length > 0);
    
    if (availableType) {
      setActiveTab(availableType); // Открываем вкладку "Люкс", если она первая с местами
      
      // Берем самый первый вагон из отфильтрованного массива этого типа
      const firstAvailableWagonInThisType = groupedWagons[availableType][0];
      if (firstAvailableWagonInThisType?.coach?._id) {
        setActiveWagonId(firstAvailableWagonInThisType.coach._id);
      }
    }
  }
}, [wagons, activeWagonId]);

  const handleQtyChange = (type, inputValue) => {
    const numericValue = inputValue === '' ? 0 : Number(inputValue);
    
    // Защита: проверяем наличие сеттера перед вызовом
    if (!setOrderState) return;

    setOrderState(prev => {
      const currentSeats = (prev?.legs?.[dir]?.seats || []).filter(s => s && s.seatNumber);
      
      const selectedAdults = currentSeats.filter(s => s.passengerInfo?.isAdult === true);
      const selectedChildren = currentSeats.filter(s => s.isChild === true && !s.includeChildrenSeat);
      const selectedBabies = currentSeats.filter(s => s.includeChildrenSeat === true);

      const newAdultCount = type === 'adult' ? numericValue : (prev?.personCount?.[dir]?.adult || 0);
      const newChildCount = type === 'child' ? numericValue : (prev?.personCount?.[dir]?.child || 0);
      const newBabyCount = type === 'baby' ? numericValue : (prev?.personCount?.[dir]?.baby || 0);

      const updatedAdults = selectedAdults.length > newAdultCount ? selectedAdults.slice(0, newAdultCount) : selectedAdults;
      const updatedChildren = selectedChildren.length > newChildCount ? selectedChildren.slice(0, newChildCount) : selectedChildren;
      const updatedBabies = selectedBabies.length > newBabyCount ? selectedBabies.slice(0, newBabyCount) : selectedBabies;

      return {
        ...prev,
        personCount: {
          ...prev?.personCount,
          [dir]: { adult: newAdultCount, child: newChildCount, baby: newBabyCount }
        },
        legs: {
          ...prev?.legs,
          [dir]: {
            ...prev?.legs?.[dir],
            seats: [...updatedAdults, ...updatedChildren, ...updatedBabies]
          }
        }
      };
    });
  };

  const handleBackToTrainsClick = () => {
    if (!setOrderState) return;
    setOrderState({
      personCount: { departure: { adult: 0, child: 0, baby: 0 }, arrival: { adult: 0, child: 0, baby: 0 } },
      legs: { departure: { routeDirectionId: null, seats: [] }, arrival: { routeDirectionId: null, seats: [] } },
      totalPrice: 0,
      totalPriceSummary: { adults: 0, children: 0, grandTotal: 0 },
      savedTrainData: null
    });
    window.history.back();
  };

  const currentWagon = wagons.find(w => String(w?.coach?._id) === String(activeWagonId)) || wagons[0];

  return (
    <div className={`seats-direction-card-block ${isReturn ? 'seats-direction-card-block--return' : ''}`}>
      <div className="seats-back-navigation">
        <div className={`seats-back-navigation__arrow-box ${isReturn ? 'seats-back-navigation__arrow-box--return' : ''}`}>➔</div>
        <button className="seats-back-navigation__btn" onClick={handleBackToTrainsClick}>
          Выбрать другой поезд
        </button>
      </div>

      {routeData && (
        <div className="seats-embedded-train-card-container">
          <SeatsTrainHeader routeStateData={routeData} isReturn={isReturn} />
        </div>
      )}

      <div className="tickets-qty-layer">
        <h3 className="seats-layer-title">Количество билетов</h3>
        <div className="tickets-qty-grid">
          <div className={`qty-card ${activeTicketType === 'adult' ? 'qty-card--active' : ''}`} onClick={() => setActiveTicketType && setActiveTicketType('adult')}>
            <div className="qty-card__input-zone">
              <span>Взрослых — </span>
              <input type="number" min="0" value={(counts.adult === null || counts.adult === 0) ? '' : counts.adult} onFocus={() => setActiveTicketType && setActiveTicketType('adult')} onChange={(e) => handleQtyChange('adult', e.target.value)} />
            </div>
          </div>

          <div className={`qty-card ${activeTicketType === 'child' ? 'qty-card--active' : ''}`} onClick={() => setActiveTicketType && setActiveTicketType('child')}>
            <div className="qty-card__input-zone">
              <span>Детских — </span>
              <input type="number" min="0" value={(counts.child === null || counts.child === 0) ? '' : counts.child} onFocus={() => setActiveTicketType && setActiveTicketType('child')} onChange={(e) => handleQtyChange('child', e.target.value)} />
            </div>
          </div>

          <div className={`qty-card ${activeTicketType === 'baby' ? 'qty-card--active' : ''}`} onClick={() => setActiveTicketType && setActiveTicketType('baby')}>
            <div className="qty-card__input-zone">
              <span>Детских "без места" — </span>
              <input type="number" min="0" value={(counts.baby === null || counts.baby === 0) ? '' : counts.baby} onFocus={() => setActiveTicketType && setActiveTicketType('baby')} onChange={(e) => handleQtyChange('baby', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {activeTab && <WagonTabs 
      groupedWagons={groupedWagons} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      setActiveWagonId={setActiveWagonId} />}
      
      {activeTab && wagons.length > 0 && (
         <WagonNumbers 
          wagonsList={groupedWagons[activeTab]} 
          activeWagonId={activeWagonId} 
          setActiveWagonId={setActiveWagonId}
          onToggleService={onToggleService} 
          currentDirection={dir} 
          activeClassType={activeTab} 
          localServices={localServices} 
        />
      )}

      {currentWagon && activeTab && (
        <WagonScheme wagon={currentWagon} classType={activeTab} directionType={dir} activeTicketType={activeTicketType} maxLimits={counts} />
      )}
      
      {selectedSeatsList.length > 0 && (
        <div className="seats-total-price-summary-bar-wrapper">
          <div className="seats-total-price-summary-bar">
            <span className="total-price-summary-bar__value">
              {currentTotalPrice.toLocaleString('ru-RU')} <span className="total-currency-rub">₽</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}