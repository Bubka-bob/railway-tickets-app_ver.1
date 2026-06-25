import React from "react";
import "./MainWork.css";
import workImg1 from "../../../assets/main-work-icon-1.png";
import workImg2 from "../../../assets/main-work-icon-2.png";
import workImg3 from "../../../assets/main-work-icon-3.png";

function MainWork({style}) {
  return (
    <div className="main-work work" id="howitworks" style={style}>
      <div className="container">
        <div className="work__content-wrapper">
          <p className="work__title">Как это работает</p>
          <div className="work__btn-wrapper">
            <button className="work__btn">Узнать больше</button>
          </div>
          <div className="work__list">
            <div className="work__item">
              <img src={workImg1} alt="Удобный заказ на сайте"></img>
              <p className="work__item-text">Удобный заказ <br/> на сайте</p>
            </div>
            <div className="work__item">
              <img src={workImg2} alt="Нет необходимости ехать в офис"></img>
              <p className="work__item-text">Нет необходимости <br/> ехать в офис</p>
            </div>
            <div className="work__item">
              <img src={workImg3} alt="Огромный выбор направлений"></img>
              <p className="work__item-text">Огромный выбор <br/> направлений</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainWork;