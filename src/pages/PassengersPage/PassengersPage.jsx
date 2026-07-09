import React, { useContext } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AppContext from '../../components/context/AppContext';
import OrderbgImage from "../../assets/header-order-image.png";
import HeaderProgressBar from "../../components/Header/HeaderProgressBar/HeaderProgressBar";
import TripDetailsSidebar from "../../components/TripDetailsSidebar/TripDetailsSidebar";
export default function SelectSeatsPage() {
  // Безопасно извлекаем глобальный контекст для проверки обратного пути
  const context = useContext(AppContext);
  const appState = context?.appState;

  const headerBg = {
    backgroundImage: `url(${OrderbgImage})`,
  };

  return (
    <div className="seats-page-global-wrapper">
      {/* Шапка сайта с горизонтальным виджетом поиска */}
      <Header style={headerBg} variant="select" />
      <HeaderProgressBar currentStep={2} />
      {/* ДВУХКОЛОНОЧНЫЙ МАКЕТ СТРАНИЦЫ ПО FIGMA */}
      <div className="seats-page-grid container">
        
        {/* ЛЕВАЯ КОЛОНКА (САЙДБАР) */}
        <aside className="seats-page-sidebar">
          <TripDetailsSidebar/>
        </aside>

        {/* ПРАВАЯ КОЛОНКА (РАБОЧАЯ ОБЛАСТЬ) */}
        <section className="seats-page-main-zone">
         
        </section>

      </div>

      <Footer />
    </div>
  );
}