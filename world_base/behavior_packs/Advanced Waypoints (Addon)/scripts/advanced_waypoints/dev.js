import { world } from "@minecraft/server";
world.afterEvents.itemUse.subscribe(({ source: player, itemStack: item }) => {
    world.sendMessage(`${JSON.stringify(item.getTags())}`);
    if (!player.hasTag("dev"))
        return;
    if (item.typeId == "minecraft:wooden_sword") {
    }
    if (item.typeId == "minecraft:stick") {
        world.sendMessage(`Entities: ${player.dimension.getEntities({ type: "advanced_waypoints:waypoint" }).length}`);
    }
});
