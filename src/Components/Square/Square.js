import React from "react";
import './Square.css'

function Square(props) {
  if (props.value === 'X') {
    return (
      <button 
        className="square x-class" 
        onClick={props.onClick}>
          {props.value}
      </button>
      );  
  }
    return (
      <button 
        className="square o-class" 
        onClick={props.onClick}>
          {props.value}
      </button>
      );  
  }

export default Square

