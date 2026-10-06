import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { Product } from "@/types";
import { formatPrice } from "@/utils";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ProductRowProps {
  products: Product[];
  title: string;
}

export default function ProductRow({ products, title }: ProductRowProps) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
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
      paddingHorizontal: 14,
      marginTop: 20,
    },
    header: {
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
    },
    listContainer: {
      marginVertical: 10,
      gap: 10,
    },
    productContainer: {
      width: 200,
      borderRadius: 6,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      aspectRatio: 1 / 1,
      resizeMode: "cover",
    },
    productInfo: {
      gap: 8,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    productName: {
      height: 20,
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "700",
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
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
    },
    productRating: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
      paddingVertical: 2,
    },
    noProductRating: {
      color: colors.success,
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
      backgroundColor: colors.badgeBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
  });
