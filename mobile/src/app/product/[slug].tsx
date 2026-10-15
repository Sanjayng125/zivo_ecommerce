import ProductCarousel from "@/components/product/ProductCarousel";
import ProductInfo from "@/components/product/ProductInfo";
import Reviews from "@/components/product/Reviews";
import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { api, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <ActivityIndicator size="large" color={colors.btnPrimaryBg} />
      </SafeAreaView>
    );
  }

  if (error || !product) {
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
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
      >
        <ProductCarousel images={product.product_images} />

        <ProductInfo product={product} />

        <Reviews product={product} />
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
  });

export default ProductScreen;
