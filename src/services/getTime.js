import moment from 'moment';
import 'moment/locale/ru';


export default function msecToString(value) {
  return moment(value).format('LT'); 
}