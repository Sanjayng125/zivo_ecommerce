import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useAddress } from "@/hooks/useAddress";
import { useColors } from "@/hooks/useColors";
import { useStyles, UseStylesContext } from "@/hooks/useStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AddressListModal from "./AddressListModal";

export default function ShowDefaultAddress() {
  const { defaultAddress } = useAddress();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <>
      <View style={styles.addressContainer}>
        <MaterialIcons
          name={defaultAddress ? "location-on" : "add-location"}
          size={20}
          color={colors.text}
        />
        <TouchableOpacity
          style={styles.addressTouchable}
          activeOpacity={0.6}
          onPress={() => setIsAddressModalOpen(true)}
        >
          <Text style={styles.addressText} numberOfLines={1}>
            {defaultAddress
              ? `${defaultAddress.line1}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.pincode}`
              : "Add a delivery address"}
          </Text>
        </TouchableOpacity>
        <Ionicons name="chevron-down" size={18} color={colors.text} />
      </View>
      <AddressListModal
        isOpen={isAddressModalOpen}
        onCloseModal={() => setIsAddressModalOpen(false)}
      />
    </>
  );
}

const getStyles = ({ colors }: UseStylesContext) =>
  StyleSheet.create({
    addressContainer: {
      padding: spacing.xs,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.xs,
      marginRight: "auto",
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    addressTouchable: {
      flexShrink: 1,
    },
    addressText: {
      color: colors.text,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      textDecorationLine: "underline",
    },
  });
