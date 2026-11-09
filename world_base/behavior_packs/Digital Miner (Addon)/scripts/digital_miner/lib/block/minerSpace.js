import { BlockComponentTypes, BlockVolume, EntityComponentTypes } from "@minecraft/server";
import { apiScoreboard } from "../math/scoreboard";
import { apiVec3 } from "../math/vector3";
import { apiString } from "../string";
export const apiMinerSpace = new class ApiMinerSpace {
    getCenter(adjacentBlock, permutation) {
        const block = permutation.getState("digital_miner:upper_bit") ? adjacentBlock.below(1) : adjacentBlock;
        if (!block)
            return;
        const blocks = [...block.dimension.getBlocks(this.getSize(block.location), { includeTypes: ["digital_miner:digital_miner"] }).getBlockLocationIterator()];
        return blocks.find(pos => apiScoreboard.hasObj(`digital_miner/miner/${apiString.getDimension(block)}/${apiVec3.toString(pos)}`)) ?? (apiScoreboard.hasObj(`digital_miner/miner/${apiString.getDimension(block)}/${apiVec3.toString(block.location)}`) ? block.location : undefined);
    }
    getContainer(dimension, pos) {
        const blockInv = dimension.getBlock(pos)?.getComponent(BlockComponentTypes.Inventory)?.container;
        if (blockInv)
            return blockInv;
        const entities = dimension.getEntitiesAtBlockLocation(pos);
        for (const entity of entities) {
            const inv = entity.getComponent(EntityComponentTypes.Inventory)?.container;
            if (!inv)
                continue;
            if (inv.emptySlotsCount == 0)
                continue;
            return inv;
        }
        return;
    }
    getSize(pos) { return new BlockVolume({ x: pos.x - 1, y: pos.y, z: pos.z - 1 }, { x: pos.x + 1, y: pos.y + 1, z: pos.z + 1 }); }
    changeSpeed(block, speed, minerCenter) {
        const center = minerCenter ?? this.getCenter(block, block.permutation);
        if (!center)
            return;
        const newBlock = block.dimension.getBlock(center);
        if (!newBlock)
            return;
        newBlock.setPermutation(newBlock.permutation.withState("digital_miner:speed", speed));
    }
};
