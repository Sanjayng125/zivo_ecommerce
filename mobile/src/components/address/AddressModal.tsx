import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import { AddressSchema, AddressSchemaType } from "@/lib/schemas";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { AppButton } from "../ui/AppButton";
import Checkbox from "../ui/CheckBox";
import TextField from "../ui/TextField";

interface AddressModalProps {
  isOpen: boolean;
  onCloseModal: () => void;
  onSuccess?: () => void;
  address?: Address;
}

export default function AddressModal({
  isOpen,
  onCloseModal,
  address,
}: AddressModalProps) {
  const styles = useStyles(getStyles);
  const colors = useColors();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<AddressSchemaType>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      is_default: false,
    },
  });

  useEffect(() => {
    if (address) {
      reset({
        full_name: address.full_name,
        phone: address.phone,
        line1: address.line1,
        line2: address?.line2 ?? undefined,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        is_default: address.is_default,
      });
    }
  }, [address]);

  const { mutate: createAddressMutation, isPending: isCreatingAddress } =
    useMutation({
      mutationFn: async (data: AddressSchemaType) => {
        const res = await authApi.post(`/addresses`, data);

        return res.data;
      },
      onSuccess: (res) => {
        Toast.show({
          type: "success",
          text1: res?.message ?? "Address created successfully",
        });
        reset({
          full_name: "",
          phone: "",
          line1: "",
          city: "",
          state: "",
          pincode: "",
          is_default: false,
        });
        queryClient.refetchQueries({ queryKey: ["addresses"] });
      },
      onError: (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message ?? "Something went wrong";
        Toast.show({
          type: "error",
          text1: message,
        });
      },
      onSettled: () => onCloseModal(),
    });

  const { mutate: updateAddressMutation, isPending: isUpdatingAddress } =
    useMutation({
      mutationFn: async (data: AddressSchemaType) => {
        const res = await authApi.patch(`/addresses/${address?.id}`, data);

        return res.data;
      },
      onSuccess: (res) => {
        Toast.show({
          type: "success",
          text1: res?.message ?? "Address updated successfully",
        });
        reset({
          full_name: res?.updated_address?.full_name ?? "",
          phone: res?.updated_address?.phone ?? "",
          line1: res?.updated_address?.line1 ?? "",
          line2: res?.updated_address?.line2 ?? undefined,
          city: res?.updated_address?.city ?? "",
          state: res?.updated_address?.state ?? "",
          pincode: res?.updated_address?.pincode ?? "",
          is_default: res?.updated_address?.is_default ?? false,
        });
        queryClient.refetchQueries({ queryKey: ["addresses"] });
      },
      onError: (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message ?? "Something went wrong";
        Toast.show({
          type: "error",
          text1: message,
        });
      },
      onSettled: () => onCloseModal(),
    });

  const onSubmit: SubmitHandler<AddressSchemaType> = async (data) => {
    if (address) {
      updateAddressMutation(data);
      return;
    }
    createAddressMutation(data);
  };

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
          <Text style={styles.title}>
            {address ? "Edit Address" : "Add New Address"}
          </Text>
          <Pressable onPress={onCloseModal}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
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
                editable={!isCreatingAddress || !isUpdatingAddress}
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
                editable={!isCreatingAddress || !isUpdatingAddress}
              />
            )}
          />
          {errors.phone && (
            <Text style={styles.error}>{errors.phone.message}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Address Line 1:</Text>
          <Controller
            control={control}
            name="line1"
            render={({ field: { onChange, value } }) => (
              <TextField
                placeholder="Enter address line 1"
                textArea
                value={value}
                onChangeText={onChange}
                style={{ marginTop: spacing.sm }}
                editable={!isCreatingAddress || !isUpdatingAddress}
              />
            )}
          />
          {errors.line1 && (
            <Text style={styles.error}>{errors.line1.message}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Address Line 2:</Text>
          <Controller
            control={control}
            name="line2"
            render={({ field: { onChange, value } }) => (
              <TextField
                placeholder="Enter address line 2 (optional)"
                textArea
                value={value}
                onChangeText={onChange}
                style={{ marginTop: spacing.sm }}
                editable={!isCreatingAddress || !isUpdatingAddress}
              />
            )}
          />
          {errors.line2 && (
            <Text style={styles.error}>{errors.line2.message}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>City:</Text>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <TextField
                placeholder="Enter city number"
                value={value}
                onChangeText={onChange}
                style={{ marginTop: spacing.sm }}
                editable={!isCreatingAddress || !isUpdatingAddress}
              />
            )}
          />
          {errors.city && (
            <Text style={styles.error}>{errors.city.message}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>State:</Text>
          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => (
              <TextField
                placeholder="Enter state number"
                value={value}
                onChangeText={onChange}
                style={{ marginTop: spacing.sm }}
                editable={!isCreatingAddress || !isUpdatingAddress}
              />
            )}
          />
          {errors.state && (
            <Text style={styles.error}>{errors.state.message}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pincode:</Text>
          <Controller
            control={control}
            name="pincode"
            render={({ field: { onChange, value } }) => (
              <TextField
                placeholder="Enter pincode number"
                value={value}
                onChangeText={onChange}
                style={{ marginTop: spacing.sm }}
                editable={!isCreatingAddress || !isUpdatingAddress}
              />
            )}
          />
          {errors.pincode && (
            <Text style={styles.error}>{errors.pincode.message}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Is Default Address:</Text>
          <Controller
            control={control}
            name="is_default"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                checked={value}
                onChange={onChange}
                label="Make this my default address"
                style={{ marginTop: spacing.sm }}
              />
            )}
          />
          {errors.is_default && (
            <Text style={styles.error}>{errors.is_default.message}</Text>
          )}
        </View>

        <AppButton
          title={address ? "Update Address" : "Add Address"}
          onPress={handleSubmit(onSubmit)}
          disabled={
            isCreatingAddress || isUpdatingAddress || !isValid || !isDirty
          }
          loading={isCreatingAddress || isUpdatingAddress}
          style={{ marginTop: spacing.xl }}
        />
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
    subtitle: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      color: colors.textSecondary,
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
