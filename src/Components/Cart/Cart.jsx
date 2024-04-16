import React, { useState } from "react";
import "./Cart.css";
import { v4 as uuidv4 } from "uuid";
const tg = window.Telegram.WebApp;

function Cart({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  onAdd,
  onRemove,
  updateCartItems,
}) {
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const client_id = params["clientid"];
  console.log(client_id);
  const handleIncrement = (item) => {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );

    updateCartItems(updatedItems);

    onAdd(item);
  };
  const handleDecrement = (item) => {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id && cartItem.quantity > 1
        ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem
    );
    updateCartItems(updatedItems);
    onRemove(item);
  };
  const handleRemoveItem = (item) => {
    const updatedItems = cartItems.filter(
      (cartItem) => cartItem.id !== item.id
    );
    updateCartItems(updatedItems);
  };

  const handlePay = async () => {
    setIsButtonActive(false);
    setIsLoading(true);
    const totalSum = cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    const resultArray = cartItems.map((item) => {
      return `${item.title} - ${item.quantity} шт.\n`;
    });
    const resultString = resultArray.join("");
    const dataApp = {
      title: resultString,
      summa: totalSum,
      order_status: "Не оплачен",
      id: uuidv4(),
    };

    const formData = new FormData();
    for (const key in dataApp) {
      formData.append(key, dataApp[key]);
    }

    await fetch(
      "https://chatter.salebot.pro/api/5fb9c27a22cd175bf2aa46f1e6590d9f/save_variables",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: client_id,
          variables: {
            shop: dataApp.id,
            title: dataApp.title,
            summa: dataApp.summa,
          },
        }),
        mode: "no-cors",
      }
    );
    await fetch(
      "https://chatter.salebot.pro/api/5fb9c27a22cd175bf2aa46f1e6590d9f/callback",
      {
        method: "post",
        body: JSON.stringify({
          client_id: client_id,
          message: `Формирование корзины`,
          mode: "no-cors",
        }),
      }
    );
    await tg.close();
    
  };
  return (
    <div className={`cart ${isOpen ? "open" : ""}`}>
      <div className="cart-content">
        <h2>Корзина товаров</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart_item_content">
              <div className="cart_item_remove">
                <img
                  className="cart_item_img"
                  src={item.image}
                  alt={item.title}
                />
                <p className="item_price">{item.price} руб.</p>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="remove_item"
                >
                  Удалить товар
                </button>
              </div>
              <div className="item_content_text">
                <p className="item_title">{item.title}</p>
                <p className="quantity">Количество:</p>
                <div className="quantity_container">
                  <button
                    className="add_item"
                    onClick={() => handleDecrement(item)}
                  >
                    -
                  </button>
                  {item.quantity}
                  <button
                    className="add_item"
                    onClick={() => handleIncrement(item)}
                  >
                    +
                  </button>
                </div>

                <div className="item_content_price">
                  <p className="price">
                    Сумма: {item.price * item.quantity} руб.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="summa">Сумма заказа: {totalPrice} руб.</div>
        <button className="btn_close" onClick={onClose}>
          Возврат в каталог
        </button>
        <button
          className="btn_pay"
          onClick={handlePay}
          disabled={!isButtonActive}
        >
          {isLoading ? "Ожидайте..." : "Перейти к оплате"}
        </button>
        button
      </div>
    </div>
  );
}

export default Cart;
