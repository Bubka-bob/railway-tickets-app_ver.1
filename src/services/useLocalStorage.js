import { useState, useEffect } from 'react';

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;
      
      return JSON.parse(item);
    } catch(error) {
      console.error('Ошибка чтения локального хранилища:', error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch(error) {
      console.error('Ошибка записи в локальное хранилище:', error);
    }
  }, [value]);

  return [value, setValue];
}

export default useLocalStorage;