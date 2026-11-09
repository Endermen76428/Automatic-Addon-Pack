import { Variables } from "../variables";
export const apiNumbers = new class apiNumbers {
    clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
    randomBetween(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
    calculateCost(playerPos, waypointPos) {
        const disX = waypointPos.x - playerPos.x;
        const disZ = waypointPos.z - playerPos.z;
        return Math.floor(Math.sqrt((disX * disX) + (disZ * disZ)) * Variables.xpByDistance);
    }
};
