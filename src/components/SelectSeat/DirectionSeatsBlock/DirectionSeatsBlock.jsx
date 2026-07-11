import React, { useState, useEffect, useContext } from 'react';
import WagonTabs from '../WagonTabs/WagonTabs';
import WagonNumbers from '../WagonNumbers';
import WagonScheme from '../WagonScheme/WagonScheme';
import SeatsTrainHeader from '../SeatsTrainHeader/SeatsTrainHeader';
import OrderContext from '../../context/OrderContext';
import "./DirectionSeatsBlock.css";

export default function DirectionSeatsBlock({ wagons = [], routeData, directionType, isReturn = false }) {
  // Достаем глобальный стейт заказа и функцию его изменения напрямую из контекста
  const { orderState, setOrderState} = useContext(OrderContext);

  const [activeTab, setActiveTab] = useState('');
  const [activeWagonId, setActiveWagonId] = useState(null); 
  const [activeTicketType, setActiveTicketType] = useState('adult');

  const dir = directionType || (isReturn ? 'arrival' : 'departure');
  
  // Контролируемые инпуты билетов напрямую из глобального контекста заказа
  const counts = orderState?.personCount?.[dir] || { adult: 0, child: 0, baby: 0 };

  // Безопасная группировка с защитой от пустого пропа wagons = null при первой загрузке страницы
  const groupedWagons = {
    first: Array.isArray(wagons) ? wagons.filter(w => w?.coach?.class_type === 'first') : [],
    second: Array.isArray(wagons) ? wagons.filter(w => w?.coach?.class_type === 'second') : [],
    third: Array.isArray(wagons) ? wagons.filter(w => w?.coach?.class_type === 'third') : [],
    fourth: Array.isArray(wagons) ? wagons.filter(w => w?.coach?.class_type === 'fourth') : []
  };

  useEffect(() => {
    // Автоинициализация табов первого доступного вагона
    if (wagons && wagons.length > 0 && !activeWagonId) {
      const type = Object.keys(groupedWagons).find(key => groupedWagons[key]?.length > 0);
      if (type) {
        setActiveTab(type);
        const firstWagonId = groupedWagons[type]?.[0]?.coach?._id;
        if (firstWagonId) setActiveWagonId(firstWagonId);
      }
    }
  }, [wagons, activeWagonId]);

  const currentWagon = wagons ? wagons.find(w => w?.coach?._id === activeWagonId) : null;

  // ==========================================================================
  // ⚛️ ЧИСТЫЙ REACT: ДЕКЛАРАТИВНЫЙ РАСЧЁТ СУММЫ ПРЯМО НА ОСНОВЕ МАССИВА СИДЕНИЙ
  // ==========================================================================
  const currentLegSeats = orderState?.legs?.[dir]?.seats || [];
  // Очищаем массив от пустых дефолтных элементов бэкенда { seatNumber: null }
  const selectedSeatsList = currentLegSeats.filter(s => s && s.seatNumber !== null && s.seatNumber !== undefined);

  // Калькулятор под вагоном просто складывает готовые цены, зашитые внутрь каждого сиденья!
  // Переключение вкладок номеров вагонов (80, 81) вообще никак не повлияет на стоимость прошлых мест,
  // так как сумма вычисляется строго декларативно по реальным ценам объектов мест.
  const currentTotalPrice = selectedSeatsList.reduce((sum, s) => sum + Number(s.price || 0), 0);

  // Универсальная функция плавного изменения инпутов билетов с автоматическим обрезанием мест
  const handleQtyChange = (type, inputValue) => {
    const numericValue = inputValue === '' ? 0 : Number(inputValue);
    
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

  // Функция полного сброса стейта в 0 при клике на навигационную стрелку назад
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
      
      {/* СЛОЙ 1: НАВИГАЦИЯ НАЗАД К ПОЕЗДАМ */}
      <div className="seats-back-navigation">
        <div className={`seats-back-navigation__arrow-box ${isReturn ? 'seats-back-navigation__arrow-box--return' : ''}`}>➔</div>
        <button className="seats-back-navigation__btn" onClick={handleBackToTrainsClick}>
          Выбрать другой поезд
        </button>
      </div>

      {/* СЛОЙ 2: ПЛАШКА ПОЕЗДА ПО МАКЕТУ FIGMA */}
      {routeData && (
        <div className="seats-embedded-train-card-container">
          <SeatsTrainHeader routeStateData={routeData} isReturn={isReturn} />
        </div>
      )}

      {/* СЛОЙ 3: КОЛИЧЕСТВО БИЛЕТОВ (Полностью привязано к Контексту заказа) */}
      <div className="tickets-qty-layer">
        <h3 className="seats-layer-title">Количество билетов</h3>
        <div className="tickets-qty-grid">
          
          <div className={`qty-card ${activeTicketType === 'adult' ? 'qty-card--active' : ''}`} onClick={() => setActiveTicketType('adult')}>
            <div className="qty-card__input-zone">
              <span>Взрослых — </span>
              <input type="number" min="0" value={counts.adult === 0 ? '' : counts.adult} onFocus={() => setActiveTicketType('adult')} onChange={(e) => handleQtyChange('adult', e.target.value)} />
            </div>
          </div>

          <div className={`qty-card ${activeTicketType === 'child' ? 'qty-card--active' : ''}`} onClick={() => setActiveTicketType('child')}>
            <div className="qty-card__input-zone">
              <span>Детских — </span>
              <input type="number" min="0" value={counts.child === 0 ? '' : counts.child} onFocus={() => setActiveTicketType('child')} onChange={(e) => handleQtyChange('child', e.target.value)} />
            </div>
          </div>

          <div className={`qty-card ${activeTicketType === 'baby' ? 'qty-card--active' : ''}`} onClick={() => setActiveTicketType('baby')}>
            <div className="qty-card__input-zone">
              <span>Детских "без места" — </span>
              <input type="number" min="0" value={counts.baby === 0 ? '' : counts.baby} onFocus={() => setActiveTicketType('baby')} onChange={(e) => handleQtyChange('baby', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* СЛОЙ 4: ТИП ВАГОНА */}
      {activeTab && <WagonTabs groupedWagons={groupedWagons} activeTab={activeTab} setActiveTab={setActiveTab} setActiveWagonId={setActiveWagonId} />}
      
      {/* СЛОЙ 5: НОМЕРА ВАГОНОВ */}
      {activeTab && groupedWagons[activeTab]?.length > 0 && <WagonNumbers wagonsList={groupedWagons[activeTab]} activeWagonId={activeWagonId} setActiveWagonId={setActiveWagonId} />}

      {/* СЛОЙ 6: ЧЕРТЕЖ ВАГОНА */}
      {currentWagon && activeTab && (
        <WagonScheme wagon={currentWagon} classType={activeTab} directionType={dir} activeTicketType={activeTicketType} maxLimits={counts} />
      )}
      
      {/* ОТРИСОВКА ИТОГОВОЙ СТОИМОСТИ МЕСТ СРАЗУ ПОД ВАГОНОМ */}
      {selectedSeatsList.length > 0 && (
        <div className="seats-total-price-summary-bar">
          <span className="total-price-summary-bar__value">
            {currentTotalPrice.toLocaleString('ru-RU')} <span className="total-currency-rub">₽</span>
          </span>
        </div>
      )}
    </div>
  );
}