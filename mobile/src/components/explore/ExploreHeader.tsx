import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../ui/AppButton";

interface ExploreHeaderProps {
  totalProducts: number;
  hasChanges: boolean;
  isLoading: boolean;
  productsLength: number;
  onOpenFilter: () => void;
  onClearFilter: () => void;
}

export const ExploreHeader = ({
  totalProducts,
  hasChanges,
  isLoading,
  productsLength,
  onOpenFilter,
  onClearFilter,
}: ExploreHeaderProps) => {
  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <View style={styles.filtersContainer}>
      <Text style={styles.itemsCountText}>
        Results {`(${totalProducts} items)`}
      </Text>
      {productsLength > 0 && (
        <AppButton
          title="Filter & Sort"
          leftIcon={
            <Ionicons name="filter" size={20} color={colors.btnPrimaryText} />
          }
          onPress={onOpenFilter}
          size="sm"
        />
      )}
      {productsLength === 0 && !isLoading && hasChanges && (
        <AppButton
          title="Clear filter"
          rightIcon={<Ionicons name="close" size={20} color={colors.text} />}
          onPress={onClearFilter}
          variant="outline"
          size="sm"
        />
      )}
    </View>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    filtersContainer: {
      paddingHorizontal: spacing.xs,
      marginBottom: spacing.sm,
      gap: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemsCountText: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
  });
