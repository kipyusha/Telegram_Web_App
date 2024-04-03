import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
const { getData } = require("./db/db");
const foods = getData();

const tg = window.Telegram.WebApp;
tg.expand();

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    tg.ready();
  });

  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  const onCheckout = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get("clientid");
    let message = "Товар куплен";
    let url = `https://chatter.salebot.pro/api/9a1e4f7aec6c8f6623b849b493521b1c/message?message=${message}&client_id=${clientId}`;
    tg.MainButton.setText = "Pay :)";
    tg.MainButton.show();
    fetch(url)
      .then(function (response) {
        console.log(response);
        tg.MainButton.setText("Готово!");
        tg.MainButton.show();
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  };

  return (
    <>
      <h1 className="heading">Order Food</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards__container">
        {foods.map((food) => {
          return (
            <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
          );
        })}
      </div>
    </>
  );
}

export default App;
