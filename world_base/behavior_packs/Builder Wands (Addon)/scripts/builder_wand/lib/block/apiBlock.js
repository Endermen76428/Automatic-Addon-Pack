export const apiBlock = new class ApiBlock {
    formatId(id) {
        if (id == "unlit_redstone_torch")
            return ["minecraft:redstone_torch", id];
        if (id.includes("lit_"))
            return [id.replace("lit_", ""), id];
        const multi = multipleBlocks[id];
        return multi ?? [id];
    }
    getFaceDregress(face) {
        return facesList[face ?? "Down"] ?? 0;
    }
};
const facesList = {
    "North": 2,
    "East": 3,
    "South": 0,
    "West": 1,
    "Up": 5,
    "Down": 4
};
const multipleBlocks = {
    "minecraft:grass_block": ["minecraft:grass_block", "minecraft:dirt"],
    "minecraft:grass_path": ["minecraft:grass_path", "minecraft:dirt"],
    "minecraft:mycelium": ["minecraft:mycelium", "minecraft:dirt"],
    "minecraft:podzol": ["minecraft:podzol", "minecraft:dirt"]
};
