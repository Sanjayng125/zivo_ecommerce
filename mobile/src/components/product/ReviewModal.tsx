import { ColorsType } from "@/constants/colors";
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
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import StarRating from "../rating/StarRating";
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
        <Pressable style={styles.closeBtn} onPress={onCloseModal}>
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

      <TouchableOpacity
        style={[
          styles.addReviewBtn,
          (isCreatingReview || isUpdatingReview || !isValid || !isDirty) && {
            opacity: 0.5,
          },
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={isCreatingReview || isUpdatingReview || !isValid || !isDirty}
      >
        <Text style={styles.addReviewBtnText}>
          {isCreatingReview || isUpdatingReview ? (
            <ActivityIndicator size="small" color={colors.btnPrimaryText} />
          ) : review ? (
            "Update Review"
          ) : (
            "Add Review"
          )}
        </Text>
      </TouchableOpacity>
    </Modal>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingBottom: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },
    closeBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    ratingContainer: {
      marginTop: 10,
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    section: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    sectionText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "600",
    },
    error: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
      paddingHorizontal: 4,
    },
    addReviewBtn: {
      marginTop: 20,
      backgroundColor: colors.btnPrimaryBg,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    addReviewBtnText: {
      color: colors.btnPrimaryText,
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
  });
