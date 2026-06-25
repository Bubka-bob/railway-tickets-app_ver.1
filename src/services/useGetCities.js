import useAPI from "./useAPI";

// export default function useGetCities(value) {
//   const trimmedValue = value ? value.trim() : "";

 
//   const shouldFetch = trimmedValue.length >= 2;
  
//   const url = shouldFetch 
//     ? `https://students.netoservices.ru/fe-diplom/routes/cities?name=${encodeURIComponent(trimmedValue)}`
//     : null; 

//   const { result, isLoading, error } = useAPI(url);

  
//   return { 
//     result: Array.isArray(result) ? result : [], 
//     isLoading: shouldFetch ? isLoading : false,
//     error 
//   };
// }
export default function useGetCities(value) {
  const { result, isLoading } = useAPI(`https://students.netoservices.ru/fe-diplom/routes/cities?name=${value}`);
  return { result, isLoading };
}