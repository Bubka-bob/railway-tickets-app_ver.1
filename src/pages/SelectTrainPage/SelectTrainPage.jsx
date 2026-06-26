import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import OrderbgImage from "../../assets/header-order-image.png";
import SelectTrainContent from "../../components/SelectTrain/SelectTrainContent";
import HeaderProgressBar from "../../components/Header/HeaderProgressBar/HeaderProgressBar";


 

export default function SelectTrainPage() {
  const OrdertBg = {
    backgroundImage: `url(${OrderbgImage})`,
  }

  return (
    <>
      <Header style={OrdertBg} variant="select"/>
       <HeaderProgressBar currentStep={1} />
      <SelectTrainContent/>
      <Footer />
    </>
  );
}

