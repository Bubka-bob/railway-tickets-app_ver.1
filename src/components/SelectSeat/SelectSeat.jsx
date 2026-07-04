

import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useGetSeats from '../../services/useGetSeats';
import AppContext from '../../components/context/AppContext';
import RouteContext from '../context/RouteContext';
import DirectionSeatsBlock from '../../components/SelectSeat/DirectionSeatsBlock/DirectionSeatsBlock';
import './SelectSeat.css';

export default function SelectSeat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { appState } = useContext(AppContext);
  const { routeState } = useContext(RouteContext); // Извлекаем routeState с настоящими строками данных
  const trainId = searchParams.get('id');

  const { resultDeparture, resultArrival } = useGetSeats({
    departure_id: trainId,
    arrival_id: appState?.arrival_id || null,
    have_first_class: appState?.have_first_class ? 'true' : null,
    have_second_class: appState?.have_second_class ? 'true' : null,
    have_third_class: appState?.have_third_class ? 'true' : null,
    have_fourth_class: appState?.have_fourth_class ? 'true' : null,
    have_wifi: appState?.have_wifi ? 'true' : null,
    have_air_conditioning: appState?.have_air_conditioning ? 'true' : null,
    have_express: appState?.have_express ? 'true' : null,
  });

  return (
    <div className="select-seats-content-flow">
      {(resultDeparture?.isLoading || resultArrival?.isLoading) && <div className="seats-status-msg">Загрузка схем вагонов...</div>}
      {(resultDeparture?.error || resultArrival?.error) && <div className="seats-status-msg error">Ошибка API</div>}

      {!resultDeparture?.isLoading && !resultDeparture?.error && (
        <>
          {/* 🔴 ИСПРАВЛЕНО: Передаем routeData={routeState} вместо trainData */}
          {resultDeparture?.result?.length > 0 && (
            <DirectionSeatsBlock 
              wagons={resultDeparture.result} 
              routeData={routeState} 
              directionType="departure" 
            />
          )}

          {/* 🔴 ИСПРАВЛЕНО: Передаем routeData={routeState} и для обратного пути */}
          {appState?.arrival_id && resultArrival?.result?.length > 0 && (
            <DirectionSeatsBlock 
              wagons={resultArrival.result} 
              routeData={routeState} 
              directionType="arrival" 
              isReturn={true} 
            />
          )}

          {/* ОБЩАЯ КНОПКА ДАЛЕЕ */}
          <div className="bottom-submit-row">
            <button className="main-orange-submit-btn" onClick={() => navigate('/order/passengers')}>
              ДАЛЕЕ
            </button>
          </div>
        </>
      )}
    </div>
  );
}