import moment from 'moment';
import 'moment/locale/ru';

export default function getTime(timestamp) {
  if (!timestamp) return '00:00';
  
  // Устанавливаем русскую локаль, чтобы не было AM/PM
  moment.locale('ru');
  
  // ИССПРАВЛЕНО: используем .unix() вместо обычного moment(), 
  // чтобы секунды бэкенда умножались на 1000 автоматически
  return moment.unix(timestamp).format('HH:mm'); 
}