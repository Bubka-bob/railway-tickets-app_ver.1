import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AppContext from '../../components/context/AppContext';
import OrderbgImage from "../../assets/header-order-image.png";
import HeaderProgressBar from "../../components/Header/HeaderProgressBar/HeaderProgressBar";
import TripDetailsSidebar from "../../components/TripDetailsSidebar/TripDetailsSidebar";
import OrderContext from '../../components/context/OrderContext';
import PassengerCardItem from '../../components/Passengers/PassengerCardItem';

export default function PassengersPage() {
  const context = useContext(AppContext);
  const appState = context?.appState;
  const { orderState, setOrderState } = useContext(OrderContext) || {};
  const navigate = useNavigate();
  const [activePassengerIndex, setActivePassengerIndex] = React.useState(0);
  const departureSeats = orderState?.legs?.departure?.seats?.filter(s => s && s.seatNumber !== null) || [];

  // 🛠️ ЛОГИКА 1: Удаление карточки пассажира на крестик (×)
  const handleRemovePassenger = (index) => {
    if (!setOrderState) return;
    setOrderState(prev => {
      const depSeats = [...(prev?.legs?.departure?.seats || [])];
      const arrSeats = [...(prev?.legs?.arrival?.seats || [])];
      
      // Определяем возрастную категорию удаляемого пассажира, чтобы уменьшить personCount
      const removedSeat = depSeats[index];
      let cat = 'adult';
      if (removedSeat?.includeChildrenSeat) cat = 'baby';
      else if (removedSeat?.isChild) cat = 'child';

      depSeats.splice(index, 1);
      arrSeats.splice(index, 1);

      const currentCount = prev?.personCount?.[prev?.legs?.departure?.routeDirectionId ? 'departure' : 'arrival']?.[cat] || 0;
      const nextCount = Math.max(0, currentCount - 1);

      return {
        ...prev,
        personCount: {
          ...prev.personCount,
          departure: { ...prev.personCount?.departure, [cat]: nextCount },
          arrival: { ...prev.personCount?.arrival, [cat]: nextCount }
        },
        legs: {
          ...prev.legs,
          departure: { ...prev.legs?.departure, seats: depSeats },
          arrival: { ...prev.legs?.arrival, seats: arrSeats }
        }
      };
    });
  };

  // 🛠️ ЛОГИКА 2: Кнопка "Добавить пассажира" (+) внизу списка
  const handleAddPassengerPlaceholder = () => {
    if (!setOrderState) return;
    setOrderState(prev => {
      const depSeats = [...(prev?.legs?.departure?.seats || [])];
      const arrSeats = [...(prev?.legs?.arrival?.seats || [])];

      const newPlaceholderSeat = {
        coachId: depSeats[0]?.coachId || null,
        seatNumber: Date.now(), // Временный уникальный ID вместо номера кресла
        price: 0,
        isChild: false,
        includeChildrenSeat: false,
        passengerInfo: { isAdult: true, firstName: '', lastName: '', patronymic: '', gender: 'male', birthday: '', documentType: 'passport', documentData: '' }
      };

      return {
        ...prev,
        personCount: {
          ...prev.personCount,
          departure: { ...prev.personCount?.departure, adult: (prev.personCount?.departure?.adult || 0) + 1 }
        },
        legs: {
          ...prev.legs,
          departure: { ...prev.legs?.departure, seats: [...depSeats, newPlaceholderSeat] },
          arrival: { ...prev.legs?.arrival, seats: [...arrSeats, newPlaceholderSeat] }
        }
      };
    });
  };

  const handlePassengerDataChange = (index, fieldName, value) => {
    if (!setOrderState) return;
    setOrderState(prev => {
      const updatedDepartureSeats = [...(prev?.legs?.departure?.seats || [])];
      if (updatedDepartureSeats[index]) {
        updatedDepartureSeats[index] = {
          ...updatedDepartureSeats[index],
          passengerInfo: { ...(updatedDepartureSeats[index].passengerInfo || {}), [fieldName]: value }
        };
      }
      const updatedArrivalSeats = [...(prev?.legs?.arrival?.seats || [])];
      if (updatedArrivalSeats[index]) {
        updatedArrivalSeats[index] = {
          ...updatedArrivalSeats[index],
          passengerInfo: { ...(updatedArrivalSeats[index].passengerInfo || {}), [fieldName]: value }
        };
      }
      return {
        ...prev,
        legs: {
          ...prev.legs,
          departure: { ...prev.legs?.departure, seats: updatedDepartureSeats },
          arrival: { ...prev.legs?.arrival, seats: updatedArrivalSeats }
        }
      };
    });
  };

  const isFormValid = departureSeats.length > 0 && departureSeats.every(seat => {
    const info = seat?.passengerInfo;
    
    // 1. Проверяем базовое заполнение текстовых полей
    const hasBaseFields = (
      info?.lastName?.trim() && 
      info?.firstName?.trim() && 
      info?.birthday?.trim() && 
      info?.documentData?.trim()
    );
    if (!hasBaseFields) return false;

    // 2. Валидируем данные в зависимости от выбранного типа документа
    const docType = info.documentType || (seat.isChild ? 'certificate' : 'passport');
    const docData = String(info.documentData).trim();

    if (docType === 'certificate') {
      // Римские цифры (I-X) - 2 русские буквы - 6 цифр (Пример: VIII-ЫП-123456)
      const certRegex = /^[IVXLCDM]{1,7}-[А-ЯЁ]{2}-[0-9]{6}$/;
      return certRegex.test(docData);
    } 
    
    if (docType === 'passport') {
      // Номер паспорта должен состоять строго из 6 цифр
      const passportNoRegex = /^[0-9]{6}$/;
      return passportNoRegex.test(docData);
    }

    return true;
  });
  
  const handleNextStepSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/order/payment');
    }
  };

  const headerBg = { backgroundImage: `url(${OrderbgImage})` };

  return (
    <div className="seats-page-global-wrapper">
      <Header style={headerBg} variant="select" />
      <HeaderProgressBar currentStep={2} />
      
      <div className="seats-page-grid container" style={{ display: 'flex', gap: '30px', marginTop: '40px', alignItems: 'flex-start' }}>
        <aside className="seats-page-sidebar">
          <TripDetailsSidebar />
        </aside>

        <section className="seats-page-main-zone" style={{ flex: 1 }}>
          <form onSubmit={handleNextStepSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
             {departureSeats.map((seat, index) => {
              const triggerNextOpen = () => {
                const nextCardHeader = document.querySelector(`[data-passenger-card-index="${index + 1}"] .minus-icon-toggle`);
                if (nextCardHeader && nextCardHeader.textContent === '+') {
                  nextCardHeader.click();
                  nextCardHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              };

              return (
                <PassengerCardItem
                  key={`${seat.coachId}_${seat.seatNumber}_${index}`}
                  passengerIndex={index + 1}
                  seatData={seat}
                  onDataChange={(field, val) => handlePassengerDataChange(index, field, val)}
                  onRemove={() => handleRemovePassenger(index)}
                  
                  /* 🔥 ДОБАВЛЕНО: Инструменты для кнопки внутри карточки */
                  isLastPassenger={index === departureSeats.length - 1}
                  onNextPassenger={triggerNextOpen}
                />
              );
            })}

            {/* КНОПКА: ДОБАВИТЬ ПАССАЖИРА С ПЛЮСИКОМ ИЗ МАКЕТА */}
            <div className="add-passenger-row-card-trigger" onClick={handleAddPassengerPlaceholder}>
              <span className="add-passenger-trigger-text">Добавить пассажира</span>
              <span className="add-passenger-plus-icon">+</span>
            </div>

            {/* НИЖНЯЯ КНОПКА ДАЛЕЕ С УПРАВЛЕНИЕМ АКТИВНОСТЬЮ DISABLED */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                type="submit" 
                disabled={!isFormValid} // ➔ Блокируем кнопку, если поля пустые!
                className={`main-orange-submit-btn ${!isFormValid ? 'btn-disabled' : ''}`}
                style={{
                  backgroundColor: isFormValid ? '#ffa800' : '#928f94',
                  color: '#ffffff',
                  border: 'none',
                  padding: '15px 50px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease'
                }}
              >
                Далее ➔
              </button>
            </div>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
}