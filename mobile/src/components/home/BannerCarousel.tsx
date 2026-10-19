import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { Banner, HomeSection } from "@/types";
import { Href, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
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

const horizontalPadding = spacing.md;

export default function BannerCarousel({ section }: BannerCarouselProps) {
  const { width } = useWindowDimensions();
  const hasBackgroundImage = Boolean(section?.bg_image);
  const carouselWidth =
    width - horizontalPadding * (hasBackgroundImage ? 4 : 2);

  const styles = useStyles(getStyles, carouselWidth, hasBackgroundImage);

  const flatListRef = useRef<FlatList<Banner>>(null);
  const currentIndex = useRef(0);
  const [isTouching, setIsTouching] = useState(false);

  const banners = (section?.items ?? []) as Banner[];

  useEffect(() => {
    if (banners.length === 0) {
      currentIndex.current = 0;
      return;
    }

    currentIndex.current = Math.min(currentIndex.current, banners.length - 1);
  }, [banners.length]);

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

  const CarouselComponent = () => {
    return (
      <>
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
            const index = Math.min(
              Math.max(
                Math.round(event.nativeEvent.contentOffset.x / carouselWidth),
                0,
              ),
              banners.length - 1,
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
      </>
    );
  };

  if (section?.bg_image)
    return (
      <ImageBackground
        source={{ uri: section.bg_image }}
        style={[styles.container, styles.bgImageContainer]}
      >
        <CarouselComponent />
      </ImageBackground>
    );

  return (
    <View style={styles.container}>
      <CarouselComponent />
    </View>
  );
}

const getStyles = (
  colors: ColorsType,
  { width }: ScaledSize,
  carouselWidth: number,
  hasBackgroundImage: boolean,
) =>
  StyleSheet.create({
    container: {
      width: hasBackgroundImage ? width - horizontalPadding * 2 : width,
      backgroundColor: colors.background,
      paddingHorizontal: horizontalPadding,
      marginVertical: spacing.sm,
    },
    bgImageContainer: {
      borderRadius: radius.md,
      overflow: "hidden",
      marginHorizontal: horizontalPadding,
      padding: spacing.md,
    },
    carouselContainer: {
      width: carouselWidth,
      borderRadius: radius.sm,
      overflow: "hidden",
    },
    title: {
      color: hasBackgroundImage ? colors.btnPrimaryText : colors.text,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
      marginBottom: spacing.md,
    },
    image: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: radius.sm,
    },
  });
