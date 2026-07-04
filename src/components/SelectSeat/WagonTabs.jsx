import React from 'react';
import luxuryIcon from '../../assets/luxury.svg';
import coupeIcon from '../../assets/coupe.svg';
import platscartIcon from '../../assets/platscart.svg';
import sedentaryIcon from '../../assets/sedentary.svg';
import "./WagonTabs.css"

export default function WagonTabs({ groupedWagons, activeTab, setActiveTab, setActiveWagonId }) {
  const tabNames = {
    fourth: "Сидячий",
    third: "Плацкарт",
    second: "Купе",
    first: "Люкс"
  };

 const tabIcons = {
    first: luxuryIcon,
    second: coupeIcon,
    third: platscartIcon,
    fourth: sedentaryIcon
  };

  return (
    <div className="wagon-tabs-container">
      <p className="wagon-tabs-label">Тип вагона</p>
      <div className="wagon-tabs-row">
        {Object.keys(groupedWagons).map(typeKey => {
          if (groupedWagons[typeKey].length === 0) return null;

          return (
            <button
              key={typeKey}
              className={`wagon-tab-btn ${activeTab === typeKey ? 'is-active' : ''}`}
              onClick={() => {
                setActiveTab(typeKey);
                // При переключении таба автоматически активируем самый первый вагон из списка нового типа
                setActiveWagonId(groupedWagons[typeKey][0]?._id || null);
              }}
            >
              <span className="wagon-tab-btn__icon">
                <img 
                  src={tabIcons[typeKey]} 
                  alt={tabNames[typeKey]} 
                  className="wagon-tab-btn__svg" 
                />
              </span>
              <span className="wagon-tab-btn__text">{tabNames[typeKey]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}