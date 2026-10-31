import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { AppButton } from "@/components/ui/AppButton";
import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const SuccessScreen = () => {
  const styles = useStyles(getStyles);

  return (
    <ScreenWrapper edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={120} color="#43A047" />
        </View>

        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully. We'll notify you once it's
          confirmed.
        </Text>

        <View style={styles.buttons}>
          <AppButton
            title="View Orders"
            onPress={() => router.replace("/orders")}
            fullWidth
          />
          <AppButton
            title="Continue Shopping"
            onPress={() => router.replace("/(tabs)")}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      gap: spacing.lg,
    },
    iconContainer: {
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.title.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
      textAlign: "center",
    },
    subtitle: {
      fontSize: typography.body.fontSize,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    buttons: {
      width: "100%",
      gap: spacing.md,
      marginTop: spacing.xl,
    },
  });

export default SuccessScreen;
