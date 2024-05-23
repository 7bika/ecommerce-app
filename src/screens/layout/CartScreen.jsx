import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import COLORS from "./../../constants/colors";
import CartContext from "../../contexts/CartContext";
import { getToken } from "../../composable/local";
import DropDownPicker from "react-native-dropdown-picker";

const CartScreen = ({ navigation }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Pay by card", value: "Credit Card" },
    { label: "Pay when delivered", value: "Cash on Delivery" },
  ]);

  //* user
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  //fetch user
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

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUser(data.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert(
        "Error",
        "An error occurred while fetching the user profile."
      );
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!mobileNumber || !address || !city || !postalCode || !country) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const orderData = {
      user: user._id,
      orderItems: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      mobileNumber,
      shippingAddress: {
        address,
        city,
        postalCode,
        country,
      },
      paymentMethod,
      totalPrice: getTotal(),
    };

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      Alert.alert("Success", "Order created successfully.");
      clearCart();
      setModalVisible(false);
      navigation.navigate("Home", {
        orderId: data.data._id,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Error", "An error occurred while creating your order.");
    }
  };

  return (
    <View style={styles.container}>
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>${item.price}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Icon name="remove" size={30} color={COLORS.black} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Icon name="add" size={30} color={COLORS.black} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Icon name="delete" size={30} color={COLORS.red} />
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: ${getTotal().toFixed(2)}
            </Text>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                cart.length === 0 && styles.checkoutButtonDisabled,
              ]}
              onPress={() => setModalVisible(true)}
              disabled={cart.length === 0}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalText}>Enter Your Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Addresse"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Gouvernat"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={styles.input}
              placeholder="Code Psotale"
              value={postalCode}
              onChangeText={setPostalCode}
            />
            <TextInput
              style={styles.input}
              placeholder="Ville"
              value={country}
              onChangeText={setCountry}
            />
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.pickerWrapper}>
              <DropDownPicker
                open={open}
                value={paymentMethod}
                items={items}
                setOpen={setOpen}
                setValue={setPaymentMethod}
                setItems={setItems}
                placeholder="Select Payment Method"
                containerStyle={styles.pickerContainer}
                style={styles.picker}
                dropDownStyle={styles.dropDown}
              />
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyleCancel}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonSubmit]}
                onPress={handleCheckout}
              >
                <Text style={styles.textStyle}>Confirmer</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: COLORS.light,
    borderRadius: 10,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    width: "30%",
  },
  cartItemPrice: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.orange,
    width: "20%",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  totalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  checkoutButtonDisabled: {
    backgroundColor: COLORS.grey,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 18,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 20,
    color: COLORS.grey,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignItems: "center",
    top: 80,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  input: {
    width: "80%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.light,
    borderRadius: 5,
  },
  pickerWrapper: {
    width: "100%",
    marginBottom: 20,
    zIndex: 1,
  },
  pickerContainer: {
    width: "100%",
  },
  picker: {
    backgroundColor: COLORS.light,
  },
  dropDown: {
    backgroundColor: COLORS.light,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: COLORS.primary,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "45%",
    alignItems: "center",
  },
  buttonClose: {
    backgroundColor: COLORS.red,
  },
  buttonSubmit: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyleCancel: {
    color: COLORS.primary,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CartScreen;
