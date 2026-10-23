import BannerCarousel from "@/components/home/BannerCarousel";
import CategoryRow from "@/components/home/CategoryRow";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import ProductRow from "@/components/home/ProductRow";
import StickySearchBar from "@/components/home/StickySearchBar";
import { ColorsType } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { api } from "@/lib/api";
import { HomeSection } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const queryClient = useQueryClient();
  const colors = useColors();

  const styles = useStyles(getStyles);

  const {
    data = [],
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQuery<HomeSection[]>({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await api.get("/home");

      return res.data?.home_sections ?? [];
    },
  });

  const handleRefresh = () => {
    refetch();
    queryClient.refetchQueries({
      queryKey: ["address"],
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
          stickyHeaderIndices={[1]}
        >
          <Header />
          <StickySearchBar />

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
          stickyHeaderIndices={[1]}
        >
          <Header />
          <StickySearchBar />

          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Couldn't load home.</Text>
            <Pressable style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        stickyHeaderIndices={[1]}
      >
        <Header />
        <StickySearchBar />

        {data.length === 0 && !error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No data available yet</Text>
          </View>
        ) : (
          <>
            {data.map((item) => {
              if (item.type === "banner") {
                return <BannerCarousel section={item} key={item.id} />;
              }
              if (item.type === "category_row") {
                return <CategoryRow section={item} key={item.id} />;
              }
              if (item.type === "product_row") {
                return <ProductRow section={item} key={item.id} />;
              }

              return null;
            })}
            <Footer />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
    },
    loadingContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
    },
    emptyContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    empty: {
      fontSize: typography.body.fontSize,
      color: colors.text,
      textAlign: "center",
    },
    retryButton: {
      backgroundColor: colors.btnPrimaryBg,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    retryButtonText: {
      color: colors.btnPrimaryText,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
  });

export default Index;
