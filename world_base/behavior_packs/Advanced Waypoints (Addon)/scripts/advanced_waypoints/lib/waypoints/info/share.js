import { apiScoreboard } from "../../math/scoreboard";
import { apiNumbers } from "../../math/numbers";
import { apiWaypointCreate } from "./create";
import { apiWarn } from "../../player/warn";
export const waypointsShare = new class ApiWaypointShare {
    share(player, target, info) {
        if (!target.isValid)
            return apiWarn.notify(player, "warn.advanced_waypoints:playerOffline", { sound: "warn.advanced_waypoints:break" });
        if (this.hasOnList(player, target.nameTag, info))
            return apiWarn.notify(player, { translate: "warn.advanced_waypoints:alreadySent", with: [info.name] }, { sound: "warn.advanced_waypoints:bass" });
        apiWaypointCreate.create(target, { name: info.name, pos: info.pos, color: info.color, icon: apiNumbers.clamp(info.icon - 25, 0, 99), turnOff: info.turnOffClose }, player.nameTag, true);
    }
    hasOnList(player, targetName, info) {
        const scoreID = `advanced_waypoints/${player.id}/${info.dimension.replace("minecraft:", "")}/${info.name}`;
        if (apiScoreboard.hasParticipant(scoreID, `S/${targetName}`))
            return true;
        apiScoreboard.setScore(scoreID, `S/${targetName}`, 0);
        return false;
    }
    removeFromList(player, name) {
        const score = apiScoreboard.getObj(`advanced_waypoints:${player.nameTag}`);
        for (const participant of score.getParticipants().filter(value => value.displayName.endsWith(name))) {
            score.removeParticipant(participant);
        }
    }
};
