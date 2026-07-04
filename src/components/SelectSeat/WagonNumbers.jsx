
import React from 'react';
import './WagonNumbers.css';
import WagonServices from "./WagonServices/WagonServices"

export default function WagonNumbers({ wagonsList = [], activeWagonId, setActiveWagonId }) {
  const currentWagon = wagonsList.find(w => String(w?.coach?._id) === String(activeWagonId)) || wagonsList[0];

  if (!currentWagon) return null;

  const coach = currentWagon?.coach;
  const seats = currentWagon?.seats || [];
  const availableSeatsCount = seats.filter(s => s?.available).length;

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

      {/* НИЖНЯЯ ПЛАНКА: Детализация по колонкам Grid */}
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
          
          {/* КОЛОНКА 1: Места */}
          <div className="wagon-grid-column">
            <span className="wagon-stat-item__label">Места</span>
            <span className="wagon-stat-item__value highlight-black">{availableSeatsCount}</span>
          </div>

          {/* КОЛОНКА 2: Стоимость */}
          <div className="wagon-grid-column">
            <span className="wagon-stat-item__label">Стоимость</span>
            <span className="wagon-stat-item__value price-value">
              {(coach?.price || 0).toLocaleString('ru-RU')} <span className="currency-rub">₽</span>
            </span>
          </div>

          {/* КОЛОНКА 3: Правый сайдбар */}
        <div className="wagon-grid-column wagon-right-sidebar">

          {/* Вставляем наш новый интерактивный компонент */}
          <WagonServices coach={coach} />

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