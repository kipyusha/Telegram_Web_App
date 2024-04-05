import React, { useState } from "react";
import "./Card.css";
import ButtonAddRemove from "./ButtonAddRemove";

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

  return (
    <div className="card" key={id}>
      <div>
        <div className="image__container">
          <img src={image} alt={title} /> 
        </div>
        <h4 className="card__title">{title}</h4>
        <p className="card__price">{price} руб.</p>
      </div>
      <span
        className={`${count !== 0 ? "card__badge" : "card__badge--hidden"}`}
      >
        {count}
      </span>
      <ButtonAddRemove
        count={count}
        handleDecrement={handleDecrement}
        handleIncrement={handleIncrement}
      />
    </div>
  );
}

export default Card;
