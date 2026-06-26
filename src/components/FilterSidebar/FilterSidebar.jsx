import React, { useContext } from 'react';
import AppContext from '../context/AppContext';
import './FilterSidebar.css';
import luxuryIcon from '../../assets/luxury.png';
import coupeIcon from '../../assets/coupe.png';
import platscartIcon from '../../assets/platscart.png';
import sedentaryIcon from '../../assets/sedentary.png';
import wifiIcon from '../../assets/wifi.png';
import expressIcon from '../../assets/express.png';

// Импорт иконок для блоков направления
import arrowToIcon from '../../assets/arrow-to.png';
import arrowFromIcon from '../../assets/arrow-from.png';
import plusIcon from '../../assets/plus.png';
import minusIcon from '../../assets/minus.png';

export default function FilterSidebar({ minPrice, maxPrice }) {
  // const { appState, setAppState } = useContext(AppContext);
const context = useContext(AppContext);
  const appState = context?.appState || {};
  const setAppState = context?.setAppState;

  const [isTudaOpen, setIsTudaOpen] = useState(true);
  const [isObratnoOpen, setIsObratnoOpen] = useState(true);

  const handleToggle = (field) => {
    setAppState((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  // Вычисляем среднее значение для красивого отображения центральной метки ползунка
  const avgPrice = Math.floor((minPrice + maxPrice) / 2);

   return (
    <aside className="filter-sidebar">
      
      {/* 1. БЛОК КАЛЕНДАРЕЙ */}
      <div className="filter-group padding-top-none">
        <label className="filter-label">Дата поездки</label>
        <div className="filter-date-field">
          <input type="text" value={appState.date_start || '30.08.2018'} readOnly />
          {calendarIcon && <img src={calendarIcon} alt="" className="filter-date-field__icon" />}
        </div>

        <label className="filter-label margin-top-md">Дата возвращения</label>
        <div className="filter-date-field">
          <input type="text" value={appState.date_end || '09.09.2018'} readOnly />
          {calendarIcon && <img src={calendarIcon} alt="" className="filter-date-field__icon" />}
        </div>
      </div>

      {/* 2. БЛОК ТУМБЛЕРОВ С ВАШИМИ ИКОНКАМИ */}
      <div className="filter-group filter-group--switches">
        
        <div className="switch-row">
          <img src={coupeIcon} alt="Купе" className="switch-row__icon" />
          <span className="switch-row__text">Купе</span>
          <button 
            type="button" 
            className={`switch-toggle ${appState.have_second_class ? 'active' : ''}`}
            onClick={() => handleToggle('have_second_class')}
          ><span className="switch-circle"></span></button>
        </div>

        <div className="switch-row">
          <img src={platscartIcon} alt="Плацкарт" className="switch-row__icon" />
          <span className="switch-row__text">Плацкарт</span>
          <button 
            type="button" 
            className={`switch-toggle ${appState.have_third_class ? 'active' : ''}`}
            onClick={() => handleToggle('have_third_class')}
          ><span className="switch-circle"></span></button>
        </div>

        <div className="switch-row">
          <img src={sedentaryIcon} alt="Сидячий" className="switch-row__icon" />
          <span className="switch-row__text">Сидячий</span>
          <button 
            type="button" 
            className={`switch-toggle ${appState.have_fourth_class ? 'active' : ''}`}
            onClick={() => handleToggle('have_fourth_class')}
          ><span className="switch-circle"></span></button>
        </div>

        <div className="switch-row">
          <img src={luxuryIcon} alt="Люкс" className="switch-row__icon" />
          <span className="switch-row__text">Люкс</span>
          <button 
            type="button" 
            className={`switch-toggle ${appState.have_first_class ? 'active' : ''}`}
            onClick={() => handleToggle('have_first_class')}
          ><span className="switch-circle"></span></button>
        </div>

        <div className="switch-row">
          <img src={wifiIcon} alt="Wi-Fi" className="switch-row__icon" />
          <span className="switch-row__text">Wi-Fi</span>
          <button 
            type="button" 
            className={`switch-toggle ${appState.have_wifi ? 'active' : ''}`}
            onClick={() => handleToggle('have_wifi')}
          ><span className="switch-circle"></span></button>
        </div>

        <div className="switch-row">
          <img src={expressIcon} alt="Экспресс" className="switch-row__icon" />
          <span className="switch-row__text">Экспресс</span>
          <button 
            type="button" 
            className={`switch-toggle ${appState.have_express ? 'active' : ''}`}
            onClick={() => handleToggle('have_express')}
          ><span className="switch-circle"></span></button>
        </div>

      </div>

      {/* 3. БЛОК СТОИМОСТИ */}
      <div className="filter-group">
        <h4 className="filter-title">Стоимость</h4>
        <div className="range-min-max-labels">
          <span>от</span>
          <span>до</span>
        </div>
        
        <div className="range-track-bar">
          <div className="range-track-bar__fill" style={{left: '15%', width: '55%'}}></div>
          <div className="range-track-bar__thumb" style={{left: '15%'}}></div>
          <div className="range-track-bar__thumb" style={{left: '70%'}}></div>
        </div>
        
        <div className="range-numeric-values">
          <span>{minPrice}</span>
          <span>{avgPrice}</span>
          <span>{maxPrice}</span>
        </div>
      </div>

      {/* 4. БЛОК ВРЕМЕНИ: ТУДА */}
      <div className="filter-group">
        <div className="collapse-header" onClick={() => setIsTudaOpen(!isTudaOpen)}>
          <h4 className="filter-title filter-title--orange">
            <img src={arrowToIcon} alt="" className="route-marker-img" /> Туда
          </h4>
          <span className="collapse-header__btn">
            <img src={isTudaOpen ? minusIcon : plusIcon} alt={isTudaOpen ? "Свернуть" : "Развернуть"} className="toggle-icon-img" />
          </span>
        </div>
        
        {isTudaOpen && (
          <div className="collapse-content-animated">
            <div className="range-sub-block">
              <span className="range-sub-title">Время отбытия</span>
              <div className="range-track-bar">
                <div className="range-track-bar__fill" style={{left: '0%', width: '50%'}}></div>
                <div className="range-track-bar__thumb" style={{left: '0%'}}></div>
                <div className="range-track-bar__thumb" style={{left: '50%'}}></div>
              </div>
              <div className="range-numeric-values">
                <span>0:00</span>
                <span>11:00</span>
                <span>24:00</span>
              </div>
            </div>

            <div className="range-sub-block">
              <span className="range-sub-title">Время прибытия</span>
              <div className="range-track-bar">
                <div className="range-track-bar__fill" style={{left: '25%', width: '35%'}}></div>
                <div className="range-track-bar__thumb" style={{left: '25%'}}></div>
                <div className="range-track-bar__thumb" style={{left: '60%'}}></div>
              </div>
              <div className="range-numeric-values">
                <span>5:00</span>
                <span>11:00</span>
                <span>24:00</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. БЛОК ВРЕМЕНИ: ОБРАТНО */}
      <div className="filter-group border-bottom-none">
        <div className="collapse-header" onClick={() => setIsObratnoOpen(!isObratnoOpen)}>
          <h4 className="filter-title filter-title--orange">
            <img src={arrowFromIcon} alt="" className="route-marker-img" /> Обратно
          </h4>
          <span className="collapse-header__btn">
            <img src={isObratnoOpen ? minusIcon : plusIcon} alt={isObratnoOpen ? "Свернуть" : "Развернуть"} className="toggle-icon-img" />
          </span>
        </div>
        
        {isObratnoOpen && (
          <div className="collapse-content-animated">
            <div className="range-sub-block">
              <span className="range-sub-title">Время отбытия</span>
              <div className="range-track-bar">
                <div className="range-track-bar__fill" style={{left: '0%', width: '50%'}}></div>
                <div className="range-track-bar__thumb" style={{left: '0%'}}></div>
                <div className="range-track-bar__thumb" style={{left: '50%'}}></div>
              </div>
              <div className="range-numeric-values">
                <span>0:00</span>
                <span>11:00</span>
                <span>24:00</span>
              </div>
            </div>

            <div className="range-sub-block">
              <span className="range-sub-title">Время прибытия</span>
              <div className="range-track-bar">
                <div className="range-track-bar__fill" style={{left: '25%', width: '35%'}}></div>
                <div className="range-track-bar__thumb" style={{left: '25%'}}></div>
                <div className="range-track-bar__thumb" style={{left: '60%'}}></div>
              </div>
              <div className="range-numeric-values">
                <span>5:00</span>
                <span>11:00</span>
                <span>24:00</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
}