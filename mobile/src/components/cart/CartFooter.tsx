import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useStyles } from "@/hooks/useStyles";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "../product/ProductCard";
import { AppButton } from "../ui/AppButton";

export default function CartFooter() {
  const { token } = useAuthStore();
  const { subTotal, shipping, total, cartCount, isFetchingNextPage } =
    useCart();
  const { data: recentlyViewedProducts } = useRecentlyViewed();
  const { data: wishlistItems } = useWishlist();

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
              router.push(token ? "/checkout/address" : "/(auth)/sign-in")
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

  const RecentlyViewedSection = () => {
    return (
      <View style={styles.otherContainer}>
        <View style={styles.otherHeader}>
          <Text style={styles.otherTitle}>Recently Viewed</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.otherListContainer}
        >
          {recentlyViewedProducts.map((item) => (
            <ProductCard product={item} size="sm" key={item.id} />
          ))}
        </ScrollView>
      </View>
    );
  };

  const WishlistSection = () => {
    return (
      <View style={styles.otherContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.otherHeader}
          onPress={() => router.push("/wishlist")}
        >
          <Text style={styles.otherTitle}>Wishlist</Text>
          <Ionicons name="heart" size={24} color={colors.error} />
          <Ionicons
            name="chevron-forward-sharp"
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.otherListContainer}
        >
          {wishlistItems.map((item) => (
            <ProductCard product={item} size="sm" key={item.id} />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      {cartCount > 0 && <OrderSummary />}
      <View style={{ marginTop: spacing.xl }}>
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

    otherContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.xl,
    },
    otherHeader: {
      marginBottom: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginRight: "auto",
    },
    otherTitle: {
      color: colors.text,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    otherListContainer: {
      marginVertical: spacing.md,
      gap: spacing.md,
    },
  });
