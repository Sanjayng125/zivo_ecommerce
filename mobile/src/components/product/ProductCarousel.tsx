import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { ProductImage } from "@/types";
import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScaledSize,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

interface CarouselProps {
  images: ProductImage[];
}

const BUTTON_IMG_PADDING = spacing.sm;
const BUTTON_IMG_GAP = radius.sm;
const BUTTON_IMG_VISIBLE_COUNT = 4;

export default function ProductCarousel({ images }: CarouselProps) {
  const { width } = useWindowDimensions();
  const carouselWidth = width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainFlatListRef = useRef<FlatList<ProductImage>>(null);

  const BUTTON_IMG_WIDTH =
    (width -
      BUTTON_IMG_PADDING * 2 -
      BUTTON_IMG_GAP * (BUTTON_IMG_VISIBLE_COUNT - 1)) /
    BUTTON_IMG_VISIBLE_COUNT;
  const styles = useStyles(getStyles, BUTTON_IMG_WIDTH);
  const colors = useColors();

  const handleImagePress = (index: number) => {
    setCurrentIndex(index);
    mainFlatListRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={mainFlatListRef}
        data={images}
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

          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.url }} style={styles.image} />
          </View>
        )}
      />
      <FlatList
        style={styles.buttonList}
        contentContainerStyle={styles.buttonContent}
        data={images}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            style={[
              styles.buttonContainer,
              currentIndex === index && styles.buttonContainerActive,
            ]}
            onPress={() => handleImagePress(index)}
          >
            <Image source={{ uri: item.url }} style={styles.buttonImage} />
          </Pressable>
        )}
      />
    </View>
  );
}

const getStyles = (
  colors: ColorsType,
  { width }: ScaledSize,
  buttonImageWidth: number,
) =>
  StyleSheet.create({
    container: {
      gap: spacing.md,
      position: "relative",
    },
    imageContainer: {
      width,
    },
    image: {
      width: "100%",
      aspectRatio: 1 / 1,
      resizeMode: "contain",
    },
    buttonList: {
      paddingBottom: 10,
    },
    buttonContent: {
      gap: spacing.sm,
      paddingHorizontal: 10,
    },
    buttonContainer: {
      width: buttonImageWidth,
      borderWidth: 2,
      borderRadius: radius.sm,
      borderColor: colors.border,
      overflow: "hidden",
    },
    buttonContainerActive: {
      borderColor: colors.primary,
      borderWidth: 3,
    },
    buttonImage: {
      width: "100%",
      aspectRatio: 1 / 1,
      resizeMode: "cover",
    },
  });
