// FavoritesContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavorites();
  }, []);

  const addToFavorites = async (item) => {
    const updatedFavorites = [...favorites, item];
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = async (itemId) => {
    const updatedFavorites = favorites.filter((item) => item.id !== itemId);
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (itemId) => {
    return favorites.some((item) => item.id === itemId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
