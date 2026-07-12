import React, { useState } from 'react';
import "./PaymentBlock.css";



export default function PaymentFormBlock({ orderState, setOrderState, onSubmitSuccess }) {
  // Локальные стейты для данных покупателя
  const [userForm, setUserForm] = useState({
    lastName: '',
    firstName: '',
    patronymic: '',
    phone: '',
    email: ''
  });

  // Стейты выбора способа оплаты
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' или 'cash'
  const [onlineType, setOnlineType] = useState('card'); // 'card', 'paypal', 'qiwi'

  

  const handleInputChange = (field, value) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };

  // Валидация: Кнопка активна, только когда заполнены ФИО, Телефон и Email
  const isFormValid = 
    userForm.lastName.trim() && 
    userForm.firstName.trim() && 
    userForm.phone.trim().length >= 10 && // Минимум 10 цифр
    userForm.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  const handleFormSubmitAction = (e) => {
    e.preventDefault();
    if (!isFormValid || !setOrderState) return;

    // Сохраняем данные плательщика в глобальный контекст заказа
    setOrderState(prev => ({
      ...prev,
      user: {
        first_name: userForm.firstName,
        last_name: userForm.lastName,
        patronymic: userForm.patronymic,
        phone: userForm.phone,
        email: userForm.email,
        payment_method: paymentMethod === 'online' ? onlineType : 'cash'
      }
    }));

    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  return (
    <section className="payment-page-main-zone">
      {/* 🔥 ИСПРАВЛЕНО: Теперь это ЕДИНАЯ сплошная форма-карточка без разрывов */}
      <form onSubmit={handleFormSubmitAction} className="payment-section-white-card-single">
        
        {/* РАЗДЕЛ 1: ПЕРСОНАЛЬНЫЕ ДАННЫЕ */}
        <div className="payment-single-block-section">
          <h2 className="payment-single-block-title">Персональные данные</h2>
          
          <div className="payment-card-body-content-inner">
            {/* Сетка ФИО (Данные подставляются автоматически) */}
            <div className="payment-form-grid-three-cols">
              <div className="payment-input-field-group">
                <label className="payment-field-label">Фамилия</label>
                <input type="text" className="payment-text-input" value={userForm.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)}  required />
              </div>
              <div className="payment-input-field-group">
                <label className="payment-field-label">Имя</label>
                <input type="text" className="payment-text-input" value={userForm.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} required />
              </div>
              <div className="payment-input-field-group">
                <label className="payment-field-label">Отчество</label>
                <input type="text" className="payment-text-input" value={userForm.patronymic} onChange={(e) => handleInputChange('patronymic', e.target.value)} />
              </div>
            </div>

            {/* Строка Контактного телефона */}
            <div className="payment-input-field-group width-340" style={{ marginTop: '20px' }}>
              <label className="payment-field-label">Контактный телефон</label>
              <input type="tel" className="payment-text-input" value={userForm.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+7 _ _ _  _ _ _  _ _  _ _" required />
            </div>

            {/* Строка Email */}
            <div className="payment-input-field-group width-340" style={{ marginTop: '20px' }}>
              <label className="payment-field-label">E-mail</label>
              <input type="email" className="payment-text-input" value={userForm.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="inbox@gmail.ru" required />
            </div>
          </div>
        </div>

        {/* ГЛАВНЫЙ СВЯЗУЮЩИЙ РАЗДЕЛИТЕЛЬ ДВУХ БЛОКОВ ПО МАКЕТУ */}
        <div className="payment-main-blocks-divider-line" />

        {/* РАЗДЕЛ 2: СПОСОБ ОПЛАТЫ */}
        <div className="payment-single-block-section">
          <h2 className="payment-single-block-title">Способ оплаты</h2>
          
          <div className="payment-card-body-content-inner">
            
            {/* ВАРИАНТ 1: ОНЛАЙН */}
            <div className="payment-method-row-selector-line">
              <label className="payment-custom-checkbox-label">
                <input type="radio" name="paymentMethod" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="payment-native-radio-hidden" />
                <span className="payment-custom-checkbox-visual">
                  {paymentMethod === 'online' && <span className="visual-check-mark">✓</span>}
                </span>
                <span className={`payment-method-label-text ${paymentMethod === 'online' ? 'is-selected-main' : ''}`}>Онлайн</span>
              </label>

              <div className={`payment-online-sub-variants-grid ${paymentMethod !== 'online' ? 'is-faded-disabled' : ''}`}>
                <span className={`online-sub-tab-item ${onlineType === 'card' ? 'is-active-bold' : ''}`} onClick={() => paymentMethod === 'online' && setOnlineType('card')}>
                  Банковской картой
                </span>
                <span className={`online-sub-tab-item ${onlineType === 'paypal' ? 'is-active-bold' : ''}`} onClick={() => paymentMethod === 'online' && setOnlineType('paypal')}>
                  PayPal
                </span>
                <span className={`online-sub-tab-item ${onlineType === 'qiwi' ? 'is-active-bold' : ''}`} onClick={() => paymentMethod === 'online' && setOnlineType('qiwi')}>
                  Visa QIWI Wallet
                </span>
              </div>
            </div>

            <div className="payment-card-internal-divider-line" />

            {/* ВАРИАНТ 2: НАЛИЧНЫМИ */}
            <div className="payment-method-row-selector-line" style={{ paddingBottom: '24px' }}>
              <label className="payment-custom-checkbox-label">
                <input type="radio" name="paymentMethod" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="payment-native-radio-hidden" />
                <span className="payment-custom-checkbox-visual">
                  {paymentMethod === 'cash' && <span className="visual-check-mark">✓</span>}
                </span>
                <span className={`payment-method-label-text ${paymentMethod === 'cash' ? 'is-selected-main' : ''}`}>Наличными</span>
              </label>
            </div>

          </div>
        </div>

        {/* НИЖНЯЯ ОРАНЖЕВАЯ КНОПКА ОТПРАВКИ */}
        <div className="payment-page-submit-bottom-row">
          <button 
            type="submit" 
            disabled={!isFormValid}
            className={`payment-main-orange-submit-btn ${!isFormValid ? 'is-btn-disabled' : ''}`}
          >
            Купить билеты
          </button>
        </div>

      </form>
    </section>
  );
}