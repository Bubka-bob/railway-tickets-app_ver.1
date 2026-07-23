import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import finalbgImage from "../../assets/header-final-image.png";
import OrderContext from '../../components/context/OrderContext';
import AppContext from '../../components/context/AppContext';
import SuccessOrderBlock from '../../components/Success/SuccessOrderBlock'; 
import './SuccessPage.css';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { orderState, setOrderState } = useContext(OrderContext) || {};
  const { setAppState } = useContext(AppContext) || {};

  const buyerFirstName = orderState?.user?.first_name;
  const buyerPatronymic = orderState?.user?.patronymic;
  const finalPrice = orderState?.totalPrice;

  const handleReturnToMainAction = () => {
    if (setOrderState) setOrderState({});
    if (setAppState) setAppState({ departure_id: null, arrival_id: null });
    navigate('/');
  };

  const finalBg = {
    backgroundImage: `url(${finalbgImage})`,
  }

  return (
    
      <div className="success-page-global-wrapper">
        <Header style={finalBg} variant="success" />
      <main className="success-page-main-container container">
        
        {/* Крупный заголовок, заходящий на фоновую область */}
        <h1 className="success-main-page-title">Благодарим Вас за заказ!</h1>

        {/* ✅ Вставляем изолированный компонент бланка, передавая пропсы */}
        <SuccessOrderBlock 
          buyerName={buyerFirstName}
          buyerPatronymic={buyerPatronymic}
          finalPrice={finalPrice}
          onReturnToMain={handleReturnToMainAction}
        />

      </main>

      <Footer />
    </div>
  );
}

