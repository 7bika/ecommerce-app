export const fetchProducts = async () => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    setProducts(data.data.documents);
    console.log("products", products);
  } catch (error) {
    console.error("Error fetching products:", error);
    Alert.alert("Error", "An error occurred while fetching the products.");
  }
};
