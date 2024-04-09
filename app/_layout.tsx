import { Stack } from "expo-router";
import React from "react";
import colors from "tailwindcss/colors";
import "../global.css";

/**
 * Layout shared by all the routes.
 */
const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.gray[50],
      }}
    />
  );
};

export default Layout;
