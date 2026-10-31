import { ExploreHeader } from "@/components/explore/ExploreHeader";
import SearchHistory from "@/components/explore/SearchHistory";
import FilterModal, { FilterValues } from "@/components/FilterModal";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ProductCard from "@/components/product/ProductCard";
import { RecentlyViewedSection } from "@/components/RecentlyViewedSection";
import { AppButton } from "@/components/ui/AppButton";
import TextField from "@/components/ui/TextField";
import { WishlistSection } from "@/components/WishlistSection";
import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useDebounce } from "@/hooks/useDebounce";
import { useStyles } from "@/hooks/useStyles";
import { api } from "@/lib/api";
import { useSearchStore } from "@/store/searchStore";
import { Product } from "@/types";
import { formatPrice } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

const DEFAULT_FILTERS: FilterValues = { sort: "newest" };

const ExploreScreen = () => {
  const { addQuery } = useSearchStore();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim());
  const [mode, setMode] = useState<"browse" | "search">("browse");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);

  const styles = useStyles(getStyles);
  const colors = useColors();
  const { width: windowWidth } = useWindowDimensions();
  const [listWidth, setListWidth] = useState(0);
  const cardWidth = ((listWidth || windowWidth) - spacing.sm * 3) / 2;

  useEffect(() => {
    if (mode !== "browse") {
      const backAction = () => {
        setMode("browse");
        setQuery("");
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [mode]);

  useEffect(() => {
    setMode(debouncedQuery.length >= 3 ? "search" : "browse");
  }, [debouncedQuery]);

  const {
    data,
    isLoading,
    error,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", debouncedQuery, filters],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, unknown> = { sort: filters["sort"] };

      if ((filters["price"] as any)?.min) {
        params["min_price"] = (filters["price"] as any).min;
      }
      if ((filters["price"] as any)?.max) {
        params["max_price"] = (filters["price"] as any).max;
      }

      const res = await api.get("/products/search", {
        params: { page: pageParam, ...params, q: debouncedQuery },
      });

      return res.data;
    },
    enabled: debouncedQuery.length >= 3,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.total_pages
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const saveCurrentSearch = () => {
    const value = debouncedQuery;

    if (value.length < 3) return;

    addQuery(value);
  };

  const products = useMemo(
    () => (data?.pages.flatMap((page) => page?.products) ?? []) as Product[],
    [data],
  );

  const totalProducts = data?.pages[0]?.pagination?.total ?? 0;
  const hasChanges =
    JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <ScreenWrapper edges={["top"]} scrollable={false}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextField
            value={query}
            onChangeText={(text) => setQuery(text)}
            placeholder="Search products..."
            style={styles.searchInput}
            onSubmitEditing={saveCurrentSearch}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} style={styles.clearButton}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
        {mode === "browse" && (
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.12)", "transparent"]}
            style={styles.searchContainerShadow}
          />
        )}
      </View>

      {mode === "browse" && (
        <ScrollView
          style={styles.browseModeContainer}
          showsVerticalScrollIndicator={false}
        >
          <SearchHistory onPress={(query) => setQuery(query)} />
          <RecentlyViewedSection />
          <WishlistSection />
        </ScrollView>
      )}

      {mode === "search" && (
        <View style={styles.searchModeContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.text} />
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>
                Couldn't load search results.
              </Text>
              <AppButton title="Retry" onPress={() => refetch()} />
            </View>
          ) : (
            <FlatList
              onLayout={({ nativeEvent: { layout } }) =>
                setListWidth(layout.width)
              }
              data={products}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.contentContainer}
              columnWrapperStyle={styles.columnWrapper}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
              ListHeaderComponent={
                <ExploreHeader
                  totalProducts={totalProducts}
                  hasChanges={hasChanges}
                  isLoading={isLoading}
                  productsLength={products.length}
                  onOpenFilter={() => setIsFilterOpen(true)}
                  onClearFilter={() => setFilters(DEFAULT_FILTERS)}
                />
              }
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  containerStyle={[styles.productCard, { width: cardWidth }]}
                  onPress={saveCurrentSearch}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.empty}>
                    No products found for that query
                  </Text>
                </View>
              }
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
          )}
        </View>
      )}

      <FilterModal
        isOpen={isFilterOpen}
        onCloseModal={() => setIsFilterOpen(false)}
        title="Sort & Filter"
        defaultValues={DEFAULT_FILTERS}
        values={filters}
        onApply={(vals) => setFilters(vals)}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        groups={[
          {
            key: "sort",
            label: "Sort By",
            type: "single",
            options: [
              { label: "Newest", value: "newest" },
              { label: "Oldest", value: "oldest" },
              { label: "Price ↑", value: "price_asc" },
              { label: "Price ↓", value: "price_desc" },
              { label: "Rating", value: "rating" },
            ],
          },
          {
            key: "price",
            label: "Filter By Price",
            type: "range",
            options: [],
            range: {
              min: 0,
              max: 5000000,
              format: formatPrice,
            },
          },
        ]}
      />
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
      paddingTop: spacing.xxxl,
    },
    loadingContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: spacing.xxxl,
    },
    empty: {
      fontSize: typography.body.fontSize,
      color: colors.textSecondary,
      textAlign: "center",
    },
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
    header: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.lg,
      position: "relative",
      zIndex: 1,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: {
      marginRight: spacing.xs,
    },
    searchInput: {
      borderWidth: 0,
      backgroundColor: "transparent",
    },
    clearButton: {
      padding: spacing.xs,
    },
    searchContainerShadow: {
      position: "absolute",
      height: 10,
      left: 0,
      right: 0,
      bottom: -10,
    },
    browseModeContainer: {
      flex: 1,
      marginTop: spacing.xl,
    },
    searchModeContainer: {
      flex: 1,
      marginTop: spacing.sm,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.xl,
      gap: spacing.md,
    },
    columnWrapper: {
      gap: spacing.sm,
    },
    productCard: {
      flexGrow: 0,
      flexShrink: 0,
    },
  });

export default ExploreScreen;
