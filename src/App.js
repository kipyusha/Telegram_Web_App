import React, { useState, useEffect, useRef } from "react";
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
  const filterRef = useRef(null);
  
  useEffect(() => {
    setCartItems(cartItems);
  }, [cartItems]);

  const handleScroll = () => {
    const filter = filterRef.current; // Получаем элемент фильтра по ссылке

    if (filter) {
      const filterOffsetTop = filter.offsetTop; // Получаем отступ фильтра от верха страницы
      const scrollTop = window.scrollY || document.documentElement.scrollTop; // Получаем текущий скролл страницы

      // Если скролл страницы больше или равен отступу фильтра от верха страницы, то добавляем CSS класс, иначе убираем
      if (scrollTop >= filterOffsetTop) {
        filter.classList.add('sticky');
      } else {
        filter.classList.remove('sticky');
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

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
            description: item[5]
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
       
      <div ref={filterRef} className="filter">
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
            <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} cartItems={cartItems}/>
          ))}
      </div>
    </>
  );
}

export default App;
