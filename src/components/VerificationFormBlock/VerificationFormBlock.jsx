import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainCard from '../TrainCard/TrainCard'; // 🔥 Импортируем твой готовый компонент поезда
import RouteContext from '../../components/context/RouteContext'; 
import PassIconCircle from "../../assets/PassIconCircle.svg"
import "./VerificationFormBlock.css"

export default function VerificationFormBlock({ orderState }) {
  const navigate = useNavigate();
  const { routeState } = useContext(RouteContext);

  const departureSeats = orderState?.legs?.departure?.seats?.filter(s => s && s.seatNumber !== null) || [];
  const totalPrice = orderState?.totalPrice || 0;
  const userPaymentMethod = orderState?.user?.payment_method || 'cash';

  const handleConfirmOrderSubmit = (e) => {
    e.preventDefault();
    navigate('/order/success'); 
  };

  return (
    <section className="verification-page-main-zone">
      <div className="verification-blocks-flow">
        
        {/* ==================== БЛОК 1: ПОЕЗД ==================== */}
        <div className="verification-section-white-card">
          <div className="verification-card-header-title">Поезд</div>
          <div className="verification-card-embedded-train-wrapper">
            {routeState ? (
              <TrainCard 
                train={routeState} 
                isVerificationMode={true} 
              />
            ) : (
              <div className="verification-no-train-error">
                Данные о выбранном поезде не найдены в контексте.
              </div>
            )}
          </div>
        </div>

        {/* ==================== БЛОК 2: ПАССАЖИРЫ ==================== */}
        <div className="verification-section-white-card">
          <div className="verification-card-header-title">Пассажиры</div>
          <div className="verification-card-body-content row-layout-passengers">
            
            {/* Левая часть: Список пассажиров */}
            <div className="verification-passengers-left-list-container">
              {departureSeats.length === 0 ? (
                <div className="verification-passenger-empty-stub-text">
                  Список пассажиров пуст. Вернитесь назад для заполнения.
                </div>
              ) : (
                departureSeats.map((seat, index) => {
                  const info = seat?.passengerInfo || {};
                  const isChild = seat?.isChild === true;
                  const docTypeLabel = info.documentType === 'certificate' ? 'Свидетельство о рождении' : 'Паспорт РФ';
                  
                  const lastName = String(info.lastName || 'Иванов').toUpperCase();
                  const firstName = String(info.firstName || 'Иван');
                  const patronymic = String(info.patronymic || 'Иванович');
                  const docDataFormatted = info.docSeries ? `${info.docSeries} ${info.documentData}` : info.documentData;

                  return (
                    <div key={index} className="verification-passenger-row-item-card">
                      <div className="v-passenger-avatar-zone">
                        <div className="v-avatar-circle">
                             <img src={PassIconCircle} alt="Пассажир" className="v-passenger-img-icon" />
                        </div>
                        <span className="v-passenger-type-label-tag">{isChild ? "Детский" : "Взрослый"}</span>
                      </div>

                      <div className="v-passenger-info-text-details">
                        <h4 className="v-passenger-full-name">
                          {lastName} {firstName} {patronymic}
                        </h4>
                        <span className="v-passenger-meta-line">Пол: {info.gender === 'female' ? "женский" : "мужской"}</span>
                        <span className="v-passenger-meta-line">Дата рождения: {info.birthday || "10.04.2010"}</span>
                        <span className="v-passenger-meta-line">{docTypeLabel}: {docDataFormatted || "3455 566666"}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Правая часть: Итог в рублях + кнопка Изменить */}
            <div className="verification-right-action-column-btn-zone width-240-border-left">
              <div className="v-checkout-total-summary-box-box">
                <span className="v-total-summary-label">Всего</span>
                <span className="v-total-summary-digits-value">
                  {totalPrice.toLocaleString('ru-RU')} <span className="v-currency-rub-gray">₽</span>
                </span>
              </div>
              <button type="button" className="verification-inline-edit-btn margin-top-20" onClick={() => navigate('/order/passengers')}>
                Изменить
              </button>
            </div>

          </div>
        </div>

        {/* ==================== БЛОК 3: СПОСОБ ОПЛАТЫ ==================== */}
        <div className="verification-section-white-card">
          <div className="verification-card-header-title">Способ оплаты</div>
          <div className="verification-card-body-content row-layout-payment">
            <div className="verification-payment-left-value-text">
              {userPaymentMethod === 'cash' ? "Наличными" : "Онлайн (Банковской картой)"}
            </div>
            <div className="verification-right-action-column-btn-zone">
              <button type="button" className="verification-inline-edit-btn" onClick={() => navigate('/order/payment')}>
                Изменить
              </button>
            </div>
          </div>
        </div>

        {/* БОЛЬШАЯ ОРАНЖЕВАЯ КНОПКА ПОДТВЕРЖДЕНИЯ */}
        <div className="verification-page-submit-bottom-row-row">
          <button type="button" className="verification-main-orange-submit-btn-btn" onClick={handleConfirmOrderSubmit}>
            Подтвердить
          </button>
        </div>

      </div>
    </section>
  );
}