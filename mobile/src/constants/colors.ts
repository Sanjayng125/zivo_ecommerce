export const Colors = {
    light: {
        background: '#ececec',
        surface: '#FFFFFF',
        primary: '#c0d7ff',
        border: '#E8E8E8',
        error: '#E53935',
        success: '#43A047',
        warning: '#ff6f00',

        // Text
        text: '#1A1A1A',
        textSecondary: '#6B6B6B',
        linkText: '#5a94ff',

        // Button
        btnPrimaryBg: '#1A1A1A',
        btnPrimaryText: '#FFFFFF',
        btnSecondaryBg: '#cccccc',
        btnSecondaryText: '#1A1A1A',

        // Input
        inputBg: '#FFFFFF',
        inputText: '#1A1A1A',
        inputPlaceholder: '#9B9B9B',
        inputBorder: '#E8E8E8',
        inputBorderFocused: '#1A1A1A',

        // Badge / Tag
        badgeBg: '#e2e2e2',
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
        surface: '#262626',
        primary: '#8DB6FF',
        border: '#525252',
        error: '#EF5350',
        success: '#66BB6A',
        warning: '#FFCA28',

        // Text
        text: '#FFFFFF',
        textSecondary: '#A0A0A0',
        linkText: '#8DB6FF',

        // Button
        btnPrimaryBg: '#8DB6FF',
        btnPrimaryText: '#FFFFFF',
        btnSecondaryBg: '#434343',
        btnSecondaryText: '#FFFFFF',

        // Input
        inputBg: '#262626',
        inputText: '#FFFFFF',
        inputPlaceholder: '#858585',
        inputBorder: '#2C2C2C',
        inputBorderFocused: '#8DB6FF',

        // Badge / Tag
        badgeBg: '#26354D',
        badgeText: '#C0D7FF',

        // Card
        cardBg: '#262626',
        cardShadow: '#00000040',

        // Tab bar
        tabBarBg: '#262626',
        tabBarActive: '#8DB6FF',
        tabBarInactive: '#858585',
    }

}

export type ColorsType = typeof Colors.light

export const ORDER_STATUS_COLORS: Record<string, string> = {
    placed: "#FB8C00",
    confirmed: "#5a94ff",
    shipped: "#9C27B0",
    delivered: "#43A047",
    cancelled: "#E53935",
};

export const ORDER_PAYMENT_COLORS: Record<string, string> = {
    pending: "#FB8C00",
    paid: "#43A047",
    failed: "#E53935",
    refunded: "#9C27B0",
};
