import React from "react";
import { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";

const BubbleTail = ({ color }: { color: ColorValue }) => {
  return (
    <Svg width="15" height="30" viewBox="0 0 15 30" fill="none">
      <Path d="M 15 15 L 15 15 Q 12 26 0 30.5 Q 6 22 5 9 Z" fill={color} />
    </Svg>
  );
};

export default BubbleTail;
