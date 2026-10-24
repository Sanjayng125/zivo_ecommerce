import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { Product } from "@/types";
import { formatPrice } from "@/utils";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface ProductCardProps {
  item: Product;
  size?: "sm" | "md" | "lg";
}

export default function ProductCard({ item, size = "md" }: ProductCardProps) {
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

  return (
    <Pressable
      style={[styles.baseContainer, productSizes[size]]}
      onPress={() => router.push(`/product/${item.slug}`)}
    >
      <Image
        source={{ uri: item.cover_image }}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={[styles.baseProductInfo, productInfoSizes[size]]}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.baseProductName, productNameSizes[size]]}
        >
          {item.title}
        </Text>
        <View style={styles.productPriceContainer}>
          <Text style={[styles.baseProductPrice, productPriceSizes[size]]}>
            {formatPrice(item.base_price)}
          </Text>
          {item.rating_count === 0 ? (
            <Text
              style={[styles.baseNoProductRating, noProductRatingSizes[size]]}
            >
              New
            </Text>
          ) : (
            <Text style={[styles.baseProductRating, productRatingSizes[size]]}>
              ⭐️ {item.rating_avg} {`(${item.rating_count})`}
            </Text>
          )}
        </View>
      </View>
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
