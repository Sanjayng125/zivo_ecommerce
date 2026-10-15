import { ColorsType } from "@/constants/colors";
import { useStyles } from "@/hooks/useStyles";
import { Banner, HomeSection } from "@/types";
import { Href, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScaledSize,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

interface BannerCarouselProps {
  section: HomeSection;
}

const horizontalPadding = 14;

export default function BannerCarousel({ section }: BannerCarouselProps) {
  const { width } = useWindowDimensions();
  const carouselWidth = width - horizontalPadding * 2;

  const styles = useStyles(getStyles);

  const flatListRef = useRef<FlatList<Banner>>(null);
  const currentIndex = useRef(0);
  const [isTouching, setIsTouching] = useState(false);

  const banners = (section?.items ?? []) as Banner[];

  useEffect(() => {
    if (banners.length <= 1 || isTouching) return;

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % banners.length;

      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length, isTouching]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {section?.title && <Text style={styles.title}>{section.title}</Text>}
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        getItemLayout={(_, index) => ({
          length: carouselWidth,
          offset: carouselWidth * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / carouselWidth,
          );

          currentIndex.current = index;
        }}
        onScrollBeginDrag={() => setIsTouching(true)}
        onScrollEndDrag={() => setIsTouching(false)}
        onTouchStart={() => setIsTouching(true)}
        onTouchEnd={() => setIsTouching(false)}
        onTouchCancel={() => setIsTouching(false)}
        renderItem={({ item }) => (
          <Pressable
            style={styles.carouselContainer}
            onPress={() => item.link && router.push(item.link as Href)}
          >
            <Image
              source={{ uri: item.image_url }}
              resizeMode="cover"
              style={styles.image}
            />
          </Pressable>
        )}
      />
    </View>
  );
}

const getStyles = (colors: ColorsType, { width }: ScaledSize) =>
  StyleSheet.create({
    container: {
      width,
      backgroundColor: colors.background,
      paddingHorizontal: horizontalPadding,
    },
    carouselContainer: {
      width: width - horizontalPadding * 2,
      borderRadius: 6,
      overflow: "hidden",
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 10,
    },
    image: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 6,
    },
  });
