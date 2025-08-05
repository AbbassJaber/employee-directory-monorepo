import { useState, useEffect } from 'react';

/**
 * A hook that returns a debounced version of a value that only updates after a specified delay.
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
