import useAPI from './useAPI';

export default function useGetSeats(queryParams) {
  const {
    departure_id,
    arrival_id,
    have_first_class,
    have_second_class,
    have_third_class,
    have_fourth_class,
    have_wifi
  } = queryParams || {};

  // Формируем query-параметры фильтрации вагонов через встроенный браузерный класс
  const searchParams = new URLSearchParams();
  if (have_first_class) searchParams.append('have_first_class', have_first_class);
  if (have_second_class) searchParams.append('have_second_class', have_second_class);
  if (have_third_class) searchParams.append('have_third_class', have_third_class);
  if (have_fourth_class) searchParams.append('have_fourth_class', have_fourth_class);
  if (have_wifi) searchParams.append('have_wifi', have_wifi);

  const paramString = searchParams.toString();
  const querySuffix = paramString ? `?${paramString}` : '';

  // 1. Запрос мест для поезда ТУДА (отправляется только если есть ID)
  // ВАЖНО: Проверьте эндпоинт! Если railway-tickets-app выдаст 404, замените на fe-diplom
  const baseUrlDeparture = departure_id 
    ? `https://students.netoservices.ru/fe-diplom/routes/seats?${querySuffix}`
    : null;
  const resultDeparture = useAPI(baseUrlDeparture);

  // 2. Запрос мест для поезда ОБРАТНО (строго при наличии arrival_id)
  const baseUrlArrival = arrival_id 
    ? `https://students.netoservices.ru/fe-diplom/routes/{id}/seats?${querySuffix}`
    : null;
  const resultArrival = useAPI(baseUrlArrival);

  return {
    resultDeparture,
    resultArrival,
  };
}