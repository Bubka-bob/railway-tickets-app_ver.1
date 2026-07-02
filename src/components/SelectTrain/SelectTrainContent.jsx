
import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import useGetRoutes from '../../services/useGetRoutes';
import TrainCard from '../../components/TrainCard/TrainCard';
import SidebarFilters from '../Sidebar/SidebarFilters/SidebarFilters';
import AppContext from '../context/AppContext';
import './SelectTrainContent.css';
import LastTickets from "../Sidebar/LastTickets/LastTickets"

import luxuryIcon from '../../assets/luxury.png';
import coupeIcon from '../../assets/coupe.png';
import platscartIcon from '../../assets/platscart.png';
import sedentaryIcon from '../../assets/sedentary.png';
import wifiIcon from '../../assets/wifi.png';
import expressIcon from '../../assets/express.png';

// Импорт иконок для блоков направления
import arrowToIcon from '../../assets/arrow-to.png';
import arrowFromIcon from '../../assets/arrow-from.png';
import plusIcon from '../../assets/plus.png';
import minusIcon from '../../assets/minus.png';

export default function SelectTrainContent() {
  const [searchParams] = useSearchParams();
  const { appState, setAppState } = useContext(AppContext);

  // Сбор параметров из URL и контекста
  const queryParams = {
    from_city_id: searchParams.get('from_id'),
    to_city_id: searchParams.get('to_id'),
    date_start: searchParams.get('date_out'),
    date_end: searchParams.get('date_in'),
    have_first_class: appState?.have_first_class ? 'true' : undefined,
    have_second_class: appState?.have_second_class ? 'true' : undefined,
    have_third_class: appState?.have_third_class ? 'true' : undefined,
    have_fourth_class: appState?.have_fourth_class ? 'true' : undefined,
    have_wifi: appState?.have_wifi ? 'true' : undefined,
    have_air_conditioning: appState?.have_air_conditioning ? 'true' : undefined,
    have_express: appState?.have_express ? 'true' : undefined,
    price_from: appState?.price_from || null,
    price_to: appState?.price_to || null,
    start_departure_hour_from: appState?.departure_hour_from,
    start_departure_hour_to : appState?.departure_hour_to,
    start_arrival_hour_from: appState?.arrival_hour_from,
    start_arrival_hour_to: appState?.arrival_hour_to,
    end_departure_hour_from: appState?.departure_hour_from_return,
    end_departure_hour_to: appState?.departure_hour_to_return,
    end_arrival_hour_from: appState?.arrival_hour_from_return,
    end_arrival_hour_to: appState?.arrival_hour_to_return,
    limit: 10
  };

  // Данные с сервера
  const { result, isLoading, error } = useGetRoutes(queryParams, [appState]);

  // Вычисляемые диапазоны цен
  let absoluteMinPrice = null;
  let absoluteMaxPrice = null;

  if (result?.items && Array.isArray(result.items)) {
    result.items.forEach((item) => {
      const prices = Object.entries(item.departure?.price_info ?? {});
      prices.forEach(([className, priceObj]) => {
        if (!priceObj) return;
        if (className === 'first' && priceObj.price !== undefined) {
          absoluteMinPrice = Math.min(absoluteMinPrice, priceObj.price);
          absoluteMaxPrice = Math.max(absoluteMaxPrice, priceObj.price);
        }
        if (priceObj.top_price !== undefined) {
          absoluteMinPrice = Math.min(absoluteMinPrice, priceObj.top_price);
          absoluteMaxPrice = Math.max(absoluteMaxPrice, priceObj.top_price);
        }
        if (priceObj.bottom_price !== undefined) {
          absoluteMinPrice = Math.min(absoluteMinPrice, priceObj.bottom_price);
          absoluteMaxPrice = Math.max(absoluteMaxPrice, priceObj.bottom_price);
        }
        if (priceObj.side_price !== undefined) {
          absoluteMinPrice = Math.min(absoluteMinPrice, priceObj.side_price);
          absoluteMaxPrice = Math.max(absoluteMaxPrice, priceObj.side_price);
        } 
        });
    });
  }

  return (
    <main className="select-train-main container">
      <aside className="filters-sidebar">
        <SidebarFilters
         appState={setAppState}
          setAppState={setAppState}
          absoluteMinPrice={absoluteMinPrice === Infinity ? 0 : absoluteMinPrice}
          absoluteMaxPrice={absoluteMaxPrice}  />
        <LastTickets/>
      </aside>

      <section className="trains-results-section">
        {isLoading && <div>Поиск рейсов...</div>}
        {error && <div>Ошибка: {error}</div>}

        {!isLoading && !error && result && (
          <>
            <div className="results-count">
              Найдено: {result.items?.length || 0}
            </div>

            <div className="trains-list">
              {result.items.map((train) => (
                <TrainCard key={train.departure._id} trainData={train} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}