export const apiNumbers = new class apiNumbers {
    clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
    wrapRange(value, min, max) {
        const range = max - min + 1;
        return ((value - min) % range + range) % range + min;
    }
};
