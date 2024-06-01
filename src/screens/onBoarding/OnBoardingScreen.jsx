// Import libraries
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useNavigation } from "@react-navigation/native";

// Create a component
const OnBoardingScreen = () => {
  const navigation = useNavigation();

  const DotComponent = ({ selected }) => {
    return (
      <View
        style={[
          styles.dot,
          selected ? styles.selectedDot : styles.unselectedDot,
        ]}
      >
        <View
          style={[
            styles.innerDot,
            selected ? styles.selectedInnerDot : styles.unselectedInnerDot,
          ]}
        />
      </View>
    );
  };

  const SkipButtonComponent = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.skipButton} {...props}>
        <Text style={styles.skipButtonText}>SKIP</Text>
      </TouchableOpacity>
    );
  };

  const NextButtonComponent = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.nextButton} {...props}>
        <Text style={styles.nextButtonText}>NEXT</Text>
      </TouchableOpacity>
    );
  };

  const DoneButtonComponent = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.doneButton} {...props}>
        <Text style={styles.doneButtonText}>{"\u2713"}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Onboarding
      bottomBarHighlight={false}
      onSkip={() => navigation.navigate("Welcome")}
      onDone={() => navigation.navigate("Welcome")}
      DotComponent={DotComponent}
      SkipButtonComponent={SkipButtonComponent}
      NextButtonComponent={NextButtonComponent}
      DoneButtonComponent={DoneButtonComponent}
      pages={[
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("./../../../assets/01.png")}
              style={styles.image}
            />
          ),
          title: "Choisissez ce Que vous voulez",
          titleStyles: styles.title,
          subtitle: "Plannification",
          subtitleStyles: styles.subtitle,
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("./../../../assets/02.png")}
              style={styles.image}
            />
          ),
          title: "Des Offres , Des Promos et du Bonne Qualité",
          titleStyles: styles.title,
          subtitle: "Selectionner en toute sécurité",
          subtitleStyles: styles.subtitle,
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={require("./../../../assets/03.png")}
              style={styles.image}
            />
          ),
          title: "Experiencer une nouvelle style d'achat",
          titleStyles: styles.title,
          subtitle: "Etes vous pret?\nLET'S GET STARTED!",
          subtitleStyles: styles.subtitle,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 15,
    height: 15,
    marginHorizontal: 3,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDot: {
    backgroundColor: "#000080", // Dark blue
  },
  unselectedDot: {
    borderColor: "#000080", // Dark blue
    borderWidth: 1,
  },
  innerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  selectedInnerDot: {
    backgroundColor: "#000080", // Dark blue
  },
  unselectedInnerDot: {
    backgroundColor: "#000080", // Dark blue
  },
  skipButton: {
    height: 45,
    width: 100,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderColor: "#000", // Black border
    borderWidth: 1,
  },
  skipButtonText: {
    color: "#000", // Black text
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButton: {
    height: 45,
    width: 100,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#000080", // Dark blue background
  },
  nextButtonText: {
    color: "#fff", // White text
    fontSize: 16,
    fontWeight: "bold",
  },
  doneButton: {
    height: 45,
    width: 100,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#000080", // Dark blue background
  },
  doneButtonText: {
    color: "#fff", // White text
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
});

export default OnBoardingScreen;
