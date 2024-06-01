import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../constants/colors";

const OrderItem = ({ order }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString();

  return (
    <View style={styles.container}>
      <Text style={styles.date}>Order Date: {orderDate}</Text>
      {order.orderItems.map((item) => (
        <View key={item._id} style={styles.itemContainer}>
          <Text style={styles.productName}>Product: {item.product.name}</Text>
          <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
          <Text style={styles.price}>Price: ${item.price}</Text>
        </View>
      ))}
      <Text style={styles.totalPrice}>Total: ${order.totalPrice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.primary,
  },
  itemContainer: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    color: COLORS.black,
  },
  quantity: {
    fontSize: 16,
    color: COLORS.grey,
  },
  price: {
    fontSize: 16,
    color: COLORS.orange,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 10,
  },
});

export default OrderItem;
