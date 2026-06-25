import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';


function Logo() {
  return (
    <div className="header-logo">
      <div className="container">
        <Link to="/" className="header-logo__link">Лого</Link>
      </div>
    </div>
  );
}

export default Logo;