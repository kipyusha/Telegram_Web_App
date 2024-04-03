import React, { useState } from "react";
import "./Card.css";
import Button from "../Button/Button";
function Card({ food, onAdd, onRemove }) {
  const [count, setCount] = useState(0);
  const { title, image, price, id } = food;

  const handleIncrement = () => {
    setCount(count + 1);
    onAdd(food);
  };
  const handleDecrement = () => {
    setCount(count - 1);
    onRemove(food);
  };
  console.log(image);
  return (
    <div className="card" key={id}>
      <span
        className={`${count !== 0 ? "card__badge" : "card__badge--hidden"}`}
      >
        {count}
      </span>
      <div className="image__container">
        <img src={image} alt={title} />
      </div>
      <h4 className="card__title">
        {title} . <span className="card__price">{price} руб.</span>
      </h4>

      <div className="btn-container">
        {count !== 0 ? (
          <Button title={"-"} type={"remove"} onClick={handleDecrement} />
        ) : (
          ""
        )}
        <Button title={"+"} type={"add"} onClick={handleIncrement} />
      </div>
    </div>
  );
}

export default Card;
