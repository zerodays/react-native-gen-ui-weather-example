import { View } from "react-native";
import LottieView from "lottie-react-native";
import React from "react";
import WeatherLoading from "../../assets/loading/weather.json";

const LoadingWeather = () => {
  return (
    <View className="w-32 h-16 -ml-6">
      <LottieView
        source={WeatherLoading}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
        }}
        autoPlay
        loop
      />
    </View>
  );
};

export default LoadingWeather;
