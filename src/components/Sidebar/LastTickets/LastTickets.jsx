import React, { useState, useEffect } from 'react';
import SVGicon from '../../SVGicon/SVGicon';
import './LastTickets.css';

const LastTickets = () => {
  const [tickets, setTickets] = useState([]);
const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('https://students.netoservices.ru/fe-diplom/routes/last');
        if (!res.ok) throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
        const json = await res.json();
        setTickets(json.data);
      // Сервер отдает массив внутри ключа data, страхуемся на случай пустого ответа
        if (json && Array.isArray(json)) {
          setTickets(json);
        } else if (json && Array.isArray(json.data)) {
          setTickets(json.data);
        }
      } catch (err) {
        console.error("Ошибка загрузки последних билетов:", err.message);
      } finally {
        setIsLoading(false); // Загрузка завершена в любом случае
      }
    };

    fetchTickets();
  }, []);

  if (isLoading) {
    return <div className="last-tickets__status">Загрузка последних билетов...</div>;
  }
  return (
    <div className="order-last-tickets last-tickets">
      <h2 className="last-tickets__title">Последние билеты</h2>
      <div className="last-tickets__wrapper">
        {tickets.length > 0 ? tickets.map(ticket => (
          <div className="last-tickets__item ticket-item" key={ticket.departure._id}>
            <div className="ticket-item__city">
              <p className="ticket-item__from_city">{ticket.departure.from.city.name}</p>
              <p className="ticket-item__to_city">{ticket.departure.to.city.name}</p>
            </div>
            
            <div className="ticket-item__railway">
              <p className="ticket-item__from_railway">{ticket.departure.from.railway_station_name}</p>
              <p className="ticket-item__to_railway">{ticket.departure.to.railway_station_name}</p>
            </div>
            
            <div className="ticket-item__options">
              {['have_wifi', 'have_air_conditioning'].filter(key => ticket.departure[key]).map((key, index) => (
                <div className="ticket-item__option" key={index}>
                  <SVGicon name={key} />
                </div>
              ))}
            </div>
            
            <p className="ticket-item__cost">
              от
              <span className="ticket-item__cost-value">{ticket.departure.min_price}</span>
              <span className="ticket-item__cost-currency">₽</span>
            </p>
          </div>
        )) : (
          <p>Последние билеты не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default LastTickets;