import ShowDefaultAddress from "@/components/address/ShowDefaultAddress";
import CartItem from "@/components/cart/CartItem";
import ProductCard from "@/components/product/ProductCard";
import { AppButton } from "@/components/ui/AppButton";
import HorizontalSeparator from "@/components/ui/HorizontalSeparator";
import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/utils";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  const { token } = useAuthStore();
  const {
    items,
    refetch,
    isLoading,
    error,
    isRefetching,
    subTotal,
    shipping,
    total,
  } = useCart();
  const { data: wishlistItems, refetch: refetchWishlist } = useWishlist();

  const colors = useColors();
  const styles = useStyles(getStyles);

  const handleRefresh = () => {
    if (token) {
      refetch();
      refetchWishlist();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <ActivityIndicator size="large" color={colors.text} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <Text style={styles.errorText}>Couldn't load cart.</Text>

        <AppButton title="Retry" onPress={() => refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={items}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          !token ? (
            <View style={styles.actionContainer}>
              <Text style={styles.signInText}>
                Sign in to continue shopping
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-in")}
                activeOpacity={0.6}
              >
                <Text style={[styles.signInText, { color: colors.linkText }]}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          ) : items.length > 0 ? (
            <View style={styles.actionContainer}>
              <ShowDefaultAddress />
            </View>
          ) : null
        }
        renderItem={({ item }) => <CartItem item={item} />}
        ItemSeparatorComponent={
          <HorizontalSeparator
            backgroundColor={colors.surface}
            style={{ paddingHorizontal: spacing.md }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="cart-arrow-down"
              size={200}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Explore products and add items to checkout
            </Text>
            <AppButton title="Explore" onPress={() => router.push("/(tabs)")} />
          </View>
        }
        ListFooterComponent={
          <>
            {items?.length > 0 && (
              <>
                <HorizontalSeparator
                  backgroundColor={colors.surface}
                  style={{ paddingHorizontal: spacing.md }}
                />
                <View style={styles.summaryContainer}>
                  <View style={styles.orderSummaryContainer}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>
                    <View style={styles.summarySection}>
                      <Text style={styles.summaryText}>Subtotal</Text>
                      <Text style={styles.summaryValue}>
                        {formatPrice(subTotal)}
                      </Text>
                    </View>
                    <View style={styles.summarySection}>
                      <Text style={styles.summaryText}>Shipping</Text>
                      <Text style={styles.summaryValue}>
                        {shipping > 0 ? formatPrice(shipping) : "Free"}
                      </Text>
                    </View>
                    <View style={styles.summarySection}>
                      <Text style={styles.summaryText}>Total</Text>
                      <Text style={styles.summaryValue}>
                        {formatPrice(total)}
                      </Text>
                    </View>
                  </View>
                  <AppButton
                    title="Checkout"
                    onPress={() =>
                      router.push(
                        token ? "/checkout/address" : "/(auth)/sign-in",
                      )
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
            )}

            {wishlistItems?.length > 0 && (
              <View style={styles.wishlistContainer}>
                {items?.length > 0 && (
                  <HorizontalSeparator
                    color={colors.textSecondary}
                    style={{ paddingHorizontal: 0, paddingBottom: spacing.xl }}
                  />
                )}
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.wishlistHeader}
                  onPress={() => router.push("/(tabs)/wishlist")}
                >
                  <Text style={styles.wishlistTitle}>Wishlist</Text>
                  <Ionicons
                    name="chevron-forward-sharp"
                    size={20}
                    color={colors.text}
                  />
                </TouchableOpacity>

                <FlatList
                  data={wishlistItems}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.wishlistListContainer}
                  renderItem={({ item }) => {
                    return <ProductCard item={item} size="sm" />;
                  }}
                />
              </View>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      flexGrow: 1,
      paddingBottom: spacing.lg,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.lg,
    },
    emptyContainer: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
      marginTop: spacing.xl,
    },
    emptyText: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.textSecondary,
      textAlign: "center",
    },
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
    actionContainer: {
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.xs,
      marginHorizontal: "auto",
      marginVertical: spacing.md,
    },
    signInText: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
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

    wishlistContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.xl,
    },
    wishlistHeader: {
      marginBottom: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginRight: "auto",
    },
    wishlistTitle: {
      color: colors.text,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    wishlistListContainer: {
      marginVertical: spacing.md,
      gap: spacing.md,
    },
  });
