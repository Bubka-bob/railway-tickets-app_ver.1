import React from "react";
import MainSlider from "../MainSlider/MainSlider";
import "./MainFeedback.css";

function MainFeedback() {
  return (
    <div className="main-feedback feedback" id="feedbacks">
      <div className="container">
        <div className="feedback__wrapper">
          <p className="feedback__title">Отзывы</p>
          <div className="feedback__swiper-container">
            <MainSlider/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainFeedback;