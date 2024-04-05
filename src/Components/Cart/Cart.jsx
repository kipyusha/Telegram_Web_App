import React from "react";
import "./Cart.css";
import axios from "axios";
function Cart({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  onAdd,
  onRemove,
  updateCartItems,
}) {
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
    const totalSum = cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    const resultArray = cartItems.map((item) => {
      return `${item.title} - ${item.price} руб. ${item.quantity} шт.`;
    });
    resultArray.push(`Общая сумма: ${totalSum} руб.`);
    const data = resultArray.join("\n");
    await axios({
      method: "post",
      url: "https://chatter.salebot.pro/api/9a1e4f7aec6c8f6623b849b493521b1c/message",
      params: {
        message: `${data}`,
        client_id: "354868984",
      },
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    await axios({
      method: "post",
      url: "https://chatter.salebot.pro/api/9a1e4f7aec6c8f6623b849b493521b1c/tg_callback",
      params: {
        message: `Оплата корзины hgfghjklk23`,
        user_id : "543677918",
        group_id: "WebSensei_bot"
      },
    });
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
                    Цена: {item.price * item.quantity} руб.
                  </p>
                </div>
                <button
                  className="remove_item"
                  onClick={() => handleRemoveItem(item)}
                >
                  Убрать товар
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="summa">Сумма заказа: {totalPrice} руб.</div>

        <button className="btn_close" onClick={onClose}>
          X
        </button>
        <button className="btn_pay" onClick={handlePay}>
          Перейти к оплате
        </button>
      </div>
    </div>
  );
}

export default Cart;
