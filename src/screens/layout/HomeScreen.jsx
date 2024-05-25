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
  FlatList,
  Animated,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import COLORS from "../../constants/colors";
import { getToken } from "../../composable/local";
import { FontAwesome5 } from "@expo/vector-icons";

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

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

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

  const Card = ({ product }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate("DetailsScreen", { product })}
      >
        <View style={styles.card}>
          <View style={styles.priceTag}>
            <Text
              style={{ color: COLORS.white, fontSize: 20, fontWeight: "bold" }}
            >
              ${product.price}
            </Text>
          </View>
          <Image
            source={{ uri: product.imageCover }}
            style={styles.cardImage}
          />
          <View style={styles.cardDetails}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                  {product.name}
                </Text>
                <Text style={{ color: COLORS.grey, fontSize: 12 }}>
                  {product.categories}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {Array(Math.floor(product.ratingsAverage))
                  .fill(0)
                  .map((_, index) => (
                    <Icon
                      key={index}
                      name="star"
                      size={15}
                      color={COLORS.orange}
                    />
                  ))}
                {Array(5 - Math.floor(product.ratingsAverage))
                  .fill(0)
                  .map((_, index) => (
                    <Icon
                      key={index}
                      name="star"
                      size={15}
                      color={COLORS.grey}
                    />
                  ))}
              </View>
              <Text style={{ fontSize: 10, color: COLORS.grey }}>
                {product.ratingsQuantity} reviews
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const TopProductCard = ({ product }) => {
    return (
      <View style={styles.topProductCard}>
        <View
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            zIndex: 1,
            flexDirection: "row",
          }}
        >
          <Icon name="star" size={15} color={COLORS.orange} />
          <Text
            style={{ color: COLORS.white, fontWeight: "bold", fontSize: 15 }}
          >
            {product.ratingsAverage.toFixed(1)}
          </Text>
        </View>
        <Image
          style={styles.topProductCardImage}
          source={{ uri: product.imageCover }}
        />
        <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>
            {product.name}
          </Text>
          <Text style={{ fontSize: 7, fontWeight: "bold", color: COLORS.grey }}>
            {product.categories}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>
            {" "}
            ${product.price}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userInfo}>
        <Icon name="person-outline" size={38} color={COLORS.grey} />
        <Text style={styles.userName}>
          {currentlyLoggedIn
            ? `Bienvenue, ${currentlyLoggedIn.name}`
            : "No user logged in"}
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Trouvez Votre</Text>
        <Text style={{ ...styles.headerText, color: COLORS.primary }}>
          Produit
        </Text>
        <Text style={styles.headerText}>ICI</Text>

        <Image
          source={require("./../../../assets/favicon.png")}
          style={styles.headerImage}
        />
      </View>
      <View style={styles.searchInputContainer}>
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
              <View style={styles.searchResultItem}>
                <Image
                  source={{ uri: product.imageCover }}
                  style={styles.searchResultImage}
                />
                <Text style={styles.searchResultText}>{product.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={{ marginTop: 20 }}>
        <Carousel data={topProducts} />
      </View>

      <View style={styles.topProductsList}>
        {topProducts.map((product) => (
          <TopProductCard product={product} key={product._id} />
        ))}
      </View>
      <View style={styles.categoriesContainer}>
        {["All", "Populaire", "Cher"].map((item) => (
          <TouchableOpacity key={item} onPress={() => setCategory(item)}>
            <Text
              style={[
                styles.categoryText,
                category === item && styles.categoryTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        contentContainerStyle={styles.productList}
        data={products}
        renderItem={({ item }) => <Card product={item} />}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Map View */}
      <Text style={styles.headerTextMap}>Ou Nous Trouvez</Text>

      <MapViewComponent />

      <TouchableOpacity
        style={styles.chatIconContainer}
        onPress={() => navigation.navigate("ChatBot")}
      >
        <Icon name="chat" size={30} color={COLORS.primary} />
      </TouchableOpacity>

      {/* footer*/}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 SAKLY CIE</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.facebook.com")}
            style={{ marginRight: 30 }}
          >
            <FontAwesome5 name="facebook" size={30} color="#143869" />
            {/* Dark blue color */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.instagram.com")}
          >
            <FontAwesome5 name="instagram" size={30} color="#E1306C" />
            {/* Dark pink color */}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.light,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTextMap: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  headerImage: {
    width: 50,
    height: 50,
    top: -80,
    left: 270,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  searchResultsContainer: {
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  searchResultText: {
    fontSize: 16,
  },
  topProductCard: {
    height: 150,
    width: 120,
    backgroundColor: COLORS.white,
    elevation: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  topProductCardImage: {
    width: "100%",
    height: 80,
    borderRadius: 10,
  },
  topProductsList: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.grey,
    marginHorizontal: 10,
  },
  categoryTextSelected: {
    color: COLORS.primary,
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
  },
  productList: {
    paddingHorizontal: 20,
  },
  card: {
    height: 280,
    width: cardWidth,
    elevation: 15,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    marginRight: 20,
    padding: 15,
  },
  cardImage: {
    height: 150,
    borderRadius: 15,
    width: "100%",
  },
  priceTag: {
    height: 60,
    width: 80,
    backgroundColor: COLORS.primary,
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardDetails: {
    height: 100,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    position: "absolute",
    bottom: 0,
    padding: 15,
    width: "100%",
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
  footer: {
    padding: 20,
    alignItems: "center",
    bottom: 0,
    width: "100%",
    alignContent: "space-evenly ",
  },
  footerText: {
    fontSize: 12,
    color: COLORS.grey,
  },
  footerLinks: {
    flexDirection: "row",
    marginTop: 10,
    alignContent: "space-between ",
    alignItems: "center",
  },
});

export default HomeScreen;
