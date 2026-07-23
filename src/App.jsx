import React, { useState } from 'react';
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
import OrderContext from './components/context/OrderContext';

import { initialAppState } from './utils/initialAppState';
import { initialRouteState } from './utils/initialRouteState';
import { initialOrderState } from './utils/initialOrderState';


export default function App() {
  const [appState, setAppState] = useState(initialAppState);
  const [routeState, setRouteState] = useState(initialRouteState);
  const [orderState, setOrderState] = useState(initialOrderState);
  return (
    <Router >
      <AppContext.Provider value={{ appState, setAppState }}>
        <RouteContext.Provider value={{ routeState, setRouteState }}>
          <OrderContext.Provider value={{ orderState, setOrderState }}>
            <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/order/trains" element={<SelectTrainPage />} />
            <Route path="/order/seats" element={<SelectSeatsPage />} />
            <Route path="/order/passengers" element={<PassengersPage />} />
            <Route path="/order/verification" element={<VerificationPage />} />
            <Route path="/order/payment" element={<PaymentPage />} />
            <Route path="/order/success" element={<SuccessPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </OrderContext.Provider>
        </RouteContext.Provider>
      </AppContext.Provider>
    </Router>
  );
}