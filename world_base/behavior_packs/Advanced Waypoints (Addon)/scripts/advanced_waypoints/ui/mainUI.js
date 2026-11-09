import { ActionFormData } from "@minecraft/server-ui";
import { waypointUITeleport } from "./teleportUI";
import { waypointUIOptions } from "./configUI";
import { waypointsUICreate } from "./createUI";
import { waypointsUIRemove } from "./removeUI";
import { Variables } from "../lib/variables";
import { waypointUIShare } from "./shareUI";
import { waypointsUIEdit } from "./editUI";
export function waypointMenu(player, quickCreate, normal = true) {
    if (quickCreate)
        return waypointsUIController[1]?.(player);
    const form = new ActionFormData()
        .title("ui.advanced_waypoints:config.title");
    if (Variables.teleportEnabled && !normal)
        form.button("ui.advanced_waypoints:config.button.teleport", "textures/ui/realmsIcon");
    form.button("ui.advanced_waypoints:config.button.create", "textures/ui/plus")
        .button("ui.advanced_waypoints:config.button.edit", "textures/ui/editIcon")
        .button("ui.advanced_waypoints:config.button.remove", "textures/ui/icon_trash")
        .button("ui.advanced_waypoints:config.button.share", "textures/ui/share_microsoft")
        .button("ui.advanced_waypoints:config.button.options", "textures/ui/settings_glyph_color_2x")
        .show(player).then(r => {
        if (r.canceled || r.selection == undefined)
            return;
        const execute = waypointsUIController[Variables.teleportEnabled && !normal ? r.selection : r.selection + 1];
        if (execute)
            execute(player);
    });
}
const waypointsUIController = new class WaypointsUIController {
    0(player) { waypointUITeleport(player); }
    1(player) { waypointsUICreate(player); }
    2(player) { waypointsUIEdit(player); }
    3(player) { waypointsUIRemove(player); }
    4(player) { waypointUIShare(player); }
    5(player) { waypointUIOptions(player); }
};
