import { system } from "@minecraft/server";
import { functionController } from "../../functions/controller";
import { apiDurability } from "../item/durability";
import { apiWarn } from "../player/warn";
import { apiBlock } from "./apiBlock";
export const GetBlocks2D = new class VeinShapeGetTunnel {
    getBlocks(info) {
        const { player, blockIds, blockFace, block, item, config } = info;
        const dimension = block.dimension;
        const maxRange = Math.floor(config.size / 2);
        const maxPosX = block.x + maxRange + 1, maxPosY = block.y + maxRange + 1, maxPosZ = block.z + maxRange + 1;
        const minPosX = block.x - maxRange, minPosY = block.y - maxRange, minPosZ = block.z - maxRange;
        const totalMaxSize = config.size * config.size;
        const faceDirection = apiBlock.getFaceDregress(blockFace);
        const direction = FaceDirections[faceDirection];
        if (direction == undefined)
            return;
        const durability = apiDurability.getDurability(item);
        const maxSize = (durability == Infinity || durability > totalMaxSize) ? (totalMaxSize > 81 ? totalMaxSize - 1 : totalMaxSize) : durability;
        if (maxSize < 1) {
            apiWarn.notify(player, "warning.builder_wand:low_durability", { type: "action_bar", sound: "builder_wand.warn.bass" });
            return;
        }
        const preOffsets = (r => config.connect ? r : r.slice(0, 4))(offsets[blockFace]);
        const preOffsets4 = config.connect ? preOffsets.slice(0, 4) : preOffsets;
        const aproved = [];
        const testing = [block.location];
        const visited = new Set();
        visited.add((block.x << 20) ^ (block.y << 10) ^ block.z);
        let realIndex = 0;
        system.runJob(function* BFS() {
            while (realIndex < testing.length) {
                const center = testing[realIndex++];
                if (!center)
                    continue;
                aproved.push(center);
                if (aproved.length >= maxSize)
                    return functionController(info, aproved, direction, preOffsets4);
                for (const offset of preOffsets) {
                    const offsetX = center.x + offset[0], offsetY = center.y + offset[1], offsetZ = center.z + offset[2];
                    if ((offsetX < minPosX || offsetX > maxPosX))
                        continue;
                    if ((offsetY < minPosY || offsetY > maxPosY))
                        continue;
                    if ((offsetZ < minPosZ || offsetZ > maxPosZ))
                        continue;
                    const offsetKey = (offsetX << 20) ^ (offsetY << 10) ^ offsetZ;
                    if (visited.has(offsetKey))
                        continue;
                    visited.add(offsetKey);
                    const targetBlock = dimension.getBlock({ x: offsetX, y: offsetY, z: offsetZ });
                    const frontBlock = dimension.getBlock({ x: offsetX - direction.x, y: offsetY - direction.y, z: offsetZ - direction.z });
                    if (!targetBlock || !frontBlock)
                        continue;
                    if (!blockIds.has(targetBlock.typeId))
                        continue;
                    if (!canReplaceIds.has(frontBlock.typeId))
                        continue;
                    testing.push({ x: offsetX, y: offsetY, z: offsetZ });
                }
                yield;
            }
            functionController(info, aproved, direction, preOffsets4);
        }());
    }
};
const canReplaceIds = new Set([
    "minecraft:air",
    "minecraft:bush",
    "minecraft:fern",
    "minecraft:flowing_lava",
    "minecraft:flowing_water",
    "minecraft:large_fern",
    "minecraft:lava",
    "minecraft:nether_sprouts",
    "minecraft:tall_dry_grass",
    "minecraft:tall_grass",
    "minecraft:seagrass",
    "minecraft:short_dry_grass",
    "minecraft:short_grass",
    "minecraft:vine",
    "minecraft:water"
]);
const preOffsetNS = [
    [1, 0, 0, "e"], [-1, 0, 0, "w"],
    [0, 1, 0, "u"], [0, -1, 0, "d"],
    [1, 1, 0, " "], [-1, -1, 0, " "],
    [-1, 1, 0, " "], [1, -1, 0, " "]
];
const preOffsetEW = [
    [0, 1, 0, "u"], [0, -1, 0, "d"],
    [0, 0, 1, "s"], [0, 0, -1, "n"],
    [0, 1, 1, " "], [0, -1, -1, " "],
    [0, -1, 1, " "], [0, 1, -1, " "]
];
const preOffsetUD = [
    [1, 0, 0, "e"], [-1, 0, 0, "w"],
    [0, 0, 1, "s"], [0, 0, -1, "n"],
    [1, 0, 1, " "], [-1, 0, -1, " "],
    [-1, 0, 1, " "], [1, 0, -1, " "]
];
const offsets = {
    "North": preOffsetNS,
    "South": preOffsetNS,
    "East": preOffsetEW,
    "West": preOffsetEW,
    "Up": preOffsetUD,
    "Down": preOffsetUD
};
export const FaceDirections = [
    { x: 0, y: 0, z: -1 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
];
