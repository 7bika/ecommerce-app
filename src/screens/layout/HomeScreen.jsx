import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../../contexts/AuthContext";
import COLORS from "../../constants/colors";
import ProductContext from "../../contexts/ProductContext";
import { getToken } from "../../composable/local";

const { width } = Dimensions.get("screen");
const cardWidth = width / 1.8;

const HomeScreen = ({ navigation }) => {
  const { loading } = useContext(AuthContext);

  const [currentlyLoggedIn, setCurrentlyLoggedIn] = useState(null);

  const { products, setProducts } = useContext(ProductContext);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Fetching current user profile
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = await getToken();
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}users/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCurrentlyLoggedIn(data.data.user);
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchUserProfile();
  }, []);

  const Card = ({ product }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("DetailsScreen", { product })}
    >
      <View style={styles.card}>
        <Image source={{ uri: product.imageCover }} style={styles.cardImage} />
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>{product.name}</Text>
          <Text style={styles.cardCategory}>{product.categories}</Text>
          <Text style={styles.cardPrice}>${product.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userInfo}>
        <Icon name="person" size={24} color={COLORS.grey} />
        <Text style={styles.userName}>
          {currentlyLoggedIn ? (
            <Text>Welcome, {currentlyLoggedIn.name}</Text>
          ) : (
            <Text>No user logged in</Text>
          )}
        </Text>
      </View>
      <Text style={styles.headerText}>Find your product in Tunisia</Text>
      <View style={styles.searchContainer}>
        <Icon name="search" size={30} style={styles.searchIcon} />
        <TextInput placeholder="Search" style={styles.searchInput} />
      </View>
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.categoryItem}>
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Text style={styles.categoryText}>Popular</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryItem}>
          <Text style={styles.categoryText}>Top Rated</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {products.map((product, index) => (
          <Card key={index} product={product} />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.chatIconContainer}
        onPress={() => navigation.navigate("ChatBot")}
      >
        <Icon name="chat" size={30} color={COLORS.primary} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
    top: 5,
  },
  userName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.grey,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.light,
    borderRadius: 30,
    paddingLeft: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: 20,
    paddingVertical: 10,
    flex: 1,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.light,
  },
  categoryText: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  cardsContainer: {
    paddingRight: 20,
  },
  card: {
    height: 280,
    width: cardWidth,
    borderRadius: 15,
    marginRight: 20,
    backgroundColor: COLORS.white,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardDetails: {
    padding: 15,
    flex: 1,
    justifyContent: "flex-end",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardCategory: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  chatIconContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default HomeScreen;
