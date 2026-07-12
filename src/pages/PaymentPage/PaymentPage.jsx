import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AppContext from '../../components/context/AppContext';
import OrderbgImage from "../../assets/header-order-image.png";
import HeaderProgressBar from "../../components/Header/HeaderProgressBar/HeaderProgressBar";
import TripDetailsSidebar from "../../components/TripDetailsSidebar/TripDetailsSidebar";
import OrderContext from '../../components/context/OrderContext';
import PaymentFormBlock from '../../components/Payment/PaymentBlock'; 

export default function PaymentPage() {
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
      <HeaderProgressBar currentStep={3} />
      {/* ДВУХКОЛОНОЧНЫЙ МАКЕТ СТРАНИЦЫ ПО FIGMA */}
      <div className="seats-page-grid container">
        
        {/* ЛЕВАЯ КОЛОНКА (САЙДБАР) */}
        <aside className="seats-page-sidebar">
          <TripDetailsSidebar/>
        </aside>

        {/* ПРАВАЯ КОЛОНКА (РАБОЧАЯ ОБЛАСТЬ) */}
        <section className="payment-page-main-zone">
         <PaymentFormBlock 
          orderState={orderState}
          setOrderState={setOrderState}
          onSubmitSuccess={() => navigate('/order/verification')}
        />
        </section>

      </div>

      <Footer />
    </div>
  );
}