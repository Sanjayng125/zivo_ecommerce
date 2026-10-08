import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 18 }: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2;

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
          return <Ionicons key={i} name={name} size={size} color="#fba124" />;
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
