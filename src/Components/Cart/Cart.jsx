import React from "react";
import "./Cart.css";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
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
  const uniqueId = uuidv4();
  const currentUrl = window.location.href;
  const urlParts = currentUrl.split("?");
  const queryParams = urlParts[1].split("&");
  const params = {};
  queryParams.forEach(function (param) {
    const paramParts = param.split("=");
    const key = decodeURIComponent(paramParts[0]);
    const value = decodeURIComponent(paramParts[1]);
    params[key] = value;
  });

  const client_id = params["clientid"];
  const platform_id = params["user_id"];
  const handleIncrement = (item) => {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    console.log(item);
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
  const isButtonActive = cartItems.length > 0;

  const handlePay = async () => {
    const totalSum = cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    const resultArray = cartItems.map((item) => {
      return `${item.title} - ${item.quantity} шт.\n`;
    });
    const resultString = resultArray.join('');
    const dataApp = {
      id: uuidv4(),
      title: resultString,
      price: totalSum,
      order_status: "Не оплачен",
      id_telegram: platform_id
    };
    
    const formData = new FormData();
    for (const key in dataApp) {
      formData.append(key, dataApp[key]);
    }

    const webAppURL = process.env.REACT_APP_API_KEY;
    await fetch(
      "https://chatter.salebot.pro/api/939524cc55ca5af63a34f6179099165f/save_variables",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: client_id,
          variables: {
            shop: dataApp.id,
          },
        }),
        mode: "no-cors",
      }
    )
      .catch((error) => {
        console.error("Error:", error);
      });
    await fetch(webAppURL, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .catch((error) => {
        console.error("Error:", error);
      });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await tg.close();

    await axios({
      method: "post",
      url: "https://chatter.salebot.pro/api/939524cc55ca5af63a34f6179099165f/callback",
      params: {
        client_id: client_id,
        message: `Формирование корзины`,
      },
    });

    console.log("Вызов закрытия");
  };
  return (
    <div className={`cart ${isOpen ? "open" : ""}`}>
      <div className="cart-content">
        {/* Здесь будет содержимое корзины */}
        <h2>Корзина товаров</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart_item_content">
              <img src={item.image} alt={item.title} />
              <div className="item_content_text">
                <p className="item_title">{item.title}</p>
                <div className="quantity_container">
                  <p className="quantity">Количество: {item.quantity}</p>
                  <button
                    className="add_item"
                    onClick={() => handleDecrement(item)}
                  >
                    -
                  </button>
                  <button
                    className="add_item"
                    onClick={() => handleIncrement(item)}
                  >
                    +
                  </button>
                </div>
                <p className="item_title">Цена: {item.price} руб.</p>
                <div className="item_content_price">
                  <p className="price">
                    Сумма: {item.price * item.quantity} руб.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveItem(item)}
                className="remove_item"
              >
                Удалить товар
              </button>
            </div>
          </div>
        ))}
        <div className="summa">Сумма заказа: {totalPrice} руб.</div>

        <button className="btn_close" onClick={onClose}>
          X
        </button>
        <button
          className="btn_pay"
          onClick={handlePay}
          disabled={!isButtonActive}
        >
          Перейти к оплате
        </button>
      </div>
    </div>
  );
}

export default Cart;
