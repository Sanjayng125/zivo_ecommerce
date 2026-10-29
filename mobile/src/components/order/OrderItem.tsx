import {
  ColorsType,
  ORDER_PAYMENT_COLORS,
  ORDER_STATUS_COLORS,
} from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Order } from "@/types";
import { formatDate, formatPrice } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface OrderItemProps {
  order: Order;
}

const MAX_VISIBLE_IMAGES = 2;
const IMAGE_SIZE = 65;
const IMAGE_OVERLAP = 40;

export default function OrderItem({ order }: OrderItemProps) {
  const styles = useStyles(getStyles);
  const colors = useColors();

  const visibleItems = order.order_items?.slice(0, MAX_VISIBLE_IMAGES);
  const extraCount = Math.min(
    order.order_items?.length - MAX_VISIBLE_IMAGES,
    9,
  );
  const totalImagesWidth =
    IMAGE_SIZE + (visibleItems?.length - 1) * (IMAGE_SIZE - IMAGE_OVERLAP);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => router.push(`/orders/${order.id}`)}
    >
      <View style={[styles.imagesContainer, { width: totalImagesWidth }]}>
        {visibleItems?.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.imageWrapper,
              {
                left: index * (IMAGE_SIZE - IMAGE_OVERLAP),
                zIndex: visibleItems?.length - index,
              },
            ]}
          >
            <Image
              source={
                item?.cover_image
                  ? { uri: item.cover_image }
                  : require("@/assets/images/product-not-found.jpg")
              }
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
        {extraCount > 0 && (
          <View style={styles.extraCountContainer}>
            <Text style={styles.extraCountText}>+{extraCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.orderId} numberOfLines={1}>
            #{order.id?.slice(0, 8).toUpperCase()}
          </Text>
          <Text style={styles.date}>{formatDate(order.created_at)}</Text>
        </View>

        {order?.order_items?.length > 0 && (
          <Text style={styles.itemCount} numberOfLines={1}>
            {order.order_items?.length} item
            {order.order_items?.length > 1 ? "s" : ""}
            {" · "}
            {order.order_items
              ?.slice(0, MAX_VISIBLE_IMAGES)
              .map((i) => i.title_snapshot)
              .join(", ")}
            {order.order_items?.length > MAX_VISIBLE_IMAGES ? "..." : ""}
          </Text>
        )}

        <View style={styles.row}>
          <View
            style={[
              styles.badge,
              { backgroundColor: ORDER_STATUS_COLORS[order.status] + "20" },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: ORDER_STATUS_COLORS[order.status] },
              ]}
            >
              {order.status.charAt(0).toUpperCase() + order.status?.slice(1)}
            </Text>
          </View>

          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  ORDER_PAYMENT_COLORS[order.payment_status] + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: ORDER_PAYMENT_COLORS[order.payment_status] },
              ]}
            >
              {order.payment_status.charAt(0).toUpperCase() +
                order.payment_status?.slice(1)}
            </Text>
          </View>

          <Text style={styles.total}>{formatPrice(order.total)}</Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textSecondary}
        style={styles.chevron}
      />
    </Pressable>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
    },
    pressed: {
      opacity: 0.7,
    },
    imagesContainer: {
      height: IMAGE_SIZE,
      position: "relative",
      flexShrink: 0,
    },
    imageWrapper: {
      position: "absolute",
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: colors.surface,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    extraCountContainer: {
      position: "absolute",
      zIndex: 99,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xs,
      borderRadius: radius.full,
      top: -5,
      left: -5,
    },
    extraCountText: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    infoContainer: {
      flex: 1,
      gap: spacing.xs,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    orderId: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
      flex: 1,
    },
    date: {
      fontSize: typography.small.fontSize,
      color: colors.textSecondary,
    },
    itemCount: {
      fontSize: typography.small.fontSize,
      color: colors.textSecondary,
    },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.full,
    },
    badgeText: {
      fontSize: typography.small.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    total: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
      marginLeft: "auto",
    },
    chevron: {
      flexShrink: 0,
    },
  });
