/* eslint-disable-next-line no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { socials } from "../../../utils/socials";
import ValidationEmail from "../../../services/ValidationEmail";
import Modal from "../../Modal/Modal";
import "./FooterSubscribe.css";

function FooterSubscribe() {
  const [value, setValue] = useState("");
  const [valid, setValid] = useState(false);
  const [modal, setModal] = useState("none");
  const [status, setStatus] = useState("");

  const handleEmail = (e) => {
    e.preventDefault();
    e.target.nextElementSibling.style.display = ValidationEmail(e.target.value) ? "none" : "block";
    e.target.nextElementSibling.nextElementSibling.disabled = ValidationEmail(e.target.value) ? false : true;
  };

  const handleClick = (e) => {
    e.preventDefault();
    const input = e.target.previousElementSibling.previousElementSibling;
    if (!input.value.trim()) return;
    setValue(input.value);
    setValid(true);
    input.value = "";
  };

  const handleModal = (value) => setModal(value);

  const modalInfo = (value) => {
    return value && value === "info" ?
      <Modal status={"info"} display={modal} text={"Вы успешно подписались на рассылку"} onChange={handleModal} /> :
      <Modal status={"error"} display={modal} text={"Ошибка! Сервер недоступен. Пожалуйста, попробуйте позже"} onChange={handleModal} />
  };

  useEffect(() => {
    if (!valid) return;
    setStatus("");
    fetch("https://students.netoservices.ru/fe-diplom/subscribe", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: value }),
    })
      .then(response => response.json())
    /* eslint-disable-next-line no-unused-vars */
      .then(data => {
        setStatus("info");
        setModal("flex");
      })
    /* eslint-disable-next-line no-unused-vars */
      .catch((e) => {
        setStatus("error");
        setModal("flex");
      });
    setStatus("");
    setValid(true);
  }, [valid, value]);


  return (
    <div className="footer-subscribe subscribe">
      <p className="subscribe__title">Подписка</p>
      <p className="subscribe__subtitle">Будьте в курсе событий</p>
      <div className="subscribe__form-wrapper">
        <form className="subscribe__form">
          <div className="subscribe__form-content">
            <input
              className="subscribe__input"
              type="email"
              name="email"
              placeholder="e-mail"
              onInput={handleEmail}
              required
            />
            <span className="subscribe__input-error">
              Введите e-mail в формате example@site.com
            </span>
            <button className="subscribe__button" onClick={handleClick}>Отправить</button>
          </div>
        </form>
      </div>

      <div className="subscribe__social">
        <p className="subscribe__social-title">Подписывайтесь на нас</p>
        <ul className="subscribe__social-list">
          {socials.map((item, i) => {
            return (
              <li className="subscribe__social-item" key={i}>
                <Link to={item.href} target="_blank" className="subscribe__social-link">
                  <img src={item.src} alt={item.alt} className="subscribe__social-image" />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      {modalInfo(status)}
    </div>
  );
}

export default FooterSubscribe;
