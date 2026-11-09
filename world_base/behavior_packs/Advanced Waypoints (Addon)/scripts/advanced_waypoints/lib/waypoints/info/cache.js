import { globalWaypointsCache } from "../../variables";
import { playersEntity } from "../../../functions/locator";
import { apiScoreboard } from "../../math/scoreboard";
import { waypointsEntity } from "../entity/entity";
import { world } from "@minecraft/server";
const date = new Date().getTime();
export const apiWaypointsCache = new class ApiWaypointsCache {
    load(player) {
        const waypointsLoaded = new Map();
        const allWaypointsInfo = world.scoreboard.getObjectives().filter(score => score.id.startsWith("advanced_waypoints/" + player.id));
        for (const score of allWaypointsInfo) {
            const info = score.id.split("/");
            const [_, playerId, dimension] = info;
            const name = info.slice(3).join("/");
            if (playerId == undefined || dimension == undefined || name == undefined)
                continue;
            const dimensionId = (dimension.includes(":") ? dimension : `minecraft:${dimension}`);
            const cacheId = playerId + "/" + dimensionId;
            const dimensionChache = waypointsLoaded.get(cacheId) ?? new Map();
            dimensionChache.set(name, {
                name: name,
                pos: { x: apiScoreboard.getScore(score, "X") + 0.5, y: apiScoreboard.getScore(score, "Y"), z: apiScoreboard.getScore(score, "Z") + 0.5 },
                dimension: dimensionId,
                icon: apiScoreboard.getScore(score, "icon"),
                color: apiScoreboard.getScore(score, "colorI"),
                rgb: { red: apiScoreboard.getScore(score, "R"), green: apiScoreboard.getScore(score, "G"), blue: apiScoreboard.getScore(score, "B") },
                visible: apiScoreboard.getScore(score, "visible") == 1 ? true : false,
                turnOffClose: apiScoreboard.getScore(score, "turnOffClose") == 1 ? true : false
            });
            waypointsLoaded.set(cacheId, dimensionChache);
        }
        for (const [key, value] of waypointsLoaded.entries())
            globalWaypointsCache.set(key, value);
        playersEntity.set(player.id, player);
        waypointsEntity.recoverWaypoints(player);
    }
    unload(player) {
        for (const key of globalWaypointsCache.keys()) {
            if (key.startsWith(player.id))
                globalWaypointsCache.delete(key);
        }
        playersEntity.delete(player.id);
    }
    set(player, info) {
        const waypoints = this.getDimension(player);
        waypoints.set(info.name, info);
    }
    remove(player, name) {
        const waypoints = this.getDimension(player);
        waypoints.delete(name);
    }
    getDimension(player) {
        const cache = globalWaypointsCache.get(player.id + "/" + player.dimension.id);
        if (!cache) {
            const map = new Map();
            globalWaypointsCache.set(player.id + "/" + player.dimension.id, map);
            return map;
        }
        return cache;
    }
};
