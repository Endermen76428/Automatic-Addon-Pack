export const apiVec3 = new class ApiVec3 {
    constructor() {
        this.offsetDirection = {
            "east": { x: 1, y: 0, z: 0 },
            "west": { x: -1, y: 0, z: 0 },
            "down": { x: 0, y: -1, z: 0 },
            "up": { x: 0, y: 1, z: 0 },
            "north": { x: 0, y: 0, z: -1 },
            "south": { x: 0, y: 0, z: 1 }
        };
    }
    toString(vector) { return `${vector.x},${vector.y},${vector.z}`; }
};
