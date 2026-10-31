import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/utils";
import { router } from "expo-router";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { RecentlyViewedSection } from "../RecentlyViewedSection";
import { AppButton } from "../ui/AppButton";
import { WishlistSection } from "../WishlistSection";

export default function CartFooter() {
  const { token } = useAuthStore();
  const { subTotal, shipping, total, cartCount, isFetchingNextPage } =
    useCart();

  const styles = useStyles(getStyles);
  const colors = useColors();

  const OrderSummary = () => {
    return (
      <>
        {isFetchingNextPage && (
          <View
            style={{ backgroundColor: colors.surface, padding: spacing.md }}
          >
            <ActivityIndicator size="large" color={colors.text} />
          </View>
        )}
        <View style={styles.summaryContainer}>
          <View style={styles.orderSummaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summarySection}>
              <Text style={styles.summaryText}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subTotal)}</Text>
            </View>
            <View style={styles.summarySection}>
              <Text style={styles.summaryText}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {shipping > 0 ? formatPrice(shipping) : "Free"}
              </Text>
            </View>
            <View style={styles.summarySection}>
              <Text style={styles.summaryText}>Total</Text>
              <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
            </View>
          </View>
          <AppButton
            title="Checkout"
            onPress={() =>
              router.push(token ? "/checkout/summary" : "/(auth)/sign-in")
            }
            fullWidth
            style={{ marginTop: spacing.sm }}
          />
          <View style={styles.paymentGatewayContainer}>
            <Image
              source={require("@/assets/images/razorpay-logo.png")}
              style={styles.paymentGatewayImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      {cartCount > 0 && <OrderSummary />}
      <View style={{ marginTop: spacing.xxxl, gap: spacing.md }}>
        {token && <RecentlyViewedSection />}
        {token && <WishlistSection />}
      </View>
    </>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    summaryContainer: {
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
    },
    orderSummaryContainer: {
      width: "100%",
      marginTop: spacing.xl,
      justifyContent: "space-between",
      gap: spacing.sm,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    summaryTitle: {
      color: colors.text,
      marginBottom: spacing.sm,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    summarySection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    summaryText: {
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    summaryValue: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    paymentGatewayContainer: {
      width: "100%",
      alignItems: "center",
      marginVertical: spacing.xl,
    },
    paymentGatewayImage: {
      width: 140,
      height: 30,
      backgroundColor: "#FFFFFF",
    },
  });
