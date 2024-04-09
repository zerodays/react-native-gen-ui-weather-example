import React, { PropsWithChildren } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ChatContainer = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <KeyboardAvoidingView behavior="padding" className="flex flex-1">
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatContainer;
