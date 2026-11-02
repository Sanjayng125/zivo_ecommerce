import FilterModal, { FilterValues } from "@/components/FilterModal";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ProductCard from "@/components/product/ProductCard";
import { AppButton } from "@/components/ui/AppButton";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles, UseStylesContext } from "@/hooks/useStyles";
import { api } from "@/lib/api";
import { CategoryWithSubcategories, Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

const DEFAULT_FILTERS: FilterValues = { sort: "newest" };

const CategoryScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);

  const styles = useStyles(getStyles);
  const colors = useColors();
  const { width: windowWidth } = useWindowDimensions();
  const [listWidth, setListWidth] = useState(0);
  const cardWidth = ((listWidth || windowWidth) - spacing.sm * 3) / 2;

  const {
    data: category,
    refetch: refetchCategory,
    isLoading: isCategoryLoading,
  } = useQuery<CategoryWithSubcategories>({
    queryKey: ["category", slug],
    queryFn: async () => {
      const res = await api.get(`/categories/${slug}`);
      return res.data?.category;
    },
    enabled: !!slug,
  });

  const activeCategoryId = selectedCategoryId ?? category?.id ?? null;

  const {
    data,
    isLoading: isProductsLoading,
    error,
    isRefetching,
    refetch: refetchProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["category-products", activeCategoryId, filters],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, unknown> = {
        category_id: activeCategoryId,
        sort: filters["sort"],
        page: pageParam,
      };
      if ((filters["price"] as any)?.min)
        params["min_price"] = (filters["price"] as any).min;
      if ((filters["price"] as any)?.max)
        params["max_price"] = (filters["price"] as any).max;

      const res = await api.get("/products", { params });
      return res.data;
    },
    enabled: !!activeCategoryId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.total_pages
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const products = useMemo(
    () => (data?.pages.flatMap((p) => p?.products) ?? []) as Product[],
    [data],
  );

  const totalProducts = data?.pages[0]?.pagination?.total ?? 0;

  const handleRefetch = () => {
    refetchCategory();
    refetchProducts();
  };

  if (isCategoryLoading) {
    return (
      <ScreenWrapper edges={["top"]} scrollable={false}>
        <View style={styles.center}>
          <AppButton
            leftIcon={
              <Ionicons
                name="arrow-back"
                size={22}
                color={colors.btnSecondaryText}
              />
            }
            onPress={() => router.back()}
            style={styles.backButton}
            size="sm"
            variant="secondary"
          />

          <ActivityIndicator size="large" color={colors.text} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!category || error) {
    return (
      <ScreenWrapper
        edges={["top"]}
        refreshing={isRefetching}
        onRefresh={handleRefetch}
      >
        <View style={styles.center}>
          <AppButton
            leftIcon={
              <Ionicons
                name="arrow-back"
                size={22}
                color={colors.btnSecondaryText}
              />
            }
            onPress={() => router.back()}
            style={styles.backButton}
            size="sm"
            variant="secondary"
          />

          <Text style={styles.errorText}>Couldn't load this category.</Text>

          <AppButton title="Retry" onPress={() => refetchCategory()} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper edges={["top"]} scrollable={false}>
      <View style={styles.header}>
        <AppButton
          leftIcon={
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.btnSecondaryText}
            />
          }
          onPress={() => router.back()}
          style={{
            marginRight: "auto",
            marginBottom: spacing.md,
            borderRadius: radius.full,
          }}
          size="sm"
          variant="secondary"
        />

        <View style={styles.headerContent}>
          {category.image_url && (
            <Image
              source={{ uri: category.image_url }}
              style={styles.categoryImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.productCount}>{totalProducts} products</Text>
        </View>
      </View>

      {category.subcategories?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subcategoryContainer}
          contentContainerStyle={styles.subcategoryList}
        >
          <AppButton
            title="All"
            variant={activeCategoryId === category.id ? "primary" : "outline"}
            onPress={() => setSelectedCategoryId(category.id)}
            size="sm"
          />
          {category.subcategories.map((sub) => (
            <AppButton
              title={sub.name}
              variant={activeCategoryId === sub.id ? "primary" : "outline"}
              onPress={() => setSelectedCategoryId(sub.id)}
              key={sub.id}
              size="sm"
            />
          ))}
        </ScrollView>
      )}

      <FlatList
        onLayout={({ nativeEvent: { layout } }) => setListWidth(layout.width)}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefetch} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.productsHeader}>
            <Text style={styles.resultsText}>{totalProducts} items</Text>
            <AppButton
              title="Sort & Filter"
              leftIcon={
                <Ionicons
                  name="filter"
                  size={16}
                  color={colors.btnPrimaryText}
                />
              }
              onPress={() => setIsFilterOpen(true)}
              size="sm"
            />
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            containerStyle={[styles.productCard, { width: cardWidth }]}
          />
        )}
        ListEmptyComponent={
          isProductsLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.text} />
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No products in this category</Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="large"
              color={colors.text}
              style={{ marginVertical: spacing.md }}
            />
          ) : undefined
        }
      />

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
            range: { min: 0, max: 5000000, format: (v) => `₹${v / 100}` },
          },
        ]}
      />
    </ScreenWrapper>
  );
};

const getStyles = ({ colors }: UseStylesContext) =>
  StyleSheet.create({
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
    },
    header: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
    },
    backButton: {
      position: "absolute",
      top: 10,
      left: 16,
      borderRadius: radius.full,
      zIndex: 1,
    },
    headerContent: {
      gap: spacing.xs,
    },
    categoryImage: {
      width: 48,
      height: 48,
      borderRadius: radius.sm,
      marginBottom: spacing.xs,
    },
    categoryName: {
      fontSize: typography.title.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    productCount: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
    },
    subcategoryContainer: {
      flexGrow: 0,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    subcategoryList: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      gap: spacing.sm,
    },
    productsHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.sm,
    },
    resultsText: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
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
    emptyText: {
      fontSize: typography.body.fontSize,
      color: colors.textSecondary,
      textAlign: "center",
    },
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
  });

export default CategoryScreen;
