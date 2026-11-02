import { ColorsType } from "@/constants/colors";
import { useMemo } from "react";
import { ScaledSize, StyleSheet, useWindowDimensions } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "./useColors";

export interface UseStylesContext {
    colors: ColorsType;
    dimensions: ScaledSize;
    safeAreaInsets: EdgeInsets;
}

export const useStyles = <
    T extends StyleSheet.NamedStyles<T>,
    Args extends unknown[] = [],
>(
    getStyles: (context: UseStylesContext, ...args: Args) => T,
    ...args: Args
): T => {
    const dimensions = useWindowDimensions();
    const safeAreaInsets = useSafeAreaInsets();
    const colors = useColors();

    return useMemo(
        () =>
            getStyles(
                { colors, dimensions, safeAreaInsets },
                ...args,
            ),
        [getStyles, colors, dimensions, safeAreaInsets, ...args],
    );
};
