import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useStyles } from "@/hooks/useStyles";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScaledSize,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ActionMenuOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  icon?: React.ReactNode;
}

interface ActionMenuProps {
  title?: string;
  options: ActionMenuOption[];
  children: React.ReactNode;
}

export default function ActionMenu({
  title,
  options,
  children,
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const styles = useStyles(getStyles, bottom);

  return (
    <>
      <Pressable onPress={() => setIsOpen(!isOpen)}>{children}</Pressable>
      <Modal
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
        transparent={true}
        animationType="fade"
        style={styles.container}
      >
        <Pressable onPress={() => setIsOpen(false)} style={styles.overlay}>
          <View style={styles.content} onStartShouldSetResponder={() => true}>
            {title && (
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
              </View>
            )}
            {options.map((option, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  option.onPress();
                  setIsOpen(false);
                }}
                style={[
                  styles.option,
                  option.destructive && styles.destructiveOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.destructive && styles.destructiveOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {option.icon && option.icon}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const getStyles = (colors: ColorsType, _: ScaledSize, bottom: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
      paddingBottom: bottom,
    },
    content: {
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      gap: spacing.sm,
    },
    header: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      color: colors.text,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    option: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.btnSecondaryBg,
    },
    optionText: {
      color: colors.btnSecondaryText,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    destructiveOption: {
      backgroundColor: colors.error,
    },
    destructiveOptionText: {
      color: colors.btnPrimaryText,
    },
  });
