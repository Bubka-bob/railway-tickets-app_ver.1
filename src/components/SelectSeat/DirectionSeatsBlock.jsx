import React, { useState, useEffect } from 'react';
import WagonTabs from './WagonTabs';
import WagonNumbers from './WagonNumbers';
import WagonScheme from '../SelectSeat/WagonScheme/WagonScheme';
import SeatsTrainHeader from './SeatsTrainHeader/SeatsTrainHeader';
import "./DirectionSeatsBlock.css";

export default function DirectionSeatsBlock({ wagons = [], routeData, directionType, isReturn = false }) {
  // Исправлено: для табов вагонов по умолчанию ставим пустую строку, чтобы сработал useEffect автоматического выбора первого доступного типа
  const [activeTab, setActiveTab] = useState('');
  const [activeWagonId, setActiveWagonId] = useState(null);
  
  // Объявляем недостающее состояние для активной подсвеченной карточки билетов
  const [activeCard, setActiveCard] = useState('adult');

  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [babyCount, setBabyCount] = useState(0);

  // Безопасная фильтрация массивов
  const groupedWagons = {
    first: wagons ? wagons.filter(w => w?.coach?.class_type === 'first') : [],
    second: wagons ? wagons.filter(w => w?.coach?.class_type === 'second') : [],
    third: wagons ? wagons.filter(w => w?.coach?.class_type === 'third') : [],
    fourth: wagons ? wagons.filter(w => w?.coach?.class_type === 'fourth') : []
  };

  useEffect(() => {
    if (wagons && wagons.length > 0 && activeTab === '') {
      const type = Object.keys(groupedWagons).find(key => groupedWagons[key]?.length > 0);
      if (type) {
        setActiveTab(type);
        setActiveWagonId(groupedWagons[type][0]?._id || null);
      }
    }
  }, [wagons, activeTab]);

  const currentWagon = wagons ? wagons.find(w => w?._id === activeWagonId) : null;

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

      {/* СЛОЙ 3: КОЛИЧЕСТВО БИЛЕТОВ (Добавлена утерянная обертка слоев для CSS) */}
      <div className="tickets-qty-layer">
        <h3 className="seats-layer-title">Количество билетов</h3>
        <div className="tickets-qty-grid">
          
          {/* Карточка Взрослых */}
          <div 
            className={`qty-card ${activeCard === 'adult' ? 'qty-card--active' : ''}`}
            onClick={() => setActiveCard('adult')}
          >
            <div className="qty-card__input-zone">
              <span>Взрослых — </span>
              <input 
                type="number" 
                value={adultCount} 
                onFocus={() => setActiveCard('adult')}
                onChange={(e) => setAdultCount(Number(e.target.value))} 
              />
            </div>
          </div>

          {/* Карточка Детских */}
          <div 
            className={`qty-card ${activeCard === 'child' ? 'qty-card--active' : ''}`}
            onClick={() => setActiveCard('child')}
          >
            <div className="qty-card__input-zone">
              <span>Детских — </span>
              <input 
                type="number" 
                value={childCount} 
                onFocus={() => setActiveCard('child')}
                onChange={(e) => setChildCount(Number(e.target.value))} 
              />
            </div>
          </div>

          {/* Карточка Без места */}
          <div 
            className={`qty-card ${activeCard === 'baby' ? 'qty-card--active' : ''}`}
            onClick={() => setActiveCard('baby')}
          >
            <div className="qty-card__input-zone">
              <span>Детсикх "без места" — </span>
              <input 
                type="number" 
                value={babyCount} 
                onFocus={() => setActiveCard('baby')}
                onChange={(e) => setBabyCount(Number(e.target.value))} 
              />
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
          setActiveWagonId={setActiveWagonId} 
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
          <p className="wagon-numbers-info">
            Нумерация вагонов начинается с головы состава
          </p>
        </>
      )}

      {/* СЛОЙ 6: ЧЕРТЕЖ ВАГОНА */}
      {currentWagon && activeTab && (
        <WagonScheme 
          wagon={currentWagon} 
          classType={activeTab} 
          directionType={directionType} 
        />
      )}
    </div>
  );
  }