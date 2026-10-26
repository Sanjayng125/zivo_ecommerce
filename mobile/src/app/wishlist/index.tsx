import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ProductCard from "@/components/product/ProductCard";
import { AppButton } from "@/components/ui/AppButton";
import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
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
  const queryClient = useQueryClient();

  const styles = useStyles(getStyles);
  const colors = useColors();

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
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={<View />}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Wishlist</Text>
            {wishlistItems.length > 0 && (
              <Text style={styles.headerCount}>
                {wishlistItems.length} item{wishlistItems.length > 1 ? "s" : ""}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons
              name="heart-outline"
              size={120}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubText}>
              Save products you love to buy them later
            </Text>
            <AppButton title="Explore" onPress={() => router.push("/(tabs)")} />
          </View>
        }
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

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.lg,
    },
    headerTitle: {
      fontSize: typography.title.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    headerCount: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.body.fontWeight,
      color: colors.textSecondary,
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
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
  });

export default WishlistScreen;
