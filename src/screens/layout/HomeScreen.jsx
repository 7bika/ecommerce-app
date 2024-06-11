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

//const API_URL = "http://192.168.1.9";

const HomeScreen = ({ navigation }) => {
  const { loading } = useContext(AuthContext);
  const [currentlyLoggedIn, setCurrentlyLoggedIn] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [category, setCategory] = useState("Populaire");

  const [type, setType] = useState("Tous");
  const [productsFiltered, setProductsFiltered] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchTopProducts();
    fetchProducts();
  }, [category]);

  useEffect(() => {
    fetchProductsByCategories();
  }, [type]);

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

  const fetchProductsByCategories = async () => {
    try {
      let url = `${process.env.EXPO_PUBLIC_API_URL}products`;

      if (type !== "Tous") {
        url += `?categories=${type}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProductsFiltered(data.data.documents);
    } catch (error) {
      console.error("Error fetching products by categories:", error);
      Alert.alert("Error", "An error occurred while fetching the products.");
    }
  };

  const fetchProducts = async () => {
    try {
      let url = `${process.env.EXPO_PUBLIC_API_URL}products`;

      if (category === "Populaire") {
        url += "?ratingsQuantity[gte]=2";
      } else if (category === "Cher") {
        url += "?price[gte]=100&price[lte]=170";
      } else if (category === "Meilleure Notés") {
        url += "?ratingsAverage[gte]=4.4";
      }

      // types with categories
      if (type !== "Tous") {
        url += url.includes("?") ? "&" : "?";
        if (type === "fouta") {
          url += "?categories=fouta";
        } else if (type === "tapis-long") {
          url += "?categories=tapis-long";
        } else if (type === "tapis-à-pieds") {
          url += "?categories=tapis-à-pieds";
        } else if (type === "kim") {
          url += "?categories=kim";
        }
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
  console.log(products, "aaaa");

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

  // pagination
  const itemsPerPage = 5;
  const paginateProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productsFiltered.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(productsFiltered.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
            source={{
              uri: product.imageCover,
            }}
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
              <Text style={{ fontSize: 12, color: COLORS.grey }}>
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
            style={{
              color: COLORS.black,
              fontWeight: "bold",
              fontSize: 15,
              top: -3,
            }}
          >
            {product.ratingsAverage.toFixed(1)}
          </Text>
        </View>
        <Image
          style={styles.topProductCardImage}
          source={{
            uri: product.imageCover,
          }}
        />
        <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            {product.name}
          </Text>
          <Text
            style={{ fontSize: 10, fontWeight: "bold", color: COLORS.grey }}
          >
            {product.categories}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>
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
          source={require("./../../../assets/logo.png")}
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
                <Text style={styles.searchResultText}> {product.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={{ marginTop: 20 }}>
        <Carousel data={topProducts} />
      </View>

      <Text style={styles.topProductsHeader}>Notre Peu Cher Produits</Text>
      <FlatList
        data={topProducts}
        renderItem={({ item }) => <TopProductCard product={item} />}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.topProductsList}
      />

      <View style={styles.categoriesContainer}>
        {["Populaire", "Cher", "Meilleure Notés"].map((item) => (
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

      {/*  new view */}
      <View style={styles.typesContainer}>
        <Text style={styles.typesHeaderText}>Tous les Catégories</Text>
        <View style={styles.typesWrapper}>
          {["Tous", "fouta", "tapis-à-pieds", "tapis-long", "kim"].map(
            (item) => (
              <TouchableOpacity key={item} onPress={() => setType(item)}>
                <Text
                  style={[
                    styles.categoryText,
                    type === item && styles.categoryTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
        <FlatList
          data={paginateProducts()}
          renderItem={({ item: product }) => (
            <TouchableOpacity
              key={product._id}
              onPress={() => navigation.navigate("DetailsScreen", { product })}
            >
              <View style={styles.filteredProductCard}>
                <Image
                  source={{ uri: product.imageCover }}
                  style={styles.filteredProductImage}
                />
                <View style={styles.filteredProductDetails}>
                  <Text style={styles.filteredProductName}>{product.name}</Text>
                  <Text style={styles.filteredProductCategory}>
                    {product.categories}
                  </Text>
                  <Text style={styles.filteredProductPrice}>
                    ${product.price}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        />
        <View style={styles.paginationControls}>
          <TouchableOpacity
            onPress={handlePrevPage}
            disabled={currentPage === 1}
            style={styles.paginationButton}
          >
            <Text style={styles.paginationButtonText}>Précédent</Text>
          </TouchableOpacity>
          <Text style={styles.pageIndicator}>
            Page {currentPage} of{" "}
            {Math.ceil(productsFiltered.length / itemsPerPage)}
          </Text>
          <TouchableOpacity
            onPress={handleNextPage}
            disabled={
              currentPage === Math.ceil(productsFiltered.length / itemsPerPage)
            }
            style={styles.paginationButton}
          >
            <Text style={styles.paginationButtonText}>Suivant</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map View */}
      <Text style={styles.headerTextMap}>Ou Nous Trouvez</Text>

      <MapViewComponent />

      {/* footer*/}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.chatIconContainer}
          onPress={() => navigation.navigate("ChatBot")}
        >
          <Icon name="chat" size={30} color={COLORS.primary} />
        </TouchableOpacity>
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
    width: 220,
    height: 70,
    top: -75,
    left: 170,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.grayLight,
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
    backgroundColor: COLORS.light,
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
  topProductsHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.black,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  topProductCard: {
    width: 150,
    height: 220,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    marginRight: 20,
    overflow: "hidden",
    margin: 20,
  },
  topProductCardImage: {
    width: "100%",
    height: 120,
  },
  topProductsContainer: {
    paddingVertical: 10,
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
    margin: 10,
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

  // new
  typesContainer: {
    padding: 20,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  typesHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filteredProductsContainer: {
    marginTop: 20,
  },
  filteredProductCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  filteredProductImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  filteredProductDetails: {
    flex: 1,
  },
  filteredProductName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  filteredProductCategory: {
    fontSize: 14,
    color: COLORS.grey,
  },
  filteredProductPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 5,
  },
  //pagination
  paginationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  paginationButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 16,
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
    backgroundColor: COLORS.light,
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
