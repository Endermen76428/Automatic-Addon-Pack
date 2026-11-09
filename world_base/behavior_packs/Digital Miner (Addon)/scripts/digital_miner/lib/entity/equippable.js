export const apiEquippable = new class ApiEquippable {
    getItemSlot(entity, slot) {
        const equippable = entity.getComponent("equippable");
        if (!equippable)
            return;
        return equippable.getEquipment(slot);
    }
    setItem(entity, item, slot, sameItem = true) {
        const equippable = entity.getComponent("equippable");
        if (!equippable)
            return;
        if (sameItem)
            if (this.getItemSlot(entity, slot)?.typeId != item?.typeId)
                return;
        equippable.setEquipment(slot, item);
    }
};
