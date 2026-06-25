/* eslint-disable-next-line no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import "./FooterCopyright.css";

function FooterCopyright() {
  const handlerScrollUp = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="footer-copyright copyright">
      <div className="container copyright-container">
        <Link to="#" className="copyright-logo__link">Лого</Link>
        <button className="copyright-top-btn" type="button" onClick={handlerScrollUp}></button>
        <p className="copyright-info">2026 WEB</p>
      </div>
    </div>
  );
}

export default FooterCopyright;
