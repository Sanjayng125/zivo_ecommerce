import BannerCarousel from "@/components/home/BannerCarousel";
import CategoryRow from "@/components/home/CategoryRow";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import ProductRow from "@/components/home/ProductRow";
import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { api } from "@/lib/api";
import { HomeSection } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
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

      return res.data?.active_home_sections ?? [];
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isLoading && data.length === 0 ? (
        <>
          <Header />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </>
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          <Header />

          {data.length === 0 && !error && (
            <Text style={styles.empty}>No data available yet</Text>
          )}
          {error && <Text style={styles.error}>{error.message}</Text>}

          {data.map((item) => {
            if (item.type === "banner") {
              return (
                <BannerCarousel
                  banners={item.active_banners ?? []}
                  key={item.id}
                />
              );
            }
            if (item.type === "category_row") {
              return (
                <CategoryRow
                  categories={item.active_categories ?? []}
                  title={item.title}
                  key={item.id}
                />
              );
            }
            if (item.type === "product_row" && item.key === "new_arrivals") {
              return (
                <ProductRow
                  products={item.new_arrivals ?? []}
                  title={item.title}
                  key={item.id}
                />
              );
            }
            if (item.type === "product_row" && item.key === "best_sellers") {
              return (
                <ProductRow
                  products={item.best_sellers ?? []}
                  title={item.title}
                  key={item.id}
                />
              );
            }

            return null;
          })}

          <Footer />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flexGrow: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    empty: {
      fontSize: 24,
      color: colors.text,
      textAlign: "center",
    },
    error: {
      fontSize: 24,
      color: colors.error,
      textAlign: "center",
    },
  });

export default Index;
