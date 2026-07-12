import React from 'react';
import './WagonNumbers.css';
import WagonServices from "./WagonServices/WagonServices";


export default function WagonNumbers({ wagonsList = [], activeWagonId, setActiveWagonId, onToggleService, currentDirection, activeClassType, localServices }) {
  const currentWagon = wagonsList.find(w => String(w?.coach?._id) === String(activeWagonId)) || wagonsList[0];
  if (!currentWagon) return null;

  const coach = currentWagon?.coach;
  const seats = currentWagon?.seats || [];
  const classType = coach?.class_type; // Получаем тип вагона ('first', 'second', 'third', 'fourth')

  // Считаем общее количество доступных мест
  const availableSeats = seats.filter(s => s?.available);
  const totalAvailableCount = availableSeats.length;

  // Распределяем места по категориям на основе индексов API Netology
  const topSeats = availableSeats.filter(s => s.index <= 36 && s.index % 2 === 0);
  const bottomSeats = availableSeats.filter(s => s.index <= 36 && s.index % 2 !== 0);
  const sideSeats = availableSeats.filter(s => s.index >= 37);

  const formatWagonName = (name, index) => {
    if (!name) return String(index + 1).padStart(2, '0');
    const onlyDigits = name.replace(/\D/g, '');
    if (!onlyDigits) return String(index + 1).padStart(2, '0');
    return onlyDigits.padStart(2, '0');
  };

  return (
    <div className="wagon-info-panel">
      {/* ВЕРХНЯЯ СТРОКА: Список номеров доступных вагонов */}
      <div className="wagon-numbers-top-row">
        <div className="wagon-selector-box">
          <span className="wagon-selector-label">Вагоны</span>
          <div className="wagon-numbers-list">
            {wagonsList.map((w, index) => {
              const wagonNum = formatWagonName(w?.coach?.name, index);
              const isSelected = String(w?.coach?._id) === String(activeWagonId);
              
              return (
                <button
                  key={w?.coach?._id || index}
                  type="button"
                  className={`wagon-number-nav-btn ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setActiveWagonId(w?.coach?._id)}
                >
                  {wagonNum}
                </button>
              );
            })}
          </div>
        </div>
        
        <span className="wagon-header-info-text">
          Нумерация вагонов начинается с головы поезда
        </span>
      </div>

      {/* НИЖНЯЯ ПЛАНКА: Детализация */}
      <div className="wagon-details-row">
        {/* Огромная цифра номера вагона слева */}
        <div className="current-wagon-badge">
          <span className="current-wagon-badge__num">
            {formatWagonName(coach?.name, wagonsList.indexOf(currentWagon))}
          </span>
          <span className="current-wagon-badge__text">вагон</span>
        </div>

        {/* ОСНОВНАЯ СЕТКА GRID */}
        <div className="wagon-stats-grid">
          
          {/* ТАБЛИЦА МЕСТ И ЦЕН ПО МАКЕТУ */}
          <div className="wagon-prices-table-container">
            <div className="wagon-table-header">
              <span className="header-label-gray">Места <span className="header-total-qty">{totalAvailableCount}</span></span>
              <span className="header-label-gray spec-cost-pos">Стоимость</span>
            </div>
            
            <div className="wagon-table-body-rows">
              {/* УСЛОВИЕ ДЛЯ ЛЮКСА И СИДЯЧЕГО (Вывод в одну строку) */}
              {(classType === 'first' || classType === 'fourth') && (
                <div className="wagon-price-row-item">
                  <span className="wagon-seat-type-label">
                    {classType === 'first' ? 'Люкс' : 'Сидячие'}
                  </span>
                  <span className="wagon-seat-qty">{totalAvailableCount}</span>
                  <span className="wagon-seat-price">
                    {(coach?.price || coach?.top_price || coach?.bottom_price || 0).toLocaleString('ru-RU')}{' '}
                    <span className="currency-rub">₽</span>
                  </span>
                </div>
              )}

              {/* УСЛОВИЕ ДЛЯ КУПЕ И ПЛАЦКАРТА (Вывод списком) */}
              {(classType === 'second' || classType === 'third') && (
                <>
                  {/* Верхние места */}
                  <div className="wagon-price-row-item">
                    <span className="wagon-seat-type-label">Верхние</span>
                    <span className="wagon-seat-qty">{topSeats.length}</span>
                    <span className="wagon-seat-price">
                      {(coach?.top_price || coach?.price || 0).toLocaleString('ru-RU')} <span className="currency-rub">₽</span>
                    </span>
                  </div>
                  
                  {/* Нижние места */}
                  <div className="wagon-price-row-item">
                    <span className="wagon-seat-type-label">Нижние</span>
                    <span className="wagon-seat-qty">{bottomSeats.length}</span>
                    <span className="wagon-seat-price">
                      {(coach?.bottom_price || coach?.price || 0).toLocaleString('ru-RU')} <span className="currency-rub">₽</span>
                    </span>
                  </div>

                  {/* Боковые места (Только если это плацкарт) */}
                  {classType === 'third' && sideSeats.length > 0 && (
                    <div className="wagon-price-row-item">
                      <span className="wagon-seat-type-label">Боковые</span>
                      <span className="wagon-seat-qty">{sideSeats.length}</span>
                      <span className="wagon-seat-price">
                        {(coach?.side_price || coach?.price || 0).toLocaleString('ru-RU')} <span className="currency-rub">₽</span>
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* КОЛОНКА 3: Правый сайдбар с услугами и количеством людей */}
          <div className="wagon-grid-column wagon-right-sidebar">
            {/* ✅ ИСПРАВЛЕНО: Прокидываем пропсы сквозного стейта услуг дальше */}
            <WagonServices 
             coach={coach} 
              onToggleService={onToggleService}
              currentDirection={currentDirection} 
              activeClassType={activeClassType}
              localServices={localServices}  />
         
            <div className="wagon-viewers-alert">
              <span className="wagon-viewers-alert__text">
                11 человек выбирают места в этом поезде
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}