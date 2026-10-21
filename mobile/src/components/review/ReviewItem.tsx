import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { Review } from "@/types";
import { formatDate } from "@/utils";
import { useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import ExpandedModal from "../ui/ExpandedModal";
import StarRating from "./StarRating";

interface ReviewItemProps {
  review: Review;
  style?: StyleProp<ViewStyle>;
}

const MAX_COMMENT_LENGTH = 150;

export default function ReviewItem({ review, style }: ReviewItemProps) {
  const [viewFullComment, setViewFullComment] = useState<boolean>(false);

  const styles = useStyles(getStyles);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.review}>
        <StarRating value={review.rating} size={20} />
        <Text style={styles.title}>{review.title}</Text>
        {review?.comment?.trim() && (
          <>
            <Text
              style={styles.comment}
              numberOfLines={
                review.comment?.trim().length > MAX_COMMENT_LENGTH
                  ? 3
                  : undefined
              }
              ellipsizeMode="tail"
            >
              {review.comment?.trim()}
            </Text>
            {review.comment?.trim().length > MAX_COMMENT_LENGTH && (
              <Pressable
                style={styles.expandButton}
                onPress={() => setViewFullComment(true)}
              >
                <Text style={styles.expandButtonText}>View more</Text>
              </Pressable>
            )}
            <ExpandedModal
              isOpen={viewFullComment}
              onCloseModal={() => setViewFullComment(false)}
              title="Review"
              subtitle={`By ${review?.full_name ?? "User"}`}
              content={review.comment?.trim()}
            />
          </>
        )}
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.name}>
          {review?.full_name ?? "User"}
          {", "}
        </Text>
        <Text style={styles.reviewedAt}>{formatDate(review.created_at)}</Text>
      </View>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
      marginVertical: spacing.sm,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    review: {
      marginBottom: spacing.sm,
    },
    title: {
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      marginBottom: spacing.xs,
    },
    comment: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
    },
    expandButton: {
      marginRight: "auto",
    },
    expandButtonText: {
      color: colors.textSecondary,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    name: {
      color: colors.textSecondary,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    reviewedAt: {
      color: colors.textSecondary,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
  });
