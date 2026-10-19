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
  RefreshControl,
  ScaledSize,
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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        stickyHeaderIndices={[1]}
      >
        <Header />
        <StickySearchBar />

        {isLoading && data?.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text} />
          </View>
        ) : (
          <>
            {data.length === 0 && !error && (
              <Text style={styles.empty}>No data available yet</Text>
            )}
            {error && <Text style={styles.error}>{error.message}</Text>}

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
          </>
        )}

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors: ColorsType, { height }: ScaledSize) =>
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
      minHeight: height * 0.75,
      justifyContent: "center",
      alignItems: "center",
    },
    empty: {
      fontSize: typography.body.fontSize,
      color: colors.text,
      textAlign: "center",
    },
    error: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },
  });

export default Index;
