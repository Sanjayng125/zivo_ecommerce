import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Footer() {
  const styles = useStyles(getStyles);

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
      marginTop: spacing.xxxl,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xxxl,
      paddingBottom: spacing.xxl,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    brandSection: {
      marginBottom: spacing.xxxl,
      gap: spacing.md,
    },
    brand: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    logo: {
      width: 38,
      height: 38,
    },
    title: {
      color: colors.text,
      fontSize: typography.title.fontSize,
      fontWeight: typography.title.fontWeight,
    },
    description: {
      fontSize: typography.caption.fontSize,
      lineHeight: 21,
      color: colors.textSecondary,
      maxWidth: 320,
    },
    section: {
      marginBottom: spacing.xxl,
    },
    heading: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
      marginBottom: spacing.md,
    },
    link: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    socialRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    socialButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
      backgroundColor: colors.badgeBg,
    },
    socialText: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.body.fontWeight,
      color: colors.badgeText,
    },
    bottom: {
      paddingTop: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    copyright: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
