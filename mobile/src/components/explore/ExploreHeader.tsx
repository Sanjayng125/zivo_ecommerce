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
  onOpenFilter: () => void;
}

export const ExploreHeader = ({
  totalProducts,
  onOpenFilter,
}: ExploreHeaderProps) => {
  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <View style={styles.filtersContainer}>
      <Text style={styles.itemsCountText}>
        Results {`(${totalProducts} items)`}
      </Text>
      <AppButton
        title="Filter & Sort"
        leftIcon={
          <Ionicons name="filter" size={20} color={colors.btnPrimaryText} />
        }
        onPress={onOpenFilter}
        size="sm"
      />
    </View>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    filtersContainer: {
      paddingHorizontal: spacing.md,
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
