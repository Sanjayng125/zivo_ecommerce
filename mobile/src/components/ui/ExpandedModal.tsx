import { ColorsType } from "@/constants/colors";
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
          <Pressable style={styles.closeBtn} onPress={onCloseModal}>
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
        </View>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
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
      paddingHorizontal: 10,
      paddingBottom: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: 20,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    closeBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      fontSize: 16,
      color: colors.text,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
  });
