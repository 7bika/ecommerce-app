import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FavoritesContext from "../../contexts/FavoritesContext";
import COLORS from "../../constants/colors";

const FavoritesScreen = ({ navigation }) => {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);

  const handleRemove = (itemId) => {
    removeFromFavorites(itemId);
  };

  const renderItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate("DetailsScreen", { product: item })}
      >
        <Image source={{ uri: item.imageCover }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DetailsScreen", { product: item })
          }
        >
          <Text style={styles.favoriteItemText}>{item.name}</Text>
          <Text style={styles.favoriteItemCategory}>{item.categories}</Text>
          <Text style={styles.favoriteItemPrice}>${item.price}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleRemove(item.id)}>
        <Icon name="delete" size={28} color={COLORS.red} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites added yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: COLORS.grey,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  favoriteItemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  favoriteItemCategory: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 5,
  },
  favoriteItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: COLORS.primary,
  },
});

export default FavoritesScreen;
