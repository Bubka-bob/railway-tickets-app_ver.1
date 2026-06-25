import React, { useState } from 'react';
// Исправлено: добавлен импорт Routes для правильной работы маршрутизации
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import StartPage from './pages/StartPage/StartPage';
import SelectTrainPage from './pages/SelectTrainPage/SelectTrainPage';
import SelectSeatsPage from './pages/SelectSeatsPage/SelectSeatsPage';
import PassengersPage from './pages/PassengersPage/PassengersPage';
import VerificationPage from './pages/VerificationPage/VerificationPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import SuccessPage from './pages/SuccessPage/SuccessPage';

import AppContext from './components/context/AppContext';
import RouteContext from './components/context/RouteContext'; 

import { initialAppState } from './utils/initialAppState';
import { initialRouteState } from './utils/initialRouteState';

export default function App() {
  const [appState, setAppState] = useState(initialAppState);
  const [routeState, setRouteState] = useState(initialRouteState);
  
// const basename = import.meta.env.BASE_URL || '/';
  return (
    <Router >
      <AppContext.Provider value={{ appState, setAppState }}>
        <RouteContext.Provider value={{ routeState, setRouteState }}>
          
          {/* Исправлено: Все теги <Route> обязательно оборачиваем в <Routes> */}
          <Routes>
            {/* Основной роут главной страницы */}
            <Route path="/" element={<StartPage />} />
            
            {/* Страница выбора поездов */}
            <Route path="/order/trains" element={<SelectTrainPage />} />
            
             {/* 3. Выбор мест в вагоне */}
            <Route path="/order/seats" element={<SelectSeatsPage />} />
            {/* 4. Ввод данных пассажиров */}
            <Route path="/order/passengers" element={<PassengersPage />} />
            
            {/* 5. Проверка данных перед оплатой */}
            <Route path="/order/verification" element={<VerificationPage />} />
            
            {/* 6. Страница оплаты */}
            <Route path="/order/payment" element={<PaymentPage />} />
            
            {/* 7. Экран успешного заказа */}
            <Route path="/order/success" element={<SuccessPage />} />
            
            {/* Перенаправление на главную при вводе несуществующего адреса */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
        </RouteContext.Provider>
      </AppContext.Provider>
    </Router>
  );
}