import { ColorsType } from "@/constants/colors";
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
import StarRating from "../rating/StarRating";
import ExpandedModal from "../ui/ExpandedModal";

interface ReviewItemProps {
  review: Review;
  style?: StyleProp<ViewStyle>;
}

const MAX_COMMENT_LENGTH = 200;

export default function ReviewItem({ review, style }: ReviewItemProps) {
  const [viewFullComment, setViewFullComment] = useState<boolean>(false);

  const styles = useStyles(getStyles);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.review}>
        <StarRating value={review.rating} size={20} />
        <Text style={styles.title}>{review.title}</Text>
        <Text
          style={styles.comment}
          numberOfLines={
            review?.comment?.length > MAX_COMMENT_LENGTH ? 1 : undefined
          }
        >
          {review?.comment}
        </Text>
        {review?.comment?.length > MAX_COMMENT_LENGTH && (
          <Pressable
            style={styles.expandButton}
            onPress={() => setViewFullComment(!viewFullComment)}
          >
            <Text style={styles.expandButtonText}>View more</Text>
          </Pressable>
        )}
        <ExpandedModal
          isOpen={viewFullComment}
          onCloseModal={() => setViewFullComment(false)}
          title="Review"
          subtitle={`By ${review?.full_name ?? "User"}`}
          content={review?.comment}
        />
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
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 6,
      marginVertical: 6,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    review: {
      marginBottom: 6,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 4,
    },
    comment: {
      color: colors.textSecondary,
      fontSize: 15,
      marginTop: 4,
    },
    expandButton: {
      marginRight: "auto",
    },
    expandButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "700",
    },
    name: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "500",
    },
    reviewedAt: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "500",
    },
  });
