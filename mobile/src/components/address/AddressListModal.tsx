import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { useAuthStore } from "@/store/authStore";
import { Address } from "@/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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
import HorizontalSeparator from "../ui/HorizontalSeparator";
import AddressItem from "./AddressItem";
import AddressModal from "./AddressModal";

interface AddressListModalProps {
  isOpen: boolean;
  onCloseModal: () => void;
  addresses: Address[];
}

export default function AddressListModal({
  isOpen,
  onCloseModal,
  addresses,
}: AddressListModalProps) {
  const { token } = useAuthStore();
  const styles = useStyles(getStyles);
  const colors = useColors();

  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

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
          <Pressable onPress={onCloseModal} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>
        <Text style={styles.subtitle} numberOfLines={2}>
          {!token
            ? "Looks like you're signed out. Please sign-in to continue."
            : "Select a default delivery address"}
        </Text>
      </View>

      {!token ? (
        <View style={styles.signInContainer}>
          <MaterialCommunityIcons
            name="login-variant"
            size={200}
            color={colors.textSecondary}
          />
          <Text style={styles.signInText}>Sign-In to continue</Text>
          <AppButton
            title="Sign-In"
            onPress={() => router.push("/(auth)/sign-in")}
          />
        </View>
      ) : (
        <ScrollView style={styles.content}>
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
            fullWidth
            variant="secondary"
            style={{ justifyContent: "space-between" }}
          />

          <HorizontalSeparator style={{ marginVertical: spacing.xl }} />

          {addresses?.map((address, i) => (
            <AddressItem address={address} key={address?.id ?? i} />
          ))}
        </ScrollView>
      )}

      <AddressModal
        isOpen={isAddAddressModalOpen}
        onCloseModal={() => setIsAddAddressModalOpen(false)}
        onSuccess={() => setIsAddAddressModalOpen(false)}
      />
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
      paddingHorizontal: spacing.md,
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
    closeButton: {
      marginHorizontal: spacing.md,
    },
    subtitle: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      color: colors.textSecondary,
    },
    signInContainer: {
      flexGrow: 0.7,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
      marginTop: spacing.xl,
    },
    signInText: {
      color: colors.text,
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: spacing.md,
      marginVertical: spacing.lg,
    },
  });
