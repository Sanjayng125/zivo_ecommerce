import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useWishlist } from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "./product/ProductCard";

export const WishlistSection = () => {
  const { data: wishlistItems, isLoading, error } = useWishlist();

  const styles = useStyles(getStyles);
  const colors = useColors();

  if (error || !wishlistItems?.length) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.header}
        onPress={() => router.push("/wishlist")}
      >
        <Text style={styles.title}>Wishlist</Text>
        <Ionicons name="heart" size={24} color={colors.error} />
        <Ionicons name="chevron-forward-sharp" size={20} color={colors.text} />
      </TouchableOpacity>

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
          {wishlistItems.map((item) => (
            <ProductCard product={item} size="sm" key={item.id} />
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
