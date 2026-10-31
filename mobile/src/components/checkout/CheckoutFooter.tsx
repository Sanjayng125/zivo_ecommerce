import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useAddress } from "@/hooks/useAddress";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { formatPrice } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { toast } from "sonner-native";
import AddressListModal from "../address/AddressListModal";
import { AppButton } from "../ui/AppButton";

export default function CheckoutFooter() {
  const { user } = useAuthStore();
  const { subTotal, shipping, total, clearCart } = useCart();
  const { defaultAddress } = useAddress();
  const { selectedAddress, setSelectedAddress, clear } = useCheckoutStore();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

  const styles = useStyles(getStyles);
  const colors = useColors();

  const address = selectedAddress || defaultAddress;

  function handleRazorpay(data: any) {
    RazorpayCheckout.open({
      description: "Zivo Order",
      image: "your-logo-url",
      currency: "INR",
      key: data.key_id,
      amount: data.amount,
      order_id: data.razorpay_order_id,
      name: "Zivo",
      prefill: {
        email: user?.email,
        contact: address?.phone,
        name: address?.full_name,
      },
      theme: { color: "#c0d7ff" },
    })
      .then((paymentData) => {
        clear();
        router.replace("/checkout/success");
      })
      .catch((error) => {
        toast.error(error?.description ?? "Payment failed");
      })
      .finally(() => {
        clearCart();
      });
  }

  const { mutate: checkoutMutation, isPending: isCheckingOut } = useMutation({
    mutationFn: async () => {
      const res = await authApi.post("/checkout", {
        address_id: address?.id,
      });

      return res.data;
    },
    onSuccess: (data) => {
      handleRazorpay(data);
    },
    onError: (err: AxiosError<ApiError>) => {
      const message = err.response?.data?.message ?? "Something went wrong";
      toast.error(message);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Deliver to:</Text>
        {address ? (
          <View style={styles.address}>
            <View style={styles.nameContainer}>
              <Text style={styles.name} numberOfLines={1}>
                {address.full_name}
              </Text>
              {address?.is_default && (
                <Text style={styles.defaultText}>Default</Text>
              )}
            </View>
            <Text
              style={styles.addressText}
              numberOfLines={2}
            >{`${address.line1}, ${address.city}, ${address.state}, ${address.pincode}`}</Text>
            <View style={styles.phoneContainer}>
              <Ionicons name="call-outline" size={18} color={colors.text} />
              <Text style={styles.phoneText} numberOfLines={1}>
                {address.phone}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.selectAddressLabel}>
            Select a delivery address
          </Text>
        )}
        <AppButton
          title={address ? "Change address" : "Select address"}
          onPress={() => setIsAddressModalOpen(true)}
          style={{ marginTop: spacing.sm, marginRight: "auto" }}
          variant="secondary"
          size="sm"
        />
        <AddressListModal
          isOpen={isAddressModalOpen}
          onCloseModal={() => setIsAddressModalOpen(false)}
          onSelect={(address) => setSelectedAddress(address)}
        />
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.orderSummaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summarySection}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subTotal)}</Text>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.summaryText}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {shipping > 0 ? formatPrice(shipping) : "Free"}
            </Text>
          </View>
          <View style={styles.summarySection}>
            <Text style={styles.summaryText}>Total</Text>
            <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        <AppButton
          title="Place Order"
          onPress={checkoutMutation}
          fullWidth
          style={{ marginTop: spacing.sm }}
          disabled={!address}
          loading={isCheckingOut}
        />

        <View style={styles.paymentGatewayContainer}>
          <Image
            source={require("@/assets/images/razorpay-logo.png")}
            style={styles.paymentGatewayImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
    },
    addressContainer: {
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
    },
    addressTitle: {
      color: colors.text,
      marginBottom: spacing.sm,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    address: {
      backgroundColor: colors.background,
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    name: {
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    defaultText: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radius.sm,
      color: colors.text,
      fontSize: typography.small.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    addressText: {
      color: colors.textSecondary,
      fontSize: typography.caption.fontSize,
    },
    phoneContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    phoneText: {
      color: colors.text,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    selectAddressLabel: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
    },
    summaryContainer: {
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    orderSummaryContainer: {
      width: "100%",
      marginTop: spacing.xl,
      justifyContent: "space-between",
      gap: spacing.sm,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    summaryTitle: {
      color: colors.text,
      marginBottom: spacing.sm,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    summarySection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    summaryText: {
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    summaryValue: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    paymentGatewayContainer: {
      width: "100%",
      alignItems: "center",
      marginVertical: spacing.xl,
    },
    paymentGatewayImage: {
      width: 140,
      height: 30,
      backgroundColor: "#FFFFFF",
    },
  });
