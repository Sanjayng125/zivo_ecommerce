import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { HomeSection, Product } from "@/types";
import { formatPrice } from "@/utils";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
          return (
            <Pressable
              style={styles.productContainer}
              onPress={() => router.push(`/product/${item.slug}`)}
            >
              <Image
                source={{ uri: item.cover_image }}
                resizeMode="cover"
                style={styles.image}
              />
              <View style={styles.productInfo}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.productName}
                >
                  {item.title}
                </Text>
                <View style={styles.productPriceContainer}>
                  <Text style={styles.productPrice}>
                    {formatPrice(item.base_price)}
                  </Text>
                  {item.rating_count === 0 ? (
                    <Text style={styles.noProductRating}>New</Text>
                  ) : (
                    <Text style={styles.productRating}>
                      ⭐️ {item.rating_avg} {`(${item.rating_count})`}
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
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
    productContainer: {
      width: 200,
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      aspectRatio: 1 / 1,
      resizeMode: "cover",
    },
    productInfo: {
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    productName: {
      height: 20,
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      lineHeight: 20,
      textAlign: "left",
    },
    productPriceContainer: {
      width: "100%",
      minHeight: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    productPrice: {
      color: colors.text,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      textAlign: "center",
    },
    productRating: {
      color: colors.text,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      textAlign: "center",
      paddingVertical: spacing.xs,
    },
    noProductRating: {
      color: colors.success,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      textAlign: "center",
      backgroundColor: colors.badgeBg,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: spacing.xs,
    },
  });
