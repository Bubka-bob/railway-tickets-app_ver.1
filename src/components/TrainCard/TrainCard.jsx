import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrainCard.css';
import trainIcon from '../../assets/trainIcon.png';
import AppContext from '../context/AppContext';
import RouteContext from "../context/RouteContext";
import OrderContext from "../context/OrderContext";
import getTime from '../../services/getTime';
import SVGicon from "../SVGicon/SVGicon"

export default function TrainCard({ trainData, isVerificationMode = false }) {
  const { departure, arrival } = trainData || {};
  const navigate = useNavigate();
  const { appState, setAppState } = useContext(AppContext);
  const { routeState, setRouteState } = useContext(RouteContext);
  const { orderState, setOrderState } = useContext(OrderContext);
   const departureData = trainData?.departure || trainData; 

  const trainNumber = departure?.train?.name || departure?.departure_train_name || departure?.train_name || "116С";
  const isExpress = departure?.train?.is_express || false;

  // 2. Станция ОТПРАВЛЕНИЯ (from) — пробиваемся сквозь city.name или плоский city_name
  const fromCityName = departure?.from?.city?.name || departure?.from?.city_name || departure?.departure_from_city_name || "Москва";
  const fromStationName = departure?.from?.railway_station_name || departure?.departure_from_railway_station_name || "Курский";
  const fromDatetime = departure?.from?.datetime || departure?.departure_from_datetime || "";

  // 3. Станция ПРИБЫТИЯ (to)
  const toCityName = departure?.to?.city?.name || departure?.to?.city_name || departure?.departure_to_city_name || "Санкт-Петербург";
  const toStationName = departure?.to?.railway_station_name || departure?.departure_to_railway_station_name || "Ладожский";
  const toDatetime = departure?.to?.datetime || departure?.departure_to_datetime || "";

  // 4. Длительность пути
  const rawDuration = departure?.duration || departure?.departure_duration || "";
  
  if (!departure) return null;
  // Локальный перевод секунд в формат "Х ч. Х мин." для стрелочек
  const getDurationString = (seconds) => {
    if (!seconds) return '0 ч. 0 мин.';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes}`;
  };

  // Метод сохранения данных выбранного поезда
  const updateContexts = () => {
    const newAppState = { ...appState };
    const newRouteState = { ...routeState };
    const newOrderState = { ...orderState }; 

    const directions = { departure, arrival };
    
    const formatDateToIso = (timestamp) => {
      if (!timestamp) return null;
      const date = new Date(timestamp * 1000);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    
        
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
      
      if (key === 'departure') {
              newRouteState["departure_date_start"] = formatDateToIso(currentItem.from.datetime); // Дата отбытия туда
              newRouteState["departure_date_start_arrival"] = formatDateToIso(currentItem.to.datetime); // Дата прибытия туда
            } else if (key === 'arrival') {
              newRouteState["arrival_date_end"] = formatDateToIso(currentItem.from.datetime); // Дата отбытия обратно
              newRouteState["arrival_date_end_arrival"] = formatDateToIso(currentItem.to.datetime); // Дата прибытия обратно
            }

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
    const seats = departure?.price_info;
    // Объект, где бэкенд хранит общее количество свободных мест по классам
    const availableSeats = departure?.available_seats_info;
   

    if (!seats || Object.keys(seats).length === 0) return <div className="train-card__no-seats">Мест нет</div>;

    const classesMap = {
      first: 'Люкс',
      second: 'Купе',
      third: 'Плацкарт',
      fourth: 'Сидячий'
    };

    return Object.keys(seats).map((className) => {
      if (!classesMap[className]) return null;
      
      const currentClassInfo = seats[className];
      const totalSeatsCount = availableSeats?.[className] || 0;
      // Если у класса нет цен на бэкенде — полностью скрываем строку
      if (!currentClassInfo) return null;

     
const minPrice = className === 'first' 
      ? currentClassInfo.price
      : Math.min(
          currentClassInfo.top_price || Infinity,
          currentClassInfo.bottom_price || Infinity,
          currentClassInfo.side_price || Infinity
        );

      if (!minPrice) return null;
      
      return (
        <div key={className} className="train-card__seat-row-container">
          {/* Основная видимая строка класса поезда */}
          <div className="train-card__seat-row">
            <span className="train-card__seat-class">{classesMap[className]}</span>
            {/* 🔴 ИСПРАВЛЕНО: Выводим реальную переменную количества мест с бэкенда */}
            <span className="train-card__seat-count">{totalSeatsCount}</span> 
            <span className="train-card__seat-price">
              от <span className="train-card__price-val">{minPrice}</span> ₽
            </span>
          </div>

         {(className === 'second' || className === 'third' || className === 'fourth') && (
          <div className="train__price-seat-up-down">
            {currentClassInfo.top_price && (
              <div className="train__price-seat-subrow">
                <span>Верхние</span>
                <span>{Math.floor(totalSeatsCount*0.5)}</span>
                <span>{currentClassInfo.top_price} ₽</span>
              </div>
            )}

            {currentClassInfo.bottom_price && (
              <div className="train__price-seat-subrow">
                <span>Нижние</span>
                <span>{Math.floor(totalSeatsCount*0.5)}</span>
                <span>{currentClassInfo.bottom_price} ₽</span>
              </div>
            )}

            {currentClassInfo.side_price && className === "third" &&(
              <div className="train__price-seat-subrow">
                <span>Боковые</span>
                <span>{totalSeatsCount % 2}</span>
                <span>{currentClassInfo.side_price} ₽</span>
              </div>
            )}
          </div>
        )}
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
        <h3 className="train-card__number">{trainNumber}</h3>
        <div className="train-card__train-route-details">
          <span className="train-card__route-city-text capitalize-text">
            {fromCityName} ➔
          </span>
          <span className="train-card__route-city-text capitalize-text">
            {toCityName}
          </span>
          {isExpress && (
            <span className="train-card__train-brand-name">«Волга»</span>
          )}
        </div>
      </div>

      {/* 2. БЛОК ТАЙМЛАЙНА */}
      <div className="train-card__center">
        <div className="train-card__timeline-row">
          <div className="train-card__time-block">
            <span className="train-card__time">{getTime(fromDatetime)}</span>
            <span className="train-card__city-name">{fromCityName}</span>
            <span className="train-card__station-name">{fromStationName} вокзал</span>
          </div>

          <div className="train-card__arrow-container">
            <span className="train-card__duration-badge">{getDurationString(rawDuration)}</span>
            <span className="train-card__arrow-icon">➔</span>
          </div>

          <div className="train-card__time-block train-card__time-block--right">
            <span className="train-card__time">{getTime(toDatetime)}</span>
            <span className="train-card__city-name">{toCityName}</span>
            <span className="train-card__station-name">{toStationName} вокзал</span>
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
          {renderSeatsInfo(departureData || departure)}
        </div>
        <div className="train-card__actions">
          <div className="train-card__comfort-icons">
      {['have_wifi', 'have_air_conditioning', 'is_express'].filter(key => departure[key]).map((key, index) => (
        <div className="train-card__comfort-icon-item" key={index}>
          <SVGicon name={key} />
        </div>
      ))}
    </div>
    {isVerificationMode ? (
          
          <div className="verification-card-btn-holder" style={{ marginTop: 'auto', width: '100%' }}>
            <button 
              type="button" 
              className="verification-inline-edit-btn" 
              style={{ width: '100%', boxSizing: 'border-box' }}
              onClick={() => navigate('/order/seats')} 
            >
              Изменить
            </button>
          </div>
        ) : (
          <button 
          className="train-card__btn" onClick={handleClick}>
            Выбрать места
          </button>
            )}
        </div>
        </div>
    </div>
  );
}