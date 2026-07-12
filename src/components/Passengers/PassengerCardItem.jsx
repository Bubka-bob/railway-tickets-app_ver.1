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

  const handleNextClickAction = () => {
    setIsOpen(false); // 1. Сворачиваем текущую анкету на минус
    if (onNextPassenger) {
      onNextPassenger(); // 2. Даем команду родителю развернуть следующую анкету
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
              <input type="checkbox" className="passenger-native-checkbox" checked={!!info.isLimitedMobility} onChange={(e) => onDataChange('isLimitedMobility', e.target.checked)} />
              <span>ограниченная подвижность</span>
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
                <input type="text" className="passenger-text-input" value={info.documentData || ''} onChange={(e) => onDataChange('documentData', e.target.value)} placeholder="12 символов" required />
              </div>
            )}
          </div>

          {/* ==========================================================================
             🔥 КНОПКА ИЗ МАКЕТА: ОТОБРАЖАЕТСЯ ЕСЛИ ЭТО НЕ ПОСЛЕДНИЙ ВЫБРАННЫЙ БИЛЕТ
             ========================================================================== */}
          {isOpen && !isLastPassenger && (
            <div className="passenger-next-action-row-footer">
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