import React, { useState } from "react";
import "./Card.css";
import ButtonAddRemove from "./ButtonAddRemove";

function Card({ food, onAdd, onRemove}) {
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { title, image, price, id, description, count } = food;
  
  

  const handleIncrement = () => {
    
    onAdd(food);
  };

  const handleDecrement = () => {
    
    onRemove(food);
  };

  const handleOpenProductDetails = (food) => {
    setSelectedProduct(food);
  };

  const handleCloseProductDetails = () => {
    setSelectedProduct(null);
  };
  return (
    <>
      <div
        className="card"
        key={id}
      >
        <div onClick={() => handleOpenProductDetails(food)}>
          <div className="image__container">
            <img src={image} alt={title} />
          </div>
          <h4 className="card__title">{title}</h4>
          <p className="card__price">{price} руб.</p>
        </div>
        <span
          className={`${count !== 0 ? "card__badge" : "card__badge--hidden"}`}
        >
          {food.count}
        </span>  
        <ButtonAddRemove
          count={food.count}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
          
        />
      </div>
      {selectedProduct && (
        <div className="product-details">
          <img className="product-details-img" src={image} alt={title} />
          <h2 className="product-details-title">{selectedProduct.title}</h2>
          <p className="product-details-price">
            Цена: {selectedProduct.price} руб.  
          </p>
          <p className="product-details-description">
          {description}
          </p>
          <button
            className="product-details-close"
            onClick={handleCloseProductDetails}
          >
            X
          </button>
          <div className="product-details-count">
            <ButtonAddRemove
              count={food.count}
              handleDecrement={handleDecrement}
              handleIncrement={handleIncrement}
              selectedProduct= {selectedProduct}
            />
            
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
