import React from "react";
import Feedback from "../../Feedbacks/Feedbacks";
import { feedbacks } from "../../../utils/feedbacks";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./MainSlider.css";

function MainSlider() {
  return (
    <Swiper
      slidesPerView={2}
      spaceBetween={90}
      pagination={{clickable: true}}
      modules={[Pagination]}
      className="swiper"
    >
      {feedbacks.map((item, i) => <SwiperSlide key={i}><Feedback {...item}/></SwiperSlide>)}
    </Swiper>
  );
}

export default MainSlider;