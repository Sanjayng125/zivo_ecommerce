import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/utils";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AddToCart from "../cart/AddToCart";
import StarRating from "../rating/StarRating";
import ExpandedModal from "../ui/ExpandedModal";
import HorizontalSeparator from "../ui/HorizontalSeparator";
import VariantPicker from "./VariantPicker";

interface ProductInfoProps {
  product: Product;
}

const MAX_DESCRIPTION_LENGTH = 500;

export default function ProductInfo({ product }: ProductInfoProps) {
  const colors = useColors();
  const styles = useStyles(getStyles);
  const [viewFullDescription, setViewFullDescription] =
    useState<boolean>(false);

  const variants = product?.product_variants ?? [];
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id);

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

  return (
    <View style={styles.infoContainer}>
      <Text style={styles.title}>{product?.title}</Text>

      <View style={styles.ratingContainer}>
        {product?.rating_count === 0 ? (
          <Text style={styles.noProductRating}>New</Text>
        ) : (
          <>
            <StarRating value={Number(product?.rating_avg)} />
            <Text style={styles.productRating}>
              {`(${product?.rating_count} reviews)`}
            </Text>
          </>
        )}
      </View>

      <Text style={styles.productPrice}>
        {formatPrice(product?.base_price ?? 0)}
      </Text>

      <HorizontalSeparator />

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
            .filter((v) => v.size === s && v.color === selectedVariant.color)
            .every((v) => v.stock === 0),
        )}
      />

      <HorizontalSeparator />

      <View>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text
          numberOfLines={
            product?.description.length > MAX_DESCRIPTION_LENGTH ? 6 : undefined
          }
        >
          {product?.description}
        </Text>
        {product?.description.length > MAX_DESCRIPTION_LENGTH && (
          <Pressable
            style={styles.expandButton}
            onPress={() => setViewFullDescription(!viewFullDescription)}
          >
            <Text style={styles.expandButtonText}>View more</Text>
          </Pressable>
        )}
        <ExpandedModal
          isOpen={viewFullDescription}
          onCloseModal={() => setViewFullDescription(false)}
          content={product?.description}
          title="Description"
          subtitle={product.title}
        />
      </View>

      <HorizontalSeparator style={{ marginBottom: 0 }} />

      <AddToCart variant={selectedVariant} />
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    infoContainer: {
      flexGrow: 1,
      backgroundColor: colors.surface,
      padding: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
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
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: "700",
    },
  });
