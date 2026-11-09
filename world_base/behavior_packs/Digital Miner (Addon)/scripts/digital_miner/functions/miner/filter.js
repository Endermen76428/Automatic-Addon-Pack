import { globalFilterTagCache, globalFilterTypeCache, globalFilterTypeTagCache } from "../../lib/variables";
import { BlockTypes, ItemStack, ItemTypes } from "@minecraft/server";
import { apiScoreboard } from "../../lib/math/scoreboard";
import { apiVec3 } from "../../lib/math/vector3";
import { apiWarn } from "../../lib/player/warn";
import { apiString } from "../../lib/string";
import { customTags } from "./ui/tagList";
export const filterDigitalMiner = new class FilterDigitalMiner {
    addType(player, pos, id) {
        const item = typeof id == "string" ? new ItemStack(ItemTypes.get(id)?.id ?? "digital_miner:null") : id;
        if (!item)
            return apiWarn.notify(player, "warn.digital_miner:miner.filter.no_block", { sound: "warn.digital_miner:break" });
        if (this.isBlock(item?.typeId ?? "") == undefined)
            return apiWarn.notify(player, { translate: "warn.digital_miner:miner.filter.not_block", with: { "rawtext": [{ "translate": item.localizationKey }] } }, { sound: "warn.digital_miner:break" });
        const minerId = `${apiString.getDimension(player.dimension)}/${apiVec3.toString(pos)}`;
        const filter = this.getType(player.dimension, pos);
        filter.add(item.typeId);
        globalFilterTypeCache.set(minerId, filter);
        apiScoreboard.setScore(`digital_miner/miner/${minerId}`, `type/${item.typeId}`, 0);
        globalFilterTypeTagCache.delete(minerId);
        apiWarn.notify(player, { translate: "warn.digital_miner:miner.filter.added_block", with: { "rawtext": [{ "translate": item.localizationKey }] } }, { sound: "warn.digital_miner:levelup" });
        return filter;
    }
    addTag(player, pos, tag) {
        const minerId = `${apiString.getDimension(player.dimension)}/${apiVec3.toString(pos)}`;
        const filter = this.getTag(player.dimension, pos);
        filter.add(tag);
        globalFilterTagCache.set(minerId, filter);
        apiScoreboard.setScore(`digital_miner/miner/${minerId}`, `tag/${tag}`, 0);
        globalFilterTypeTagCache.delete(minerId);
        apiWarn.notify(player, { translate: "warn.digital_miner:miner.filter.added_tag", with: { "rawtext": [{ "translate": (tag.startsWith("bedrock_awakening:") ? "ui.digital_miner:tag." : "") + tag }] } }, { sound: "warn.digital_miner:levelup" });
        return filter;
    }
    getType(dimension, pos) {
        const minerId = `${apiString.getDimension(dimension)}/${apiVec3.toString(pos)}`;
        const filterCache = globalFilterTypeCache.get(minerId);
        if (filterCache)
            return filterCache;
        const scoreInfo = apiScoreboard.getObj(`digital_miner/miner/${minerId}`);
        const allTypes = this.validTypeList(scoreInfo, scoreInfo.getParticipants());
        globalFilterTypeCache.set(minerId, allTypes);
        return allTypes;
    }
    getTag(dimension, pos) {
        const minerId = `${apiString.getDimension(dimension)}/${apiVec3.toString(pos)}`;
        const filterCache = globalFilterTagCache.get(minerId);
        if (filterCache)
            return filterCache;
        const scoreInfo = apiScoreboard.getObj(`digital_miner/miner/${minerId}`);
        const allTags = this.validTagList(scoreInfo.getParticipants());
        globalFilterTagCache.set(minerId, allTags);
        return allTags;
    }
    getTypeTag(dimension, pos) {
        const minerId = `${apiString.getDimension(dimension)}/${apiVec3.toString(pos)}`;
        const filterCache = globalFilterTypeTagCache.get(minerId);
        if (filterCache)
            return filterCache;
        const allType = this.getType(dimension, pos);
        const allTag = this.getTag(dimension, pos);
        const types = [];
        const tags = [];
        for (const tag of allTag) {
            const custom = customTags[tag];
            if (!custom)
                continue;
            types.push(...custom.types);
            tags.push(...custom.tags);
            if (custom?.directory)
                for (const directoryTag of custom.directory) {
                    const custom = customTags[directoryTag];
                    if (!custom)
                        continue;
                    types.push(...custom.types);
                    tags.push(...custom.tags);
                }
        }
        const list = {
            type: [...allType, ...types],
            tag: [...allTag, ...tags]
        };
        globalFilterTypeTagCache.set(minerId, list);
        return list;
    }
    validTypeList(score, items) {
        return new Set(items
            .filter(item => {
            if (item.displayName.startsWith("tag/") || item.displayName.startsWith("info/"))
                return false;
            if (this.isBlock(item.displayName.replace("type/", "")) == undefined) {
                score.removeParticipant(item);
                return false;
            }
            return true;
        })
            .map(item => item.displayName.replace("type/", ""))
            .sort());
    }
    validTagList(items) {
        return new Set(items
            .filter(item => item.displayName.startsWith("tag/"))
            .map(item => item.displayName.replace("tag/", ""))
            .sort());
    }
    isBlock(item) {
        const id = BlockTypes.get(item)?.id;
        return !invalidBlocks[id ?? ""] ? id : undefined;
    }
};
const invalidBlocks = {
    "minecraft:allow": true,
    "minecraft:barrier": true,
    "minecraft:bedrock": true,
    "minecraft:border_block": true,
    "minecraft:budding_amethyst": true,
    "minecraft:chain_command_block": true,
    "minecraft:command_block": true,
    "minecraft:deny": true,
    "minecraft:reinforced_deepslate": true,
    "minecraft:repeating_command_block": true
};
