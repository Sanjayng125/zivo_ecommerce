import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { useMemo } from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Footer() {
  const colors = useColors();

  const styles = useMemo(() => getStyles(colors), [colors]);

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.brand}>
          <Image
            accessibilityLabel="Zivo logo"
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Zivo</Text>
        </View>

        <Text style={styles.description}>
          Discover products you'll love, delivered right to your doorstep.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Quick Links</Text>

        <Pressable>
          <Text style={styles.link}>Shop</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>Categories</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>About Us</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>Contact</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Customer Service</Text>

        <Pressable>
          <Text style={styles.link}>Help Center</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>Shipping & Returns</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>Privacy Policy</Text>
        </Pressable>

        <Pressable>
          <Text style={styles.link}>Terms & Conditions</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Follow Us</Text>

        <View style={styles.socialRow}>
          <Pressable
            style={styles.socialButton}
            onPress={() => openLink("https://instagram.com")}
          >
            <Text style={styles.socialText}>Instagram</Text>
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={() => openLink("https://x.com")}
          >
            <Text style={styles.socialText}>X</Text>
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={() => openLink("https://facebook.com")}
          >
            <Text style={styles.socialText}>Facebook</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Zivo. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      marginTop: 32,
      paddingHorizontal: 20,
      paddingTop: 32,
      paddingBottom: 24,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    brandSection: {
      marginBottom: 28,
      gap: 10,
    },
    brand: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logo: {
      width: 38,
      height: 38,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "700",
    },
    description: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      maxWidth: 320,
    },
    section: {
      marginBottom: 26,
    },
    heading: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },
    link: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 10,
    },
    socialRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    socialButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.badgeBg,
    },
    socialText: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.badgeText,
    },
    bottom: {
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    copyright: {
      fontSize: 12,
      color: colors.subtext,
      textAlign: "center",
    },
  });
