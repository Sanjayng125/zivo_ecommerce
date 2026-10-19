import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import ActionMenu from "../ui/ActionMenu";

interface AddressItemProps {
  address: Address;
}

export default function AddressItem({ address }: AddressItemProps) {
  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="location-outline"
          size={30}
          color={colors.textSecondary}
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.actionContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{address.full_name}</Text>
            {address.is_default && (
              <Text style={styles.defaultText}>Default</Text>
            )}
          </View>
          <ActionMenu
            title="Address"
            options={[
              {
                label: "Edit",
                onPress() {},
                icon: (
                  <Ionicons
                    name="pencil-outline"
                    size={20}
                    color={colors.btnSecondaryText}
                  />
                ),
              },
              {
                label: "Delete",
                onPress() {},
                icon: (
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.btnPrimaryText}
                  />
                ),
                destructive: true,
              },
            ]}
          >
            <Ionicons
              name="ellipsis-vertical-outline"
              size={20}
              color={colors.text}
            />
          </ActionMenu>
        </View>
        <Text
          style={styles.address}
          numberOfLines={2}
        >{`${address.line1}, ${address.city}, ${address.state}, ${address.pincode}`}</Text>
        <View style={styles.phoneContainer}>
          <Ionicons name="call-outline" size={18} color={colors.text} />
          <Text style={styles.phoneText}>{address.phone}</Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      marginVertical: spacing.sm,
    },
    iconContainer: {
      padding: spacing.lg,
      borderRadius: radius.sm,
      backgroundColor: colors.badgeBg,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "auto",
    },
    infoContainer: {
      flex: 1,
      flexDirection: "column",
      gap: spacing.xs,
    },
    actionContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.xs,
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    defaultText: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radius.sm,
      color: colors.text,
      fontSize: typography.small.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    name: {
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
    address: {
      color: colors.textSecondary,
      fontSize: typography.caption.fontSize,
    },
    phoneContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    phoneText: {
      color: colors.text,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
    },
  });
