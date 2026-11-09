import { system, ItemTypes, ItemStack } from "@minecraft/server";
import { filterDigitalMiner } from "../functions/miner/filter";
export const digitalMinerMaxRadius = 32;
export const globalFilterTypeCache = new Map();
export const globalFilterTagCache = new Map();
export const globalFilterTypeTagCache = new Map();
export const globalBlocksLocations = new Map();
export const globalBlocksLocationsAmount = new Map();
export const globalUpgradesCache = new Map();
export const globalToolCache = new Map();
const filterTypePageSize = 50;
export const blockTypeIdCategory = new Map();
export let addonNamePriority = [];
const changeId = {
    "bp": "simple_backpack",
    "ws": "simple_waystone"
};
system.run(() => {
    const generalBlockCategory = {};
    ItemTypes.getAll().forEach(value => {
        const [identifier, id] = value.id.split(":");
        if (identifier && id) {
            if (filterDigitalMiner.isBlock(value.id)) {
                const blocks = (generalBlockCategory[changeId[identifier] ?? identifier] ?? []);
                blocks.push(value.id);
                generalBlockCategory[changeId[identifier] ?? identifier] = blocks;
            }
        }
    });
    addonNamePriority = Object.keys(generalBlockCategory).sort((a, b) => {
        if (a === "minecraft")
            return 1;
        if (b === "minecraft")
            return -1;
        return a.localeCompare(b);
    });
    Object.entries(generalBlockCategory).forEach(([key, value]) => {
        const addonBlocks = value.sort();
        const blocks = Array.from({ length: Math.ceil(addonBlocks.length / filterTypePageSize) }, (_, i) => {
            return addonBlocks
                .slice(i * filterTypePageSize, i * filterTypePageSize + filterTypePageSize)
                .map(value => {
                return {
                    id: value,
                    translate: new ItemStack(value).localizationKey
                };
            });
        });
        blockTypeIdCategory.set(key, blocks);
    });
});
