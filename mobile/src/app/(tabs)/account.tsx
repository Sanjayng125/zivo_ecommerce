import AccountSignedOut from "@/components/account/AccountSignedOut";
import ChangePasswordModal from "@/components/account/ChangePasswordModal";
import EditProfileModal from "@/components/account/EditProfileModal";
import SettingsRow from "@/components/account/SettingsRow";
import AddressListModal from "@/components/address/AddressListModal";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { AppButton } from "@/components/ui/AppButton";
import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useAddress } from "@/hooks/useAddress";
import { useColors } from "@/hooks/useColors";
import { useOrders } from "@/hooks/useOrders";
import { useProfile } from "@/hooks/useProfile";
import { useSignOut } from "@/hooks/useSignOut";
import { useStyles } from "@/hooks/useStyles";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/uiStore";
import { getDefaultAvatar } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const AccountScreen = () => {
  const { token, user } = useAuthStore();
  const { profile, isLoading, error, isRefetching, refetch } = useProfile();
  const { defaultAddress } = useAddress();
  const { data: wishlistItems } = useWishlist();
  const { data: orders } = useOrders();
  const { signOut, isSigningOut } = useSignOut();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

  const { theme, toggleTheme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const styles = useStyles(getStyles);
  const colors = useColors();

  const handleRefresh = () => {
    if (token) refetch();
  };

  if (isLoading) {
    return (
      <ScreenWrapper edges={["top"]} scrollable={false}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper
        edges={["top"]}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
      >
        <View style={styles.center}>
          <Text style={styles.errorText}>Couldn't load profile.</Text>

          <AppButton title="Retry" onPress={() => refetch()} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      edges={["top"]}
      {...(token ? { refreshing: isRefetching, onRefresh: handleRefresh } : {})}
      style={{ paddingTop: spacing.xl, paddingBottom: spacing.xxxl }}
    >
      {!token ? (
        <AccountSignedOut />
      ) : (
        <>
          <View style={styles.userInfoContainer}>
            <Image
              source={{
                uri:
                  profile?.avatar_url ?? getDefaultAvatar(user?.name ?? "User"),
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>Hey 👋🏻 {profile?.full_name}!</Text>
            <View style={styles.emailContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.text} />
              <Text style={styles.email}>{profile?.email}</Text>
            </View>
            <View style={styles.phoneContainer}>
              <Ionicons name="call-outline" size={20} color={colors.text} />
              <Text style={styles.phone}>{profile?.phone}</Text>
            </View>
            <EditProfileModal />
          </View>

          <SettingsRow
            label="My Orders"
            icon="bag-outline"
            value={`${orders?.length} order${orders?.length > 1 && "s"}`}
            onPress={() => router.push("/orders")}
          />

          <SettingsRow
            label="My Addresses"
            icon="location-outline"
            value={defaultAddress ?? "Add a delivery address"}
            onPress={() => setIsAddressModalOpen(true)}
          />
          <AddressListModal
            isOpen={isAddressModalOpen}
            onCloseModal={() => setIsAddressModalOpen(false)}
          />

          <SettingsRow
            label="My Wishlist"
            icon="heart-outline"
            {...(wishlistItems?.length > 0
              ? {
                  value: `${wishlistItems.length} Item${wishlistItems.length > 1 ? "s" : ""}`,
                }
              : {})}
            onPress={() => router.push("/wishlist")}
          />

          <SettingsRow
            label="Dark Mode"
            icon="moon-outline"
            hideChevron
            right={<Switch value={isDarkMode} onValueChange={toggleTheme} />}
          />

          <ChangePasswordModal />
          <SettingsRow
            label="Sign Out"
            icon="log-out-outline"
            destructive
            loading={isSigningOut}
            onPress={signOut}
          />
          <SettingsRow
            label="Delete Account"
            icon="trash-outline"
            destructive
            disabled={isSigningOut}
            onPress={() => {}}
          />
        </>
      )}
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.lg,
    },
    errorText: {
      fontSize: typography.body.fontSize,
      color: colors.error,
      textAlign: "center",
    },

    userInfoContainer: {
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    avatar: {
      width: 160,
      height: 160,
      borderRadius: radius.full,
    },
    name: {
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
    },
    emailContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    email: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.textSecondary,
    },
    phoneContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    phone: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.textSecondary,
    },
  });

export default AccountScreen;
