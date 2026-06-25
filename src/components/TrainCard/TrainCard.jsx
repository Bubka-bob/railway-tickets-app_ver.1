import React from 'react';
import './TrainCard.css';

export default function TrainCard({ trainData }) {
  const { departure, arrival } = trainData;

  const formatTime = (timestamp) => {
    if (!timestamp) return '00:00';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} ч. ${minutes} мин.`;
  };

  const renderSeatsInfo = () => {
    const seats = departure.price_info;
    if (!seats) return <div className="train-card__no-seats">Мест нет</div>;

    const classesMap = {
      first: 'СВ',
      second: 'Купе',
      third: 'Плацкарт',
      fourth: 'Сидячий'
    };

    return Object.keys(seats).map((className) => {
      if (!classesMap[className]) return null;
      return (
        <div key={className} className="train-card__seat-row">
          <span className="train-card__seat-class">{classesMap[className]}</span>
          <span className="train-card__seat-count">{Math.floor(Math.random() * 15) + 1}</span> 
          <span className="train-card__seat-price">
            от <span className="train-card__price-val">{seats[className].top_price || seats[className].bottom_price}</span> ₽
          </span>
        </div>
      );
    });
  };

  return (
    <div className="train-card">
      {/* 1. БЛОК ПОЕЗДА */}
      <div className="train-card__left">
        <div className="train-card__icon-badge"></div>
        <h3 className="train-card__number">{departure.train.name}</h3>
        <p className="train-card__route">
          {departure.from.city.name} ➡️ <br /> {departure.to.city.name}
        </p>
      </div>

      {/* 2. БЛОК ТАЙМЛАЙНА (ВРЕМЯ) */}
      <div className="train-card__center">
        
        {/* ИСПРАВЛЕНО: Добавлена обертка строки для маршрута ТУДА */}
        <div className="train-card__timeline-row">
          <div className="train-card__time-block">
            <span className="train-card__time">{formatTime(departure.from.datetime)}</span>
            <span className="train-card__station">{departure.from.railway_station_name}</span>
          </div>

          <div className="train-card__duration-arrow">
            <span className="train-card__duration">{formatDuration(departure.duration)}</span>
            <div className="train-card__line train-card__line--to"></div>
          </div>

          <div className="train-card__time-block train-card__time-block--right">
            <span className="train-card__time">{formatTime(departure.to.datetime)}</span>
            <span className="train-card__station">{departure.to.railway_station_name}</span>
          </div>
        </div>

        {/* МАРШРУТ ОБРАТНО */}
        {arrival && (
          <div className="train-card__timeline-row train-card__timeline-row--return">
            <div className="train-card__time-block">
              <span className="train-card__time">{formatTime(arrival?.from?.datetime)}</span>
              <span className="train-card__station">{arrival?.from?.railway_station_name}</span>
            </div>

            <div className="train-card__duration-arrow">
              <span className="train-card__duration">{formatDuration(arrival?.duration)}</span>
              <div className="train-card__line train-card__line--from"></div>
            </div>

            <div className="train-card__time-block train-card__time-block--right">
              <span className="train-card__time">{formatTime(arrival?.to?.datetime)}</span>
              <span className="train-card__station">{arrival?.to?.railway_station_name}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. БЛОК СТОИМОСТИ И МЕСТ */}
      <div className="train-card__right">
        <div className="train-card__seats-list">
          {renderSeatsInfo()}
        </div>
        <div className="train-card__actions">
          <button className="train-card__btn">Выбрать места</button>
        </div>
      </div>
    </div>
  );
}
