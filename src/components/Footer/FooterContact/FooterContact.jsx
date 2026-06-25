/* eslint-disable-next-line no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { contacts } from "../../../utils/contacts";
import "./FooterContact.css";

function FooterContact() {
  return (
    <div className="footer-contact contact">
      <p className="contact__title">Свяжитесь с нами</p>
      <ul className="contact__list">
        {contacts.map((item, i) => {
          return (
            <li className="contact__item" key={i}>
              <Link to={item.href} target="_blank" className="contact__link">
                <img src={item.src} alt={item.alt} className="contact__image"></img>
                <p className="contact__desc">{item.desc}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default FooterContact;
