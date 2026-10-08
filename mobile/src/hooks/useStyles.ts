import { ColorsType } from "@/constants/colors";
import { useMemo } from "react";
import { ScaledSize, StyleSheet, useWindowDimensions } from "react-native";
import { useColors } from "./useColors";

export const useStyles = <T extends StyleSheet.NamedStyles<T>>(getStyles: (colors: ColorsType, dimensions: ScaledSize) => T): T => {
    const dimensions = useWindowDimensions()
    const colors = useColors();

    return useMemo(() => getStyles(colors, dimensions), [colors, dimensions])
}
