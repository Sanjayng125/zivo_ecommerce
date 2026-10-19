import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { token } = useAuthStore();
  const { removeItem, updateQuantity } = useCartStore();

  const colors = useColors();
  const styles = useStyles(getStyles);

  const { mutate: updateQuantityMutation, isPending: isUpdatingQuantity } =
    useMutation({
      mutationFn: async (quantity: number) => {
        const res = await authApi.patch(`/cart/${item.id}`, {
          quantity: quantity,
        });

        return res.data;
      },
      onSuccess: (_data, quantity) => {
        updateQuantity(quantity, item.variant_id);
      },
      onError: (err: AxiosError<ApiError>) => {
        const message = err.response?.data?.message ?? "Something went wrong";
        Toast.show({
          type: "error",
          text1: message,
        });
      },
    });

  const { mutate: removeItemMutation, isPending: isRemovingItem } = useMutation(
    {
      mutationFn: async () => {
        const res = await authApi.delete(`/cart/${item.id}`);

        return res.data;
      },
      onSuccess: (data) => {
        removeItem(item.variant_id);
        Toast.show({
          type: "success",
          text1: data?.message || "Item removed from cart",
        });
      },
      onError: (err: AxiosError<ApiError>) => {
        const message = err.response?.data?.message ?? "Something went wrong";
        Toast.show({
          type: "error",
          text1: message,
        });
      },
    },
  );

  const handleUpdateQuantity = (quantity: number) => {
    if (quantity < 1 || quantity > 10 || isUpdatingQuantity) return;

    if (!token) updateQuantity(quantity, item.variant_id);

    if (token) updateQuantityMutation(quantity);
  };

  const handleRemoveItem = () => {
    if (!token) removeItem(item.variant_id);

    if (token) removeItemMutation();
  };

  const btnsDisabled = isUpdatingQuantity || isRemovingItem;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.leftContainer}
        onPress={() => router.push(`/product/${item.slug}`)}
      >
        <Image source={{ uri: item.cover_image }} style={styles.image} />

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {item?.size && <Text style={styles.size}>Size: {item.size}</Text>}
          {item?.color && <Text style={styles.color}>Color: {item.color}</Text>}

          <View
            style={[styles.quantityContainer, btnsDisabled && styles.disabled]}
          >
            <Pressable
              disabled={item.quantity <= 1 || btnsDisabled}
              onPress={() => handleUpdateQuantity(item.quantity - 1)}
              style={[item.quantity <= 1 && styles.disabled]}
            >
              <AntDesign name="minus" size={18} color={colors.text} />
            </Pressable>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <Pressable
              disabled={item.quantity >= 10 || btnsDisabled}
              onPress={() => handleUpdateQuantity(item.quantity + 1)}
              style={[item.quantity >= 10 && styles.disabled]}
            >
              <AntDesign name="plus" size={18} color={colors.text} />
            </Pressable>
          </View>
        </View>
      </Pressable>

      <View style={styles.rightContainer}>
        <Text style={styles.price} numberOfLines={1}>
          {formatPrice(item.price)}
        </Text>
        <Pressable
          onPress={handleRemoveItem}
          disabled={btnsDisabled}
          style={[styles.trashButton, btnsDisabled && styles.disabled]}
        >
          {isRemovingItem ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 16,
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 8,
    },
    leftContainer: {
      flexDirection: "row",
      flex: 1,
      gap: 8,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 8,
    },
    infoContainer: {
      flex: 1,
      flexDirection: "column",
      gap: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    size: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textSecondary,
    },
    color: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textSecondary,
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginRight: "auto",
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    quantity: {
      fontSize: 18,
      fontWeight: "400",
      color: colors.text,
    },
    disabled: {
      opacity: 0.5,
    },
    rightContainer: {
      gap: 4,
    },
    price: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    trashButton: {
      marginLeft: "auto",
    },
  });
