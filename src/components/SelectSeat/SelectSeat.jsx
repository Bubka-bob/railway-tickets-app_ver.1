import React, { useContext, useState } from 'react';
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

  // Мониторим ответ сервера свободных мест в консоли
  if (wagonsArray) {
    console.log("=== МАССИВ ВАГОНОВ С СЕРВЕРА ВЫБОРА МЕСТ ===", wagonsArray);
  }

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
          <div className="alert-success-box" style={{ background: '#e2f0d9', padding: '15px', borderRadius: '4px' }}>
            Связь с API установлена успешно! Найдено вагонов для выбора: <strong>{wagonsArray.length}</strong>.
          </div>
          {/* Сюда мы на следующем шаге внедрим вкладки типов вагонов и карту мест */}
        </div>
      )}
    </div>
  );
}