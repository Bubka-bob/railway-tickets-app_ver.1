import React, { useContext } from 'react';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import AppContext from '../../context/AppContext';
import AccordionItem from "../AccordionItem/AccordionItem"

// Импорт иконок из вашего проекта
import luxuryIcon from '../../../assets/luxury.png';
import coupeIcon from '../../../assets/coupe.png';
import platscartIcon from '../../../assets/platscart.png';
import sedentaryIcon from '../../../assets/sedentary.png';
import wifiIcon from '../../../assets/wifi.png';
import expressIcon from '../../../assets/express.png';

import arrowToIcon from '../../../assets/arrow-to.png';
import arrowFromIcon from '../../../assets/arrow-from.png';

import './SidebarFilters.css';

function CustomValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <span>
      {/* Рендерим саму ручку ползунка */}
      {children}
      
      {/* Если взаимодействие активно (open=true), показываем стоимость */}
      {open && (
        <span className="slider-thumb-value">
          {(value)}
        </span>
      )}
    </span>
  );
}

export default function FilterSidebar({ absoluteMinPrice, absoluteMaxPrice }) {
  const { appState, setAppState } = useContext(AppContext);

  const sliderMin = (absoluteMinPrice === Infinity || !absoluteMinPrice) ? 0 : absoluteMinPrice;
  const sliderMax = (absoluteMaxPrice === 0 || !absoluteMaxPrice) ? 10000 : absoluteMaxPrice;

  const toggleCheckbox = (field) => {
    setAppState((prev) => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const handlePriceChange = (event, values) => {
    setAppState((prev) => ({
      ...prev,
      price_from: values[0], // Минимальный бегунок
      price_to: values[1]    // Максимальный бегунок
    }));
  };

const handlePriceChangeCommitted = (event, values) => {
    setAppState((prev) => ({
      ...prev,
      price_from: values[0],
      price_to: values[1]
    }));
  };

  const handleTimeChange = (direction, type, values) => {
    const minKey = direction === 'start' ? `${type}_time_min` : `return_${type}_time_min`;
    const maxKey = direction === 'start' ? `${type}_time_max` : `return_${type}_time_max`;
  setAppState((prev) => ({
      ...prev,
      [minKey]: values[0],
      [maxKey]: values[1]
    }));
  };

  // Вспомогательная функция для форматирования ползунков времени (1100 -> "11:00")
  const formatTime = (value) => {
    const hours = Math.floor(value / 100);
    return `${String(hours).padStart(2, '0')}:00`;
  };

  return (
    <div className="filter-sidebar">
      
      {/* СЛОЙ 1: ДАТЫ ПОЕЗДКИ */}
      <div className="filter-sidebar__section filter-sidebar__section--dates">
        <div className="filter-date-group">
          <label className="filter-date-label">Дата поездки</label>
          <div className="filter-date-input-box">
            <input 
              type="text" 
              placeholder="ДД.ММ.ГГГГ" 
              value={appState?.date_start || ''} 
              onChange={(e) => setAppState(prev => ({ ...prev, date_start: e.target.value }))}
            />
          </div>
        </div>

        <div className="filter-date-group" style={{ marginTop: '20px' }}>
          <label className="filter-date-label">Дата возвращения</label>
          <div className="filter-date-input-box">
            <input 
              type="text" 
              placeholder="ДД.ММ.ГГГГ" 
              value={appState?.date_end || ''} 
              onChange={(e) => setAppState(prev => ({ ...prev, date_end: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* СЛОЙ 2: ТУМБЛЕРЫ ОПЦИЙ */}
      <div className="filter-sidebar__section filter-sidebar__section--switches">
        <div className="filter-switch-row">
          <span className="switch-caption"><img src={coupeIcon} alt="" className="sw-img" /> Купе</span>
          <Switch checked={!!appState?.have_second_class} onChange={() => toggleCheckbox('have_second_class')} color="warning" />
        </div>

        <div className="filter-switch-row">
          <span className="switch-caption"><img src={platscartIcon} alt="" className="sw-img" /> Плацкарт</span>
          <Switch checked={!!appState?.have_third_class} onChange={() => toggleCheckbox('have_third_class')} color="warning" />
        </div>

        <div className="filter-switch-row">
          <span className="switch-caption"><img src={sedentaryIcon} alt="" className="sw-img" /> Сидячий</span>
          <Switch checked={!!appState?.have_fourth_class} onChange={() => toggleCheckbox('have_fourth_class')} color="warning" />
        </div>

        <div className="filter-switch-row">
          <span className="switch-caption"><img src={luxuryIcon} alt="" className="sw-img" /> Люкс</span>
          <Switch checked={!!appState?.have_first_class} onChange={() => toggleCheckbox('have_first_class')} color="warning" />
        </div>

        <div className="filter-switch-row filter-switch-row--divider">
          <span className="switch-caption"><img src={wifiIcon} alt="" className="sw-img" /> Wi-Fi</span>
          <Switch checked={!!appState?.have_wifi} onChange={() => toggleCheckbox('have_wifi')} color="warning" />
        </div>

        <div className="filter-switch-row">
          <span className="switch-caption"><img src={expressIcon} alt="" className="sw-img" /> Экспресс</span>
          <Switch checked={!!appState?.have_express} onChange={() => toggleCheckbox('have_express')} color="warning" />
        </div>
      </div>

      {/* СЛОЙ 3: ДИНАМИЧЕСКИЙ СЛАЙДЕР СТОИМОСТИ С СЕРВЕРА */}
      <div className="filter-sidebar__section filter-sidebar__section--price">
        <h4 className="range-title-sidebar">Стоимость</h4>
        {/* Надписи "от" и "до" над ползунком по макету */}
          <div className="range-text-hints">
            <span>от</span>
            <span>до</span>
          </div>        
        <div className="mui-slider-wrapper">
          <Slider
            /* 🔴 ИСПРАВЛЕНО: Бегунки теперь ссылаются на динамические границы sliderMin и sliderMax */
            
            // value={[appState?.price_from || sliderMin,
            //    appState?.price_to || sliderMax]}
            value={[
              appState?.price_from ?? absoluteMinPrice, 
              appState?.price_to ?? absoluteMaxPrice
            ]}
            onChange={handlePriceChange}
            onChangeCommitted={handlePriceChangeCommitted} 
            min={sliderMin}
            max={sliderMax}
            step={50}
            className="custom-mui-slider"
            // valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}`}

            
          />
          <div className="range-numeric-outputs">
          <span>{appState?.price_from ?? absoluteMinPrice} ₽</span>
          <span>{appState?.price_to ?? absoluteMaxPrice} ₽</span>
        </div>
          
        </div>
       </div>

      {/* СЛОЙ 4: НАПРАВЛЕНИЕ ТУДА */}
      <div className="filter-sidebar__section-accordion">
        <AccordionItem
          title={
            <div className="accordion-title-with-icon">
              <img src={arrowToIcon} alt="" className="dir-arrow-img" />
              <span>Туда</span>
            </div>
          }
        >
          <div className="time-slider-subblock">
            <h5>Время отбытия</h5>
            <Slider
              value={[appState?.start_time_min || 0, appState?.start_time_max || 2400]}
              onChange={(e, v) => handleTimeChange('start', 'start', v)}
              min={0}
              max={2400}
              step={100}
              className="custom-mui-slider"
            />
            <div className="time-slider-labels">
              <span>0:00</span>
              <span className="active-time-val">{formatTime(appState?.start_time_min || 0)}</span>
              <span>24:00</span>
            </div>
          </div>

          <div className="time-slider-subblock" style={{ marginTop: '20px' }}>
            <h5>Время прибытия</h5>
            <Slider
              value={[appState?.end_time_min || 0, appState?.end_time_max || 2400]}
              onChange={(e, v) => handleTimeChange('start', 'end', v)}
              min={0}
              max={2400}
              step={100}
              className="custom-mui-slider"
            />
            <div className="time-slider-labels">
              <span>0:00</span>
              <span className="active-time-val">{formatTime(appState?.end_time_min || 0)}</span>
              <span>24:00</span>
            </div>
          </div>
        </AccordionItem>
      </div>

      {/* СЛОЙ 5: НАПРАВЛЕНИЕ ОБРАТНО */}
      <div className="filter-sidebar__section-accordion no-border">
        <AccordionItem  title={
            <div className="accordion-title-with-icon">
              <img src={arrowFromIcon} alt="" className="dir-arrow-img" />
              <span>Обратно</span>
            </div>
          }
        >
          <div className="time-slider-subblock">
            <h5>Время отбытия</h5>
            <Slider
              value={[appState?.return_start_time_min || 0, appState?.return_start_time_max || 2400]}
              onChange={(e, v) => handleTimeChange('return', 'start', v)}
              min={0}
              max={2400}
              step={100}
              className="custom-mui-slider"
            />
            <div className="time-slider-labels">
              <span>0:00</span>
              <span className="active-time-val">{formatTime(appState?.return_start_time_min || 0)}</span>
              <span>24:00</span>
            </div>
          </div>

          <div className="time-slider-subblock" style={{ marginTop: '20px' }}>
            <h5>Время прибытия</h5>
            <Slider
              value={[appState?.return_end_time_min || 0, appState?.return_end_time_max || 2400]}
              onChange={(e, v) => handleTimeChange('return', 'end', v)}
              min={0}
              max={2400}
              step={100}
              className="custom-mui-slider"
            />
            <div className="time-slider-labels">
              <span>0:00</span>
              <span className="active-time-val">{formatTime(appState?.return_end_time_min || 0)}</span>
              <span>24:00</span>
            </div>
          </div>
        </AccordionItem>
      </div>

    </div>
  );
}