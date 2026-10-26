import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { HomeSection, Product } from "@/types";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ProductCard from "../product/ProductCard";

interface ProductRowProps {
  section: HomeSection;
}

export default function ProductRow({ section }: ProductRowProps) {
  const styles = useStyles(getStyles);

  const products = (section?.items ?? []) as Product[];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{section?.title}</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          return <ProductCard product={item} />;
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
