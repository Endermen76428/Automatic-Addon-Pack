import { colorRBG } from "../../variables";
import { waypointsEntity } from "../entity/entity";
import { stringFormat } from "../../stringFormat";
import { apiVec3 } from "../../math/vector";
import { apiWarn } from "../../player/warn";
import { waypointsInfo } from "./general";
import { waypointsShare } from "./share";
export const apiWaypointsEdit = new class ApiWaypointsEdit {
    edit(player, oldInfo, info, message = true) {
        waypointsInfo.remove(player, oldInfo.name);
        waypointsEntity.remove(player, oldInfo.name);
        if (oldInfo.name != info.name)
            waypointsShare.removeFromList(player, oldInfo.name);
        const name = stringFormat.sameNames(info.name, waypointsInfo.getAllName(player, oldInfo.name));
        const color = info.color != oldInfo.color ? (colorRBG[info.color] ?? { red: 200, green: 200, blue: 200 }) : { red: info.colorR, green: info.colorG, blue: info.colorB };
        const icon = waypointsEntity.getIcon(info.icon, name);
        const waypointInfo = {
            name,
            dimension: player.dimension.id,
            icon,
            color: info.color,
            rgb: color,
            turnOffClose: info.turnOff,
            visible: info.visible
        };
        waypointsInfo.set(player, { ...waypointInfo, pos: apiVec3.floor(info.pos) });
        if (info.visible)
            waypointsEntity.spawn(player, { ...waypointInfo, pos: apiVec3.bottomCenter(info.pos) }, true);
        message && apiWarn.notify(player, { translate: `warn.advanced_waypoints:editPoint`, with: [name] }, { sound: "warn.advanced_waypoints:break_amethyst" });
    }
};
