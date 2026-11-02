import { ColorsType } from "@/constants/colors";
import { useMemo } from "react";
import { ScaledSize, StyleSheet, useWindowDimensions } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "./useColors";

export const useStyles = <
    T extends StyleSheet.NamedStyles<T>,
    Args extends unknown[] = [],
>(
    getStyles: (colors: ColorsType, dimensions: ScaledSize, SafeAreaInsets: EdgeInsets, ...args: Args) => T,
    ...args: Args
): T => {
    const dimensions = useWindowDimensions()
    const safeAreaInsets = useSafeAreaInsets();
    const colors = useColors();

    return useMemo(() => getStyles(colors, dimensions, safeAreaInsets, ...args), [getStyles, colors, dimensions, safeAreaInsets, ...args])
}
