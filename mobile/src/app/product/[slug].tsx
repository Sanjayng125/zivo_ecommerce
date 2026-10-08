import AddToCart from "@/components/cart/AddToCart";
import ProductCarousel from "@/components/product/ProductCarousel";
import VariantPicker from "@/components/product/VariantPicker";
import StarRating from "@/components/rating/StarRating";
import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { api } from "@/lib/api";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useColors();
  const styles = useStyles(getStyles);

  const { data, isLoading, isRefetching, refetch, error } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);

      return res.data?.product;
    },
    enabled: !!slug,
  });

  const variants = data?.product_variants ?? [];

  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id);
  const [expandDescription, setExpandDescription] = useState<boolean>(
    (data && data?.description.length < 100 ? true : false) || false,
  );

  const selectedVariant: ProductVariant = useMemo(() => {
    return (
      variants.find((v) => v.id === selectedId) ??
      variants.find((v) => v.stock > 0) ??
      variants[0]
    );
  }, [selectedId, variants]);

  const outOfStock = selectedVariant?.stock === 0;
  const lowStock = selectedVariant?.stock < 10;

  const colorOptions = useMemo(
    () =>
      [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[],
    [variants],
  );

  const sizeOptions = useMemo(
    () => [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[],
    [variants],
  );

  const pickColor = (value: string) => {
    const match =
      variants.find(
        (v) => v.color === value && v.size === selectedVariant?.size,
      ) ?? variants.find((v) => v.color === value);
    if (match) {
      setSelectedId(match.id);
    }
  };

  const pickSize = (value: string) => {
    const match =
      variants.find(
        (v) => v.size === value && v.color === selectedVariant?.color,
      ) ?? variants.find((v) => v.size === value);
    if (match) {
      setSelectedId(match.id);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <ActivityIndicator size="large" color={colors.btnPrimaryBg} />
      </SafeAreaView>
    );
  }

  if (error || !data || !selectedVariant) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.errorText}>Couldn't load this product.</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <ProductCarousel images={data?.product_images ?? []} />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{data?.title}</Text>

          <View style={styles.ratingContainer}>
            {data?.rating_count === 0 ? (
              <Text style={styles.noProductRating}>New</Text>
            ) : (
              <>
                <StarRating rating={Number(data?.rating_avg)} />
                <Text style={styles.productRating}>
                  {`(${data?.rating_count} reviews)`}
                </Text>
              </>
            )}
          </View>

          <Text style={styles.productPrice}>
            {formatPrice(data?.base_price ?? 0)}
          </Text>

          <View style={styles.separator} />

          {/* Variants */}
          {(outOfStock || lowStock) && (
            <Text
              style={[
                styles.stockText,
                {
                  color: outOfStock
                    ? colors.error
                    : lowStock
                      ? colors.warning
                      : "inherit",
                },
              ]}
            >
              {outOfStock
                ? "Out of stock"
                : lowStock
                  ? `Only ${selectedVariant.stock} left`
                  : ""}
            </Text>
          )}
          <VariantPicker
            label="Color"
            options={colorOptions}
            selected={selectedVariant.color ?? ""}
            onSelect={(value) => pickColor(value)}
            unavailable={colorOptions.filter((c) =>
              variants
                .filter((v) => v.color === c && v.size === selectedVariant.size)
                .every((v) => v.stock === 0),
            )}
          />
          <VariantPicker
            label="Size"
            options={sizeOptions}
            selected={selectedVariant.size ?? ""}
            onSelect={(value) => pickSize(value)}
            unavailable={sizeOptions.filter((s) =>
              variants
                .filter(
                  (v) => v.size === s && v.color === selectedVariant.color,
                )
                .every((v) => v.stock === 0),
            )}
          />

          <View style={styles.separator} />

          <View>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text numberOfLines={expandDescription ? undefined : 1}>
              {data?.description}
            </Text>
            {data?.description.length > 100 && (
              <Pressable
                style={styles.expandButton}
                onPress={() => setExpandDescription(!expandDescription)}
              >
                <Text style={styles.expandButtonText}>
                  {expandDescription ? "Show less" : "Show more"}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.separator} />

          <AddToCart
            variant={selectedVariant}
            title={data?.title}
            cover_image={data?.product_images[0]?.url}
          />
        </View>
      </ScrollView>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>
    </SafeAreaView>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
    },
    backButton: {
      position: "absolute",
      top: 56,
      left: 16,
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      color: colors.error,
      fontSize: 16,
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
    infoContainer: {
      flexGrow: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
      marginTop: 10,
      textAlign: "left",
    },
    ratingContainer: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    productRating: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: "700",
      paddingVertical: 2,
    },
    noProductRating: {
      color: colors.success,
      fontSize: 16,
      fontWeight: "700",
      backgroundColor: colors.badgeBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    productPrice: {
      marginTop: 10,
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
    },
    stockText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      backgroundColor: colors.badgeBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginRight: "auto",
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },
    expandButton: {
      marginRight: "auto",
    },
    expandButtonText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
    },
  });

export default ProductScreen;
