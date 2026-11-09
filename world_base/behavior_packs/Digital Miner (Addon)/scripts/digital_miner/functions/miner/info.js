import { globalBlocksLocations, globalBlocksLocationsAmount } from "../../lib/variables";
import { apiMinerSpace } from "../../lib/block/minerSpace";
import { apiVec3 } from "../../lib/math/vector3";
import { apiString } from "../../lib/string";
export const infoDigitalMiner = new class InfoDigitalMiner {
    turnState(dimension, center, enable, playSound = true) {
        if (playSound)
            dimension.playSound(`block.digital_miner:digital_miner.turning_${enable ? "on" : "off"}`, center);
        const locations = [...dimension.getBlocks(apiMinerSpace.getSize(center), { includeTypes: ["digital_miner:digital_miner"] }).getBlockLocationIterator()];
        for (const pos of locations) {
            const minerBlock = dimension.getBlock(pos);
            if (!minerBlock)
                continue;
            minerBlock.setPermutation(minerBlock.permutation.withState("digital_miner:enabled", enable));
        }
        if (enable == false) {
            globalBlocksLocations.delete(`${apiString.getDimension(dimension)}/${apiVec3.toString(center)}`);
            globalBlocksLocationsAmount.delete(`${apiString.getDimension(dimension)}/${apiVec3.toString(center)}`);
        }
    }
};
