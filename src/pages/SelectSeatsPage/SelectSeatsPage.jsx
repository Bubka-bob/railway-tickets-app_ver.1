import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import OrderbgImage from "../../assets/header-order-image.png";
import HeaderProgressBar from "../../components/Header/HeaderProgressBar/HeaderProgressBar";
import SelectSeat from "../../components/SelectSeat/SelectSeat"

 

export default function SelectSeatsPage() {
  const OrdertBg = {
    backgroundImage: `url(${OrderbgImage})`,
  }

  return (
    <>
      <Header style={OrdertBg} variant="select"/>
       <HeaderProgressBar currentStep={1} />
      <SelectSeat/> 
      <Footer />
    </>
  );
}
