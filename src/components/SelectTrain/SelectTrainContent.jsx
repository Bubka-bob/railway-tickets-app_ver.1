import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import useGetRoutes from "../../services/useGetRoutes";
import TrainCard from "../../components/TrainCard/TrainCard";
// import FilterSidebar from "../FilterSidebar/FilterSidebar";
import AppContext from "../context/AppContext";
import "./SelectTrainContent.css"; 

export default function SelectTrainContent() {
  const [searchParams] = useSearchParams();
  const { appState } = useContext(AppContext);

  // 1. Собираем параметры из URL, проверяя их наличие (fallback на null/undefined)
  const queryParams = {
    from_city_id: searchParams.get("from_id"),
    to_city_id: searchParams.get("to_id"),
    date_start: searchParams.get("date_out"),
    date_end: searchParams.get("date_in"),
    have_first_class: appState?.have_first_class ? 'true' : null,
    have_second_class: appState?.have_second_class ? 'true' : null,
    have_third_class: appState?.have_third_class ? 'true' : null,
    have_fourth_class: appState?.have_fourth_class ? 'true' : null,
    have_wifi: appState?.have_wifi ? 'true' : null,
    have_express: appState?.have_express ? 'true' : null,
    limit: 10,
    // Фильтры стоимости (передаются только если пользователь что-то ввел)
    price_from: appState?.price_from || null,
    price_to: appState?.price_to || null,
  };

  // 2. Вызываем специализированный хук, передавая объект параметров
  const { result, isLoading, error } = useGetRoutes(queryParams);
 let absoluteMinPrice = 0;
  let absoluteMaxPrice = 0;

  if (result?.items && result.items.length > 0) {
    const allPrices = [];

    result.items.forEach(item => {
      const priceInfo = item.departure?.price_info;
      if (priceInfo) {
        Object.values(priceInfo).forEach(classPrices => {
          // Собираем все возможные цены (верхние, нижние, боковые)
          if (classPrices.top_price) allPrices.push(classPrices.top_price);
          if (classPrices.bottom_price) allPrices.push(classPrices.bottom_price);
          if (classPrices.side_price) allPrices.push(classPrices.side_price);
        });
      }
    });

    if (allPrices.length > 0) {
      absoluteMinPrice = Math.min(...allPrices);
      absoluteMaxPrice = Math.max(...allPrices);
    }
  }

  return (
    <main className="select-train-main container">
      <aside className="filters-sidebar">
      {/* <FilterSidebar/> */}
      </aside>

      <section className="trains-results-section">
        {isLoading && <div className="loading-status">Идет поиск поездов...</div>}
        {error && <div className="error-status">{error}</div>}

        {!isLoading && !error && result && (
          <>
            <div className="results-count">
              Найдено :  {result.items?.length || 0}
            </div>

            <div className="trains-list">
              {result.items && result.items.length > 0 ? (
                result.items.map((train) => (
      /* Передаем объект train внутрь компонента TrainCard через пропс trainData */
      <TrainCard key={train.departure._id} trainData={train} />
    ))
              ) : (
                <div className="no-results">Поездов по данному направлению не найдено.</div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}