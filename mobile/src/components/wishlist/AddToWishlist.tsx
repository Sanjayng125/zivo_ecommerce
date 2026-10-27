import { radius } from "@/constants/radius";
import { useColors } from "@/hooks/useColors";
import { useWishlist } from "@/hooks/useWishlist";
import { ApiError, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { toast } from "sonner-native";
import { AppButton } from "../ui/AppButton";

interface AddToWishlistProps {
  product: Product;
}

export default function AddToWishlist({ product }: AddToWishlistProps) {
  const { token } = useAuthStore();
  const { data: wishlistItems } = useWishlist();
  const queryClient = useQueryClient();

  const colors = useColors();

  const itemExistsInWishlist = wishlistItems.find(
    (item) => item?.product_id === product.id,
  );

  const { mutate: addItemToWishlist, isPending: isAddingToWishlist } =
    useMutation({
      mutationFn: async (product_id: string) => {
        const res = await authApi.post("/wishlist", { product_id });

        return res.data;
      },
      onSuccess: (data) => {
        toast.success(data?.message || "Product added to wishlist");
        queryClient.refetchQueries({ queryKey: ["wishlist"] });
      },
      onError: (err: AxiosError<ApiError>) => {
        const message = err.response?.data?.message ?? "Something went wrong";
        toast.error(message);
      },
    });

  const { mutate: removeItemFromWishlist, isPending: isRemovingFromWishlist } =
    useMutation({
      mutationFn: async (item_id: string) => {
        const res = await authApi.delete(`/wishlist/${item_id}`);

        return res.data;
      },
      onSuccess: (data) => {
        toast.success(data?.message || "Product removed from wishlist");
        queryClient.refetchQueries({ queryKey: ["wishlist"] });
      },
      onError: (err: AxiosError<ApiError>) => {
        const message = err.response?.data?.message ?? "Something went wrong";
        toast.error(message);
      },
    });

  const handleAddToWishlist = () => {
    if (!token) {
      router.push("/(auth)/sign-in");
      return;
    }

    if (isAddingToWishlist || isRemovingFromWishlist) return;

    if (itemExistsInWishlist) {
      removeItemFromWishlist(itemExistsInWishlist.id);
    } else {
      addItemToWishlist(product.id);
    }
  };

  return (
    <AppButton
      onPress={handleAddToWishlist}
      loading={isAddingToWishlist || isRemovingFromWishlist}
      leftIcon={
        <Ionicons
          name={itemExistsInWishlist ? "heart" : "heart-outline"}
          size={22}
          color={colors.text}
        />
      }
      variant="secondary"
      style={styles.wishlistButton}
    />
  );
}

const styles = StyleSheet.create({
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 16,
    borderRadius: radius.full,
  },
});
