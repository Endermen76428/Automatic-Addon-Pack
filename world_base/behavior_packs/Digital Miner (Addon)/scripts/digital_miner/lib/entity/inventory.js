import { ItemStack, EntityComponentTypes } from "@minecraft/server";
export const apiInventory = new class ApiInventory {
    addItem(entity, itemId, amount = 1) {
        const inventory = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!inventory)
            return;
        inventory.addItem(itemId instanceof ItemStack ? itemId : new ItemStack(itemId, amount));
    }
    getItems(entity, itemId) {
        const inventory = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!inventory)
            return [];
        const itemArray = itemId != undefined && Array.isArray(itemId) ? itemId.map(value => typeof value == "string" ? value : value.typeId) : undefined;
        const items = [];
        for (let i = 0; i < inventory.size; i++) {
            const slot = inventory.getItem(i);
            if (!slot)
                continue;
            if (!itemId) {
                items.push({ item: slot, slot: i });
                continue;
            }
            if (Array.isArray(itemId)) {
                if (Array.isArray(itemArray)) {
                    if (itemArray.includes(slot.typeId))
                        items.push({ item: slot, slot: i });
                    continue;
                }
                continue;
            }
            const id = itemId instanceof ItemStack ? itemId.typeId : itemId;
            const item = inventory.getItem(i);
            if (item?.typeId == id)
                items.push({ item: item, slot: i });
        }
        return items;
    }
    decrementSlot(entity, slot, amount = 1) {
        const inventory = entity.getComponent(EntityComponentTypes.Inventory)?.container;
        if (!inventory)
            return;
        const item = inventory.getItem(slot);
        if (!item)
            return;
        if (item.amount - amount < 1) {
            inventory.setItem(slot, undefined);
        }
        else {
            item.amount -= amount;
            inventory.setItem(slot, item);
        }
    }
};
