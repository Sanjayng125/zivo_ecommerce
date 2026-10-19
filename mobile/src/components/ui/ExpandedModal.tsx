import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ExpandedModalProps {
  isOpen: boolean;
  onCloseModal: () => void;
  title: string;
  subtitle?: string;
  content: string;
}

export default function ExpandedModal({
  isOpen,
  onCloseModal,
  title,
  subtitle,
  content,
}: ExpandedModalProps) {
  const styles = useStyles(getStyles);
  const colors = useColors();

  return (
    <Modal
      visible={isOpen}
      onRequestClose={onCloseModal}
      animationType="slide"
      presentationStyle="pageSheet"
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onCloseModal}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.content}>{content}</Text>
      </ScrollView>
    </Modal>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      marginTop: spacing.xl,
    },
    header: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.md,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: typography.title.fontSize,
      fontWeight: typography.title.fontWeight,
      color: colors.text,
    },
    subtitle: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      color: colors.textSecondary,
    },
    content: {
      fontSize: typography.body.fontSize,
      color: colors.text,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
    },
  });
