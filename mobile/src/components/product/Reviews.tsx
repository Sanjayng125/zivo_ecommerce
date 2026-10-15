import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { api, authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Product, Review } from "@/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HorizontalSeparator from "../ui/HorizontalSeparator";
import ReviewItem from "./ReviewItem";
import ReviewModal from "./ReviewModal";

interface ReviewsProps {
  product: Product;
}

export default function Reviews({ product }: ReviewsProps) {
  const { token } = useAuthStore();
  const styles = useStyles(getStyles);
  const colors = useColors();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", product.id, "reviews"],
    queryFn: async () => {
      const res = await api.get(`/products/reviews/${product.id}`);

      return res.data;
    },
  });

  const reviews = (data?.reviews ?? []) as Review[];

  const {
    data: myReview,
    isLoading: isMyReviewLoading,
    refetch: refetchMyReview,
  } = useQuery<Review | null>({
    queryKey: ["product", product.id, "my-review"],
    queryFn: async () => {
      const res = await authApi.get(
        `/products/reviews/${product.id}/my-review`,
      );

      return res.data?.my_review ?? null;
    },
    enabled: !!product && !!token,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rating & Reviews</Text>

      {myReview && <ReviewItem review={myReview} style={{ marginBottom: 0 }} />}
      <TouchableOpacity
        activeOpacity={0.6}
        style={[
          styles.addReviewBtn,
          myReview && { marginTop: 0 },
          isMyReviewLoading && { opacity: 0.5 },
        ]}
        onPress={() =>
          token ? setIsReviewModalOpen(true) : router.push("/(auth)/sign-in")
        }
        disabled={isMyReviewLoading}
      >
        <MaterialCommunityIcons
          name={myReview ? "comment-edit-outline" : "comment-plus-outline"}
          size={24}
          color={colors.text}
        />
        <Text style={styles.addReviewBtnText}>
          {myReview ? "Edit review" : "Add a review"}
        </Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={24}
          color={colors.text}
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={refetchMyReview}
        product={product}
        review={myReview}
      />

      <View style={styles.reviewContainer}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.btnPrimaryBg}
            style={{ marginVertical: 10 }}
          />
        )}

        {error && <Text style={styles.errorText}>Failed to load reviews</Text>}

        {!isLoading && !error && reviews?.length === 0 && (
          <Text style={styles.errorText}>No reviews yet</Text>
        )}

        <View key={"reviews"}>
          {!isLoading &&
            !error &&
            reviews?.map((review, i) => (
              <View key={review?.id ?? i}>
                <ReviewItem review={review} />
                {i < reviews.length - 1 && <HorizontalSeparator />}
              </View>
            ))}
        </View>

        {reviews && data?.pagination?.total > data?.pagination?.limit && (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.viewAllReviewsContainer}
            onPress={() => console.log("View all reviews")}
          >
            <Text style={styles.viewAllReviews}>View all reviews</Text>
            <Ionicons
              name="chevron-forward-sharp"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingBottom: 20,
      marginTop: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginVertical: 10,
      textAlign: "left",
      paddingHorizontal: 10,
    },
    addReviewBtn: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderRadius: 8,
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    addReviewBtnText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    reviewContainer: {
      marginBottom: 20,
    },
    errorText: {
      marginTop: 20,
      color: colors.error,
      fontSize: 16,
      textAlign: "center",
    },
    viewAllReviewsContainer: {
      marginTop: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    viewAllReviews: {
      color: colors.btnPrimaryBg,
      fontSize: 15,
      fontWeight: "700",
    },
  });
