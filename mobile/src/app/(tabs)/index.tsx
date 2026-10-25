import BannerCarousel from "@/components/home/BannerCarousel";
import CategoryRow from "@/components/home/CategoryRow";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import ProductRow from "@/components/home/ProductRow";
import StickySearchBar from "@/components/home/StickySearchBar";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { AppButton } from "@/components/ui/AppButton";
import { ColorsType } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { api } from "@/lib/api";
import { HomeSection } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
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
      <ScreenWrapper edges={["top"]} stickyHeaderIndices={[1]}>
        <Header />
        <StickySearchBar />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper
        edges={["top"]}
        stickyHeaderIndices={[1]}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
      >
        <Header />
        <StickySearchBar />

        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Couldn't load home.</Text>

          <AppButton title="Retry" onPress={() => refetch()} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      edges={["top"]}
      stickyHeaderIndices={[1]}
      refreshing={isRefetching}
      onRefresh={handleRefresh}
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
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
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
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
  });

export default HomeScreen;
