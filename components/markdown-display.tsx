import React, { memo } from "react";
import { Platform } from "react-native";
import Markdown from "react-native-markdown-display";

interface MarkdownDisplayProps {
  textColor?: string;
  children: string;
}

const MarkdownDisplay = memo(
  ({ children, textColor }: MarkdownDisplayProps) => {
    return (
      <Markdown
        style={{
          ...styles,
          body: {
            color: textColor || "black",
          },
        }}
      >
        {children}
      </Markdown>
    );
  }
);

MarkdownDisplay.displayName = "MarkdownDisplay";

export default MarkdownDisplay;

// this is converted to a stylesheet internally at run time with StyleSheet.create(
const styles = {
  heading1: {
    marginVertical: 10,
    fontSize: 32,
  },
  heading2: {
    marginVertical: 8,
    fontSize: 24,
  },
  heading3: {
    marginVertical: 6,
    fontSize: 18,
  },
  heading4: {
    marginVertical: 4,
    fontSize: 16,
  },
  heading5: {
    marginVertical: 2,
    fontSize: 13,
  },
  heading6: {
    marginVertical: 1,
    fontSize: 11,
  },
  // Horizontal Rule
  hr: {
    backgroundColor: "#000000",
    marginVertical: 10,
    height: 1,
  },
  // Code
  code_inline: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ["ios"]: {
        fontFamily: "Courier New",
      },
      ["android"]: {
        fontFamily: "monospace",
      },
    }),
  },
  code_block: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ["ios"]: {
        fontFamily: "Courier New",
      },
      ["android"]: {
        fontFamily: "monospace",
      },
    }),
  },
  fence: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ["ios"]: {
        fontFamily: "Courier New",
      },
      ["android"]: {
        fontFamily: "monospace",
      },
    }),
  },
  paragraph: {
    marginTop: 2,
    marginBottom: 2,
  },
};
