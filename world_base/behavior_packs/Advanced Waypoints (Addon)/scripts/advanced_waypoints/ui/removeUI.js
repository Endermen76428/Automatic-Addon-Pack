import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { waypointsEntity } from "../lib/waypoints/entity/entity";
import { waypointsInfo } from "../lib/waypoints/info/general";
import { apiConfig } from "../lib/player/config";
import { iconPathId } from "../lib/variables";
import { apiVec3 } from "../lib/math/vector";
import { apiWarn } from "../lib/player/warn";
export function waypointsUIRemove(player) {
    const waypoints = waypointsInfo.getAll(player);
    if (waypoints.length < 1)
        return apiWarn.notify(player, { translate: "warn.advanced_waypoints:dontHavePoints" }, { type: "action_bar", sound: "warn.advanced_waypoints:bass" });
    const config = apiConfig.get(player);
    const form = new ActionFormData()
        .title("ui.advanced_waypoints:delete.title")
        .body("ui.advanced_waypoints:delete.body");
    waypoints.forEach(button => {
        form.button(button.name + (config.pos ? `\n${apiVec3.formatColored(button.pos)}` : ""), `textures/advanced_waypoints/ui/${iconPathId[button.icon]}_${button.visible}`);
    });
    form.show(player).then(({ canceled, selection }) => {
        if (canceled || selection == undefined)
            return;
        const point = waypoints[selection];
        if (!point)
            return apiWarn.notify(player, "warn.advanced_waypoints:waypointNotFound", { type: "action_bar", sound: "warn.advanced_waypoints:bass" });
        new MessageFormData()
            .title("ui.advanced_waypoints:delete.title")
            .body({ "rawtext": [{ "translate": "ui.advanced_waypoints:delete.confirm1", "with": [point.name] }, { "translate": `${config.pos ? "ui.advanced_waypoints:delete.confirm2" : ""}`, "with": [apiVec3.formatWithLetter(point.pos)] }, { "text": "?" }] })
            .button1("ui.advanced_waypoints:yes")
            .button2("ui.advanced_waypoints:no")
            .show(player).then(r2 => {
            if (r2.canceled || r2.selection == 1)
                return waypointsUIRemove(player);
            waypointsEntity.remove(player, point.name);
            waypointsInfo.remove(player, point.name);
            apiWarn.notify(player, { translate: "warn.advanced_waypoints:deleted", with: [point.name] }, { type: "action_bar", sound: "warn.advanced_waypoints:deactive" });
            if (waypoints.length > 1)
                return waypointsUIRemove(player);
        });
    });
}
