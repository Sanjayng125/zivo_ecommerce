import { ColorsType } from "@/constants/colors";
import { useStyles } from "@/hooks/useStyles";
import { ProductImage } from "@/types";
import { useRef } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScaledSize,
  StyleSheet,
  View,
} from "react-native";

interface CarouselProps {
  images: ProductImage[];
}

export default function ProductCarousel({ images }: CarouselProps) {
  const mainFlatListRef = useRef<FlatList<ProductImage>>(null);

  const styles = useStyles(getStyles);

  const handleImagePress = (item: ProductImage) => {
    const index = images.findIndex((image) => image.id === item.id);

    mainFlatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={mainFlatListRef}
        style={styles.list}
        data={images}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
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
        renderItem={({ item }) => (
          <Pressable
            style={styles.buttonContainer}
            onPress={() => handleImagePress(item)}
          >
            <Image source={{ uri: item.url }} style={styles.buttonImage} />
          </Pressable>
        )}
      />
    </View>
  );
}

const getStyles = (colors: ColorsType, { width }: ScaledSize) =>
  StyleSheet.create({
    container: {
      gap: 10,
    },
    list: {
      flexGrow: 0,
      flexShrink: 0,
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
      gap: 6,
      paddingHorizontal: 10,
    },
    buttonContainer: {
      width: width * 0.2,
      borderWidth: 2,
      borderRadius: 6,
      borderColor: colors.border,
      overflow: "hidden",
    },
    buttonImage: {
      width: "100%",
      aspectRatio: 1 / 1,
      resizeMode: "cover",
    },
  });
