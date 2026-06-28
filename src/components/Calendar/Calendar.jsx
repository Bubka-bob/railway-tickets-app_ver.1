import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendarIcon from '../../assets/calendar.png';
import "./Calendar.css"

export default function WidgetDatePicker({ selected, onChange, placeholderText = 'ДД/ММ/ГГ', required = false }) {
  return (
    <div className="search-widget__input-wrapper">
      <div className="datepicker-container">
        <DatePicker
          selected={selected}
          onChange={onChange}
          placeholderText={placeholderText}
          dateFormat="dd.MM.yyyy"
          locale="ru"
          className="search-widget__input"
          popperContainer={({ children }) => <div>{children}</div>} 
          required={required}
        />
      </div>
      <img src={calendarIcon} alt="" className="search-widget__icon" />
    </div>
  );
}
