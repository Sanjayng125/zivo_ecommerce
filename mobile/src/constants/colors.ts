export const Colors = {
    light: {
        background: '#F8F8F8',
        surface: '#FFFFFF',
        primary: '#1A1A1A',
        secondary: '#6B6B6B',
        subtext: '#9B9B9B',
        border: '#E8E8E8',
        error: '#E53935',
        success: '#43A047',

        // Text
        text: '#1A1A1A',
        textSecondary: '#6B6B6B',

        // Button
        btnPrimaryBg: '#1A1A1A',
        btnPrimaryText: '#FFFFFF',
        btnSecondaryBg: '#F0F0F0',
        btnSecondaryText: '#1A1A1A',
        btnDisabledBg: '#D4D4D4',
        btnDisabledText: '#9B9B9B',

        // Input
        inputBg: '#FFFFFF',
        inputText: '#1A1A1A',
        inputPlaceholder: '#9B9B9B',
        inputBorder: '#E8E8E8',
        inputBorderFocused: '#1A1A1A',

        // Badge / Tag
        badgeBg: '#F0F0F0',
        badgeText: '#1A1A1A',

        // Card
        cardBg: '#FFFFFF',
        cardShadow: '#00000010',

        // Tab bar
        tabBarBg: '#FFFFFF',
        tabBarActive: '#1A1A1A',
        tabBarInactive: '#9B9B9B',
    },
    dark: {
        background: '#121212',
        surface: '#1E1E1E',
        primary: '#FFFFFF',
        secondary: '#A0A0A0',
        subtext: '#6B6B6B',
        border: '#2C2C2C',
        error: '#EF5350',
        success: '#66BB6A',

        // Text
        text: '#FFFFFF',
        textSecondary: '#A0A0A0',

        // Button
        btnPrimaryBg: '#FFFFFF',
        btnPrimaryText: '#121212',
        btnSecondaryBg: '#2C2C2C',
        btnSecondaryText: '#FFFFFF',
        btnDisabledBg: '#3A3A3A',
        btnDisabledText: '#6B6B6B',

        // Input
        inputBg: '#1E1E1E',
        inputText: '#FFFFFF',
        inputPlaceholder: '#6B6B6B',
        inputBorder: '#2C2C2C',
        inputBorderFocused: '#FFFFFF',

        // Badge / Tag
        badgeBg: '#2C2C2C',
        badgeText: '#FFFFFF',

        // Card
        cardBg: '#1E1E1E',
        cardShadow: '#00000040',

        // Tab bar
        tabBarBg: '#1E1E1E',
        tabBarActive: '#FFFFFF',
        tabBarInactive: '#6B6B6B',
    }
}

export type ColorsType = typeof Colors.light
