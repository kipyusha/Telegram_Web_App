import React, {useState} from "react";
import "./Cart.css";
import axios from "axios";

function Cart({ isOpen, onClose, cartItems, totalPrice, onAdd, onRemove, updateCartItems  }) {
  const [response, setResponse] = useState(null);
  
    
  
  const handleIncrement = (item) => {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    updateCartItems(updatedItems)
    
    onAdd(item);
    
  };

  const handleDecrement = (item) => {
    const updatedItems = cartItems.map((cartItem) =>
      cartItem.id === item.id && cartItem.quantity > 1
        ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem
    );
    updateCartItems(updatedItems)
    onRemove(item);
    
  };

  const handleRemoveItem = (item) => {
    const updatedItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
    updateCartItems(updatedItems)
    
  };
  const token = 'b551e18c8b8e86bea6f14f38de3f5cc3c31ba1edb4d8'
  const sendData = async () => {
    try {
      const response = await axios.post(`https://chatter.salebot.pro/api/${token}/callback`, {
        data: "Заказ выполнен"
      });
      setResponse(response.data); // Установка ответа от сервера
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };
  


  return (
    <div  className={`cart ${isOpen ? "open" : ""}`}>
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
          <button className="btn_pay" onClick={sendData}>
            Перейти к оплате
          </button>
        
      </div>
    </div>
  );
}

export default Cart;
