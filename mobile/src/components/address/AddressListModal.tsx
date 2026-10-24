import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useAddress } from "@/hooks/useAddress";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useAuthStore } from "@/store/authStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { AppButton } from "../ui/AppButton";
import HorizontalSeparator from "../ui/HorizontalSeparator";
import AddressItem from "./AddressItem";
import AddressModal from "./AddressModal";

interface AddressListModalProps {
  isOpen: boolean;
  onCloseModal: () => void;
}

export default function AddressListModal({
  isOpen,
  onCloseModal,
}: AddressListModalProps) {
  const { token } = useAuthStore();
  const { addresses, isLoading, refetch, isRefetching } = useAddress();
  const styles = useStyles(getStyles);
  const colors = useColors();

  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  const handleRefresh = () => {
    if (token && !isLoading) refetch?.();
  };

  return (
    <Modal
      visible={isOpen}
      onRequestClose={onCloseModal}
      animationType="slide"
      presentationStyle="pageSheet"
      style={styles.container}
    >
      <Toast position="bottom" />
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Addresses</Text>

          <AppButton
            onPress={onCloseModal}
            size="sm"
            variant="ghost"
            leftIcon={<Ionicons name="close" size={22} color={colors.text} />}
          />
        </View>
        <Text style={styles.subtitle} numberOfLines={2}>
          {!token
            ? "Looks like you're signed out. Please sign-in to continue."
            : addresses?.length > 0
              ? "Select a default delivery address"
              : "Add a delivery address"}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {token && (
          <>
            <View style={styles.actionContainer}>
              <AppButton
                title="Add new address"
                rightIcon={
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.btnSecondaryText}
                  />
                }
                onPress={() => setIsAddAddressModalOpen(true)}
                variant="secondary"
                style={{ justifyContent: "space-between", flex: 1 }}
              />

              <AppButton
                leftIcon={
                  <MaterialIcons
                    name="refresh"
                    size={20}
                    color={colors.btnSecondaryText}
                  />
                }
                variant="secondary"
                onPress={handleRefresh}
                disabled={isLoading}
                loading={isRefetching}
              />
            </View>

            <HorizontalSeparator style={{ marginVertical: spacing.xl }} />

            <AddressModal
              isOpen={isAddAddressModalOpen}
              onCloseModal={() => setIsAddAddressModalOpen(false)}
              onSuccess={() => setIsAddAddressModalOpen(false)}
            />
          </>
        )}

        {addresses?.length === 0 || !token ? (
          <View style={styles.ctaContainer}>
            <MaterialIcons
              name={
                !token
                  ? "login"
                  : addresses?.length === 0
                    ? "add-location"
                    : "location-pin"
              }
              size={200}
              color={colors.textSecondary}
            />
            <Text style={styles.ctaText}>
              {!token
                ? "Sign-In to continue"
                : addresses?.length === 0
                  ? "Add a delivery address"
                  : "Select a default delivery address"}
            </Text>
            {!token && (
              <AppButton
                title="Sign-In"
                onPress={() => router.push("/(auth)/sign-in")}
              />
            )}
          </View>
        ) : (
          addresses.map((address, i) => (
            <AddressItem address={address} key={address?.id ?? i} />
          ))
        )}
      </ScrollView>
    </Modal>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.xs,
      paddingBottom: spacing.xl,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      marginTop: spacing.xl,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
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
    actionContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    ctaContainer: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
    },
    ctaText: {
      color: colors.text,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    contentContainer: {
      flexGrow: 0.75,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.md,
      marginVertical: spacing.lg,
    },
  });
