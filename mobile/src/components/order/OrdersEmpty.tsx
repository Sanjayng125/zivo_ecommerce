import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../ui/AppButton";

export default function OrdersEmpty() {
  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <View style={styles.center}>
      <MaterialCommunityIcons
        name="package"
        size={120}
        color={colors.textSecondary}
      />
      <Text style={styles.emptyText}>You don't have have any order yet</Text>
      <Text style={styles.emptySubText}>
        Explore products you love to buy them
      </Text>
      <AppButton title="Explore" onPress={() => router.push("/(tabs)")} />
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
      paddingTop: spacing.xxxl,
    },
    emptyText: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
      textAlign: "center",
    },
    emptySubText: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
