import React from "react";
import { View, Text } from "react-native";
import {
  ChatCompletionMessageOrReactElement,
  ChatCompletionMessageParam,
} from "react-native-gen-ui";
import ChatBubble from "./chat-bubble";
import Thinking from "../loaders/thinking";
import { cn } from "../../utils/cn";

interface ChatMessageProps {
  message: ChatCompletionMessageOrReactElement;
  isLastMessage: boolean;
  isLoading: boolean;
  isStreaming: boolean;
  error?: Error;
}

const ChatMessage = ({
  message,
  isLastMessage,
  isLoading,
  isStreaming,
  error,
}: ChatMessageProps) => {
  return (
    <View className={cn("flex gap-y-2", !isLastMessage && "pb-4")}>
      <MessageContent message={message} />
      {isLastMessage && isLoading && !isStreaming && <Thinking />}
      {isLastMessage && error && (
        <View className="self-start px-5 py-4 bg-red-100 rounded-2xl">
          <Text className="text-red-500">{error.message}</Text>
        </View>
      )}
    </View>
  );
};

// The chat message component
const MessageContent = ({
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

  return <ChatBubble message={m} />;
};

export default ChatMessage;
