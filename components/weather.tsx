import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ClearDay,
  ClearNight,
  Cloudy,
  Foggy,
  RainyDay,
  RainyNight,
  SnowyDay,
  SnowyNight,
  Stormy,
} from "../assets/weather";
import colors from "tailwindcss/colors";
import AnimateIn from "./animate-in";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export enum WeatherType {
  CLEAR = "clear",
  FOGGY = "foggy",
  CLOUDY = "cloudy",
  RAINY = "rainy",
  SNOWY = "snowy",
  STORMY = "stormy",
  PARTLY_CLOUDY = "partly-cloudy",
}

export interface WeatherData {
  time: Date;
  temperature: number;
  icon: WeatherType;
}

interface WeatherProps {
  location: string;
  current: WeatherData;
  forecast: WeatherData[];
}

const Weather: React.FC<WeatherProps> = ({ location, current, forecast }) => {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const isDay = current.time.getHours() > 6 && current.time.getHours() < 18;

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      height: height.value,
    };
  });

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 150,
      easing: Easing.inOut(Easing.ease),
    });
    height.value = withTiming(260, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, []);

  return (
    <Animated.View
      style={animatedStyles}
      className="relative p-6 overflow-hidden rounded-2xl"
    >
      {/* Background Gradient */}
      <LinearGradient
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        colors={[
          isDay ? colors.sky[500] : colors.blue[950],
          isDay ? colors.sky[300] : colors.blue[800],
        ]}
      />

      {/* Header */}
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl text-white max-w-[200px] truncate text-nowrap">
          {/* <Text>{`${location}, `}</Text> */}
          {current.time.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Text className="text-xl text-white capitalize">{current.icon}</Text>
      </View>

      {/* Current weather */}
      <View className="flex flex-row items-end justify-start my-4 gap-x-4">
        <Text className="text-6xl font-semibold text-white">{`${current.temperature}°C`}</Text>
        <WeatherIcon icon={current.icon} timestamp={current.time} size="md" />
      </View>

      {/* Weather info list */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-6"
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
      >
        {forecast.map((weather, index) => (
          <AnimateIn key={index} delay={200 + index * 100}>
            <View className="flex items-center justify-between w-20 my-2 gap-y-2">
              <Text className="text-lg text-white">
                {weather.time.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  hour12: true,
                })}
              </Text>
              <WeatherIcon icon={weather.icon} timestamp={weather.time} />
              <Text className="text-lg text-white">{`${weather.temperature}°C`}</Text>
            </View>
          </AnimateIn>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

interface WeatherIconProps {
  icon: WeatherType;
  timestamp: Date;
  size?: "sm" | "md" | "lg";
}

const WeatherIcon = ({ icon, timestamp, size = "sm" }: WeatherIconProps) => {
  const isDay = timestamp.getHours() > 6 && timestamp.getHours() < 18;

  const getWeatherIcon = (icon: WeatherType) => {
    switch (icon) {
      case WeatherType.CLEAR:
        return isDay ? ClearDay : ClearNight;
      case WeatherType.CLOUDY:
        return Cloudy;
      case WeatherType.FOGGY:
        return Foggy;
      case WeatherType.RAINY:
        return isDay ? RainyDay : RainyNight;
      case WeatherType.SNOWY:
        return isDay ? SnowyDay : SnowyNight;
      case WeatherType.STORMY:
        return Stormy;
      case WeatherType.PARTLY_CLOUDY:
        return isDay ? ClearDay : ClearNight;
      default:
        return isDay ? ClearDay : ClearNight;
    }
  };

  return (
    <LottieView
      source={getWeatherIcon(icon)}
      style={{
        width: size === "sm" ? 35 : size === "md" ? 60 : 120,
        aspectRatio: 1,
      }}
      autoPlay
      speed={0.5}
      loop
    />
  );
};

export default Weather;
