import useAPI from "./useAPI";

export default function useGetRoutes({ ...rest }) {
  const params = [];

  for (const key in rest) {
    if (rest[key]) {
      params.push(`${key}=${rest[key]}`);
    }
  }

  const hasRequiredParams = ['from_city_id', 'to_city_id'].every(param => params.some(p => p.startsWith(param)));

  const { result, isLoading, error } = useAPI(
    hasRequiredParams ?
      `https://students.netoservices.ru/fe-diplom/routes?${params.join('&')}` :
      null
  );

  return { result, isLoading, error };
}