import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AppContext from '../../components/context/AppContext';
import OrderbgImage from "../../assets/header-order-image.png";
import HeaderProgressBar from "../../components/Header/HeaderProgressBar/HeaderProgressBar";
import TripDetailsSidebar from "../../components/TripDetailsSidebar/TripDetailsSidebar";
import OrderContext from '../../components/context/OrderContext';
import VerificationFormBlock from '../../components/VerificationFormBlock/VerificationFormBlock';


export default function VerificationPage() {
  const context = useContext(AppContext);
  const appState = context?.appState;
  const { orderState, setOrderState } = useContext(OrderContext) || {};
  const navigate = useNavigate();
  const headerBg = {
    backgroundImage: `url(${OrderbgImage})`,
  };

  return (
    <div className="seats-page-global-wrapper">
      {/* Шапка сайта с горизонтальным виджетом поиска */}
      <Header style={headerBg} variant="select" />
      <HeaderProgressBar currentStep={4} />
      {/* ДВУХКОЛОНОЧНЫЙ МАКЕТ СТРАНИЦЫ ПО FIGMA */}
      <div className="seats-page-grid container">
        
        {/* ЛЕВАЯ КОЛОНКА (САЙДБАР) */}
        <aside className="seats-page-sidebar">
          <TripDetailsSidebar/>
        </aside>

        {/* ПРАВАЯ КОЛОНКА (РАБОЧАЯ ОБЛАСТЬ) */}
        <section className="verification-page-main-zone">
           <VerificationFormBlock orderState={orderState} />
         </section>

      </div>

      <Footer />
    </div>
  );
}