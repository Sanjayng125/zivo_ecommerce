import CheckoutFooter from "@/components/checkout/CheckoutFooter";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutItem from "@/components/checkout/CheckoutItem";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import HorizontalSeparator from "@/components/ui/HorizontalSeparator";
import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const SummaryScreen = () => {
  const { items, cartCount } = useCart();

  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <ScreenWrapper edges={["top"]} scrollable={false}>
      <CheckoutHeader count={cartCount} />

      <FlatList
        data={items}
        contentContainerStyle={styles.contentContainer}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <CheckoutItem item={item} />}
        ItemSeparatorComponent={
          <HorizontalSeparator
            backgroundColor={colors.surface}
            style={{ paddingHorizontal: spacing.sm }}
          />
        }
        ListFooterComponent={<CheckoutFooter />}
      />
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      flexGrow: 1,
      paddingBottom: spacing.lg,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.lg,
    },
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
  });

export default SummaryScreen;
