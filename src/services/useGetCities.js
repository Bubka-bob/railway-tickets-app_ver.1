import useAPI from "./useAPI";

export default function useGetCities(value) {
  const { result, isLoading } = useAPI(`https://students.netoservices.ru/fe-diplom/routes/cities?name=${value}`);
  return { result, isLoading };
}