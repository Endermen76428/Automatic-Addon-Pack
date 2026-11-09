export const apiTimer = new class ApiTimer {
    check(player, id) {
        if (this.currentTime() > this.get(player, id))
            return { finished: true, time: this.get(player, id) - this.currentTime() };
        return { finished: false, time: this.currentTime() - this.get(player, id) };
    }
    set(player, id, time) {
        player.setDynamicProperty(id, this.currentTime() + time);
    }
    get(player, id) {
        const cooldown = player.getDynamicProperty(id);
        if (typeof cooldown != "number")
            return this.currentTime() - 0.001;
        return cooldown;
    }
    currentTime() { return Date.now() / 1000; }
};
