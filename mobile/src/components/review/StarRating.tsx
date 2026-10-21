import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface StarRatingProps {
  value: number;
  size?: number;
  editable?: boolean;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export default function StarRating({
  size = 18,
  editable = false,
  value,
  onChange,
  disabled = false,
}: StarRatingProps) {
  const [rating, setRating] = useState(value);
  const rounded = Math.round(rating * 2) / 2;

  const handleStarClick = (index: number) => {
    if (editable) {
      setRating(index + 1);
      onChange?.(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      {Array(5)
        .fill(0)
        .map((_, i) => {
          const name =
            i + 1 <= rounded
              ? "star"
              : i + 0.5 === rounded
                ? "star-half"
                : "star-outline";
          return (
            <Pressable
              key={i}
              onPress={() => handleStarClick(i)}
              disabled={disabled}
              style={{ opacity: disabled ? 0.5 : 1 }}
            >
              <Ionicons key={i} name={name} size={size} color="#ff9500" />
            </Pressable>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});
