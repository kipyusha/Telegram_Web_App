import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Card from "./Components/Card/Card";
import ButtonOrder from "./Components/Button/ButtonOrder";
const tg = window.Telegram.WebApp;
tg.expand();

function App() {
  
  const [foods, setFoods] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  
  useEffect(() => {
    setCartItems(cartItems);
  }, [cartItems]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}",
          {
            params: {
              key: "AIzaSyDlSmLpJB0VhjfSy-K2-GdWZfPqKy6jtmY",
              spreadsheetId: "18BjWGD4nM4JtR6i8iw8Ls73w6G1-H3pxiCqY57eHKMI",
              range: "products",
            },
          }
        );

        const data = response.data;
        const productsData = data.values.slice(1).map((item) => {
          return {
            id: item[0],
            title: item[1],
            price: item[2],
            category: item[3],
            image: item[4],
          };
        });
        setFoods(productsData);
      } catch (error) {
        console.error("Ошибка при получении данных из Google Sheets:", error);
      }
    }

    fetchData();

    // Вызываем tg.ready() после загрузки данных
    tg.ready();
  }, []);

  const onAdd = (food) => {
    const exists = cartItems.some((x) => x.id === food.id);
    if (exists) {
      const updatedCartItems = cartItems.map((x) =>
        x.id === food.id ? { ...x, quantity: x.quantity + 1 } : x
      );
      setCartItems(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { ...food, quantity: 1 }];
      setCartItems(updatedCartItems);
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

  const updateCartItems = (newCartItems) => {
    setCartItems(newCartItems);
  };

  const handleFilterClick = (category) => {
    setSelectedCategory(category);
  };
  return (
    <>
      <h1 className="heading">Order Food</h1>

      <ButtonOrder
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
        updateCartItems={updateCartItems}
        
      />
      
      <div className="filter">
        <button onClick={() => handleFilterClick("Все")}>Все</button>
        <button onClick={() => handleFilterClick("Пицца")}>Пицца</button>
        <button onClick={() => handleFilterClick("Бургер")}>Бургер</button>
        <button onClick={() => handleFilterClick("Напитки")}>Напитки</button>
        
      </div>
      <div className="cards__container">
        {foods
          .filter(
            (food) =>
              selectedCategory === "Все" || food.category === selectedCategory
          )
          .map((food) => (
            <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
          ))}
      </div>
    </>
  );
}

export default App;
