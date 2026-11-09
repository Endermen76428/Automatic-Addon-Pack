import { EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { apiWandInfo } from "../wand";
export const apiConfig = new class ApiConfig {
    get(item) {
        const size = (r => typeof r != "number" ? apiWandInfo.getMaxSize(item) : r)(item.getDynamicProperty("bw:size"));
        const connect = (r => typeof r != "boolean" ? true : r)(item.getDynamicProperty("bw:connect"));
        return { size, connect };
    }
    set(player, item, config) {
        item.setDynamicProperty("bw:size", config.size);
        item.setDynamicProperty("bw:connect", config.connect);
        player.getComponent(EntityComponentTypes.Equippable)?.setEquipment(EquipmentSlot.Mainhand, item);
    }
};
