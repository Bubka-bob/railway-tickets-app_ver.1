import React from 'react';
import { HashLink } from 'react-router-hash-link';
import './Navigation.css';

function Navigation() {
  return (
    <div className="header-nav">
      <div className="container">
        <nav className="header-nav__nav nav">
      <ul className="header-nav__list">
        <li className="header-nav__item">
          <HashLink smooth to="/#about" className="header-nav__link">О нас</HashLink>
        </li>
        <li className="header-nav__item">
          <HashLink smooth to="/#howitworks" className="header-nav__link">Как это работает</HashLink>
        </li>
        <li className="header-nav__item">
          <HashLink smooth to="/#feedbacks" className="header-nav__link">Отзывы</HashLink>
        </li>
        <li className="header-nav__item">
          <HashLink smooth to="/#contacts" className="header-nav__link">Контакты</HashLink>
        </li>
      </ul>
    </nav>
    </div>
    </div>
  );
}

export default Navigation;