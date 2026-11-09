import { Dimension } from "@minecraft/server";
export const apiString = new class ApiString {
    firstUpperCase(str) {
        return str
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    getDimension(dimension, noPrefix = true) {
        const dim = dimension instanceof Dimension ? dimension : dimension.dimension;
        if (noPrefix)
            return dim.id.replace("minecraft:", "");
        return dim.id;
    }
};
