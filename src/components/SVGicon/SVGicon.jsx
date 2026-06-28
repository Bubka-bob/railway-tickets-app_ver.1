/* eslint-disable-next-line no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import Icon from "./SVGicon.svg";

function SVGicon({ name }) {
  return(
    <svg 
      className={`icon icon-${name}`} 
      fill="currentColor" 
      stroke="transparent" 
    >
      <use xlinkHref={`${Icon}#icon-${name}`} />
    </svg>
  )
}

export default SVGicon;

SVGicon.propTypes = {
  name: PropTypes.string.isRequired, 
};
