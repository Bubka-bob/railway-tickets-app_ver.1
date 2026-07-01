import React from 'react';

export default function WagonNumbers({ wagonsList, activeWagonId, setActiveWagonId }) {
  return (
    <div className="wagon-numbers-panel">
      <div className="wagon-numbers-panel__left">
        <span className="wagon-numbers-title">Вагоны:</span>
        {wagonsList.map((wagon, index) => {
          const isSelected = activeWagonId === wagon._id;
          // Красиво форматируем номер вагона (добавляем ведущий ноль, если номер одиночный)
          const wagonNum = wagon.coach?.name ? String(wagon.coach.name).padStart(2, '0') : String(index + 1).padStart(2, '0');
          
          return (
            <button
              key={wagon._id}
              className={`wagon-num-btn ${isSelected ? 'is-active' : ''}`}
              onClick={() => setActiveWagonId(wagon._id)}
            >
              {wagonNum}
            </button>
          );
        })}
      </div>
      <p className="wagon-numbers-panel__hint">Нумерация вагонов начинается с головы состава</p>
    </div>
  );
}