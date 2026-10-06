import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { Category } from "@/types";
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

interface CategoryRowProps {
  categories: Category[];
  title: string;
}

export default function CategoryRow({ categories, title }: CategoryRowProps) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={styles.pillContainer}
              onPress={() => router.push(`/category/${item.slug}`)}
            >
              {item?.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  resizeMode="cover"
                  style={styles.image}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.categoryName}>{item.name}</Text>
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
    pillContainer: {
      width: 100,
      borderRadius: 6,
      backgroundColor: colors.surface,
      alignItems: "center",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      aspectRatio: 1 / 1,
      resizeMode: "cover",
    },
    imagePlaceholder: {
      width: "100%",
      aspectRatio: 1 / 1,
      backgroundColor: colors.badgeBg,
      justifyContent: "center",
      alignItems: "center",
    },
    placeholderText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "700",
    },
    categoryName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
      marginVertical: "auto",
    },
  });
