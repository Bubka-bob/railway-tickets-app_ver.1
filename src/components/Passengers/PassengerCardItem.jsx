import React, { useState } from 'react';
import './PassengerCardItem.css';

export default function PassengerCardItem({ 
  passengerIndex, 
  seatData, 
  onDataChange, 
  onRemove,
  isLastPassenger,
  onNextPassenger 
}) {
  // 🛠️ ЛОКАЛЬНЫЙ СТЕЙТ: Сворачивание и разворачивание полностью независимо на каждой карточке!
  const [isOpen, setIsOpen] = useState(true);
  const [docError, setDocError] = useState('');
  const info = seatData?.passengerInfo || {};
  const defaultAgeType = seatData?.isChild ? 'child' : 'adult';

  const [gender, setGender] = useState(info.gender || 'male');
  const [docType, setDocType] = useState(info.documentType || (seatData?.isChild ? 'certificate' : 'passport'));

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    onDataChange('gender', selectedGender);
  };

  const handleDocTypeSelect = (e) => {
    const selectedDoc = e.target.value;
    setDocType(selectedDoc);
    onDataChange('documentType', selectedDoc);
  };

   // 🛠️ ДОБАВЛЕНО: Функция валидации свидетельства и паспорта
  const validateDocument = (value) => {
    const cleanValue = (value || '').trim();

    if (docType === 'certificate') {
      // Регулярное выражение бэкенда Нетологии: римские цифры - 2 русские буквы - 6 цифр
      const certRegex = /^[IVXLCDM]{1,7}-[А-ЯЁ]{2}-[0-9]{6}$/;
      
      if (cleanValue && !certRegex.test(cleanValue)) {
        setDocError('Номер свидетельства о рождении указан некорректно\nПример: VIII-ЫП-123456');
        return false;
      }
    } else if (docType === 'passport') {
      // Простая подстраховка для паспорта: номер должен состоять ровно из 6 цифр
      const passportNoRegex = /^[0-9]{6}$/;
      if (cleanValue && !passportNoRegex.test(cleanValue)) {
        setDocError('Номер паспорта должен состоять из 6 цифр');
        return false;
      }
    }
    
    setDocError(''); // Если всё правильно — стираем ошибку
    return true;
  };

  const isLastNameOk = !!info.lastName?.trim();
  const isFirstNameOk = !!info.firstName?.trim();
  const isBirthdayOk = !!info.birthday?.trim();
  const isDocDataOk = !!info.documentData?.trim();

  // Документ валиден, если он заполнен и регулярное выражение не выдает ошибку
  let isDocValid = false;
  if (docType === 'certificate') {
    isDocValid = /^[IVXLCDM]{1,7}-[А-ЯЁ]{2}-[0-9]{6}$/.test(String(info.documentData).trim());
  } else {
    isDocValid = /^[0-9]{6}$/.test(String(info.documentData).trim());
  }

  // Карточка успешна только когда ВСЕ обязательные поля в порядке и нет ошибок маски
  const isCurrentCardSuccess = isLastNameOk && isFirstNameOk && isBirthdayOk && isDocDataOk && isDocValid && !docError;


  const handleNextClickAction = () => {
    // Перед тем как свернуть карточку, проверяем валидность документа
    const isValid = validateDocument(info.documentData);
    
    // Если данные некорректны — блокируем сворачивание и переход, оставляя плашку на экране
    if (!isValid) return; 

    setIsOpen(false); 
    if (onNextPassenger) {
      onNextPassenger(); 
    }
  };

  return (
    /* Добавили дата-атрибут data-passenger-card-index для точечного поиска следующего плюсика в DOM */
    <div className={`passenger-card-item-box ${!isOpen ? 'is-collapsed-state' : ''}`} data-passenger-card-index={passengerIndex - 1}>
      
      {/* ШАПКА КАРТОЧКИ */}
      <div className="passenger-card-header-top">
        <span className="passenger-card-title-text">
          {/* Клик по круглому маркеру свободно меняет локальный стейт isOpen */}
          <span 
            className={`minus-icon-toggle ${!isOpen ? 'plus-style-active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: 'pointer' }}
          >
            {isOpen ? '−' : '+'}
          </span> 
          Пассажир {passengerIndex}
        </span>
        <button type="button" className="passenger-card-remove-x-btn" onClick={onRemove}>×</button>
      </div>

      {/* ТЕЛО КАРТОЧКИ С ИНПУТАМИ */}
      {isOpen && (
        <div className="passenger-card-body-content">
          <div className="passenger-form-row">
            <select className="passenger-styled-select" defaultValue={defaultAgeType} disabled>
              <option value="adult">Взрослый</option>
              <option value="child">Детский</option>
            </select>
          </div>

          <div className="passenger-form-grid-three-cols">
            <div className="passenger-input-field-group">
              <label className="passenger-field-label">Фамилия</label>
              <input type="text" className="passenger-text-input" value={info.lastName || ''} onChange={(e) => onDataChange('lastName', e.target.value)} placeholder="Мартынюк" required />
            </div>
            <div className="passenger-input-field-group">
              <label className="passenger-field-label">Имя</label>
              <input type="text" className="passenger-text-input" value={info.firstName || ''} onChange={(e) => onDataChange('firstName', e.target.value)} placeholder="Ирина" required />
            </div>
            <div className="passenger-input-field-group">
              <label className="passenger-field-label">Отчество</label>
              <input type="text" className="passenger-text-input" value={info.patronymic || ''} onChange={(e) => onDataChange('patronymic', e.target.value)} placeholder="Эдуардовна" />
            </div>
          </div>

          <div className="passenger-form-flex-row-gender-birthday">
            <div className="passenger-input-field-group width-auto">
              <label className="passenger-field-label">Пол</label>
              <div className="passenger-gender-toggle-buttons-box">
                <button type="button" className={`gender-toggle-btn ${gender === 'male' ? 'is-active' : ''}`} onClick={() => handleGenderSelect('male')}>М</button>
                <button type="button" className={`gender-toggle-btn ${gender === 'female' ? 'is-active' : ''}`} onClick={() => handleGenderSelect('female')}>Ж</button>
              </div>
            </div>
            <div className="passenger-input-field-group">
              <label className="passenger-field-label">Дата рождения</label>
              <input type="text" className="passenger-text-input" style={{ width: '180px' }} value={info.birthday || ''} onChange={(e) => onDataChange('birthday', e.target.value)} placeholder="ДД.ММ.ГГГГ" required />
            </div>
          </div>

          <div className="passenger-checkbox-row-line">
            <label className="passenger-custom-checkbox-label">
              <input type="checkbox"
               className="passenger-native-checkbox hidden"
                checked={!!info.isLimitedMobility} 
                onChange={(e) => onDataChange('isLimitedMobility', e.target.checked)} />
              <span className="passenger-custom-checkbox-visual">
              {info.isLimitedMobility && <span className="visual-check-mark">✓</span>}
            </span>
            <span className="checkbox-text-label-label">ограниченная подвижность</span>
            </label>
          </div>

          <div className="passenger-card-internal-divider" />

          <div className="passenger-form-grid-document-zone">
            <div className="passenger-input-field-group" style={{ width: '280px' }}>
              <label className="passenger-field-label">Тип документа</label>
              <select className="passenger-styled-select" value={docType} onChange={handleDocTypeSelect}>
                <option value="passport">Паспорт РФ</option>
                <option value="certificate">Свидетельство о рождении</option>
              </select>
            </div>

            {docType === 'passport' ? (
              <>
                <div className="passenger-input-field-group" style={{ width: '100px' }}>
                  <label className="passenger-field-label">Серия</label>
                  <input type="text" className="passenger-text-input" style={{ textAlign: 'center' }} value={info.docSeries || ''} maxLength={4} onChange={(e) => onDataChange('docSeries', e.target.value)} placeholder="_ _ _ _" />
                </div>
                <div className="passenger-input-field-group" style={{ width: '160px' }}>
                  <label className="passenger-field-label">Номер</label>
                  <input type="text" className="passenger-text-input" style={{ textAlign: 'center' }} value={info.documentData || ''} maxLength={6} onChange={(e) => onDataChange('documentData', e.target.value)} placeholder="_ _ _ _ _ _" required />
                </div>
              </>
            ) : (
              <div className="passenger-input-field-group" style={{ width: '320px' }}>
                <label className="passenger-field-label">Номер</label>
                 <input 
                    type="text" 
                    className="passenger-text-input" 
                    value={info.documentData || ''} 
                     onChange={(e) => {
                    const val = e.target.value;
                    onDataChange('documentData', val); // 1. Записываем в глобальный контекст
                    validateDocument(val);             // 2. Мгновенно проверяем маску для вывода плашки
                  }} 
                  onBlur={(e) => validateDocument(e.target.value)} 
                  placeholder="VIII-ЫП-123456" 
                  required 
                  />
                  </div>
            )}
          </div>
 {/* ==========================================================================
             🔥 ДОБАВЛЕНО: ЛОСОСЕВАЯ ПЛАШКА ОШИБКИ ВАЛИДАЦИИ ИЗ МАКЕТА КАРТИНКИ
             ========================================================================== */}
          {docError && (
            <div className="passenger-document-error-banner-alert">
              <div className="error-banner-cross-circle">×</div>
              <div className="error-banner-text-message">
                {docError.split('\n').map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </div>
          )}
          {/* ==========================================================================
             🔥 КНОПКА ИЗ МАКЕТА: ОТОБРАЖАЕТСЯ ЕСЛИ ЭТО НЕ ПОСЛЕДНИЙ ВЫБРАННЫЙ БИЛЕТ
             ========================================================================== */}
           {isOpen && (
            <div className={`passenger-card-footer-action-zone ${isCurrentCardSuccess ? 'footer-theme--success' : ''}`}>
              
              {/* Если карточка полностью валидна — выводим макетную зеленую галочку «Готово» */}
              {isCurrentCardSuccess ? (
                <div className="success-banner-ready-indicator">
                  <div className="success-banner-check-circle">✓</div>
                  <span className="success-banner-ready-text">Готово</span>
                </div>
              ) : (
                <div className="success-banner-empty-stub" /> /* Заглушка для сохранения флекс-выравнивания вправо */
              )}

              <button 
                type="button" 
                className="passenger-inline-next-btn"
                onClick={handleNextClickAction} /* Сворачивает текущую и открывает следующую */
              >
                Следующий пассажир
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}