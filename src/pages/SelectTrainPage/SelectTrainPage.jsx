import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import OrderbgImage from "../../assets/header-order-image.png";
import SelectTrainContent from "../../components/SelectTrain/SelectTrainContent"

 

export default function SelectTrainPage() {
  const OrdertBg = {
    backgroundImage: `url(${OrderbgImage})`,
  }

  return (
    <>
      <Header style={OrdertBg} variant="select"/>
      <SelectTrainContent/>
      <Footer />
    </>
  );
}

