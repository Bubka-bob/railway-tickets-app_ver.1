import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrainCard.css';
import trainIcon from '../../assets/trainIcon.png';
import AppContext from '../context/AppContext';
import RouteContext from "../context/RouteContext";
import OrderContext from "../context/OrderContext";
import getTime from '../../services/getTime';

export default function TrainCard({ trainData }) {
  const { departure, arrival } = trainData;
  const navigate = useNavigate();

  const { appState, setAppState } = useContext(AppContext);
  const { routeState, setRouteState } = useContext(RouteContext);
  const { orderState, setOrderState } = useContext(OrderContext);

  // Локальный перевод секунд в формат "Х ч. Х мин." для стрелочек
  const getDurationString = (seconds) => {
    if (!seconds) return '0 ч. 0 мин.';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} ч. ${minutes} мин.`;
  };

  // Метод сохранения данных выбранного поезда
  const updateContexts = () => {
    const newAppState = { ...appState };
    const newRouteState = { ...routeState };
    const newOrderState = { ...orderState }; 

    const directions = { departure, arrival };
    
    for (let key in directions) {
      let currentItem = directions[key];
      
      if (!currentItem) continue;
      
      newAppState[key + "_id"] = currentItem._id;
      
      newRouteState[key + "_train_name"] = currentItem.train.name;
      newRouteState[key + "_from_city_name"] = currentItem.from.city.name;
      newRouteState[key + "_to_city_name"] = currentItem.to.city.name;
      newRouteState[key + "_from_datetime"] = getTime(currentItem.from.datetime);
      newRouteState[key + "_from_railway_station_name"] = currentItem.from.railway_station_name;
      newRouteState[key + "_to_datetime"] = getTime(currentItem.to.datetime);
      newRouteState[key + "_to_railway_station_name"] = currentItem.to.railway_station_name;
      
      newRouteState[key + "_duration"] = getDurationString(currentItem.duration);
      
      if (newOrderState && newOrderState[key]) {
        newOrderState[key].route_direction_id = currentItem._id;
      }
    }

    setAppState(newAppState);
    setRouteState(newRouteState);
    
    if (setOrderState && newOrderState && Object.keys(newOrderState).length > 0) {
      setOrderState(newOrderState); 
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    updateContexts();
    navigate(`/order/seats?id=${departure._id}`);
  };

  const openSeats = (e) => {
    e.preventDefault();
    if (e.target.nextElementSibling?.className?.includes("train__price-seat-up-down")) {
      e.target.nextElementSibling.classList.toggle("train__price-seat-up-down-open");
    }
  };

  const renderSeatsInfo = () => {
    const seats = departure.price_info;
    if (!seats) return <div className="train-card__no-seats">Мест нет</div>;

    const classesMap = {
      first: 'Люкс',
      second: 'Купе',
      third: 'Плацкарт',
      fourth: 'Сидячий'
    };

    return Object.keys(seats).map((className) => {
      if (!classesMap[className]) return null;
      return (
        <div key={className} className="train-card__seat-row" onClick={openSeats}>
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
      {/* 1. ЛЕВАЯ ЧАСТЬ */}
      <div className="train-card__left">
        <div className="train-card__train-icon-wrapper">
          <img src={trainIcon} alt="Поезд" className="train-card__train-icon-img" />
        </div>
        <h3 className="train-card__number">{departure.train.name}</h3>
        <div className="train-card__train-route-details">
          <span className="train-card__route-city-text capitalize-text">
            {departure.from.city.name} ➔
          </span>
          <span className="train-card__route-city-text capitalize-text">
            {departure.to.city.name}
          </span>
          {departure.train.is_express && (
            <span className="train-card__train-brand-name">«Волга»</span>
          )}
        </div>
      </div>

      {/* 2. БЛОК ТАЙМЛАЙНА */}
      <div className="train-card__center">
        <div className="train-card__timeline-row">
          <div className="train-card__time-block">
            <span className="train-card__time">{getTime(departure.from.datetime)}</span>
            <span className="train-card__city-name">{departure.from.city.name}</span>
            <span className="train-card__station-name">{departure.from.railway_station_name} вокзал</span>
          </div>

          <div className="train-card__arrow-container">
            <span className="train-card__duration-badge">{getDurationString(departure.duration)}</span>
            <span className="train-card__arrow-icon">➔</span>
          </div>

          <div className="train-card__time-block train-card__time-block--right">
            <span className="train-card__time">{getTime(departure.to.datetime)}</span>
            <span className="train-card__city-name">{departure.to.city.name}</span>
            <span className="train-card__station-name">{departure.to.railway_station_name} вокзал</span>
          </div>
        </div>

        {arrival && (
          <div className="train-card__timeline-row train-card__timeline-row--return">
            <div className="train-card__time-block">
              <span className="train-card__time">{getTime(arrival?.from?.datetime)}</span>
              <span className="train-card__city-name">{arrival?.from?.city?.name}</span>
              <span className="train-card__station-name">{arrival?.from?.railway_station_name} вокзал</span>
            </div>

            <div className="train-card__arrow-container">
              <span className="train-card__duration-badge">{getDurationString(arrival?.duration)}</span>
              <span className="train-card__arrow-icon train-card__arrow-icon--left">➔</span>
            </div>

            <div className="train-card__time-block train-card__time-block--right">
              <span className="train-card__time">{getTime(arrival?.to?.datetime)}</span>
              <span className="train-card__city-name">{arrival?.to?.city?.name}</span>
              <span className="train-card__station-name">{arrival?.to?.railway_station_name} вокзал</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. БЛОК СТОИМОСТИ */}
      <div className="train-card__right">
        <div className="train-card__seats-list">
          {renderSeatsInfo()}
        </div>
        <div className="train-card__actions">
          <button className="train-card__btn" onClick={handleClick}>
            Выбрать места
          </button>
        </div>
      </div>
    </div>
  );
}