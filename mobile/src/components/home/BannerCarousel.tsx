import { ColorsType } from "@/constants/colors";
import { useStyles } from "@/hooks/useStyles";
import { Banner } from "@/types";
import { useEffect, useRef } from "react";
import {
  FlatList,
  Image,
  ScaledSize,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

interface BannerCarouselProps {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const { width } = useWindowDimensions();

  const styles = useStyles(getStyles);

  const flatListRef = useRef<FlatList<Banner>>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % banners.length;

      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <FlatList
      ref={flatListRef}
      data={banners}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      getItemLayout={(_, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);

        currentIndex.current = index;
      }}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <Image
            source={{ uri: item.image_url }}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
      )}
    />
  );
}

const getStyles = (colors: ColorsType, { width }: ScaledSize) =>
  StyleSheet.create({
    container: {
      width,
      backgroundColor: colors.background,
    },
    image: {
      width: "100%",
      aspectRatio: 16 / 9,
    },
  });
