import { Platform, TextInput } from "react-native";
import { cn } from "../../utils/cn";
import React from "react";

interface ChatInputProps {
  input: string;
  onInputChange: (text: string) => void;
}

const ChatInput = ({ input, onInputChange }: ChatInputProps) => {
  return (
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
  );
};

export default ChatInput;
