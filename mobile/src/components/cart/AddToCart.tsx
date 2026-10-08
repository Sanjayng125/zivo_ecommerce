import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { ProductVariant } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

interface AddToCartProps {
  variant: ProductVariant;
}

export default function AddToCart({ variant }: AddToCartProps) {
  const { token } = useAuthStore();
  const { items, addItem } = useCartStore();

  const colors = useColors();
  const styles = useStyles(getStyles);

  const itemExistsInCart = items.find(
    (item) => item?.variant_id === variant.id,
  );

  const { mutate: addItemToCart, isPending: isAddingToCart } = useMutation({
    mutationFn: async (data: { variant_id: string; quantity: number }) => {
      const res = await authApi.post("/cart", data);

      return res.data;
    },
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: data?.message || "Item added to cart",
      });
      addItem({
        variant_id: variant.id,
        quantity: 1,
      });
    },
    onError: (err: AxiosError<ApiError>) => {
      const message = err.response?.data?.message ?? "Something went wrong";
      Toast.show({
        type: "error",
        text1: message,
      });
    },
  });

  const handleAddToCart = () => {
    if (!variant || isAddingToCart) return;

    if (itemExistsInCart) {
      router.push("/cart");
      return;
    }

    if (token) {
      addItemToCart({
        variant_id: variant.id,
        quantity: 1,
      });
    } else {
      addItem({
        variant_id: variant.id,
        quantity: 1,
      });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.addToCartButton,
        isAddingToCart && styles.disabled,
        itemExistsInCart && styles.itemExistsBtn,
      ]}
      onPress={handleAddToCart}
      disabled={isAddingToCart}
    >
      <Text
        style={[
          styles.addToCartButtonText,
          itemExistsInCart && styles.itemExistsBtnText,
        ]}
      >
        {itemExistsInCart ? "Go to cart" : "Add to cart"}
      </Text>
      {isAddingToCart && <ActivityIndicator size="small" color={colors.text} />}
    </TouchableOpacity>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    addToCartButton: {
      backgroundColor: colors.btnPrimaryBg,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 12,
      marginTop: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    itemExistsBtn: {
      backgroundColor: "transparent",
      borderColor: colors.btnPrimaryBg,
      borderWidth: 1,
    },
    addToCartButtonText: {
      color: colors.btnPrimaryText,
      fontSize: 15,
      fontWeight: "700",
    },
    itemExistsBtnText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
    },
    disabled: {
      opacity: 0.6,
    },
  });
