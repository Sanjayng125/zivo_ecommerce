import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { useSearchStore } from "@/store/searchStore";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../ui/AppButton";

interface SearchHistoryProps {
  onPress?: (query: string) => void;
}

export default function SearchHistory({ onPress }: SearchHistoryProps) {
  const { searchHistory, clearHistory } = useSearchStore();

  const styles = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent searches</Text>
      </View>

      <View style={styles.contectContainer}>
        {searchHistory.map((query, i) => (
          <AppButton
            title={query}
            onPress={() => {
              onPress?.(query);
            }}
            size="sm"
            variant="secondary"
            key={i}
            style={styles.chip}
          />
        ))}
      </View>
      {searchHistory?.length > 0 && (
        <AppButton
          title="Clear"
          onPress={clearHistory}
          variant="ghost"
          style={styles.clearBtn}
          textStyle={styles.clearBtnText}
        />
      )}
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.lg,
    },
    header: {
      marginBottom: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginRight: "auto",
    },
    title: {
      color: colors.text,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    contectContainer: {
      gap: spacing.sm,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    chip: {
      paddingVertical: spacing.xs,
    },
    clearBtn: {
      paddingHorizontal: spacing.sm,
      marginRight: "auto",
    },
    clearBtnText: {
      textDecorationLine: "underline",
      color: colors.linkText,
    },
  });
