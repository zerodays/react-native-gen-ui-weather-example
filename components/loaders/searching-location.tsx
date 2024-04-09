import LottieView from "lottie-react-native";
import LocationLoading from "../../assets/loading/location.json";
import React from "react";

const SearchingLocation = () => {
  return (
    <LottieView
      source={LocationLoading}
      style={{
        marginTop: -70,
        marginBottom: -80,
        marginLeft: -40,
        height: 200,
        width: 120,
      }}
      autoPlay
      loop
    />
  );
};

export default SearchingLocation;
