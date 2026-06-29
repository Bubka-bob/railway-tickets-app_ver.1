// import React, { useContext, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import useGetSeats from '../../services/useGetSeats';
// import AppContext from '../../components/context/AppContext';
// import './SelectSeat.css';

// export default function SelectSeatsPage() {
//   const [searchParams] = useSearchParams();
//   const { appState } = useContext(AppContext);

//   // Считываем ID поезда из URL строки браузера
//   const trainId = searchParams.get('id');

//   // Передаем параметры в наш обновленный хук мест
//   const { resultDeparture } = useGetSeats({
//     departure_id: trainId,
//     arrival_id: appState?.arrival_id || null,
//     have_first_class: appState?.have_first_class ? 'true' : null,
//     have_second_class: appState?.have_second_class ? 'true' : null,
//     have_third_class: appState?.have_third_class ? 'true' : null,
//     have_fourth_class: appState?.have_fourth_class ? 'true' : null,
//     have_wifi: appState?.have_wifi ? 'true' : null,
//   });

//   const wagonsArray = resultDeparture?.result;
//   const isLoading = resultDeparture?.isLoading;
//   const error = resultDeparture?.error;

//   // Мониторим ответ сервера свободных мест в консоли
//   if (wagonsArray) {
//     console.log("=== МАССИВ ВАГОНОВ С СЕРВЕРА ВЫБОРА МЕСТ ===", wagonsArray);
//   }

//   return (
//     <div className="select-seats-page container" style={{ padding: '40px 20px' }}>
//       <header className="select-seats-page__header">
//         <h2>Выбор мест</h2>
//         <p>Инициализирован запрос для поезда: <strong>{trainId}</strong></p>
//       </header>

//       {isLoading && <div className="seats-loading">Загрузка интерактивной карты вагонов...</div>}
//       {error && <div className="seats-error">Не удалось загрузить вагоны: {error}</div>}

//       {!isLoading && !error && wagonsArray && (
//         <div className="seats-workspace">
//           <div className="alert-success-box" style={{ background: '#e2f0d9', padding: '15px', borderRadius: '4px' }}>
//             Связь с API установлена успешно! Найдено вагонов для выбора: <strong>{wagonsArray.length}</strong>.
//           </div>
//           {/* Сюда мы на следующем шаге внедрим вкладки типов вагонов и карту мест */}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useGetSeats from '../../services/useGetSeats';
import AppContext from '../../components/context/AppContext';
import './SelectSeat.css';

export default function SelectSeatsPage() {
  const [searchParams] = useSearchParams();
  const { appState } = useContext(AppContext);

  // Считываем ID поезда из URL строки браузера
  const trainId = searchParams.get('id');

  // Передаем параметры в наш обновленный хук мест
  const { resultDeparture } = useGetSeats({
    departure_id: trainId,
    arrival_id: appState?.arrival_id || null,
    have_first_class: appState?.have_first_class ? 'true' : null,
    have_second_class: appState?.have_second_class ? 'true' : null,
    have_third_class: appState?.have_third_class ? 'true' : null,
    have_fourth_class: appState?.have_fourth_class ? 'true' : null,
    have_wifi: appState?.have_wifi ? 'true' : null,
  });

  const wagonsArray = resultDeparture?.result;
  const isLoading = resultDeparture?.isLoading;
  const error = resultDeparture?.error;

  // ЛОГИКА ТАБОВ: Состояние для хранения выбранного типа вагона
  const [activeTab, setActiveTab] = useState('');
  // Состояние для хранения выбранного конкретного номера вагона
  const [activeWagonId, setActiveWagonId] = useState(null);

  // Группируем вагоны по типам, если они пришли с сервера
  const groupedWagons = {
    first: wagonsArray?.filter(w => w.coach?.class_type === 'first') || [],
    second: wagonsArray?.filter(w => w.coach?.class_type === 'second') || [],
    third: wagonsArray?.filter(w => w.coach?.class_type === 'third') || [],
    fourth: wagonsArray?.filter(w => w.coach?.class_type === 'fourth') || []
  };

  // Словарь для красивого вывода названий вкладок
  const tabNames = {
    fourth: "Сидячий",
    third: "Плацкарт",
    second: "Купе",
    first: "Люкс"
  };

  // ✅ ИСПРАВЛЕНО: Автоматический выбор первого доступного вагона перенесен в безопасный useEffect
  useEffect(() => {
    if (wagonsArray && wagonsArray.length > 0 && activeTab === '') {
      // Ищем первый тип вагона, в котором есть хотя бы один элемент
      const firstAvailableType = Object.keys(groupedWagons).find(key => groupedWagons[key].length > 0);
      
      if (firstAvailableType) {
        setActiveTab(firstAvailableType);
        // Безопасно берем ID самого первого вагона в этом типе
        const firstWagonId = groupedWagons[firstAvailableType]?.[0]?._id;
        if (firstWagonId) {
          setActiveWagonId(firstWagonId);
        }
      }
    }
  }, [wagonsArray, activeTab]);

  // Находим объект текущего активного вагона, чтобы рендерить его схему мест
  const currentActiveWagon = wagonsArray?.find(w => w._id === activeWagonId);

  return (
    <div className="select-seats-page container" style={{ padding: '40px 20px' }}>
      <header className="select-seats-page__header">
        <h2>Выбор мест</h2>
        <p>Инициализирован запрос для поезда: <strong>{trainId}</strong></p>
      </header>

      {isLoading && <div className="seats-loading">Загрузка интерактивной карты вагонов...</div>}
      {error && <div className="seats-error">Не удалось загрузить вагоны: {error}</div>}

      {!isLoading && !error && wagonsArray && (
        <div className="seats-workspace">
          
          {/* 1. ГОРИЗОНТАЛЬНЫЕ ВКЛАДКИ ТИПОВ ВАГОНОВ (TABS) */}
          <div className="seats-tabs">
            {Object.keys(groupedWagons).map(typeKey => {
              const count = groupedWagons[typeKey].length;
              if (count === 0) return null; // Если вагонов такого типа в поезде нет — вкладку не рендерим

              return (
                <button
                  key={typeKey}
                  className={`seats-tab-btn ${activeTab === typeKey ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(typeKey);
                    // ✅ ИСПРАВЛЕНО: Безопасный сброс на первый вагон нового типа через опциональную цепочку ?.
                    setActiveWagonId(groupedWagons[typeKey]?.[0]?._id || null); 
                  }}
                >
                  {tabNames[typeKey]}
                </button>
              );
            })}
          </div>

          {/* 2. РЯД КНОПОК С НОМЕРАМИ ВАГОНОВ */}
          <div className="wagons-numbers-row" style={{ marginTop: '20px' }}>
            <span className="wagons-label">Вагоны: </span>
            {groupedWagons[activeTab]?.map(wagon => (
              <button
                key={wagon._id}
                className={`wagon-number-btn ${activeWagonId === wagon._id ? 'active' : ''}`}
                onClick={() => setActiveWagonId(wagon._id)}
              >
                {wagon.coach?.name || wagon.name}
              </button>
            ))}
          </div>

          {/* 3. ЗОНА ИНТЕРАКТИВНОЙ КАРТЫ МЕСТ ТЕКУЩЕГО ВАГОНА */}
          {currentActiveWagon && (
            <div className="active-wagon-details" style={{ marginTop: '30px', border: '1px solid #c4c4c4', padding: '20px' }}>
              <h4>Выбран Вагон №{currentActiveWagon.coach?.name || currentActiveWagon.name} ({tabNames[activeTab]})</h4>
              <p>Свободных мест в этом вагоне: <strong>{currentActiveWagon.avaliable_seats || currentActiveWagon.coach?.avaliable_seats}</strong></p>
              
              <div className="debug-seats-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
                {/* Перебираем физические места текущего вагона с сервера */}
                {currentActiveWagon.seats?.map(seat => (
                  <div
                    key={seat.index}
                    style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',       // Проверьте camelCase
                        justifyContent: 'center',    // 🔴 ИСПРАВЛЕНО: было justifycontent
                        background: seat.available ? '#ffffff' : '#e5e5e5',
                        border: seat.available ? '2px solid #ffa800' : '1px solid #c4c4c4',
                        color: seat.available ? '#000' : '#939393',
                        cursor: seat.available ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold',
                        borderRadius: '4px'
                    }}
                    title={seat.available ? "Свободно" : "Занято"}
                  >
                    {seat.index}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div> /* ✅ ИСПРАВЛЕНО: Закрыт тег главного контейнера */
  );
}