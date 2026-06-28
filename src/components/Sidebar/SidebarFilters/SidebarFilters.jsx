// import React, { useState, useContext, useEffect } from 'react';
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
// import Calendar from '../../Calendar/Calendar';
// import AppContext from '../../context/AppContext';
// import { switchFilters } from '../../utils/switchFilters'; 
// import './SidebarFilters.css';


// import luxuryIcon from '../../assets/luxury.png';
// import coupeIcon from '../../assets/coupe.png';
// import platscartIcon from '../../assets/platscart.png';
// import sedentaryIcon from '../../assets/sedentary.png';
// import wifiIcon from '../../assets/wifi.png';
// import expressIcon from '../../assets/express.png';


// import arrowToIcon from '../../assets/arrow-to.png';
// import arrowFromIcon from '../../assets/arrow-from.png';
// import plusIcon from '../../assets/plus.png';
// import minusIcon from '../../assets/minus.png';

// function TrainFilters() {
//   const { appState, setAppState } = useContext(AppContext);
//   const [filters, setFilters] = useState(appState);

//   useEffect(() => {
//     setAppState(filters);
//   }, [filters, setAppState]);

//   const changeDate = value => {
//     setFilters(prev => ({...prev, ...value}));
//   };

//   const handleClickSwitch = value => {
//     setFilters(prev => ({...prev, ...value}));
//   };

//   const handlePrice = value => {
//     setFilters(prev => ({...prev, ...value}));
//   };

//   const handleTimePeriod = value => {
//     setFilters(prev => ({...prev, ...value}));
//   };
