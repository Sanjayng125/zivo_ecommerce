import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { AppButton } from "@/components/ui/AppButton";
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
import { ApiError, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Order } from "@/types";
import { formatDate, formatPrice, isOlderThan } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { toast } from "sonner-native";

const OrderScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, hydrated } = useAuthStore();
  const queryClient = useQueryClient();

  const colors = useColors();
  const styles = useStyles(getStyles);

  const {
    data: order,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await authApi.get(`/orders/${id}`);
      return res.data?.order;
    },
    enabled: !!id && hydrated && !!token,
  });

  const { mutate: verifyPaymentMutation, isPending: isVerifyingPayment } =
    useMutation({
      mutationFn: async () => {
        const res = await authApi.get(`/orders/${id}/verify-payment`);

        return res.data;
      },
      onSuccess: (data) => {
        refetch();
        queryClient.refetchQueries({ queryKey: ["orders"] });
        toast.success(data?.message ?? "Payment verified");
      },
      onError: (err: AxiosError<ApiError>) => {
        const message = err.response?.data?.message ?? "Something went wrong";
        toast.error(message);
      },
    });

  const isPaymentPending = order?.payment_status === "pending";

  const Header = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <AppButton
            leftIcon={
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.btnSecondaryText}
              />
            }
            onPress={() => router.back()}
            style={{ paddingHorizontal: 0, paddingVertical: 0 }}
            size="sm"
            variant="ghost"
          />
          <Text style={styles.headerTitle}>Order Details</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper edges={["top"]} scrollable={false}>
        <Header />

        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !order) {
    return (
      <ScreenWrapper
        edges={["top"]}
        refreshing={isRefetching}
        onRefresh={refetch}
      >
        <Header />

        <View style={styles.center}>
          <Text style={styles.errorText}>Couldn't load this order.</Text>
          <AppButton title="Retry" onPress={() => refetch()} />
        </View>
      </ScreenWrapper>
    );
  }

  const address = order.address_snapshot;
  const statusColor = ORDER_STATUS_COLORS[order.status] ?? colors.text;
  const paymentColor =
    ORDER_PAYMENT_COLORS[order.payment_status] ?? colors.text;

  return (
    <ScreenWrapper
      edges={["top"]}
      refreshing={isRefetching}
      onRefresh={refetch}
      style={styles.container}
    >
      <Header />

      <View style={styles.section}>
        <View style={styles.headerContent}>
          <Text style={styles.orderId}>
            #{order.id.slice(0, 8).toUpperCase()}
          </Text>
          <Text style={styles.orderDate}>
            {formatDate(order.created_at, true)}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.badge, { backgroundColor: statusColor + "20" }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>
        {isPaymentPending && isOlderThan(order.created_at, 10) && (
          <AppButton
            title="Verify Payment"
            onPress={verifyPaymentMutation}
            loading={isVerifyingPayment}
            size="sm"
            style={{ marginRight: "auto" }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Items ({order.order_items.length})
        </Text>
        {order.order_items.map((item) => (
          <Pressable
            key={item.id}
            style={styles.orderItem}
            onPress={() =>
              item.slug ? router.push(`/product/${item.slug}`) : undefined
            }
            disabled={!item.slug}
          >
            <Image
              source={
                item.cover_image
                  ? { uri: item.cover_image }
                  : require("@/assets/images/product-not-found.jpg")
              }
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title_snapshot}
              </Text>
              {item.variant_snapshot?.size && (
                <Text style={styles.itemVariant}>
                  Size: {item.variant_snapshot.size}
                </Text>
              )}
              {item.variant_snapshot?.color && (
                <Text style={styles.itemVariant}>
                  Color: {item.variant_snapshot.color}
                </Text>
              )}
              <View style={styles.itemPriceRow}>
                <Text style={styles.itemPrice}>
                  {formatPrice(item.price_snapshot)}
                </Text>
                <Text style={styles.itemQty}>× {item.quantity}</Text>
                <Text style={styles.itemTotal}>
                  {formatPrice(item.price_snapshot * item.quantity)}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(order.subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>
            {order.shipping > 0 ? formatPrice(order.shipping) : "Free"}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Payment</Text>
          <View
            style={[styles.badge, { backgroundColor: paymentColor + "20" }]}
          >
            <Text style={[styles.badgeText, { color: paymentColor }]}>
              {order.payment_status.charAt(0).toUpperCase() +
                order.payment_status.slice(1)}
            </Text>
          </View>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.addressCard}>
          <Text style={styles.addressName}>{address.full_name}</Text>
          <Text style={styles.addressPhone}>{address.phone}</Text>
          <Text style={styles.addressLine}>{address.line1}</Text>
          {address.line2 && (
            <Text style={styles.addressLine}>{address.line2}</Text>
          )}
          <Text style={styles.addressLine}>
            {address.city}, {address.state} — {address.pincode}
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingBottom: spacing.lg,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.lg,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: spacing.lg,
      marginTop: spacing.md,
    },
    header: {
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    headerContent: {
      gap: spacing.xs,
    },
    orderId: {
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    headerTitleContainer: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    headerTitle: {
      fontSize: typography.title.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    orderDate: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
    },
    statusRow: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    badge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
    },
    badgeText: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    section: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
      borderRadius: radius.md,
      padding: spacing.lg,
      gap: spacing.md,
    },
    sectionTitle: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    orderItem: {
      flexDirection: "row",
      gap: spacing.md,
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: radius.sm,
      backgroundColor: colors.background,
    },
    itemInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    itemTitle: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    itemVariant: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
    },
    itemPriceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    itemPrice: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
    },
    itemQty: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
    },
    itemTotal: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
      marginLeft: "auto",
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    summaryLabel: {
      fontSize: typography.body.fontSize,
      color: colors.textSecondary,
    },
    summaryValue: {
      fontSize: typography.body.fontSize,
      color: colors.textSecondary,
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
      marginTop: spacing.xs,
    },
    totalLabel: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    totalValue: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    addressCard: {
      gap: spacing.xs,
      padding: spacing.md,
      backgroundColor: colors.background,
      borderRadius: radius.sm,
    },
    addressName: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    addressPhone: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
    },
    addressLine: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
    },
    errorText: {
      color: colors.error,
      fontSize: typography.body.fontSize,
    },
  });

export default OrderScreen;
