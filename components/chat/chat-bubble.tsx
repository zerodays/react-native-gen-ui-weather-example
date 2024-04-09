import { View } from "react-native";
import { cn } from "../../utils/cn";
import React from "react";
import BubbleTail from "../bubble-tail";
import colors from "tailwindcss/colors";
import MarkdownDisplay from "../markdown-display";
import { ChatCompletionMessageParam } from "react-native-gen-ui";

interface ChatBubbleProps {
  message: ChatCompletionMessageParam;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  return (
    <View
      className={cn(
        "relative rounded-3xl py-3 px-4",
        message.role === "user"
          ? "bg-sky-500 self-end ml-14"
          : "bg-gray-200 self-start mr-14"
      )}
    >
      {message.role === "user" ? (
        <View className="absolute -bottom-1 -right-1 -scale-x-100">
          <BubbleTail color={colors.sky[500]} />
        </View>
      ) : (
        <View className="absolute -bottom-1 -left-1">
          <BubbleTail color={colors.gray[200]} />
        </View>
      )}
      <MarkdownDisplay textColor={message.role === "user" ? "white" : "black"}>
        {typeof message.content === "string" ? message.content : ""}
      </MarkdownDisplay>
    </View>
  );
};

export default ChatBubble;
