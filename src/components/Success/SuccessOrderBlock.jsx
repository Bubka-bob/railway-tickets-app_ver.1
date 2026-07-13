import React, { useState } from 'react';

export default function SuccessOrderBlock({ buyerName, buyerPatronymic, finalPrice, onReturnToMain }) {
  // Локальный стейт для оранжевых звезд рейтинга сервиса
  const [rating, setRating] = useState(0);

  return (
    <div className="success-order-monolith-card">
      
      {/* Верхняя шапка бланка с номером и суммой */}
      <div className="success-card-top-row-bar">
        <span className="success-order-number-badge">
          № Заказа <strong className="v-order-id-digits">285АА</strong>
        </span>
        <span className="success-order-price-summary-text">
          сумма <strong className="v-order-price-digits">{finalPrice.toLocaleString('ru-RU')}</strong> <span className="v-rub-gray">₽</span>
        </span>
      </div>

      {/* Средний ряд с тремя круглыми иконками-инструкциями */}
      <div className="success-card-instructions-layer">
        <div className="success-instruction-item-node">
          <div className="success-icon-circle-badge orange-theme-svg-icon">💻</div>
          <p className="success-instruction-text-desc">билеты высланы <br />на электронную <br />почту</p>
        </div>
        
        <div className="success-instruction-item-node">
          <div className="success-icon-circle-badge orange-theme-svg-icon">🖨️</div>
          <p className="success-instruction-text-desc">распечатайте <br />и сохраняйте билеты <br />до даты поездки</p>
        </div>

        <div className="success-instruction-item-node">
          <div className="success-icon-circle-badge orange-theme-svg-icon">👮</div>
          <p className="success-instruction-text-desc">предъявите <br />распечатанные <br />билеты при посадке</p>
        </div>
      </div>

      {/* Основной текстовый блок обращения к клиенту */}
      <div className="success-card-client-personal-message-zone">
        <h2 className="success-client-fullname-title">{buyerName} {buyerPatronymic}!</h2>
        <p className="success-message-paragraph-text">Ваш заказ успешно оформлен.</p>
        <p className="success-message-paragraph-text">В ближайшее время с вами свяжется наш оператор для подтверждения.</p>
        
        <div className="success-message-bold-wishes-footer">
          Благодарим Вас за оказанное доверие и желаем приятного путешествия!
        </div>
      </div>

      {/* Нижний подвал бланка (Оценка сервиса + кнопка на главную) */}
      <div className="success-card-bottom-action-panel-bar">
        
        {/* Интерактивный блок звезд */}
        <div className="success-rating-stars-holder-box">
          <span className="success-rating-label-text">Оценить сервис</span>
          <div className="success-stars-flex-row">
            {[1, 2, 3, 4, 5].map((starNum) => (
              <span 
                key={starNum} 
                className={`star-item-clickable ${starNum <= rating ? 'is-star-filled' : ''}`}
                onClick={() => setRating(starNum)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Кнопка возврата на главную */}
        <button 
          type="button" 
          className="success-btn-back-to-home-page" 
          onClick={onReturnToMain}
        >
          Вернуться на главную
        </button>

      </div>

    </div>
  );
}