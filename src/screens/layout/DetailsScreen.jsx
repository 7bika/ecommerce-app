import React, { useEffect, useState, useContext } from "react";
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import COLORS from "./../../constants/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import CartContext from "../../contexts/CartContext";
import FavoritesContext from "../../contexts/FavoritesContext";
import { getToken } from "../../composable/local";

const DetailsScreen = ({ navigation, route }) => {
  let item = route.params.product;

  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isFavorite } =
    useContext(FavoritesContext);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [currentlyLoggedIn, setCurrentlyLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile();
      await fetchReviews(item.id);
      setLoading(false);
    };

    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  useEffect(() => {
    setIsBookmarked(isFavorite(item.id));
  }, [item.id, isFavorite]);

  const handleBookmarkPress = () => {
    if (isBookmarked) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
    setIsBookmarked(!isBookmarked);
  };

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

  //fecth review
  const fetchReviews = async (productId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}products/${productId}/reviews`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  //submit review
  const handleReviewSubmit = async () => {
    if (newRating === 0 || newReview === "") {
      Alert.alert("Error", "Please provide a rating and a review.");
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}products/${item._id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: newRating,
            review: newReview,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      await fetchReviews(item._id);
      await fetchUserProfile();
      setNewReview("");
      setNewRating(0);
      Alert.alert("Success", "Your review has been submitted.");
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "An error occurred while submitting your review.");
    }
  };

  //delete
  const handleDeleteReview = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}reviews/${reviewToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      await fetchReviews(item._id);
      await fetchUserProfile();
      setReviewToDelete(null);
      setModalVisible(false);
      Alert.alert("Success", "Your review has been deleted.");
    } catch (error) {
      console.error("Error deleting review:", error);
      Alert.alert("Error", "An error occurred while deleting your review.");
    }
  };

  //update
  const handleUpdateReview = async () => {
    if (newRating === 0 || newReview === "") {
      Alert.alert("Error", "Please provide a rating and a review.");
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}reviews/${editingReview._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: newRating,
            review: newReview,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update review");
      }
      await fetchReviews(item._id);
      await fetchUserProfile();
      setEditingReview(null);
      setNewReview("");
      setNewRating(0);
      Alert.alert("Success", "Ton commentaire à été ajouté.");
    } catch (error) {
      console.error("Error updating review:", error);
      Alert.alert("Error", "An error occurred while updating your review.");
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...item, quantity });
    navigation.navigate("CartScreen");
  };

  const handleEditReview = (review) => {
    if (!currentlyLoggedIn) return;
    setEditingReview(review);
    setNewReview(review.review);
    setNewRating(review.rating);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          color: COLORS.black,
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: COLORS.white,
        paddingBottom: 20,
      }}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <ImageBackground
        style={style.headerImage}
        source={{ uri: item.imageCover }}
      >
        <View style={style.header}>
          <Icon
            name="arrow-back-ios"
            size={28}
            color={COLORS.white}
            onPress={navigation.goBack}
          />
          <Icon name="bookmark-border" size={28} color={COLORS.white} />
        </View>
      </ImageBackground>
      <View>
        <View style={style.iconContainer}>
          <TouchableOpacity onPress={handleBookmarkPress}>
            <Icon
              name={isBookmarked ? "bookmark" : "bookmark-border"}
              color={isBookmarked ? COLORS.orange : COLORS.white}
              size={28}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.name}</Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "400",
              color: COLORS.grey,
              marginTop: 5,
            }}
          >
            {item.description}
          </Text>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Icon
                  key={index}
                  name="star"
                  size={20}
                  color={
                    index < Math.floor(item.ratingsAverage)
                      ? COLORS.orange
                      : COLORS.grey
                  }
                />
              ))}
              <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: 5 }}>
                {item.rating}
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: COLORS.black }}>
              {reviews.length} reviews
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ lineHeight: 20, color: COLORS.grey }}>
              {item.details}
            </Text>
          </View>
        </View>
        <View style={style.reviewsContainer}>
          {reviews.map((review) => (
            <View key={review._id} style={style.review}>
              <View style={style.reviewHeader}>
                <Text style={style.reviewUser}>{review.user.name}</Text>
                <Text style={style.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
                {currentlyLoggedIn &&
                  review.user._id === currentlyLoggedIn._id && (
                    <View style={style.reviewActions}>
                      <TouchableOpacity
                        onPress={() => handleEditReview(review)}
                      >
                        <Icon name="edit" size={20} color={COLORS.grey} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setReviewToDelete(review._id);
                          setModalVisible(true);
                        }}
                      >
                        <Icon name="delete" size={20} color={COLORS.red} />
                      </TouchableOpacity>
                    </View>
                  )}
              </View>
              <View style={style.reviewStars}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon
                    key={index}
                    name="star"
                    size={20}
                    color={index < review.rating ? COLORS.orange : COLORS.grey}
                  />
                ))}
              </View>
              <Text style={style.reviewText}>{review.review}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {editingReview ? "Edit Review" : "Add a Review"}
          </Text>
          <View style={style.reviewStars}>
            {Array.from({ length: 5 }).map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setNewRating(index + 1)}
              >
                <Icon
                  name="star"
                  size={30}
                  color={index < newRating ? COLORS.orange : COLORS.grey}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={style.reviewInput}
            placeholder="Write your review here"
            value={newReview}
            onChangeText={setNewReview}
          />
          <TouchableOpacity
            style={style.submitButton}
            onPress={editingReview ? handleUpdateReview : handleReviewSubmit}
          >
            <Text style={style.submitButtonText}>
              {editingReview ? "Update Review" : "Submit Review"}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 20,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>Prix</Text>
          <View style={style.priceTag}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: COLORS.grey,
                marginLeft: 5,
              }}
            >
              ${item.price}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: COLORS.grey,
                marginLeft: 5,
              }}
            >
              + Livraison Gratuite
            </Text>
          </View>
        </View>
        <TouchableOpacity style={style.btn} onPress={handleAddToCart}>
          <Text
            style={{ color: COLORS.white, fontSize: 18, fontWeight: "bold" }}
          >
            Ajouter au panier
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                }
              }}
            >
              <Icon name="remove" size={30} color={COLORS.white} />
            </TouchableOpacity>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 18,
                marginHorizontal: 10,
              }}
            >
              {quantity}
            </Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
              <Icon name="add" size={30} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <Text style={style.modalText}>
              Êtes-vous sûr de vouloir supprimer ce commentaire ?
            </Text>
            <View style={style.modalButtonContainer}>
              <TouchableOpacity
                style={[style.button, style.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={style.textStyle}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[style.button, style.buttonDelete]}
                onPress={handleDeleteReview}
              >
                <Text style={style.textStyle}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  headerImage: {
    height: 400,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  header: {
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.primary,
    position: "absolute",
    top: -30,
    right: 20,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  review: {
    backgroundColor: COLORS.light,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  reviewUser: {
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.black,
  },
  reviewActions: {
    flexDirection: "row",
  },
  reviewStars: {
    flexDirection: "row",
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
  },
  reviewInput: {
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 17,
  },
  priceTag: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    borderEndStartRadius: 15,
  },
  btn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  buttonDelete: {
    backgroundColor: COLORS.red,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
  },
});

export default DetailsScreen;
