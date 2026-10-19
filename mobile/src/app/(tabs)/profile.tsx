import { useSignOut } from "@/hooks/useSignOut";
import { useThemeStore } from "@/store/uiStore";
import { router } from "expo-router";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const signOut = useSignOut();
  const { toggleTheme } = useThemeStore();

  return (
    <SafeAreaView edges={["top"]}>
      <Text>Profile</Text>
      <Button title="Sign out" onPress={signOut} />
      <Button title="Sign in" onPress={() => router.push("/(auth)/sign-in")} />
      <Button title="Toggle theme" onPress={toggleTheme} />
    </SafeAreaView>
  );
};

export default Profile;
