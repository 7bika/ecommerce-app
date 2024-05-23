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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import COLORS from "../../constants/colors";
import { getToken } from "../../composable/local";

import MapViewComponent from "../../components/MapViewComponent";
import Carousel from "../../components/Carousel";

const { width } = Dimensions.get("screen");
const cardWidth = width / 1.8;

const HomeScreen = ({ navigation }) => {
  const { loading } = useContext(AuthContext);
  const [currentlyLoggedIn, setCurrentlyLoggedIn] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchUserProfile();
    fetchTopProducts();
    fetchProducts();
  }, [category]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const fetchUserProfile = async () => {
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
      console.error("Error fetching user profile:", err);
      Alert.alert(
        "Error",
        "An error occurred while fetching the user profile."
      );
    }
  };

  const fetchProducts = async () => {
    try {
      let url = `${process.env.EXPO_PUBLIC_API_URL}products`;

      if (category === "Populaire") {
        url += "?ratingsAverage[gte]=4";
      } else if (category === "Cher") {
        url += "?price[gte]=100&price[lte]=170";
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.data.documents);
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "An error occurred while fetching the products.");
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}products/top-5-cheap`
      );
      if (response.ok) {
        const data = await response.json();
        setTopProducts(data.data.documents);
      } else {
        throw new Error("Failed to fetch top products");
      }
    } catch (err) {
      console.error("Error fetching top products:", err);
      Alert.alert("Error", "An error occurred while fetching top products.");
    }
  };

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}products?name=${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setSearchResults(data.data.documents);
    } catch (error) {
      console.error("Error fetching search results:", error);
      Alert.alert(
        "Error",
        "An error occurred while fetching the search results."
      );
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      fetchSearchResults(query);
    } else {
      setSearchResults([]);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

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
          {currentlyLoggedIn
            ? `Bienvenue, ${currentlyLoggedIn.name}`
            : "No user logged in"}
        </Text>
      </View>
      <Text style={styles.headerText}>Touvez vos produits chez nous</Text>
      <View style={styles.searchContainer}>
        <Icon name="search" size={30} style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          {searchResults.map((product) => (
            <TouchableOpacity
              key={product._id}
              onPress={() => navigation.navigate("DetailsScreen", { product })}
            >
              <Text style={styles.searchResultItem}>{product.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Carousel */}
      <Text style={styles.headerText1}>Nouveaux Arrivage</Text>
      <Carousel />

      {/* Top Products Section */}
      <Text style={styles.headerText}>Meilleur 5 Produits</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {topProducts.map((product, index) => (
          <Card key={index} product={product} />
        ))}
      </ScrollView>

      {/* Category Section */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => setCategory("All")}
        >
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => setCategory("Populaire")}
        >
          <Text style={styles.categoryText}>Populaire</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => setCategory("Cher")}
        >
          <Text style={styles.categoryText}>Cher</Text>
        </TouchableOpacity>
      </View>

      {/* Products Section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {products.map((product, index) => (
          <Card key={index} product={product} />
        ))}
      </ScrollView>

      {/* Map View */}
      <Text style={styles.headerText}>Ou nous Trouvez</Text>
      <View style={styles.mapContainer}>
        <MapViewComponent />
      </View>

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
  headerText1: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.orange,
    marginBottom: 20,
    paddingHorizontal: 20,
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
  searchResultsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
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
    elevation: 5,
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
  mapContainer: {
    height: 300,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
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
