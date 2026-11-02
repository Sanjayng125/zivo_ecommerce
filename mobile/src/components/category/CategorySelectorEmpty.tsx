import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { CategoryWithSubcategories } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface CategorySelectorEmptyProps {
  selectedCategory: CategoryWithSubcategories | null;
}

export default function CategorySelectorEmpty({
  selectedCategory,
}: CategorySelectorEmptyProps) {
  const styles = useStyles(getStyles);
  const colors = useColors();

  return (
    <View style={styles.subEmptyContainer}>
      {!selectedCategory ? (
        <>
          <Ionicons
            name="grid-outline"
            size={42}
            color={colors.textSecondary}
          />
          <Text style={styles.subEmptyTitle}>Explore subcategories</Text>
          <Text style={styles.subEmptyDescription}>
            Select any category to view its subcategories.
          </Text>
        </>
      ) : (
        <>
          <Ionicons
            name="folder-open-outline"
            size={42}
            color={colors.textSecondary}
          />
          <Text style={styles.subEmptyTitle}>No subcategories yet</Text>
          <Text style={styles.subEmptyDescription}>
            {selectedCategory.name} doesn't have any subcategories.
          </Text>
        </>
      )}
    </View>
  );
}

const getStyles = ({ colors }: UseStylesContext) =>
  StyleSheet.create({
    subEmptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxxl,
      gap: spacing.sm,
    },
    subEmptyTitle: {
      fontSize: typography.caption.fontSize,
      fontWeight: "600",
      color: colors.text,
    },
    subEmptyDescription: {
      fontSize: typography.body.fontSize,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 21,
    },
  });
