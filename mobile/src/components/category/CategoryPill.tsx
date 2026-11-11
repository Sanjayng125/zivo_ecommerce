import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles, UseStylesContext } from "@/hooks/useStyles";
import { Category } from "@/types";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface CategoryPillProps {
  item: Category;
  onPress?: (category: Category) => void;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function CategoryPill({
  item,
  onPress,
  containerStyle,
  imageStyle,
  textStyle,
}: CategoryPillProps) {
  const styles = useStyles(getStyles);

  return (
    <Pressable
      style={[styles.pillContainer, containerStyle]}
      onPress={() => onPress?.(item)}
    >
      <View style={[styles.imageContainer, imageStyle]}>
        {item?.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            resizeMode="cover"
            style={styles.image}
          />
        ) : (
          <Text style={styles.placeholderText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>
      <Text style={[styles.categoryName, textStyle]} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );
}

const getStyles = ({ colors }: UseStylesContext) =>
  StyleSheet.create({
    pillContainer: {
      width: 90,
      alignItems: "center",
      overflow: "hidden",
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
    },
    imageContainer: {
      width: "100%",
      aspectRatio: 1 / 1,
      backgroundColor: colors.badgeBg,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      aspectRatio: 1 / 1,
      resizeMode: "cover",
    },
    placeholderText: {
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
    },
    categoryName: {
      color: colors.text,
      fontSize: typography.small.fontSize,
      fontWeight: typography.heading.fontWeight,
      textAlign: "center",
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      marginVertical: "auto",
    },
  });
