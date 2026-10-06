import { useColors } from "@/hooks/useColors";
import { getToken } from "@/lib/secureStore";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, View } from "react-native";

export default function Index() {
  const { setToken } = useAuthStore();
  const colors = useColors();

  useEffect(() => {
    const init = async () => {
      const token = await getToken();
      if (token) setToken(token);
      router.replace("/(tabs)");
    };
    init();
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
