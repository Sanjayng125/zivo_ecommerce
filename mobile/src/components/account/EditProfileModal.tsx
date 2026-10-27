import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/hooks/useProfile";
import { useStyles } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import { ProfileSchema, ProfileSchemaType } from "@/lib/schemas";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { toast } from "sonner-native";
import { AppButton } from "../ui/AppButton";
import TextField from "../ui/TextField";

interface EditProfileModalProps {
  style?: StyleProp<ViewStyle>;
}

export default function EditProfileModal({ style }: EditProfileModalProps) {
  const { profile, refetch } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  const styles = useStyles(getStyles);
  const colors = useColors();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
    },
  });

  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (data: ProfileSchemaType) => {
        const res = await authApi.patch("/profile", data);

        return res.data;
      },
      onSuccess: (data) => {
        refetch();
        reset({
          full_name: data?.updated_profile?.full_name ?? "",
          phone: data?.updated_profile?.phone ?? "",
        });

        toast.success(data?.message ?? "Profile updated successfully");
      },
      onError: (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message ?? "Something went wrong";
        reset();

        toast.error(message);
      },
      onSettled: () => {
        setIsOpen(false);
      },
    });

  const onSubmit: SubmitHandler<ProfileSchemaType> = async (data) => {
    updateProfileMutation(data);
  };

  return (
    <>
      <AppButton
        title="Edit Profile"
        onPress={() => setIsOpen(true)}
        style={style}
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
            <Text style={styles.title}>Edit Profile</Text>

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
            <Text style={styles.sectionLabel}>Full Name:</Text>
            <Controller
              control={control}
              name="full_name"
              render={({ field: { onChange, value } }) => (
                <TextField
                  placeholder="Enter full name"
                  value={value}
                  onChangeText={onChange}
                  style={{ marginTop: spacing.sm }}
                  editable={!isUpdatingProfile}
                />
              )}
            />
            {errors.full_name && (
              <Text style={styles.error}>{errors.full_name.message}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Phone:</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <TextField
                  placeholder="Enter phone number"
                  value={value}
                  onChangeText={onChange}
                  style={{ marginTop: spacing.sm }}
                  editable={!isUpdatingProfile}
                />
              )}
            />
            {errors.phone && (
              <Text style={styles.error}>{errors.phone.message}</Text>
            )}
          </View>

          <AppButton
            title="Update Profile"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || !isDirty}
            loading={isUpdatingProfile}
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
