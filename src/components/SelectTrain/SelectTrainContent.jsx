import React from "react";
import { useSearchParams } from "react-router-dom";
import useGetRoutes from "../../services/useGetRoutes";
import TrainCard from "../../components/TrainCard/TrainCard";
import "./SelectTrainContent.css"; // Перенесите сюда стили контента

export default function SelectTrainContent() {
  const [searchParams] = useSearchParams();

  // 1. Собираем параметры из URL, проверяя их наличие (fallback на null/undefined)
  const queryParams = {
    from_city_id: searchParams.get("from_id"),
    to_city_id: searchParams.get("to_id"),
    date_start: searchParams.get("date_out"),
    date_end: searchParams.get("date_in"),
    // Сюда же в будущем можно будет легко дописать фильтры из сайдбара:
    // have_wifi: searchParams.get("wifi"),
    // price_from: searchParams.get("price_from")
  };

  // 2. Вызываем специализированный хук, передавая объект параметров
  const { result, isLoading, error } = useGetRoutes(queryParams);

  return (
    <main className="select-train-main container">
      <aside className="filters-sidebar">
        <h3>Фильтры (В разработке)</h3>
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