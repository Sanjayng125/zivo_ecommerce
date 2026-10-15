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

export const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    return dateObj.toLocaleDateString("en-IN", options);
};

export const getDefaultAvatar = (fullName: string) => {
    const initials = fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase();

    return `https://ui-avatars.com/api/?name=${initials}&background=random&format=png`;
}
