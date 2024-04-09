import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  OpenAI,
  useChat,
  ChatCompletionMessageOrReactElement,
  ChatCompletionMessageParam,
} from "react-native-gen-ui";
import { z } from "zod";
import SearchingLocation from "../components/loaders/searching-location";
import * as Location from "expo-location";
import LocationMap from "../components/location-map";
import LoadingWeather from "../components/loaders/weather";
import Weather from "../components/weather";
import { cn } from "../utils/cn";
import React from "react";
import Thinking from "../components/loaders/thinking";
import LottieView from "lottie-react-native";
import { Send } from "lucide-react-native";
import colors from "tailwindcss/colors";
import BubbleTail from "../components/bubble-tail";
import MarkdownDisplay from "../components/markdown-display";
import { fetchWeatherData } from "../utils/fetch-weather-data";
import { fetchLocation } from "../utils/fetch-reverse-geocode";
import TypingAnimation from "../assets/loading/typing.json";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const openAi = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "",
  model: process.env.EXPO_PUBLIC_OPENAI_MODEL || "gpt-4",
  // You can even set a custom basePath of your SSE server
});

export default function App() {
  const insets = useSafeAreaInsets();

  const {
    input,
    error,
    isLoading,
    isStreaming,
    messages,
    handleSubmit,
    onInputChange,
  } = useChat({
    openAi,
    initialMessages: [
      {
        content: "Hello, how can I help you today?",
        role: "assistant",
      },
    ],
    onError: (error) => {
      console.error("Error while streaming:", error);
    },
    onSuccess: () => {
      console.log("✅ Streaming done!");
    },
    tools: {
      getLocation: {
        description: "Get the user's location",
        parameters: z.object({}),
        render: async function* () {
          yield <SearchingLocation />;

          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            throw new Error("Permission to access location was denied");
          }

          let location = await Location.getCurrentPositionAsync({});

          const geoLocation = await fetchLocation(
            location.coords.latitude,
            location.coords.longitude
          );

          const locationName = `${geoLocation.address.city}, ${geoLocation.address.country}`;

          return {
            component: (
              <LocationMap
                latitude={location.coords.latitude}
                longitude={location.coords.longitude}
                locationName={locationName}
              />
            ),
            data: {
              location: {
                locationName,
                details: geoLocation,
              },
            },
          };
        },
      },
      getWeather: {
        description: "Get weather for a location",
        parameters: z.object({
          date: z.date().default(() => new Date()),
          location: z.string(),
        }),
        render: async function* (args) {
          yield <LoadingWeather />;

          const weatherData = await fetchWeatherData(args.location);

          return {
            component: (
              <Weather
                location={args.location}
                current={weatherData[0]}
                forecast={weatherData}
              />
            ),
            data: {
              current: weatherData[0],
              forecast: weatherData,
              location: args.location,
            },
          };
        },
      },
    },
  });

  return (
    <View
      className="flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <KeyboardAvoidingView behavior="padding" className="flex flex-1">
        <FlatList
          data={messages}
          inverted
          className="flex-1"
          fadingEdgeLength={10}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{
            flexDirection: "column-reverse",
            padding: 12,
          }}
          renderItem={({ item, index }) => {
            const isLast = index === messages.length - 1;

            return (
              <View className={cn("flex gap-y-2", !isLast && "pb-4")}>
                <Message message={item} />
                {isLast && isLoading && !isStreaming && <Thinking />}
                {isLast && error && (
                  <View className="self-start px-5 py-4 bg-red-100 rounded-2xl">
                    <Text className="text-red-500">{error.message}</Text>
                  </View>
                )}
              </View>
            );
          }}
        />

        <View className="flex flex-row items-end p-3 gap-x-2">
          <View className="grow basis-0">
            <TextInput
              className={cn(
                Platform.OS === "ios" ? "py-4" : "py-2",
                "px-5 min-h-[46px] bg-white border border-gray-300 rounded-3xl"
              )}
              multiline
              value={input}
              inputMode="text"
              verticalAlign="middle"
              textAlignVertical="center"
              onChangeText={onInputChange}
              placeholder="Type a message..."
            />
          </View>
          <View className="shrink-0">
            <TouchableOpacity
              className="flex flex-row items-center justify-center bg-gray-50 border border-gray-200 rounded-full w-28 h-[46px] gap-x-2"
              disabled={isLoading}
              onPress={() => {
                handleSubmit(input);
              }}
            >
              {isStreaming ? (
                <LottieView
                  source={TypingAnimation}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 18,
                  }}
                  autoPlay
                  loop
                />
              ) : (
                <>
                  <Send color={colors.sky[500]} size={16} />
                  <Text className="text-md text-sky-500">Send</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// The chat message component
const Message = ({
  message,
}: {
  message: ChatCompletionMessageOrReactElement;
}) => {
  if (message == null) {
    return null;
  }

  if (React.isValidElement(message)) {
    return message;
  }

  const m = message as ChatCompletionMessageParam;

  if (m.role === "function") {
    return (
      <View style={{ opacity: 0.4 }}>
        <Text>Only seen by the model:</Text>
        <Text>{m.content?.toString().slice(0, 100)}...</Text>
      </View>
    );
  }

  return (
    <View
      className={cn(
        "relative rounded-3xl py-3 px-4",
        m.role === "user"
          ? "bg-sky-500 self-end ml-14"
          : "bg-gray-200 self-start mr-14"
      )}
    >
      {m.role === "user" ? (
        <View className="absolute -bottom-1 -right-1 -scale-x-100">
          <BubbleTail color={colors.sky[500]} />
        </View>
      ) : (
        <View className="absolute -bottom-1 -left-1">
          <BubbleTail color={colors.gray[200]} />
        </View>
      )}
      <MarkdownDisplay textColor={m.role === "user" ? "white" : "black"}>
        {typeof m.content === "string" ? m.content : ""}
      </MarkdownDisplay>
    </View>
  );
};
