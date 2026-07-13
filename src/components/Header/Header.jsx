import React from 'react';
import Logo from '../Logo/Logo';
import Navigation from './Navigation/Navigation';
import HeaderTitle from './HeaderTitle/HeaderTitle';
import SearchWidget from './SearchWidget/SearchWidget';
import './Header.css';

export default function Header({style, variant = "main" }) {
   return (
    <header style={style} className={`header header--${variant}`}>
     
      <Logo />
      <Navigation />
      

      {variant === "main" && (
      <div className="header-widget container">
        <HeaderTitle />
        <SearchWidget variant="vertical"/>
      </div>
      )}
      {variant === "select" && (
        /* Страница выбора поездов — горизонтальный виджет */
        <div className="header-widget-select-page container">
          <SearchWidget variant="horizontal" />
        </div>
      )}

      {/* 🔥 Если variant === "success", здесь ничего не рендерится, 
          остается только чистое меню и фон, как на твоем макете! */}
    </header>
  );
}
     
    