import CartItem from "@/components/cart/CartItem";
import HorizontalSeparator from "@/components/ui/HorizontalSeparator";
import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { CartItem as CartItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  const { token } = useAuthStore();
  const { items, setItems, clearCart } = useCartStore();

  const colors = useColors();
  const styles = useStyles(getStyles);

  const { data, isLoading, error, isRefetching, refetch } = useQuery<
    CartItemType[]
  >({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await authApi.get("/cart");

      return res.data?.cart_items ?? [];
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (data) setItems(data ?? []);
  }, [data]);

  const handleRefresh = () => {
    if (token) refetch();
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
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isLoading && items?.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      ) : (
        <>
          {!token && (
            <View style={styles.signInContainer}>
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
          )}
          <FlatList
            data={items}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({ item }) => <CartItem item={item} />}
            ItemSeparatorComponent={
              <HorizontalSeparator style={{ marginVertical: 0 }} />
            }
            ListEmptyComponent={
              <Text style={styles.empty}>No items in cart</Text>
            }
            ListFooterComponent={<View style={styles.footer}></View>}
          />
        </>
      )}
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
      paddingBottom: 16,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
    },
    empty: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: "center",
    },
    retryButton: {
      backgroundColor: colors.btnPrimaryBg,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    retryButtonText: {
      color: colors.btnPrimaryText,
      fontSize: 15,
      fontWeight: "700",
    },
    signInContainer: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 4,
      marginHorizontal: "auto",
      marginVertical: 20,
    },
    signInText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: "700",
    },
    footer: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
  });
