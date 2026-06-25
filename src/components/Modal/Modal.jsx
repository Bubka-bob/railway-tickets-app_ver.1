/* eslint-disable-next-line no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({ status, display, onChange, text }) => {
  const isError = status === 'error';
  const bgStyle = isError ? { backgroundColor: '#ff3d0061' } : { backgroundColor: '#fff5005c' };

  const handleClick = (event) => {
    event.preventDefault();
    if (event.target.classList.contains('modal__btn')) onChange('none');
  };

  return (
    <div className="modal__wrapper" style={{ display }} onClick={handleClick}>
      <div className="modal__container">
        <div className={`modal__header modal__header-${status}`} style={bgStyle}></div>
        <div className="modal__content">
          <p className="modal__title">{isError ? 'Ошибка!' : 'Информация'}</p>
          <p className="modal__text">{text}</p>
        </div>
        <div className="modal__footer">
          <button className="modal__btn" type="button">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  status: PropTypes.oneOf(['error', 'info']).isRequired,
  display: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default Modal;