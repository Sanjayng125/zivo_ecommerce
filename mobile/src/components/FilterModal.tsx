import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppButton } from "./ui/AppButton";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  type: "single" | "range";
  options: FilterOption[];
  range?: {
    min: number;
    max: number;
    step?: number;
    format?: (value: number) => string;
  };
}

export type FilterValues = Record<
  string,
  string | { min: number; max: number }
>;

interface FilterModalProps {
  isOpen: boolean;
  onCloseModal: () => void;
  title: string;
  groups: FilterGroup[];
  values: FilterValues;
  onApply: (values: FilterValues) => void;
  onReset: () => void;
  defaultValues: FilterValues;
}

export default function FilterModal({
  isOpen,
  onCloseModal,
  title,
  groups,
  values,
  defaultValues,
  onApply,
  onReset,
}: FilterModalProps) {
  const styles = useStyles(getStyles);
  const colors = useColors();
  const [internal, setInternal] = useState<FilterValues>(values);

  useEffect(() => {
    if (isOpen) setInternal(values);
  }, [isOpen]);

  const handleSelect = (group: FilterGroup, optionValue: string) => {
    setInternal((prev) => {
      return { ...prev, [group.key]: optionValue };
    });
  };

  const isSelected = (group: FilterGroup, optionValue: string): boolean => {
    const current = internal[group.key];
    return current === optionValue;
  };

  const handleApply = () => {
    onApply(internal);
    onCloseModal();
  };

  const handleReset = () => {
    setInternal(defaultValues);
    onReset();
    onCloseModal();
  };

  const hasChanges = JSON.stringify(internal) !== JSON.stringify(defaultValues);

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

          <AppButton
            onPress={onCloseModal}
            size="sm"
            variant="ghost"
            leftIcon={<Ionicons name="close" size={22} color={colors.text} />}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group, i) => (
          <View
            key={group.key}
            style={[styles.group, i < groups.length - 1 && styles.groupBorder]}
          >
            <Text style={styles.groupLabel}>{group.label}</Text>
            {group.type === "single" && (
              <View style={styles.chips}>
                {group.options.map((option) => {
                  const selected = isSelected(group, option.value);
                  return (
                    <Pressable
                      key={option.value}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => handleSelect(group, option.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selected && styles.chipTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {group.type === "range" && group.range && (
              <View style={styles.rangeContainer}>
                <View style={styles.rangeLabels}>
                  <Text style={styles.rangeValue}>
                    {group.range.format
                      ? group.range.format(
                          (internal[group.key] as any)?.min ?? group.range.min,
                        )
                      : ((internal[group.key] as any)?.min ?? group.range.min)}
                  </Text>
                  <Text style={styles.rangeValue}>
                    {group.range.format
                      ? group.range.format(
                          (internal[group.key] as any)?.max ?? group.range.max,
                        )
                      : ((internal[group.key] as any)?.max ?? group.range.max)}
                  </Text>
                </View>

                <View style={styles.rangeInputs}>
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeInputLabel}>Min (In Paise)</Text>
                    <TextInput
                      style={styles.rangeInput}
                      keyboardType="numeric"
                      value={String(
                        (internal[group.key] as any)?.min ?? group.range.min,
                      )}
                      onChangeText={(text) => {
                        const val = Number(text);
                        if (isNaN(val)) return;
                        setInternal((prev) => ({
                          ...prev,
                          [group.key]: {
                            ...(prev[group.key] as any),
                            min: Math.min(
                              val,
                              (prev[group.key] as any)?.max ?? group.range!.max,
                            ),
                          },
                        }));
                      }}
                    />
                  </View>

                  <View style={styles.rangeDivider} />
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeInputLabel}>Max (In Paise)</Text>
                    <TextInput
                      style={styles.rangeInput}
                      keyboardType="numeric"
                      value={String(
                        (internal[group.key] as any)?.max ?? group.range.max,
                      )}
                      onChangeText={(text) => {
                        const val = Number(text);
                        if (isNaN(val)) return;
                        setInternal((prev) => ({
                          ...prev,
                          [group.key]: {
                            ...(prev[group.key] as any),
                            max: Math.max(
                              val,
                              (prev[group.key] as any)?.min ?? group.range!.min,
                            ),
                          },
                        }));
                      }}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title="Reset"
          variant="outline"
          onPress={handleReset}
          style={styles.footerBtn}
          disabled={!hasChanges}
        />
        <AppButton
          title="Apply"
          onPress={handleApply}
          style={styles.footerBtn}
        />
      </View>
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
      paddingHorizontal: spacing.sm,
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      gap: spacing.lg,
    },
    group: {
      gap: spacing.md,
      paddingBottom: spacing.lg,
    },
    groupBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    groupLabel: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipSelected: {
      borderColor: colors.btnPrimaryBg,
      backgroundColor: colors.btnPrimaryBg,
    },
    chipText: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    chipTextSelected: {
      color: colors.btnPrimaryText,
    },
    rangeContainer: {
      gap: spacing.sm,
    },
    rangeLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rangeValue: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
      fontWeight: typography.heading.fontWeight,
    },
    rangeInputs: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    rangeInputContainer: {
      flex: 1,
      gap: spacing.xs,
    },
    rangeInputLabel: {
      fontSize: typography.caption.fontSize,
      color: colors.textSecondary,
    },
    rangeInput: {
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: colors.inputText,
      fontSize: typography.body.fontSize,
    },
    rangeDivider: {
      width: spacing.md,
      height: 1,
      backgroundColor: colors.border,
      marginTop: spacing.xl,
    },
    footer: {
      flexDirection: "row",
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerBtn: {
      flex: 1,
    },
  });
