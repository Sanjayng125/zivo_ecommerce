import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ProductCard from "@/components/product/ProductCard";
import { AppButton } from "@/components/ui/AppButton";
import WishlistEmpty from "@/components/wishlist/WishlistEmpty";
import WishlistHeader from "@/components/wishlist/WishlistHeader";
import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const WishlistScreen = () => {
  const { token } = useAuthStore();
  const {
    data: wishlistItems,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useWishlist();

  const styles = useStyles(getStyles);
  const colors = useColors();
  const { width: windowWidth } = useWindowDimensions();
  const [listWidth, setListWidth] = useState(0);
  const cardWidth = ((listWidth || windowWidth) - spacing.md * 3) / 2;

  if (!token) {
    return (
      <ScreenWrapper edges={["top"]}>
        <View style={styles.center}>
          <Ionicons
            name="heart-outline"
            size={120}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyText}>Sign in to view your wishlist</Text>
          <AppButton
            title="Sign In"
            onPress={() => router.push("/(auth)/sign-in")}
          />
        </View>
      </ScreenWrapper>
    );
  }

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
        refreshing={isRefetching}
        onRefresh={refetch}
      >
        <View style={styles.center}>
          <Text style={styles.errorText}>Couldn't load wishlist.</Text>
          <AppButton title="Retry" onPress={() => refetch()} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={["top"]} scrollable={false}>
      <FlatList
        onLayout={({ nativeEvent: { layout } }) => setListWidth(layout.width)}
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          token ? (
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          ) : undefined
        }
        ListHeaderComponent={<WishlistHeader />}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            containerStyle={[styles.productCard, { width: cardWidth }]}
            wishlistCard
          />
        )}
        ListEmptyComponent={<WishlistEmpty />}
      />
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
      gap: spacing.md,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
      paddingTop: spacing.xxxl,
    },
    columnWrapper: {
      gap: spacing.md,
    },
    productCard: {
      flexGrow: 0,
      flexShrink: 0,
    },

    emptyText: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
      textAlign: "center",
    },
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
  });

export default WishlistScreen;
