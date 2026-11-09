import { world, system } from "@minecraft/server";
export const globalWaypointsCache = new Map();
const render = 25;
const turnOff = 10;
export const Variables = {
    updateRate: 20,
    maxName: 13,
    maxDistance: 9999999,
    minRenderDistance: render * render,
    turnOffDistance: turnOff * turnOff,
    teleportEnabled: true,
    costXp: true,
    xpByDistance: 0.002
};
system.run(() => {
    Variables.teleportEnabled = (r => typeof r == "boolean" ? r : Variables.teleportEnabled)(world.getDynamicProperty("c:tp"));
    Variables.costXp = (r => typeof r == "boolean" ? r : Variables.costXp)(world.getDynamicProperty("c:tpcost"));
    Variables.xpByDistance = (r => typeof r == "number" ? r : Variables.xpByDistance)(world.getDynamicProperty("c:tpdis"));
});
export const colorRBG = [
    { red: 200, green: 200, blue: 200 },
    { red: 128, green: 128, blue: 128 },
    { red: 90, green: 90, blue: 90 },
    { red: 0, green: 0, blue: 0 },
    { red: 70, green: 25, blue: 0 },
    { red: 255, green: 0, blue: 0 },
    { red: 255, green: 165, blue: 0 },
    { red: 255, green: 255, blue: 0 },
    { red: 0, green: 255, blue: 0 },
    { red: 0, green: 128, blue: 0 },
    { red: 25, green: 90, blue: 180 },
    { red: 0, green: 255, blue: 255 },
    { red: 0, green: 0, blue: 240 },
    { red: 160, green: 0, blue: 200 },
    { red: 90, green: 0, blue: 140 },
    { red: 240, green: 50, blue: 150 }
];
export const iconPathId = [
    "a_icon",
    "b_icon",
    "c_icon",
    "d_icon",
    "e_icon",
    "f_icon",
    "g_icon",
    "h_icon",
    "i_icon",
    "j_icon",
    "k_icon",
    "l_icon",
    "m_icon",
    "n_icon",
    "o_icon",
    "p_icon",
    "q_icon",
    "r_icon",
    "s_icon",
    "t_icon",
    "u_icon",
    "v_icon",
    "w_icon",
    "x_icon",
    "y_icon",
    "z_icon",
    "waypoint_icon",
    "death_icon",
    "house_icon",
    "sword_icon",
    "pickaxe_icon",
    "axe_icon"
];
