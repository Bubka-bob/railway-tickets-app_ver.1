import React from "react";
import MainAbout from "./MainAbout/MainAbout";
import MainWork from "./MainWork/MainWork";
import MainFeedback from "./MainFeedback/MainFeedback";
import "./Main.css";
import WorkbgImage from "../../assets/main-work-image.png";

function Main() {
 const WorktBg = {
     backgroundImage: `url(${WorkbgImage})`,
   } 
  return (
    <main className="main">
      <MainAbout />
      <MainWork style={WorktBg}/>
      <MainFeedback />
    </main>
  );
}

export default Main;