import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale/ru'; 
import 'react-datepicker/dist/react-datepicker.css';
import './SearchWidget.css';

// 1. Импортируем сам контекст (укажите правильный относительный путь к вашему файлу appContext)
import AppContext from '../../context/AppContext';

// Импортируем готовый компонент SelectLocation
import SelectLocation from '../../Select/SelectLocation';

import calendarIcon from '../../../assets/calendar.png';
import reverseIcon from '../../../assets/reverse.png';
import locationIcon from '../../../assets/location.png'

registerLocale('ru', ru);

export default function SearchWidget({ variant = 'vertical' }) {
  const navigate = useNavigate();

  // 2. Подключаем глобальный контекст приложения
  const { appState, setAppState } = useContext(AppContext);

  // Храним данные направления в виде объектов. Инициализируем значениями из контекста (если они там есть)
  const [locationFrom, setLocationFrom] = useState({ 
    name: appState.from_city_name || '', 
    id: appState.from_city_id || '' 
  });
  const [locationTo, setLocationTo] = useState({ 
    name: appState.to_city_name || '', 
    id: appState.to_city_id || '' 
  });
  
  // Инициализируем даты из контекста (если даты сохранены строкой, создаем объект Date)
  const [dateOut, setDateOut] = useState(appState.date_start ? new Date(appState.date_start) : null);
  const [dateIn, setDateIn] = useState(appState.date_end ? new Date(appState.date_end) : null);

  
  

    
  // Обработчик для получения данных из SelectLocation (Откуда)
  const handleSelectFrom = (value) => {
    if (value.from_city_name) {
      setLocationFrom({
        name: value.from_city_name,
        id: value.from_city_id
      });
    }
  };

  // Обработчик для получения данных из SelectLocation (Куда)
  const handleSelectTo = (value) => {
    if (value.to_city_name) {
      setLocationTo({
        name: value.to_city_name,
        id: value.to_city_id
      });
    }
  };

  // Функция реверса направлений
  const handleReverse = () => {
    const temp = locationFrom;
    setLocationFrom(locationTo);
    setLocationTo(temp);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("From ID:", locationFrom.id, "To ID:", locationTo.id);
     if (!locationFrom.id || !locationTo.id) {
    alert('Пожалуйста, выберите города отправления и прибытия из выпадающего списка подсказок.');
    return;
  }
    // Форматируем даты в безопасный формат YYYY-MM-DD
    const formattedDateOut = dateOut ? dateOut.toISOString().split('T')[0] : '';
    const formattedDateIn = dateIn ? dateIn.toISOString().split('T')[0] : '';
setAppState((prevState) => ({
      ...prevState,
      from_city_name: locationFrom.name,
      from_city_id: locationFrom.id,
      to_city_name: locationTo.name,
      to_city_id: locationTo.id,
      date_start: formattedDateOut,
      date_end: formattedDateIn,
    }));
  

    // Передаем в URL и осуществляем переход
    navigate(
      `/order/trains?from_name=${encodeURIComponent(locationFrom.name)}&from_id=${locationFrom.id}&to_name=${encodeURIComponent(locationTo.name)}&to_id=${locationTo.id}&date_out=${formattedDateOut}&date_in=${formattedDateIn}`
    );
  };
  

  return (
    <form className={`search-widget search-widget--${variant}`} onSubmit={handleSearchSubmit}>
      {/* НАПРАВЛЕНИЕ */}
      <div className="search-widget__section">
        <span className="search-widget__label">Направление</span>
        <div className="search-widget__row">
          
          {/* ОТКУДА */}
          <div className="search-widget__input-wrapper">
            <SelectLocation
              name="search-widget__input search-widget__input-from"
              placeholder="Откуда"
              value={locationFrom.name} 
              onValue={handleSelectFrom}
            />
            <img src={locationIcon} alt="" className="search-widget__icon" />

          </div>
          
          <button type="button" className="search-widget__reverse-btn" onClick={handleReverse}>
            <img src={reverseIcon} alt="Реверс" />
          </button>

          {/* КУДА */}
          <div className="search-widget__input-wrapper">
            <SelectLocation
              name="search-widget__input search-widget__input-to"
              placeholder="Куда"
              value={locationTo.name} 
              onValue={handleSelectTo}
            />
            <img src={locationIcon} alt="" className="search-widget__icon" />

          </div>

        </div>
      </div>

      {/* ДАТЫ */}
      <div className="search-widget__section">
        <span className="search-widget__label">Дата</span>
        <div className="search-widget__row">
          <div className="search-widget__input-wrapper">
            <div className="datepicker-container">
              <DatePicker
                selected={dateOut}
                onChange={(date) => setDateOut(date)}
                placeholderText="ДД/ММ/ГГ"
                dateFormat="dd.MM.yyyy"
                locale="ru"
                className="search-widget__input"
                popperContainer={({ children }) => <div>{children}</div>} 
                required
              />
            </div>
            <img src={calendarIcon} alt="" className="search-widget__icon" />
          </div>

          <div className="search-widget__input-wrapper">
            <div className="datepicker-container">
              <DatePicker
                selected={dateIn}
                onChange={(date) => setDateIn(date)}
                placeholderText="ДД/ММ/ГГ"
                dateFormat="dd.MM.yyyy"
                locale="ru"
                className="search-widget__input"
                popperContainer={({ children }) => <div>{children}</div>}
              />
            </div>
            <img src={calendarIcon} alt="" className="search-widget__icon" />
          </div>
        </div>
      </div>

      <button type="submit" className="search-widget__submit-btn">
        Найти билеты
      </button>
    </form>
  );
}