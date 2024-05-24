import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { getToken } from "../../composable/local";
import COLORS from "./../../constants/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const HistoryScreen = () => {
  const { currentlyLoggedIn } = useContext(AuthContext);
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}orders/myOrders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.data.orders);
    } catch (error) {
      console.error("Error fetching order history:", error);
      Alert.alert(
        "Error",
        "An error occurred while fetching the order history."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Historique des Commandes</Text>
      </View>
      {orders.length > 0 ? (
        <ScrollView>
          {orders.map((order) => (
            <View key={order._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Details du commande</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.text}>
                  <Text style={styles.label}>Date: </Text>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Methode de Payment: </Text>
                  {order.paymentMethod}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Ville: </Text>
                  {order.shippingAddress.city}
                </Text>
                <Text style={styles.label}>Products:</Text>
                {order.orderItems.map((item) => (
                  <View key={item._id} style={styles.productContainer}>
                    <Text style={styles.productText}>
                      <Text style={styles.label}>Produit:</Text>
                      {item.product.name}
                    </Text>
                    <Text style={styles.productText}>
                      <Text style={styles.label}>Quantité:</Text>{" "}
                      {item.quantity}
                    </Text>
                    <Text style={styles.productText}>
                      <Text style={styles.label}>Prix:</Text> ${item.price}
                    </Text>
                  </View>
                ))}
                <Text style={styles.text}>
                  <Text style={styles.label}>Prix Totale du Commande: </Text>$
                  {order.totalPrice}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Orders Found.</Text>
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginLeft: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
    marginBottom: 10,
    paddingBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.orange,
  },
  cardBody: {
    marginTop: 10,
  },
  text: {
    fontSize: 17,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: COLORS.black,
  },
  productContainer: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  productText: {
    fontSize: 14,
    marginBottom: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.grey,
  },
});

export default HistoryScreen;
