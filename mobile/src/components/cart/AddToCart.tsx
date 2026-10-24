import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { ApiError, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Product, ProductVariant } from "@/types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { AppButton } from "../ui/AppButton";

interface AddToCartProps {
  product: Product;
  variant: ProductVariant;
}

export default function AddToCart({ variant, product }: AddToCartProps) {
  const { token } = useAuthStore();
  const { items, addItem } = useCart();
  const queryClient = useQueryClient();

  const colors = useColors();

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
        variant_id: data?.cart_item?.variant_id,
        quantity: data?.cart_item?.quantity,
        title: data?.cart_item?.title,
        slug: data?.cart_item?.slug,
        price: data?.cart_item?.price,
        cover_image: data?.cart_item?.cover_image,
        size: data?.cart_item?.size,
        color: data?.cart_item?.color,
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
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
    if (isAddingToCart) return;

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
        title: product.title,
        slug: product.slug,
        price: variant.price,
        cover_image: product.cover_image,
        size: variant.size,
        color: variant.color,
      });
    }
  };

  return (
    <AppButton
      title={itemExistsInCart ? "Go to cart" : "Add to cart"}
      onPress={handleAddToCart}
      disabled={isAddingToCart}
      loading={isAddingToCart}
      leftIcon={
        <MaterialIcons
          name="shopping-cart"
          size={24}
          color={itemExistsInCart ? colors.text : colors.btnPrimaryText}
        />
      }
      rightIcon={
        <Ionicons
          name={itemExistsInCart ? "chevron-forward-sharp" : "add-outline"}
          size={24}
          color={itemExistsInCart ? colors.text : colors.btnPrimaryText}
        />
      }
      variant={itemExistsInCart ? "outline" : "primary"}
    />
  );
}
