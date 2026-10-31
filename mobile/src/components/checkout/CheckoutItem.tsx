import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { CartItem } from "@/types";
import { formatPrice } from "@/utils";
import { Image, StyleSheet, Text, View } from "react-native";

interface CheckoutItemProps {
  item: CartItem;
}

export default function CheckoutItem({ item }: CheckoutItemProps) {
  const styles = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image source={{ uri: item.cover_image }} style={styles.image} />

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {item?.size && <Text style={styles.size}>Size: {item.size}</Text>}
          {item?.color && <Text style={styles.color}>Color: {item.color}</Text>}
          <Text style={styles.priceAndQuantity}>
            {formatPrice(item.price)} x {item.quantity}
          </Text>
        </View>
      </View>

      <View
        style={styles.rightContainer}
        onStartShouldSetResponder={() => true}
      >
        <Text style={styles.price} numberOfLines={1}>
          {formatPrice(item.quantity * item.price)}
        </Text>
      </View>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.surface,
    },
    leftContainer: {
      flexDirection: "row",
      flex: 1,
      gap: spacing.sm,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: radius.sm,
    },
    infoContainer: {
      flex: 1,
      flexDirection: "column",
      gap: spacing.sm,
    },
    title: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    size: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.textSecondary,
    },
    color: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.textSecondary,
    },
    rightContainer: {
      gap: spacing.xs,
    },
    priceAndQuantity: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    price: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
  });
