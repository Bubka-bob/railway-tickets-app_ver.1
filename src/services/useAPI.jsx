import { useEffect, useState } from 'react';

const useAPI = (url) => {
  const [result, setResult] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;
   
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (!isCancelled) {
          setResult(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (!isCancelled) {
          setError('Возникла проблема с загрузкой данных.');
          setLoading(false);
        }
      });
      
    return () => {
      isCancelled = true;
    };
  }, [url]);

  return { result, isLoading, error };
};

export default useAPI;
