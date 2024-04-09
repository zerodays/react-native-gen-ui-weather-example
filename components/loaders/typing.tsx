import LottieView from "lottie-react-native";
import TypingAnimation from "../../assets/loading/typing.json";
import React from "react";
import { View } from "react-native";

const Typing = () => {
  return (
    <View className="relative flex items-center justify-center w-20 bg-gray-100 rounded-full">
      <LottieView
        source={TypingAnimation}
        style={{
          width: 45,
          height: 35,
        }}
        autoPlay
        loop
      />
    </View>
  );
};

export default Typing;
