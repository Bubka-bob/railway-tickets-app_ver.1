import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useGetCities from "../../services/useGetCities";
import "./SelectLocation.css";

function SelectLocation({ name, placeholder, value, onValue }) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // СИНХРОНИЗАЦИЯ: Если внешнее значение изменилось (например, при реверсе), обновляем инпут
  useEffect(() => {
    setInput(value || "");
  }, [value]);

  const { result, isLoading } = useGetCities(input);
  const cities = Array.isArray(result) ? result : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city) => {
    const uppercaseName = city.name.toUpperCase();
    setInput(uppercaseName);
    setIsOpen(false);

    // Определяем ключ на основе базового плейсхолдера
    const key = placeholder === "Откуда" || placeholder === "Куда" 
      ? (placeholder === "Откуда" ? "from_city" : "to_city")
      : (name.includes("from") ? "from_city" : "to_city");
    
    if (onValue) {
      onValue({
        [`${key}_name`]: uppercaseName,
        [`${key}_id`]: city._id,
      });
    }
  };

  return (
    <div className={`select-location-container ${name}`} ref={containerRef}>
      <input
        type="text"
        placeholder={placeholder}
        className="search-widget__input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        required
      />
      
      {isOpen && (input.trim().length >= 2 || isLoading) && (
        <ul className="search-widget__dropdown">
          {isLoading && <li className="search-widget__dropdown-item loading">Загрузка...</li>}
          
          {!isLoading && cities.length === 0 && (
            <li className="search-widget__dropdown-item empty">Город не найден</li>
          )}
          
          {!isLoading && cities.map((city) => (
            <li
              key={city._id}
              className="search-widget__dropdown-item"
              onClick={() => handleSelectCity(city)}
            >
              {city.name.toUpperCase()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

SelectLocation.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string, // Добавили валидацию пропса value
  onValue: PropTypes.func,
};

export default SelectLocation;