import useAPI from './useAPI';

export default function useGetSeats(queryParams) {
  const {
    departure_id,
    arrival_id,
    have_first_class,
    have_second_class,
    have_third_class,
    have_fourth_class,
    have_wifi,
    have_air_conditioning,
    have_express
  } = queryParams || {};

  // Формируем query-параметры фильтрации вагонов
  const searchParams = new URLSearchParams();
  if (have_first_class) searchParams.append('have_first_class', have_first_class);
  if (have_second_class) searchParams.append('have_second_class', have_second_class);
  if (have_third_class) searchParams.append('have_third_class', have_third_class);
  if (have_fourth_class) searchParams.append('have_fourth_class', have_fourth_class);
  if (have_wifi) searchParams.append('have_wifi', have_wifi);
  if (have_air_conditioning) searchParams.append('have_air_conditioning', have_air_conditioning);
  if (have_express) searchParams.append('have_express', have_express);

  const paramString = searchParams.toString();
  const querySuffix = paramString ? `?${paramString}` : '';

  // 1. ИСПРАВЛЕНО: Передаем departure_id и убрали лишний слеш перед знаком вопроса
  const baseUrlDeparture = departure_id 
    ? `https://students.netoservices.ru/fe-diplom/routes/${departure_id}/seats${querySuffix}`
    : null;
  const resultDeparture = useAPI(baseUrlDeparture);

  // 2. ИСПРАВЛЕНО: Передаем arrival_id для обратного направления
  const baseUrlArrival = arrival_id 
    ? `https://students.netoservices.ru/fe-diplom/routes/${arrival_id}/seats${querySuffix}`
    : null;
  const resultArrival = useAPI(baseUrlArrival);

  return {
    resultDeparture,
    resultArrival,
  };
}