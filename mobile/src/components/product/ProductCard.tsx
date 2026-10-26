import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import queryClient from "@/lib/queryClient";
import { Product, WishlistItem } from "@/types";
import { formatCount, formatPrice } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Toast from "react-native-toast-message";
import { AppButton } from "../ui/AppButton";

interface ProductCardProps {
  product: Product | WishlistItem;
  size?: "sm" | "md" | "lg";
  containerStyle?: StyleProp<ViewStyle>;
  wishlistCard?: boolean;
}

export default function ProductCard({
  product,
  size = "md",
  containerStyle,
  wishlistCard,
}: ProductCardProps) {
  const styles = useStyles(getStyles);

  const productSizes: Record<string, object> = {
    sm: styles.smallContainer,
    md: styles.mediumContainer,
    lg: styles.largeContainer,
  };

  const productInfoSizes: Record<string, object> = {
    sm: styles.smallProductInfo,
    md: styles.mediumProductInfo,
    lg: styles.largeProductInfo,
  };

  const productNameSizes: Record<string, object> = {
    sm: styles.smallProductName,
    md: styles.mediumProductName,
    lg: styles.largeProductName,
  };

  const productPriceSizes: Record<string, object> = {
    sm: styles.smallProductPrice,
    md: styles.mediumProductPrice,
    lg: styles.largeProductPrice,
  };

  const productRatingSizes: Record<string, object> = {
    sm: styles.smallProductRating,
    md: styles.mediumProductRating,
    lg: styles.largeProductRating,
  };

  const noProductRatingSizes: Record<string, object> = {
    sm: styles.smallNoProductRating,
    md: styles.mediumNoProductRating,
    lg: styles.largeNoProductRating,
  };

  const { mutate: removeItem, isPending: isRemovingItem } = useMutation({
    mutationFn: async (id: string) => {
      const res = await authApi.delete(`/wishlist/${id}`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["wishlist"], (old: WishlistItem[]) =>
        old.filter((item) => item.id !== id),
      );
      Toast.show({ type: "success", text1: "Removed from wishlist" });
    },
    onError: (err: AxiosError<ApiError>) => {
      const message = err.response?.data?.message ?? "Something went wrong";
      Toast.show({ type: "error", text1: message });
    },
  });

  return (
    <Pressable
      style={[styles.baseContainer, productSizes[size], containerStyle]}
      onPress={() => router.push(`/product/${product.slug}`)}
    >
      <Image
        source={{ uri: product.cover_image }}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={[styles.baseProductInfo, productInfoSizes[size]]}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.baseProductName, productNameSizes[size]]}
        >
          {product.title}
        </Text>
        <View style={styles.productPriceContainer}>
          <Text
            numberOfLines={1}
            style={[styles.baseProductPrice, productPriceSizes[size]]}
          >
            {formatPrice(product.base_price)}
          </Text>
          {product.rating_count === 0 ? (
            <Text
              numberOfLines={1}
              style={[styles.baseNoProductRating, noProductRatingSizes[size]]}
            >
              New
            </Text>
          ) : (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.baseProductRating, productRatingSizes[size]]}
            >
              ⭐️ {product.rating_avg} {`(${formatCount(product.rating_count)})`}
            </Text>
          )}
        </View>
      </View>

      {wishlistCard && (
        <AppButton
          title="Remove"
          onPress={() => removeItem(product.id)}
          variant="destructive"
          size="sm"
          loading={isRemovingItem}
          style={{
            marginHorizontal: spacing.sm,
            marginBottom: spacing.sm,
            marginTop: spacing.xs,
          }}
        />
      )}
    </Pressable>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    baseContainer: {
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    mediumContainer: {
      width: 200,
    },
    smallContainer: {
      width: 150,
    },
    largeContainer: {
      width: 300,
    },

    image: {
      width: "100%",
      aspectRatio: 1 / 1,
      resizeMode: "cover",
    },

    baseProductInfo: {
      gap: spacing.xs,
    },
    mediumProductInfo: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    smallProductInfo: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    largeProductInfo: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },

    baseProductName: {
      color: colors.textSecondary,
      textAlign: "left",
    },
    mediumProductName: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    smallProductName: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    largeProductName: {
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },

    productPriceContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    baseProductPrice: {
      color: colors.text,
      textAlign: "center",
    },
    mediumProductPrice: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    smallProductPrice: {
      fontSize: typography.small.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    largeProductPrice: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },

    baseProductRating: {
      color: colors.text,
      paddingVertical: spacing.xs,
      textAlign: "center",
    },
    mediumProductRating: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    smallProductRating: {
      fontSize: typography.small.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    largeProductRating: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },

    baseNoProductRating: {
      color: colors.success,
      textAlign: "center",
      backgroundColor: colors.badgeBg,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: spacing.xs,
    },
    mediumNoProductRating: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    smallNoProductRating: {
      fontSize: typography.small.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    largeNoProductRating: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
  });
