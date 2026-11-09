import { system } from "@minecraft/server";
import { Variables } from "../lib/variables";
export const LocatorWaypointsList = new Map();
export const forceUpdateList = new Set();
const minDistanceMoved = 3 * 3;
const playerLastPos = new Map();
export const playersEntity = new Map();
system.runInterval(() => {
    for (const [playerId, waypointList] of LocatorWaypointsList.entries()) {
        if (!playersEntity.has(playerId)) {
            removeFromList(playerId);
            continue;
        }
        const player = playersEntity.get(playerId);
        if (!player || !player.isValid) {
            removeFromList(playerId);
            continue;
        }
        if (forceUpdateList.has(playerId)) {
            for (const waypoint of waypointList.values()) {
                if (waypoint.forceUpdate)
                    waypoint.update();
            }
            forceUpdateList.delete(playerId);
            return;
        }
        const lastPos = playerLastPos.get(playerId) ?? { x: 0, y: 1024, z: 0 };
        const disX = player.location.x - lastPos.x;
        const disY = player.location.y - lastPos.y;
        const disZ = player.location.z - lastPos.z;
        if ((disX * disX) + (disY * disY) + (disZ * disZ) < minDistanceMoved)
            continue;
        playerLastPos.set(playerId, player.location);
        for (const waypoint of waypointList.values())
            waypoint.update(disX, disZ);
    }
}, Variables.updateRate);
function removeFromList(playerId) {
    for (const entity of LocatorWaypointsList.get(playerId)?.values() ?? [])
        entity.despawn();
    LocatorWaypointsList.delete(playerId);
    playerLastPos.delete(playerId);
    playersEntity.delete(playerId);
}
