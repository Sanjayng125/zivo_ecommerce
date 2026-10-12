const priceFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

export const formatPrice = (paise: number) => priceFormatter.format(paise / 100);

const numberFormatter = new Intl.NumberFormat("en-IN", {
    notation: "compact",
    compactDisplay: "short",
});

export const formatCount = (count: number) => numberFormatter.format(count);
