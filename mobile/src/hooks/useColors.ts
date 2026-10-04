import { Colors, ColorsType } from "@/constants/colors"
import { useThemeStore } from "@/store/uiStore"

export const useColors = (): ColorsType => {
    const { theme } = useThemeStore()

    return theme === "light" ? Colors.light : Colors.dark
}
