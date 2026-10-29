
import { useEffect, useState } from "react";

export function useDebounce(value: string, delay = 500, minLength = 3): string {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        if (value.length < minLength) {
            if (debouncedValue.length === 0) return
            else {
                setDebouncedValue("")
                return
            }
        }

        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
