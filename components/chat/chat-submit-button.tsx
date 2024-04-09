import LottieView from "lottie-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import TypingAnimation from "../../assets/loading/typing.json";
import { Send } from "lucide-react-native";
import { Text } from "react-native";
import colors from "tailwindcss/colors";

interface ChatSubmitButtonProps {
  isLoading: boolean;
  isStreaming: boolean;
  input: string;
  handleSubmit: (input: string) => void;
}

const ChatSubmitButton = ({
  isLoading,
  isStreaming,
  input,
  handleSubmit,
}: ChatSubmitButtonProps) => {
  return (
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
  );
};

export default ChatSubmitButton;
