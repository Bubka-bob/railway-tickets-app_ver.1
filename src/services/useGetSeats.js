import useAPI from './useAPI';

export default function useGetSeats({
  departure_id,
  arrival_id,
  have_first_class,
  have_second_class,
  have_third_class,
  have_fourth_class,
  have_wifi
}) {
  const cutObjDeparture = {
    id: departure_id,
    have_first_class,
    have_second_class,
    have_third_class,
    have_fourth_class,
    have_wifi,
  };

  const cutObjArrival = {
    id: arrival_id,
    have_first_class,
    have_second_class,
    have_third_class,
    have_fourth_class,
    have_wifi,
  };

  let params = '';
  for (const key in cutObjDeparture) {
    if (key !== 'id' && cutObjDeparture[key]) {
      params += `${params.length > 0 ? '&' : ''}${key}=${cutObjDeparture[key]}`;
    }
  }

  const resultDeparture = useAPI(
    `https://students.netoservices.ru/railway-tickets-app/routes/${cutObjDeparture.id}/seats?${params}`
  );

  const resultArrival = useAPI(
    `https://students.netoservices.ru/railway-tickets-app/routes/${cutObjArrival.id}/seats?${params}`
  );

   return {
    resultDeparture,
    resultArrival,
  };
}