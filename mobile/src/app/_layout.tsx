import { useColors } from "@/hooks/useColors";
import queryClient from "@/lib/queryClient";
import { useThemeStore } from "@/store/uiStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const { theme } = useThemeStore();
  const colors = useColors();

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={colors.primary}
      />
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </QueryClientProvider>
  );
}
