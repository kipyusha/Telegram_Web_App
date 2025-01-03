import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import Card from "./Components/Card/Card";
import ButtonOrder from "./Components/Button/ButtonOrder";
import ClipLoader from 'react-spinners/ClipLoader';
import "react-lazy-load-image-component/src/effects/blur.css";
const tg = window.Telegram.WebApp;
tg.expand();

function App() {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const filterRef = useRef(null);

  useEffect(() => {
    setCartItems(cartItems);
  }, [cartItems]);

  const handleScroll = () => {
    const filter = filterRef.current;

    if (filter) {
      const filterOffsetTop = filter.offsetTop;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop >= filterOffsetTop) {
        filter.classList.add("sticky");
      } else {
        filter.classList.remove("sticky");
      }
      if (scrollTop === 0) {
        filter.classList.remove("sticky");
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    localStorage.clear();
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}",
          {
            params: {
              key: "AIzaSyB2Jj3rT0T52B3AInjPYlBHx6zAijXDAiY",
              spreadsheetId: "1bTJ9NZXImSxPAzg2BtfrOrGem5reWwyjVlap5_XPEnA",
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
            description: item[5],
            count: 0,
          };
        });
        const storedFoods = JSON.parse(localStorage.getItem('foods')) || [];
        const newFoods = productsData.filter(
          (product) => !storedFoods.some((item) => item.id === product.id)
        );

        if (newFoods.length > 0) {
          const updatedFoods = [...storedFoods, ...newFoods];
          localStorage.setItem('foods', JSON.stringify(updatedFoods));
          setFoods(updatedFoods);
        } else {
          setFoods(storedFoods);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при получении данных из Google Sheets:", error);
        setIsLoading(false);
      }
    }

    fetchData();

    tg.ready();
  }, []);

  const onAdd = (food) => {
    const updatedFoods = foods.map((item) => {
      if (item.id === food.id) {
        return { ...item, count: item.count + 1 };
      }
      return item;
    });
    setFoods(updatedFoods);

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
    const updatedFoods = foods.map((item) => {
      if (item.id === food.id && item.count > 0) {
        return { ...item, count: item.count - 1 };
      }
      return item;
    });
    setFoods(updatedFoods);

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

  const deleteItem = (food) => {
    const updatedFoods = foods.map((item) => {
      if (item.id === food.id) {
        return { ...item, count: 0 };
      }
      return item;
    });
    setFoods(updatedFoods);
  }

  const updateCartItems = (newCartItems) => {
    setCartItems(newCartItems);
  };

  const handleFilterClick = (category) => {
    setSelectedCategory(category);
    setActiveCategory(category);
  };

  return (
    <div className="container">
      <h1 className="heading">Каталог</h1>

      <div ref={filterRef} className="filter">
        <ButtonOrder
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
          deleteItem={deleteItem}
          updateCartItems={updateCartItems}
          filterRef={filterRef}
        />
        <div className="filter_content">
          <button
            onClick={() => handleFilterClick("Все")}
            className={activeCategory === "Все" ? "active" : ""}
          >
            Все
          </button>
          <button
            onClick={() => handleFilterClick("Пицца")}
            className={activeCategory === "Пицца" ? "active" : ""}
          >
            Пицца
          </button>
          <button
            onClick={() => handleFilterClick("Бургер")}
            className={activeCategory === "Бургер" ? "active" : ""}
          >
            Бургер
          </button>
          <button
            onClick={() => handleFilterClick("Напитки")}
            className={activeCategory === "Напитки" ? "active" : ""}
          >
            Напитки
          </button>
          <button
            onClick={() => handleFilterClick("Твистеры")}
            className={activeCategory === "Твистеры" ? "active" : ""}
          >
            Твистеры
          </button>
          <button
            onClick={() => handleFilterClick("Десерты")}
            className={activeCategory === "Десерты" ? "active" : ""}
          >
            Десерты
          </button>
          <button
            onClick={() => handleFilterClick("Салаты")}
            className={activeCategory === "Салаты" ? "active" : ""}
          >
            Салаты
          </button>
          <button>End</button>
        </div>
      </div>
      <div className="cards__container">
        {isLoading ? (
          <div className="loader-container">
            <ClipLoader color={'#fff'} size={60} />
          </div>
        ) : (
          foods
            .filter(
              (food) =>
                selectedCategory === "Все" || food.category === selectedCategory
            )
            .map((food) => (
              <Card
                food={food}
                key={food.id}
                onAdd={onAdd}
                onRemove={onRemove}
                cartItems={cartItems}
              />
            ))
        )}
      </div>
    </div>
  );
}

export default App;
