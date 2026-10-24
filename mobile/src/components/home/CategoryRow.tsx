import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { Category, HomeSection } from "@/types";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface CategoryRowProps {
  section: HomeSection;
}

export default function CategoryRow({ section }: CategoryRowProps) {
  const styles = useStyles(getStyles);

  const categories = (section?.items ?? []) as Category[];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{section?.title}</Text>
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
              <Text style={styles.categoryName} numberOfLines={1}>
                {item.name}
              </Text>
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
    pillContainer: {
      width: 100,
      borderRadius: radius.sm,
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
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
    },
    categoryName: {
      color: colors.text,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      textAlign: "center",
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      marginVertical: "auto",
    },
  });
