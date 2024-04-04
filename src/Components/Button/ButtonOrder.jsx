import React, { useState } from 'react';
import "./ButtonOrder.css"
import Cart from '../Cart/Cart';
const ButtonOrder = ({cartItems, onAdd, onRemove, updateCartItems}) => {
    
    const [isCartOpen, setCartOpen] = useState(false);
    const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
    const openCart = () => {
        setCartOpen(true);
      };
    
      // Функция для закрытия корзины
      const closeCart = () => {
        setCartOpen(false);
      };
  return (
    <div className="cart__container">
      {cartItems.length === 0 ? "В корзине нет товаров" : ""}
      {cartItems.length !== 0 ? <span className="">Стоимость: {totalPrice.toFixed(2)} руб.</span> : ""}
      
      <button className='buttonOrder' onClick={openCart}>Корзина</button>
      <Cart isOpen={isCartOpen} onClose={closeCart} cartItems={cartItems} totalPrice={totalPrice} onAdd={onAdd} onRemove={onRemove} updateCartItems={updateCartItems}/>
    </div>
    
  )
}

export default ButtonOrder