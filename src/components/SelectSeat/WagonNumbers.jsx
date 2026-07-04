// import React from 'react';

// export default function WagonNumbers({ wagonsList, activeWagonId, setActiveWagonId }) {
//   return (
//     <div className="wagon-numbers-panel">
//       <div className="wagon-numbers-panel__left">
//         <span className="wagon-numbers-title">Вагоны:</span>
//         {wagonsList.map((wagon, index) => {
//           const isSelected = activeWagonId === wagon._id;
//           // Красиво форматируем номер вагона (добавляем ведущий ноль, если номер одиночный)
//           const wagonNum = wagon.coach?.name ? String(wagon.coach.name).padStart(2, '0') : String(index + 1).padStart(2, '0');
          
//           return (
//             <button
//               key={wagon._id}
//               className={`wagon-num-btn ${isSelected ? 'is-active' : ''}`}
//               onClick={() => setActiveWagonId(wagon._id)}
//             >
//               {wagonNum}
//             </button>
//           );
//         })}
//       </div>
//       <p className="wagon-numbers-panel__hint">Нумерация вагонов начинается с головы состава</p>
//     </div>
//   );
// }
import React from 'react';
import './WagonNumbers.css';

export default function WagonNumbers({ wagonsList = [], activeWagonId, setActiveWagonId }) {
  // 1. ИСПРАВЛЕНО: Безопасный поиск вагона со строгой нормализацией ID в строку
  const currentWagon = wagonsList.find(w => String(w?._id) === String(activeWagonId)) || wagonsList[0];

  if (!currentWagon) return null;

  const coach = currentWagon?.coach;
  const seats = currentWagon?.seats || [];
  const availableSeatsCount = seats.filter(s => s?.available).length;

  // Функция-хелпер для очистки имени вагона от буквенного мусора API
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
              
              // 2. ИСПРАВЛЕНО: Сверяем ID через приведение к строке, чтобы сравнение не сбоило
              const isSelected = String(w?.coach?._id) === String(activeWagonId);
              
              return (
                <button
                  key={w?._id}
                  type="button"
                  className={`wagon-number-nav-btn ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => 
                    // Переключаем ID активного вагона при клике
                    setActiveWagonId(w?.coach?._id)
                  }
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

      {/* НИЖНЯЯ ПЛАНКА: Детализация по макету Figma */}
      <div className="wagon-details-row">
        <div className="current-wagon-badge">
          <span className="current-wagon-badge__num">
            {formatWagonName(coach?.name, wagonsList.indexOf(currentWagon))}
          </span>
          <span className="current-wagon-badge__text">вагон</span>
        </div>

        <div className="wagon-stats-grid">
          <div className="wagon-stat-item">
            <span className="wagon-stat-item__label">Места</span>
            <span className="wagon-stat-item__value highlight-black">{availableSeatsCount}</span>
          </div>

          <div className="wagon-stat-item">
            <span className="wagon-stat-item__label">Стоимость</span>
            <span className="wagon-stat-item__value price-value">
              {(coach?.price || 0).toLocaleString('ru-RU')} <span className="currency-rub">₽</span>
            </span>
          </div>

          <div className="wagon-stat-item">
            <span className="wagon-stat-item__label">Обслуживание <span className="sub-label-gray">ФПК</span></span>
            <div className="wagon-services-icons">
              <div className={`service-icon-box ${coach?.have_air_conditioning ? 'is-active' : ''}`} title="Кондиционер">
                ❄️
              </div>
              <div className={`service-icon-box ${coach?.have_wifi ? 'is-active' : ''}`} title="Wi-Fi">
                📶
              </div>
              <div className="service-icon-box is-active" title="Питание">
                ☕
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="wagon-viewers-alert">
        <span className="wagon-viewers-alert__text">11 человек выбирают места в этом поезде</span>
      </div>
    </div>
  );
}