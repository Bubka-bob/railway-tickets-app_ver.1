import React from 'react';
import './SeatsTrainHeader.css'; 

export default function SeatsTrainHeader({ routeStateData, isReturn = false }) {
  if (!routeStateData) return null;

  // Динамический префикс ключей в контексте в зависимости от направления (Туда/Обратно)
  const prefix = isReturn ? 'arrival_' : 'departure_';

  const trainName = routeStateData[`${prefix}train_name`] || '116С';
  const fromCity = routeStateData[`${prefix}from_city_name`] || 'Москва';
  const toCity = routeStateData[`${prefix}to_city_name`] || 'Санкт-Петербург';
  
  const fromTime = routeStateData[`${prefix}from_datetime`] || '00:00';
  const toTime = routeStateData[`${prefix}to_datetime`] || '00:00';
  
  const fromStation = routeStateData[`${prefix}from_railway_station_name`] || 'Курский';
  const toStation = routeStateData[`${prefix}to_railway_station_name`] || 'Ладожский';
  
  const durationStr = routeStateData[`${prefix}duration`] || '0 ч. 0 мин.';

  // Форматирование длительности в две строки по макету
  const formatDurationToLines = (str) => {
    const cleanStr = str.replace('ч.', 'часов').replace('мин.', 'минуты');
    const parts = cleanStr.split(' ');
    if (parts.length >= 4) {
      return (
        <>
          {parts[0]} {parts[1]}<br />
          {parts[2]} {parts[3]}
        </>
      );
    }
    return cleanStr;
  };

  return (
    <div className="seats-train-header">
      {/* ЛЕВАЯ ПАНЕЛЬ: ПОЕЗД И МАРШРУТ */}
      <div className="seats-train-header__left">
        <div className="seats-train-header__icon-bg">
          <div className="seats-train-header__icon-train">🚂</div>
        </div>
        <div className="seats-train-header__left-info">
          <h3 className="seats-train-header__number">{trainName}</h3>
          <div className="seats-train-header__route">
            <span className="route-city-line route-city-line--main">Адлер ➔</span>
            <span className="route-city-line capitalize-text">{fromCity} ➔</span>
            <span className="route-city-line capitalize-text">{toCity}</span>
          </div>
        </div>
      </div>

      {/* ЦЕНТРАЛЬНАЯ ПАНЕЛЬ: РАСПИСАНИЕ И СТРЕЛКА */}
      <div className="seats-train-header__center">
        <div className="seats-train-header__time-block">
          <span className="seats-train-header__time">{fromTime}</span>
          <span className="seats-train-header__city capitalize-text">{fromCity}</span>
          <span className="seats-train-header__station">{fromStation} вокзал</span>
        </div>

        {/* ТОЛСТАЯ МАКЕТНАЯ СТРЕЛКА */}
        <div className="seats-train-header__timeline-arrow-zone">
          <div className={`seats-train-header__thick-arrow ${isReturn ? 'is-return' : ''}`}></div>
        </div>

        <div className="seats-train-header__time-block text-right">
          <span className="seats-train-header__time">{toTime}</span>
          <span className="seats-train-header__city capitalize-text">{toCity}</span>
          <span className="seats-train-header__station">{toStation} вокзал</span>
        </div>

        {/* ПРАВАЯ ЗОНА: ИКОНКА ЧАСОВ И ДЛИТЕЛЬНОСТЬ */}
        <div className="seats-train-header__duration-zone">
          <div className="seats-train-header__clock-icon">🕒</div>
          <div className="seats-train-header__duration-text">
            {formatDurationToLines(durationStr)}
          </div>
        </div>
      </div>
    </div>
  );
}