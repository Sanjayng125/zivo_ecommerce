import { useColors } from "@/hooks/useColors";
import { getToken } from "@/lib/secureStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, View } from "react-native";

export default function Index() {
  const colors = useColors();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/sign-in");
        }
      } catch (error) {
        router.replace("/(auth)/sign-in");
      }
    };
    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 20,
        }}
      >
        <Image
          source={require("@/assets/images/full_logo.png")}
          style={{ width: 300, height: 300 }}
        />
      </View>
      <ActivityIndicator size={"large"} color={colors.primary} />
    </View>
  );
}
