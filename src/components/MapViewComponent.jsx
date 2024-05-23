import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapViewComponent = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 35.765064,
          longitude: 10.825595,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 35.765064, longitude: 10.825595 }}
          title="Rue de Liberté, Monastir"
          description="Press to see more details"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});

export default MapViewComponent;
