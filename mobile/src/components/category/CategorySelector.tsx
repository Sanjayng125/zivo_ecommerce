import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCategories } from "@/hooks/useCategories";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Category, CategoryWithSubcategories } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScaledSize,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { EdgeInsets } from "react-native-safe-area-context";
import { AppButton } from "../ui/AppButton";
import CategoryPill from "./CategoryPill";
import CategorySelectorEmpty from "./CategorySelectorEmpty";

interface CategorySelectorProps {
  onSelectCategory?: (category: Category) => void;
  selectedCategory?: Category | null;
}

export default function CategorySelector({
  onSelectCategory,
  selectedCategory,
}: CategorySelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<CategoryWithSubcategories | null>(null);

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCategories();

  const subListHorizontalPadding = spacing.sm * 2;
  const subColumnGaps = spacing.xs * 3;
  const [subListWidth, setSubListWidth] = useState<number | null>(null);
  const subPillWidth =
    subListWidth === null
      ? undefined
      : Math.max(
          0,
          (subListWidth - subListHorizontalPadding - subColumnGaps) / 4,
        );

  const styles = useStyles(getStyles);
  const colors = useColors();

  const handleSelectCategory = (category: CategoryWithSubcategories) => {
    if (category?.subcategories?.length === 0) {
      setSelectedParentCategory(category);
      onSelectCategory?.(category);
      setIsModalOpen(false);
    } else if (
      (!selectedParentCategory || selectedParentCategory.id !== category.id) &&
      category?.subcategories
    ) {
      setSelectedParentCategory(category);
      return;
    } else if (selectedParentCategory) {
      onSelectCategory?.(category);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedParentCategory(null);
    }
  }, [isModalOpen]);

  return (
    <>
      <AppButton
        title={selectedCategory ? selectedCategory.name : "Select Category"}
        onPress={() => setIsModalOpen(true)}
        variant="outline"
        rightIcon={
          <Ionicons name="chevron-down" size={22} color={colors.text} />
        }
      />
      <Modal
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        animationType="slide"
        presentationStyle="pageSheet"
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Select Category</Text>

            <AppButton
              onPress={() => setIsModalOpen(false)}
              size="sm"
              variant="ghost"
              leftIcon={<Ionicons name="close" size={22} color={colors.text} />}
            />
          </View>

          <Text style={styles.subTitle}>
            Tap a parent category with subcategories 2 times to select it
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={"large"} color={colors.text} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Couldn't load categories.</Text>

            <AppButton title="Retry" onPress={() => refetch()} />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <FlatList
              style={styles.parentList}
              data={data}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.parentListContentContainer}
              renderItem={({ item }) => {
                return (
                  <CategoryPill
                    item={item}
                    onPress={(category) =>
                      handleSelectCategory(
                        category as CategoryWithSubcategories,
                      )
                    }
                    imageStyle={[
                      styles.pillImageContainer,
                      selectedParentCategory?.id === item.id &&
                        styles.selectedCategory,
                    ]}
                  />
                );
              }}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
            />

            <FlatList
              style={styles.subList}
              onLayout={({ nativeEvent: { layout } }) =>
                setSubListWidth(layout.width)
              }
              data={selectedParentCategory?.subcategories ?? []}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.subListContentContainer}
              numColumns={4}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => {
                return (
                  <CategoryPill
                    item={item}
                    onPress={(category) =>
                      handleSelectCategory(
                        category as CategoryWithSubcategories,
                      )
                    }
                    containerStyle={[
                      styles.pillContainer,
                      { width: subPillWidth },
                    ]}
                    imageStyle={[
                      styles.pillImageContainer,
                      { backgroundColor: colors.surface },
                    ]}
                  />
                );
              }}
              ListEmptyComponent={
                <CategorySelectorEmpty
                  selectedCategory={selectedParentCategory}
                />
              }
            />
          </View>
        )}
      </Modal>
    </>
  );
}

const getStyles = (colors: ColorsType, _: ScaledSize, { top }: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingBottom: spacing.xl,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      marginTop: top + spacing.md,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xl,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: typography.title.fontSize,
      fontWeight: typography.title.fontWeight,
      color: colors.text,
    },
    subTitle: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.title.fontWeight,
      color: colors.textSecondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
    },
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },

    contentContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "stretch",
    },
    parentList: {
      flexGrow: 0,
      flexShrink: 0,
    },
    parentListContentContainer: {
      flexGrow: 1,
      alignSelf: "stretch",
      paddingVertical: spacing.md,
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xxxl * 3,
      backgroundColor: colors.surface,
    },
    pillContainer: {
      backgroundColor: "transparent",
    },
    pillImageContainer: {
      borderRadius: radius.full,
      borderWidth: 3,
      borderColor: "transparent",
    },

    subList: {
      flex: 1,
    },
    subListContentContainer: {
      flexGrow: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.xxxl * 3,
      backgroundColor: colors.background,
    },
    columnWrapper: {
      gap: spacing.xs,
    },
    selectedCategory: {
      borderColor: colors.primary,
    },
  });
