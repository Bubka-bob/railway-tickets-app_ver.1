import React, { useState, useEffect } from 'react';
import WagonTabs from './WagonTabs';
import WagonNumbers from './WagonNumbers';
import WagonScheme from '../SelectSeat/WagonScheme/WagonScheme';
import SeatsTrainHeader from './SeatsTrainHeader/SeatsTrainHeader';

// 🔴 ИСПРАВЛЕНО: Принимаем routeData вместо trainData
export default function DirectionSeatsBlock({ wagons, routeData, directionType, isReturn = false }) {
  const [activeTab, setActiveTab] = useState('');
  const [activeWagonId, setActiveWagonId] = useState(null);
  
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(1);
  const [babyCount, setBabyCount] = useState(0);

  const groupedWagons = {
    first: wagons.filter(w => w.coach?.class_type === 'first'),
    second: wagons.filter(w => w.coach?.class_type === 'second'),
    third: wagons.filter(w => w.coach?.class_type === 'third'),
    fourth: wagons.filter(w => w.coach?.class_type === 'fourth')
  };

  useEffect(() => {
    if (wagons.length > 0 && activeTab === '') {
      const type = Object.keys(groupedWagons).find(key => groupedWagons[key].length > 0);
      if (type) {
        setActiveTab(type);
        setActiveWagonId(groupedWagons[type][0]?._id || null);
      }
    }
  }, [wagons, activeTab]);

  const currentWagon = wagons.find(w => w._id === activeWagonId);

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
          {/* 🔴 ИСПРАВЛЕНО: передаем routeStateData для чтения динамических строк из контекста */}
          <SeatsTrainHeader routeStateData={routeData} isReturn={isReturn} />
        </div>
      )}

      {/* СЛОЙ 3: КОЛИЧЕСТВО БИЛЕТОВ */}
      <div className="tickets-qty-layer">
        <h3 className="seats-layer-title">Количество билетов</h3>
        <div className="tickets-qty-grid">
          <div className="qty-card">
            <div className="qty-card__input-zone"><span>Взрослых — </span><input type="number" value={adultCount} onChange={(e) => setAdultCount(Number(e.target.value))} /></div>
          </div>
          <div className="qty-card qty-card--active">
            <div className="qty-card__input-zone"><span>Детских — </span><input type="number" value={childCount} onChange={(e) => setChildCount(Number(e.target.value))} /></div>
          </div>
          <div className="qty-card">
            <div className="qty-card__input-zone"><span>Без места — </span><input type="number" value={babyCount} onChange={(e) => setBabyCount(Number(e.target.value))} /></div>
          </div>
        </div>
      </div>

      {/* СЛОЙ 4: ТИП ВАГОНА */}
      <WagonTabs groupedWagons={groupedWagons} activeTab={activeTab} setActiveTab={setActiveTab} setActiveWagonId={setActiveWagonId} />

      {/* СЛОЙ 5: НОМЕРА ВАГОНОВ */}
      {groupedWagons[activeTab]?.length > 0 && (
        <WagonNumbers wagonsList={groupedWagons[activeTab]} activeWagonId={activeWagonId} setActiveWagonId={setActiveWagonId} />
      )}

      {/* СЛОЙ 6: ЧЕРТЕЖ ВАГОНА */}
      {currentWagon && <WagonScheme wagon={currentWagon} classType={activeTab} directionType={directionType} />}
    </div>
  );
}