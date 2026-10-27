import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import { ChangePasswordSchema, ChangePasswordSchemaType } from "@/lib/schemas";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";
import { AppButton } from "../ui/AppButton";
import TextField from "../ui/TextField";
import SettingsRow from "./SettingsRow";

export default function ChangePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);

  const styles = useStyles(getStyles);
  const colors = useColors();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: updatePasswordMutation, isPending: isUpdatingPassword } =
    useMutation({
      mutationFn: async (data: ChangePasswordSchemaType) => {
        const res = await authApi.post("/auth/change-password", data);

        return res.data;
      },
      onSuccess: (data) => {
        toast.success(data?.message ?? "Password changed successfully");

        setIsOpen(false);
      },
      onError: (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message ?? "Something went wrong";

        toast.error(message);
      },
      onSettled: () => {
        setIsOpen(false);
        reset();
      },
    });

  const onSubmit: SubmitHandler<ChangePasswordSchemaType> = async (data) => {
    updatePasswordMutation(data);
  };

  return (
    <>
      <SettingsRow
        label="Change Password"
        icon="lock-closed-outline"
        onPress={() => setIsOpen(true)}
      />
      <Modal
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
        animationType="slide"
        presentationStyle="pageSheet"
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Change Password</Text>

            <AppButton
              onPress={() => setIsOpen(false)}
              size="sm"
              variant="ghost"
              leftIcon={<Ionicons name="close" size={22} color={colors.text} />}
            />
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Password:</Text>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, value } }) => (
                <TextField
                  placeholder="Enter current password"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  style={{ marginTop: spacing.sm }}
                  editable={!isUpdatingPassword}
                />
              )}
            />
            {errors.currentPassword && (
              <Text style={styles.error}>{errors.currentPassword.message}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>New Password:</Text>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value } }) => (
                <TextField
                  placeholder="Enter new password"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  style={{ marginTop: spacing.sm }}
                  editable={!isUpdatingPassword}
                />
              )}
            />
            {errors.newPassword && (
              <Text style={styles.error}>{errors.newPassword.message}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Confirm Password:</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <TextField
                  placeholder="Enter confirm password"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  style={{ marginTop: spacing.sm }}
                  editable={!isUpdatingPassword}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword.message}</Text>
            )}
          </View>

          <AppButton
            title="Change Password"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || !isDirty}
            loading={isUpdatingPassword}
            style={{ marginTop: spacing.xl }}
          />
        </ScrollView>
      </Modal>
    </>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xxxl,
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
    section: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    sectionLabel: {
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    error: {
      color: colors.error,
      fontSize: typography.caption.fontSize,
      marginTop: spacing.xs,
      paddingHorizontal: spacing.xs,
    },
  });
