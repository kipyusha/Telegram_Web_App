import React from "react";
import "./Cart.css";
import axios from "axios";

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
    console.log(item)
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
  const isButtonActive =  cartItems.length > 0;
  
  const handlePay = async () => {
    tg.close();
    
    const totalSum = cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    const resultArray = cartItems.map((item) => {
      return `${item.title} - ${item.price} руб. ${item.quantity} шт.`;
    });
    resultArray.push(`Общая сумма: ${totalSum} руб.`);
    const data = resultArray.join("\n");
    console.log(data)
    await axios({
      method: "post",
      url: "https://chatter.salebot.pro/api/20f0537f4eb89acd70970e74778f3205/message",
      params: {
        message: `${data}`,
        client_id: client_id,
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await axios({
      method: "post",
      url: "https://chatter.salebot.pro/api/20f0537f4eb89acd70970e74778f3205/tg_callback",
      params: {
        message: `Оплата корзины hgfghjklk23`,
        user_id: platform_id,
        group_id: "WebSensei_bot",
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
                <p className="item_title">{item.title} Цена: {item.price} руб.</p>
                <div className="item_content_price">
                  
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
          X
        </button>
        <button className="btn_pay" onClick={handlePay} disabled={!isButtonActive}>
          Перейти к оплате
        </button>
      </div>
    </div>
  );
}

export default Cart;
