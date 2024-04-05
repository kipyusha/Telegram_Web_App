import React from 'react'
import Button from "../Button/Button";
import "./ButtonAddRemove.css";
const ButtonAddRemove = ({count, handleDecrement, handleIncrement}) => {
  return (
    <div className="btn-container">
        {count !== 0 ? (
          <Button title={"-"} type={"remove"} onClick={handleDecrement} />
        ) : (
          ""
        )}
        <Button title={"+"} type={"add"} onClick={handleIncrement} />
      </div>
  )
}

export default ButtonAddRemove