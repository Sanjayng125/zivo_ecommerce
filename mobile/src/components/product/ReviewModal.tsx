import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import { ReviewSchema, ReviewSchemaType } from "@/lib/schemas";
import { Product, Review } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import StarRating from "../rating/StarRating";
import { AppButton } from "../ui/AppButton";
import TextField from "../ui/TextField";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product: Product;
  review?: Review | null;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSuccess,
  product,
  review,
}: ReviewModalProps) {
  const styles = useStyles(getStyles);
  const colors = useColors();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    setValues,
    reset,
  } = useForm<ReviewSchemaType>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 1,
      title: "",
    },
  });

  useEffect(() => {
    if (review) {
      setValues({
        rating: review.rating,
        title: review.title,
        comment: review.comment ?? undefined,
      });
    }
  }, [review]);

  const { mutate: createReviewMutation, isPending: isCreatingReview } =
    useMutation({
      mutationFn: async (data: ReviewSchemaType) => {
        const res = await authApi.post(`/products/reviews/${product.id}`, data);

        return res.data;
      },
      onSuccess: (res) => {
        Toast.show({
          type: "success",
          text1: res?.message ?? "Review created successfully",
        });
        reset({
          rating: res?.review?.rating ?? 1,
          title: res?.review?.title ?? "",
          comment: res?.review?.comment ?? undefined,
        });
        onSuccess?.();
      },
      onError: (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message ?? "Something went wrong";
        Toast.show({
          type: "error",
          text1: message,
        });
      },
    });

  const { mutate: updateReviewMutation, isPending: isUpdatingReview } =
    useMutation({
      mutationFn: async (data: ReviewSchemaType) => {
        const res = await authApi.patch(
          `/products/reviews/${review?.id}`,
          data,
        );

        return res.data;
      },
      onSuccess: (res) => {
        Toast.show({
          type: "success",
          text1: res?.message ?? "Review updated successfully",
        });
        reset({
          rating: res?.review?.rating ?? 1,
          title: res?.review?.title ?? "",
          comment: res?.review?.comment ?? undefined,
        });
        onSuccess?.();
      },
      onError: (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message ?? "Something went wrong";
        Toast.show({
          type: "error",
          text1: message,
        });
      },
    });

  const { mutate: deleteReviewMutation, isPending: isDeletingReview } =
    useMutation({
      mutationFn: async () => {
        const res = await authApi.delete(`/products/reviews/${review?.id}`);

        return res.data;
      },
      onSuccess: (res) => {
        Toast.show({
          type: "success",
          text1: res?.message ?? "Review deleted successfully",
        });
        reset();
        onSuccess?.();
      },
      onError: (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message ?? "Something went wrong";
        Toast.show({
          type: "error",
          text1: message,
        });
      },
    });

  const onSubmit: SubmitHandler<ReviewSchemaType> = async (data) => {
    if (review) {
      updateReviewMutation(data);
      return;
    }
    createReviewMutation(data);
  };

  const onCloseModal = () => {
    setValues({
      rating: review?.rating ?? 1,
      title: review?.title ?? "",
      comment: review?.comment ?? undefined,
    });
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      onRequestClose={onCloseModal}
      animationType="slide"
      presentationStyle="pageSheet"
      style={styles.container}
    >
      <Toast position="bottom" />
      <View style={styles.header}>
        <Text style={styles.title}>Review</Text>
        <Pressable onPress={onCloseModal}>
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.sectionText}>Rating:</Text>
        <Controller
          control={control}
          name="rating"
          render={({ field: { onChange, value } }) => (
            <StarRating
              value={value}
              size={30}
              editable
              onChange={onChange}
              disabled={isCreatingReview || isUpdatingReview}
            />
          )}
        />
        {errors.rating && (
          <Text style={styles.error}>{errors.rating.message}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextField
              placeholder="Enter title"
              autoCapitalize="sentences"
              value={value}
              onChangeText={onChange}
              style={{ marginTop: 20 }}
              editable={!isCreatingReview && !isUpdatingReview}
            />
          )}
        />
        {errors.title && (
          <Text style={styles.error}>{errors.title.message}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Controller
          control={control}
          name="comment"
          render={({ field: { onChange, value } }) => (
            <TextField
              placeholder="Enter comment"
              autoCapitalize="none"
              value={value}
              onChangeText={(text) => onChange(text === "" ? undefined : text)}
              style={{ marginTop: 20 }}
              editable={!isCreatingReview && !isUpdatingReview}
            />
          )}
        />
        {errors.comment && (
          <Text style={styles.error}>{errors.comment.message}</Text>
        )}
      </View>

      <AppButton
        title={review ? "Update Review" : "Add Review"}
        onPress={handleSubmit(onSubmit)}
        disabled={isCreatingReview || isUpdatingReview || !isValid || !isDirty}
        loading={isCreatingReview || isUpdatingReview}
        style={{ marginTop: spacing.xl }}
      />
      {review && (
        <AppButton
          title="Delete Review"
          onPress={() => deleteReviewMutation()}
          variant="destructive"
          disabled={isCreatingReview || isUpdatingReview}
          loading={isDeletingReview}
          style={{ marginTop: spacing.xl }}
        />
      )}
    </Modal>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      marginTop: spacing.xl,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.md,
    },
    title: {
      fontSize: typography.title.fontSize,
      fontWeight: typography.title.fontWeight,
      color: colors.text,
    },
    ratingContainer: {
      marginTop: spacing.md,
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    section: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    sectionText: {
      color: colors.text,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    error: {
      color: colors.error,
      fontSize: typography.caption.fontSize,
      marginTop: spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    addReviewBtn: {
      marginTop: spacing.xl,
      backgroundColor: colors.btnPrimaryBg,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.md,
    },
    addReviewBtnText: {
      color: colors.btnPrimaryText,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      textAlign: "center",
    },
  });
