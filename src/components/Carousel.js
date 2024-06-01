import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import Swiper from "react-native-swiper";

const { width } = Dimensions.get("window");
const imageWidth = width - 40;

const images = [
  require("./../../assets/product11.jpg"),
  require("./../../assets/product1.jpg"),
  require("./../../assets/product5.jpg"),
  require("./../../assets/product6.jpg"),
];

const Carousel = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.scrollBy(1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Swiper
      ref={swiperRef}
      style={styles.wrapper}
      showsButtons={false}
      autoplay={true}
      autoplayTimeout={2}
    >
      {images.map((image, index) => (
        <View key={index} style={styles.slide}>
          <Image source={image} style={styles.image} />
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "120%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Carousel;
