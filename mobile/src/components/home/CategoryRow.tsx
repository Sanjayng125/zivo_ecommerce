import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { Category, HomeSection } from "@/types";
import { router } from "expo-router";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import CategoryPill from "../category/CategoryPill";

interface CategoryRowProps {
  section: HomeSection;
  style?: StyleProp<ViewStyle>;
}

export default function CategoryRow({ section, style }: CategoryRowProps) {
  const styles = useStyles(getStyles);

  const categories = (section?.items ?? []) as Category[];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{section?.title}</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          return (
            <CategoryPill
              item={item}
              onPress={() => router.push(`/category/${item.slug}`)}
            />
          );
        }}
      />
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.xl,
    },
    header: {
      marginBottom: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    title: {
      color: colors.text,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    listContainer: {
      marginVertical: spacing.md,
      gap: spacing.md,
    },
  });
