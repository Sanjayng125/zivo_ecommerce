import FilterModal, { FilterValues } from "@/components/FilterModal";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import OrderItem from "@/components/order/OrderItem";
import OrdersEmpty from "@/components/order/OrdersEmpty";
import OrdersHeader from "@/components/order/OrdersHeader";
import { AppButton } from "@/components/ui/AppButton";
import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useOrders } from "@/hooks/useOrders";
import { useStyles } from "@/hooks/useStyles";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

const OrdersScreen = () => {
  const { token } = useAuthStore();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const DEFAULT_SORT: FilterValues = { sort: "newest" };
  const [sort, setSort] = useState<FilterValues>(DEFAULT_SORT);
  const {
    data: orders,
    error,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrders(sort["sort"]);

  const colors = useColors();
  const styles = useStyles(getStyles);

  if (!token) {
    return (
      <ScreenWrapper edges={["top"]}>
        <View style={styles.center}>
          <Ionicons
            name="heart-outline"
            size={120}
            color={colors.textSecondary}
          />
          <Text style={styles.emptyText}>Sign in to view your orders</Text>
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
          <Text style={styles.errorText}>Couldn't load orders.</Text>
          <AppButton title="Retry" onPress={() => refetch()} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={["top"]} scrollable={false}>
      <OrdersHeader count={orders?.length ?? 0} />

      <View style={styles.sortContainer}>
        <AppButton
          title="Sort"
          leftIcon={
            <Ionicons name="filter" size={24} color={colors.btnPrimaryText} />
          }
          onPress={() => setIsSortOpen(true)}
          size="sm"
          style={styles.filterBtn}
        />
        <FilterModal
          isOpen={isSortOpen}
          onCloseModal={() => setIsSortOpen(false)}
          title="Filter & Sort"
          defaultValues={DEFAULT_SORT}
          values={sort}
          onApply={(vals) => {
            setSort(vals);
          }}
          onReset={() => setSort(DEFAULT_SORT)}
          groups={[
            {
              key: "sort",
              label: "Sort By",
              type: "single",
              options: [
                { label: "Newest", value: "newest" },
                { label: "Oldest", value: "oldest" },
                { label: "Total ↑", value: "total_asc" },
                { label: "Total ↓", value: "total_desc" },
              ],
            },
          ]}
        />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          token ? (
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          ) : undefined
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <OrderItem order={item} />}
        ListEmptyComponent={<OrdersEmpty />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="large"
              color={colors.text}
              style={{ marginVertical: 10 }}
            />
          ) : undefined
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
    sortContainer: {
      marginHorizontal: spacing.md,
      marginBottom: spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    filterBtn: {
      marginTop: spacing.sm,
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

export default OrdersScreen;
