import { FlatList, View } from "react-native";
import { OpenAI, useChat } from "react-native-gen-ui";
import { z } from "zod";
import SearchingLocation from "../components/loaders/searching-location";
import LocationMap from "../components/location-map";
import LoadingWeather from "../components/loaders/weather";
import Weather from "../components/weather";
import React from "react";
import { fetchWeatherData } from "../utils/fetch-weather-data";
import { fetchLocation } from "../utils/fetch-reverse-geocode";
import ChatInput from "../components/chat/chat-input";
import ChatSubmitButton from "../components/chat/chat-submit-button";
import ChatContainer from "../components/chat/chat-container";
import ChatMessage from "../components/chat/chat-message";
import { getDeviceLocation } from "../utils/get-device-location";

const openAi = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "",
  model: process.env.EXPO_PUBLIC_OPENAI_MODEL || "gpt-4",
  // You can even set a custom basePath of your SSE server
});

export default function App() {
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
        parameters: z.object({}), // Empty object if no parameters are needed
        render: async function* () {
          yield <SearchingLocation />;

          const location = await getDeviceLocation();

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
              instruction: "Describe the weather in 2-3 sentences.",
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
    <ChatContainer>
      {/* List of messages */}
      <FlatList
        data={messages}
        inverted
        contentContainerStyle={{
          flexDirection: "column-reverse",
          padding: 12,
        }}
        renderItem={({ item, index }) => (
          // Individual message component
          <ChatMessage
            message={item}
            isLastMessage={index === messages.length - 1}
            isLoading={isLoading}
            isStreaming={isStreaming}
            error={error}
          />
        )}
      />

      <View className="flex flex-row items-end p-3 gap-x-2">
        {/* Text input field */}
        <View className="grow basis-0">
          <ChatInput input={input} onInputChange={onInputChange} />
        </View>

        {/* Submit button */}
        <View className="shrink-0">
          <ChatSubmitButton
            isLoading={isLoading}
            isStreaming={isStreaming}
            input={input}
            handleSubmit={handleSubmit}
          />
        </View>
      </View>
    </ChatContainer>
  );
}
