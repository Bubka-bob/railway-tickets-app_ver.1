import React from "react";
import Header from "../../components/Header/Header";
import Main from "../../components/Main/Main";
import Footer from "../../components/Footer/Footer";

import startbgImage from "../../assets/header-base-image.png";

function StartPage() {
  const startBg = {
    backgroundImage: `url(${startbgImage})`,
  }

  return (
    <>
  
      <Header style={startBg}/>
      <Main />
      <Footer />
    </>
  );
}

export default StartPage;