import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useStyles } from "@/hooks/useStyles";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProductCard from "./product/ProductCard";

export const RecentlyViewedSection = () => {
  const {
    data: recentlyViewedProducts,
    isLoading,
    error,
  } = useRecentlyViewed();

  const styles = useStyles(getStyles);
  const colors = useColors();

  if (error) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recently Viewed</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.text} />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {recentlyViewedProducts.map((item) => (
            <View key={item.id}>
              <ProductCard product={item} size="sm" />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.lg,
    },
    loadingContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: spacing.md,
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
    listContainer: {
      marginVertical: spacing.md,
      gap: spacing.md,
    },
  });
