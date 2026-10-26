import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ProductCarousel from "@/components/product/ProductCarousel";
import ProductInfo from "@/components/product/ProductInfo";
import Reviews from "@/components/product/Reviews";
import { AppButton } from "@/components/ui/AppButton";
import AddToWishlist from "@/components/wishlist/AddToWishlist";
import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { api, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const ProductScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const colors = useColors();
  const styles = useStyles(getStyles);

  const {
    data: product,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);

      if (token && res.status === 200 && res.data?.product) {
        void authApi
          .post(`/products/views/${res.data.product.id}`)
          .catch((error) => {
            // console.error("Failed to record product view:", error);
          });
      }

      return res.data?.product;
    },
    enabled: !!slug,
  });

  const handleRefresh = () => {
    refetch();
    if (product) {
      queryClient.refetchQueries({
        queryKey: ["product", product.id, "reviews"],
      });
      queryClient.refetchQueries({
        queryKey: ["product", product.id, "my-review"],
      });
    }
  };

  if (isLoading) {
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

  if (error || !product) {
    return (
      <ScreenWrapper
        edges={["top"]}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
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

          <Text style={styles.errorText}>Couldn't load this product.</Text>

          <AppButton title="Retry" onPress={() => refetch()} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      edges={["top"]}
      onRefresh={handleRefresh}
      refreshing={isRefetching}
    >
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

      <ProductCarousel images={product.product_images} />
      <AddToWishlist product={product} />

      <ProductInfo product={product} />

      <Reviews product={product} />
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.lg,
    },
    backButton: {
      position: "absolute",
      top: 10,
      left: 16,
      borderRadius: radius.full,
    },
    errorText: {
      color: colors.error,
      fontSize: typography.caption.fontSize,
    },
  });

export default ProductScreen;
