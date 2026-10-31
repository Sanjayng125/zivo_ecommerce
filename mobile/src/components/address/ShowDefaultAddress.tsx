import { ColorsType } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useAddress } from "@/hooks/useAddress";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AddressListModal from "./AddressListModal";

export default function ShowDefaultAddress() {
  const { defaultAddress } = useAddress();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

  const colors = useColors();
  const styles = useStyles(getStyles);

  return (
    <View>
      <View style={styles.addressContainer}>
        {defaultAddress && (
          <Ionicons name="location" size={18} color={colors.text} />
        )}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setIsAddressModalOpen(true)}
        >
          <Text style={styles.addressText}>
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
    </View>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    addressContainer: {
      paddingVertical: spacing.xs,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.xs,
      marginRight: "auto",
      borderRadius: radius.sm,
    },
    addressText: {
      color: colors.text,
      fontSize: typography.caption.fontSize,
      fontWeight: typography.heading.fontWeight,
      textDecorationLine: "underline",
    },
  });
