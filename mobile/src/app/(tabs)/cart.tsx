import CartEmpty from "@/components/cart/CartEmpty";
import CartFooter from "@/components/cart/CartFooter";
import CartHeader from "@/components/cart/CartHeader";
import CartItem from "@/components/cart/CartItem";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { AppButton } from "@/components/ui/AppButton";
import HorizontalSeparator from "@/components/ui/HorizontalSeparator";
import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useAuthStore } from "@/store/authStore";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CartScreen = () => {
  const { token } = useAuthStore();
  const { items, refetch, isLoading, error, isRefetching } = useCart();

  const colors = useColors();
  const styles = useStyles(getStyles);

  const handleRefresh = () => {
    if (token) {
      refetch();
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper edges={["top"]} scrollable={false}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper
        edges={["top"]}
        {...(token
          ? { refreshing: isRefetching, onRefresh: handleRefresh }
          : {})}
      >
        <View style={styles.center}>
          <Text style={styles.errorText}>Couldn't load cart.</Text>

          <AppButton title="Retry" onPress={() => refetch()} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={["top"]} scrollable={false}>
      <FlatList
        data={items}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          token ? (
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          ) : undefined
        }
        ListHeaderComponent={<CartHeader />}
        renderItem={({ item }) => <CartItem item={item} />}
        ItemSeparatorComponent={
          <HorizontalSeparator
            backgroundColor={colors.surface}
            style={{ paddingHorizontal: spacing.md }}
          />
        }
        ListEmptyComponent={<CartEmpty />}
        ListFooterComponent={<CartFooter />}
      />
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
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
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.lg,
    },
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
  });

export default CartScreen;
